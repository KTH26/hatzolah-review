import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hatzolah | Volunteer Emergency Medical Service",
  description: "Hatzolah volunteer emergency medical response — serving the community 24 hours a day.",
  icons: { icon: "/logo.ico", shortcut: "/logo.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
