import { NextAuthOptions } from "next-auth";
import User from "@/models/User";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Callback } from "mongoose";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    // // ...add more providers here
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text"},
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        try {
          await connectToDatabase();
          const user = await User.findOne({email: credentials.email})

          if(!User){
            throw new Error("User not found");
          }
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if(!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id,
            email: user.email
          }
        } catch (error) {
          console.error("Error in authorize:", error);  
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if(user){
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if(session.user){
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allow redirect to the base URL or any other URL
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true; // Return true to allow sign-in
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }, 
  secret: process.env.NEXTAUTH_SECRET
};



