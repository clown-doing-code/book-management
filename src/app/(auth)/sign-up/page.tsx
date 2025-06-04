"use client";

import { signUp } from "@/actions/auth-action";
import AuthForm from "@/components/auth-form";
import { signUpSchema } from "@/lib/validations";
import React from "react";

type Props = {};

export default function SignUpPage({}: Props) {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{
        email: "",
        password: "",
        name: "",
        universityId: 0,
        universityCard: "",
      }}
      onSubmit={signUp}
    />
  );
}
