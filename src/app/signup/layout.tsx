import type { ReactNode } from "react";
import AuthLayout from "@/auth/AuthLayout";

export default function SignupLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
