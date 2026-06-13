import type { ReactNode } from "react";
import AuthLayout from "@/auth/AuthLayout";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
