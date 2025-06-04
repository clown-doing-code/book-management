"use client";

import { signInWithCredentials } from "@/actions/auth-action";
import AuthForm from "@/components/auth-form";
import { signInSchema } from "@/lib/validations";
import React from "react";

type Props = {};

export default function SignInPage({}: Props) {
  return (
    <AuthForm
      type="SIGN_IN"
      schema={signInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={signInWithCredentials}
    />
  );
}
