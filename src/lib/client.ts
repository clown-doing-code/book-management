import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  //you can pass client configuration here
});

export const { signUp, signIn, signOut, useSession } = authClient;
