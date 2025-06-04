import type { auth } from "./auth";
import { authClient } from "./client";

export type Session = typeof auth.$Infer.Session;
