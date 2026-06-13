import type { ReactNode } from "react";
import AuthLayout from "@/auth/AuthLayout";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
