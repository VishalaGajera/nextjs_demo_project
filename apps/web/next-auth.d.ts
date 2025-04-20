import "next-auth";
import "next-auth/jwt";
import { User } from "./types/session";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    email: string;
    avatar: string | null;
    token: string;
  }

  interface AdapterUser {
    token: string;
    id: string;
    email: string;
    avatar: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}
