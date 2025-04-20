import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { HttpStatus } from "../constants/httpStatus";
import { AUTH_ROUTES } from "../constants/routes/auth/routes";
import type { ApiSuccessResponse } from "../types/apiResponse";
import { rawAxios } from "./axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials) {
          try {
            const { data, status } = await rawAxios.post<
              ApiSuccessResponse<{
                user: {
                  id: string;
                  name: string;
                  email: string;
                  token: string;
                  avatar: string;
                };
              }>
            >(AUTH_ROUTES.login, {
              email: credentials.email,
              password: credentials.password,
            });

            if (status === HttpStatus.Ok) {
              return {
                ...data.data.user,
              };
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log("error in signin -> ", e);

            return null;
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        ...token.user,
      };

      return session;
    },
  },
};
