import GoogleProvider from "next-auth/providers/google";
import {
  getOrCreateUser,
  getOrCreateSession,
  getOrCreateVerificationToken,
} from "./authHelpers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const res = await getOrCreateUser(profile, account);
        console.log("ok", res);
        return true;
      }
      return false;
    },
    // session: async ({ session, token }) => ({
    //   ...session,
    //   user: {
    //     id: token.id,
    //     name: token.name,
    //     image: token.image,
    //     email: token.email,
    //     accessToken: token.accessToken,
    //     membershipExpire: session.expires,
    //   },
    // }),
    // jwt: async ({ token, account, user }) => {
    //   // 检查 user 和 account 是否存在
    //   if (!user || !user.email) {
    //     console.error("User or user.email is not defined");
    //     return token; // 返回默认 token
    //   }

    //   // 查询用户记录
    //   const [userRecord] = await db
    //     .select()
    //     .from(users)
    //     .where(eq(users.email, user.email))
    //     .limit(1);

    //   if (!userRecord) {
    //     console.error("User record not found for email:", user.email);
    //     return token; // 返回默认 token
    //   }

    //   const userId = userRecord.id;

    //   // 初始化 token 的默认值
    //   token = {
    //     ...token,
    //     id: userId,
    //     email: user.email,
    //     name: user.name || token.name,
    //     image: user.image || token.picture,
    //     accessToken: account?.access_token || "",
    //   };

    //   // 获取或创建会话和验证令牌
    //   const session = await getOrCreateSession(userId);
    //   const verificationToken = await getOrCreateVerificationToken(user.email);

    //   // 返回更新后的 token
    //   return {
    //     ...token,
    //     sessionToken: session.sessionToken,
    //     sessionExpires: session.expires,
    //     verificationToken: verificationToken.token,
    //     verificationTokenExpires: verificationToken.expires,
    //   };
    // },
  },
};
