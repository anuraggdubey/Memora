import { Suspense } from "react";
import AuthForm from "../components/AuthForm";

export default function Signup() {
  return (
    <Suspense>
      <AuthForm mode="register" />
    </Suspense>
  );
}
