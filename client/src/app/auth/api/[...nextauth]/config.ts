import { IAccessToken } from "@shared/dto/auth/access-token.interface";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession, NextAuthOptions } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

import { client } from "@/lib/queryClient";

import { signInSchema } from "@/containers/auth/signin/form/schema";

declare module "next-auth" {
  interface Session {
    user: IAccessToken["user"];
    accessToken: IAccessToken["accessToken"];
  }

  interface User extends IAccessToken {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user: IAccessToken["user"];
    accessToken: IAccessToken["accessToken"];
  }
}

export const config = {
  providers: [
    Credentials({
      // @ts-expect-error - why is so hard to type this?
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
            throw new Error(
              response.body.errors?.[0]?.title || "unknown error",
            );
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
    // signOut: "/auth/signin",
  },
} as NextAuthOptions;

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
