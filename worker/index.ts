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
    const isDonationEmbed = url.pathname === "/donate/embed";

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
      if (isDonationEmbed) originUrl.pathname = "/donate/";
      const originRequest = new Request(originUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
        redirect: "manual",
      });
      const originResponse = await fetch(originRequest, {
        cf: { resolveOverride: "origin.hatzolaht.com" },
      } as RequestInit);
      const responseHeaders = new Headers(originResponse.headers);
      const location = responseHeaders.get("Location");
      if (location) {
        responseHeaders.set("Location", location.replace(/^https?:\/\/origin\.hatzolaht\.com/i, "https://hatzolaht.com"));
      }
      if (isDonationEmbed && responseHeaders.get("Content-Type")?.includes("text/html")) {
        const html = await originResponse.text();
        const embedStyles = `<style id="hatzolah-embed-style">
          body { min-height: 1050px !important; margin: 0 !important; background: #fff !important; }
          body * { visibility: hidden !important; }
          #give-form-7987-wrap, #give-form-7987-wrap *, .give_error, .give_error *, .give-notice, .give-notice * { visibility: visible !important; }
          #give-form-7987-wrap { position: absolute !important; top: 0 !important; left: 50% !important; transform: translateX(-50%) !important; width: min(100%, 760px) !important; padding: 18px 24px !important; margin: 0 !important; background: #fff !important; }
          #give-form-7987-wrap > .give-form-title, #give-form-content-7987 { display: none !important; }
          #give-form-7987-1 { margin-top: 0 !important; }
        </style>`;
        const embedScript = `<script id="hatzolah-embed-script">
          document.addEventListener("DOMContentLoaded", function () {
            var formWrap = document.getElementById("give-form-7987-wrap");
            if (formWrap) document.body.prepend(formWrap);
          });
        </script>`;
        responseHeaders.delete("Content-Length");
        responseHeaders.delete("Content-Encoding");
        return new Response(html.replace("</head>", `${embedStyles}</head>`).replace("</body>", `${embedScript}</body>`), {
          status: originResponse.status,
          statusText: originResponse.statusText,
          headers: responseHeaders,
        });
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
