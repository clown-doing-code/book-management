"use client";

import { signUp } from "@/actions/auth-action";
import AuthForm from "@/components/auth-form";
import { signUpSchema } from "@/lib/validations";
import React from "react";

export default function SignUpPage() {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        credentialId: 0,
        credentialCard: "",
      }}
      onSubmit={signUp}
    />
  );
}
