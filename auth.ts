import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // If password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user does not exist or password does not match return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      session.user.id = token.sub;
      // We want to make available to the session the role and name of the token that are defined from the next callback
      session.user.role = token.role;
      session.user.name = token.name;

      // console.log(token) this is to see what is inside the jwt(what it had by default + the role we added with the next callback + if the name did not exist ex. google account then it would be set the part of email before @)

      // If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // if the user has no name then use the 1st part of email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];
        }

        // Update database to reflect the token name
        await prisma.user.update({
          where: { id: user.id },
          data: { name: token.name },
        });
      }

      if (trigger === "signIn" || trigger === "signUp") {
        const cookiesObject = await cookies();
        const sessionCartId = cookiesObject.get("sessionCartId")?.value;

        if (sessionCartId) {
          const sessionCart = await prisma.cart.findFirst({
            where: { sessionCartId },
          });

          if (sessionCart) {
            // Delete current user cart
            await prisma.cart.deleteMany({
              where: { userId: user.id },
            });

            // Assign new cart
            await prisma.cart.update({
              where: { id: sessionCart.id },
              data: { userId: user.id },
            });
          }
        }
      }
      // Handle session updates (ex. changing profile name -> it takes it from token)
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },
    authorized({ request, auth }: any) {
      // Array of regex patterns of paths we want to protect
      // The \ is to escape the / one so that we can use it (because the reger should be inside /)
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // Get pathname from the req URL object
      const { pathname } = request.nextUrl;

      // Check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      if (!request.cookies.get("sessionCartId")) {
        // Check for session cart cookie
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // Clone the req headers
        const newRequestHeaders = new Headers(request.headers);

        // Create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // Set newly generated SessionCartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig; // we added it because in the next line we had a TS error regarding the config parameter (this satisfies keyword is from TS and ensures that the object structure, this config object is compatible with the with this type the next auth config.

export const { handlers, auth, signIn, signOut } = NextAuth(config);

// handlers -> object that contains the HTTP handlers for the different end points NextAuth uses
// auth -> function that will check the session to see if the user is logged in or not
