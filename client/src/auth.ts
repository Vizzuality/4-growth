import { IAccessToken } from "@shared/dto/auth/access-token.interface";
import { isAxiosError } from "axios";
import NextAuth, { CredentialsSignin } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

import { client } from "@/lib/queryClient";

import { signInSchema } from "@/containers/auth/signin/form/schema";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: IAccessToken["user"];
  }

  interface User extends IAccessToken {}
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `auth`, when using JWT sessions
   */
  interface JWT {
    user: IAccessToken["user"];
    accessToken: IAccessToken["accessToken"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        let access: IAccessToken | null = null;

        const { email, password } = await signInSchema.parseAsync(credentials);

        const response = await client.auth.signIn.mutation({
          body: {
            email,
            password,
          },
        });

        if (response.status === 201) {
          access = response.body;
        }

        if (!access) {
          if (response.status === 401) {
            throw new CredentialsSignin(response.body.message);
          }
        }

        return access;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user: access }) {
      if (access) {
        token.user = access.user;
        token.accessToken = access.accessToken;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: token.user,
        accessToken: token.accessToken,
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/profile",
    error: "/auth/error",
  },
});
