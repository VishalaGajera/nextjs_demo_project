"use client";

import { AuthUiContainer } from "../../../components/auth/Layouts/AuthUiContainer";
import { SignInForm } from "../../../components/signIn/SignInForm";

export default function Page() {
  return (
    <AuthUiContainer>
      <SignInForm />
    </AuthUiContainer>
  );
}
