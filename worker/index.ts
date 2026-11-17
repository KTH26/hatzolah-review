/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Keep the existing WordPress donation flow available after the main
    // domain is attached to this Worker. Cloudflare sends these requests to
    // the preserved origin while retaining hatzolaht.com as the public host.
    const isWordPressRequest =
      url.pathname === "/donate" ||
      url.pathname.startsWith("/donate/") ||
      url.pathname.startsWith("/give") ||
      url.pathname.startsWith("/wp-admin/admin-ajax.php") ||
      url.pathname.startsWith("/wp-json/give") ||
      url.pathname.startsWith("/wp-content/") ||
      url.pathname.startsWith("/wp-includes/") ||
      url.searchParams.has("givewp-route") ||
      url.searchParams.has("giveDonationFormInIframe");

    if (isWordPressRequest) {
      const originUrl = new URL(request.url);
      originUrl.hostname = "origin.hatzolaht.com";
      const originHeaders = new Headers(request.headers);
      originHeaders.set("Host", "hatzolaht.com");
      originHeaders.set("X-Forwarded-Host", "hatzolaht.com");
      originHeaders.set("X-Forwarded-Proto", "https");
      const originRequest = new Request(originUrl, {
        method: request.method,
        headers: originHeaders,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
        redirect: "manual",
      });
      const originResponse = await fetch(originRequest);
      const responseHeaders = new Headers(originResponse.headers);
      const location = responseHeaders.get("Location");
      if (location) {
        responseHeaders.set("Location", location.replace(/^https?:\/\/origin\.hatzolaht\.com/i, "https://hatzolaht.com"));
      }
      return new Response(originResponse.body, {
        status: originResponse.status,
        statusText: originResponse.statusText,
        headers: responseHeaders,
      });
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
