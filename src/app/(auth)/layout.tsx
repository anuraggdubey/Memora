import type { ReactNode } from "react";
import AuthLayout from "../layout/AuthLayout";

export default function AuthRouteLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
