import GoogleProvider from "next-auth/providers/google";
import {
  getOrCreateUser,
  getOrCreateSession,
  getOrCreateVerificationToken,
} from "./authHelpers";
import { db } from "@/db";
import { users,accounts } from "@/db/schema";
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
        // console.log("ok", res);
        return true;
      }
      return false;
    },
    session: async ({ session, token }) => ({
      ...session,
      user: {
        id: token.id,
        name: token.name,
        image: token.image,
        email: token.email,
        accessToken: token.accessToken,
        membershipExpire: session.expires,
      },
    }),
    jwt: async ({ user, account, token }) => {
    
      if (!user || !user.email) {
        console.error("User or user.email is not defined");
        return token;
      }
    
      const [userRecord] = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email))
        .limit(1);
    
      if (!userRecord) {
        console.error("User record not found for email:", user.email);
        return token;
      }
    
      const userId = userRecord.id;
    
      // 检查 Access Token 是否过期
      // if (account?.expires_at && Date.now() > account.expires_at * 1000) {
      //   const [accountRecord] = await db
      //     .select()
      //     .from(accounts)
      //     .where(eq(accounts.userId, userId))
      //     .limit(1);
    
      //   if (accountRecord?.refresh_token) {
      //     const { accessToken, expiresAt } = await refreshAccessToken(
      //       accountRecord.refresh_token
      //     );
    
      //     // 更新数据库中的 Access Token
      //     await db
      //       .update(accounts)
      //       .set({
      //         access_token: accessToken,
      //         expires_at: Math.floor(expiresAt / 1000), // 转换为秒
      //       })
      //       .where(eq(accounts.userId, userId));
    
      //     account.access_token = accessToken;
      //     account.expires_at = Math.floor(expiresAt / 1000);
      //   } else {
      //     console.error("Refresh token not found");
      //     return token;
      //   }
      // }
    
      token = {
        ...token,
        id: userId,
        email: user.email,
        name: user.name || token.name,
        image: user.image || token.picture,
        accessToken: account?.access_token || "",
      };
    
      const session = await getOrCreateSession(userId);
      const verificationToken = await getOrCreateVerificationToken(user.email);
    
      if (!verificationToken || !verificationToken.token) {
        console.error("Verification token is not defined");
        return token;
      }
    
      // 检查验证令牌是否过期
      if (new Date() > new Date(verificationToken.expires)) {
        console.error("Verification token has expired");
        return token;
      }
    
      return {
        ...token,
        sessionToken: session.sessionToken,
        sessionExpires: session.expires,
        verificationToken: verificationToken.token,
        verificationTokenExpires: verificationToken.expires,
      };
    },
  },
};


async function refreshAccessToken(refreshToken) {
  const params = new URLSearchParams();
  params.append("client_id", process.env.GOOGLE_CLIENT_ID);
  params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000, // 转换为毫秒
  };
}
