import GoogleProvider from "next-auth/providers/google";
import {
  getOrCreateUser,
  getOrCreateSession,
  getOrCreateVerificationToken,
} from "./authHelpers";
import { db } from "@/db";
import { users, accounts } from "@/db/schema";
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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const res = await getOrCreateUser(profile, account);
        return true;
      }
      return false;
    },
    session: async ({ session, token }) => ({
      ...session,
      user: {
        id: token.id,
        name: token.name,
        image: token.picture,
        email: token.email,
        accessToken: token.accessToken,
        membershipExpire: session.expires,
      },
    }),
    jwt: async ({ user, account, token }) => {
      // console.log("jwtuser", user, account, token);
    
      // 首次登录时，user 和 account 会被传递
      if (user) {
        const [userRecord] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);
    
        if (!userRecord) {
          console.error("User record not found for email:", user.email);
          return token;
        }
    
        token = {
          ...token,
          id: userRecord.id,
          email: user.email,
          name: user.name || token.name,
          image: user.image || token.picture,
          accessToken: account?.access_token || "",
          refreshToken: account?.refresh_token || "", // 保存 refreshToken
          expiresAt: Date.now() + 60 * 60 * 1000, // 设置 JWT 过期时间为 1 小时后
        };
    
        // 创建会话和验证令牌
        const session = await getOrCreateSession(userRecord.id);
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
    
        token.sessionToken = session.sessionToken;
        token.sessionExpires = session.expires;
        token.verificationToken = verificationToken.token;
        token.verificationTokenExpires = verificationToken.expires;
      }
    
      // 检查 accessToken 是否过期
      if (token.accessToken && token.expiresAt && Date.now() > token.expiresAt) {
        try {
          const refreshedTokens = await refreshAccessToken(token.refreshToken);
          token.accessToken = refreshedTokens.accessToken;
          token.expiresAt = refreshedTokens.expiresAt;
        } catch (error) {
          console.error("Failed to refresh access token:", error);
          token.error = "RefreshAccessTokenError"; // 标记错误
        }
      }
    
      return token;
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
