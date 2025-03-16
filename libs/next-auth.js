// import prisma from "@/lib/prismadb";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { compare } from "bcryptjs";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email";
// import { createTransport } from "nodemailer";
// import { ONE_DAY } from "./constans";
// import { getUserSubscriptionStatus } from "./lemonsqueezy/subscriptionFromStorage";
// import redis from "./redis";
// import { getSessionUser } from "@/utils/auth";

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),
//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     EmailProvider({
//       server: process.env.EMAIL_SERVER,
//       from: process.env.EMAIL_FROM,
//       async sendVerificationRequest({
//         identifier: email,
//         url,
//         provider: { server, from },
//       }) {
//         const { host } = new URL(url);
//         const transport = createTransport(server);
//         const result = await transport.sendMail({
//           to: email,
//           from: from,
//           subject: `[StableVideoHub.com] Your sign-in link`,
//           text: text({ url, host }),
//           html: html({ url, host }),
//         });
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile, email, credentials }) {
//       if (account && account.provider === "google" && profile) {
//         let user = await prisma.user.findUnique({
//           where: { email: profile.email },
//         });

//         if (user) {
//           await prisma.user.update({
//             where: { id: user.id },
//             data: {
//               name: profile.name ?? user.name,
//               image: profile.picture ?? user.image,
//               emailVerified: user.emailVerified ?? new Date(),
//             },
//           });
//         } else {
//           user = await prisma.user.create({
//             data: {
//               email: profile.email,
//               name: profile.name,
//               image: profile.picture,
//               emailVerified: new Date(), // Verified via Google
//             },
//           });
//         }

//         await prisma.account.upsert({
//           where: {
//             provider_providerAccountId: {
//               provider: account.provider,
//               providerAccountId: account.providerAccountId,
//             },
//           },
//           update: {
//             access_token: account.access_token,
//             refresh_token: account.refresh_token,
//             token_type: account.token_type,
//             expires_at: account.expires_at,
//             scope: account.scope,
//             id_token: account.id_token,
//           },
//           create: {
//             userId: user.id,
//             type: "oauth",
//             provider: account.provider,
//             providerAccountId: account.providerAccountId,
//             access_token: account.access_token,
//             refresh_token: account.refresh_token,
//             token_type: account.token_type,
//             expires_at: account.expires_at,
//             scope: account.scope,
//             id_token: account.id_token,
//           },
//         });

//         return true;
//       }

//       return true;
//     },
//     async session({ session, token }) {
//       if (token && token.userId) {
//         session.user = await getSessionUser(token);
//       }

//       return {
//         ...session,
//         user: {
//           ...session.user,
//           randomKey: token.randomKey,
//         },
//       };
//     },
//     async jwt({ token, account, user }) {
//       if (account && user) {
//         const userInfo = await upsertUserAndGetInfo(token, account);
//         if (!userInfo || !userInfo.id) {
//           throw new Error("User information could not be saved or retrieved.");
//         }

//         const planRes = await getUserSubscriptionStatus({
//           userId: userInfo.id,
//           defaultUser: userInfo,
//         });

//         return {
//           ...token,
//           userId: userInfo.id,
//           username: userInfo.name,
//           avatar: userInfo.image,
//           email: userInfo.email,
//           role: planRes.role,
//           membershipExpire: planRes.membershipExpire,
//           accessToken: account.access_token,
//         };
//       }

//       return token;
//     },
//   },
// };

// async function storeAccessToken(accessToken, sub) {
//   if (!accessToken || !sub) return;
//   const expire = ONE_DAY * 30; // 30 days in seconds
//   await redis.set(accessToken, sub, { ex: expire });
// }

// async function upsertUserAndGetInfo(token, account) {
//   const user = await upsertUser(token, account.provider);
//   if (!user || !user.id) return null;

//   const subscriptionStatus = await getUserSubscriptionStatus({
//     userId: user.id,
//     defaultUser: user,
//   });

//   return {
//     ...user,
//     role: subscriptionStatus.role,
//     membershipExpire: subscriptionStatus.membershipExpire,
//   };
// }

// async function upsertUser(token, provider) {
//   const user = await prisma.user.upsert({
//     where: { id: token.sub },
//     update: {
//       name: token.name,
//       image: token.picture,
//       email: token.email,
//     },
//     create: {
//       name: token.name,
//       image: token.picture,
//       email: token.email,
//       role: 0,
//     },
//   });

//   return user || null;
// }

// async function getSessionUser(token) {
//   const planRes = await getUserSubscriptionStatus({
//     userId: token.userId,
//   });

//   return {
//     userId: token.userId,
//     username: token.username,
//     avatar: token.avatar,
//     email: token.email,
//     role: planRes.role,
//     membershipExpire: planRes.membershipExpire,
//     accessToken: token.accessToken,
//   };
// }

// function text({ url, host }) {
//   return `Sign in to ${host}\n${url}\n\n`;
// }

// function html({ url, host }) {


//   const escapedHost = host.replace(/\./g, "&#8203;.");

//   return `
//   <div style="max-width:500px;margin:0 auto;font-family:Helvetica,Arial,sans-serif"><div class="adM">
      
//       </div><div style="padding:16px 16px 16px 16px"><span class="im"><div class="adM">
      
//         </div><img src="https://lh3.google.com/u/0/d/1QjFzDX_rrwCwUaKMPkBLtPKNEoIjUv9d=w2922-h1476-iv1" width="150px" style="margin-bottom:20px" class="CToWUd" data-bit="iit">
        
//         <h1 style="font-family:Helvetica,Arial,sans-serif;color:#111826;font-weight:bold;font-size:36px;line-height:1;max-width:400px">
//             Sign in to <strong>${escapedHost}</strong>
//         </h1>
        
//         <div>
//             <a href="${url}" style="background-color:#111826;border:1px solid #111826;border-radius:8px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:16px;font-weight:bold;line-height:60px;text-align:center;text-decoration:none;width:140px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=${url}">
//                 Click to sign in
//             </a>
//         </div>
        
//         </span><p style="color:#111826;font-size:16px;line-height:1.5;margin-top:30px">
//             Alternatively, copy and paste this link into your address bar: <a href="${url}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=${url}">${url}</a>
//         </p><span class="im">
        
//         <hr style="border:none;border-top:1px solid #e2e8f0;margin-top:40px">
        
//         <p style="font-size:12px;line-height:20px;color:#94a3b8;margin-top:30px">
//           If you didn't try to sign in, you can safely ignore this email.
//         </p>
        
//       </span></div>
//     <img src="https://ci3.googleusercontent.com/meips/ADKq_NYupqDcCoDOyOGKxXYmdEpWL1ozyyCTtTm8hTf5_V02MgGaMCGA_AW0g7om39nQjZb2cWrSFJaXGvT301zGPjGwgfNQ6ZSTdyxnyw1ZwfAYjglYT-KNp7y_-6uzqOahfD4HRCJ8hu52q35kuXTQURrqaI2WEQ_lLlZbH72Xm9Xnk2VqB3xbXPt1CO-8qD9dRh-pu8DpsE6zM5ngOVtBdsWIfOjO9CV6_oML_fAq-DynLuRVXSjebv_u4DksX24fvR5kp7NOBculEu4E6cHxnOZS54BrJ1-iIGfdC7rWOpGkvuJCn_sZeJkUwYFMIZizCRLw67k3y3cEtynSVzvhPCL9Z5wYl4cr1spba61hIX1aN3shOa4cOqb2IxLZtG_GC_xQO0_vtIQkjI27ZRuCCAVwHNiON9qCjjSrBAdN_7w1bHHoo-6Ic93Q0QxlWSccQ5yFI7tSe8MKeStJLdyC80zfft8iJP_YL1HrS96pU-oLcMspz_DgzHyYd1YZ1rfi3409RSsWxfE5gkZkMeI8Xtdff7doebnnf3AoPXvQ9yKXWd_P_8yjMoy2Sdw4nvPnmTXQd2YZ6zqWbWVPdlFlXDh-uLQ=s0-d-e1-ft" alt="" width="1" height="1" border="0" style="height:1px!important;width:1px!important;border-width:0!important;margin-top:0!important;margin-bottom:0!important;margin-right:0!important;margin-left:0!important;padding-top:0!important;padding-bottom:0!important;padding-right:0!important;padding-left:0!important" class="CToWUd" data-bit="iit"></div>`;
// }
