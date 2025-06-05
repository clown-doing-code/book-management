import { createAuthClient } from "better-auth/react";
import { multiSessionClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [multiSessionClient()],
});

export const { signUp, signIn, signOut, useSession } = authClient;

authClient.$store.listen("$sessionSignal", async () => {});
