import { Suspense } from "react";
import AuthForm from "./AuthForm";

export default function Login() {
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
