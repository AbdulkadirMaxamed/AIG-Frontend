import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";
import { GithubProfile } from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      profile(profile: GithubProfile){
        return{
          ...profile,
          role: profile.role ?? "user",
          id: profile.id.toString(),
          image: profile.avatar_url,
        }
      },
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialProvider({
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@gmail.com",
        },
      },
      async authorize(credentials, req) {
        console.log(credentials)
        const user = { id: "1", name: "John", email: credentials?.email, role: "admin" };
        if (user) {
          console.log(user);
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks:{
    async jwt({token, user}){
      if(user){
        token.role = user.role;

      }
      return token;
    },

    async session({session, token}){
      if(session?.user) {
        session.user.role = token.role

      }
      return session
    }
  },
  pages: {
    signIn: "/", //sigin page
  },
};
