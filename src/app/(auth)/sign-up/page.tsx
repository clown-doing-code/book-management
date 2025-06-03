"use client";

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
        fullName: "",
        universityId: 0,
        universityCard: "",
      }}
      onSubmit={() => {}}
    />
  );
}
