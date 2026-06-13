import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles.css";
import AppProviders from "@/AppProviders";

export const metadata: Metadata = {
  title: "Memora",
  description: "A personal memory and decision workspace.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
