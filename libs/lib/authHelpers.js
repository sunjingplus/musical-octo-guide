import { db } from "../../db/index";
import { accounts, users, sessions, verificationTokens } from "../../db/schema";
import { eq } from "drizzle-orm";

/**
 * 获取或创建用户
 * @param profile 用户资料
 * @param account 账户信息
 * @returns 用户ID
 */
export async function getOrCreateUser(profile, account) {
  const userdb = await db
    .select()
    .from(users)
    .where(eq(users.email, profile.email))
    .limit(1);
  console.log("数据库", userdb);

  if (userdb && userdb.length > 0) {
    const user = userdb[0];
    await updateExistingUser(user, profile, account);
    // 更新会话和验证令牌
    console.log("开始更新回话");

    await createSessionAndVerificationToken(user.id, profile.email, account); // {{ edit_1 }}
    console.log("开始返回", user.id);

    return user.id;
  } else {
    const newUser = await createNewUser(profile, account);
    return newUser.id;
  }
}

/**
 * 更新现有用户信息
 * @param user 现有用户
 * @param profile 用户资料
 * @param account 账户信息
 */
async function updateExistingUser(user, profile, account) {
  await db
    .update(users)
    .set({
      name: user.name ?? profile.name,
      image: profile.picture,
      emailVerified: user.emailVerified ?? new Date(),
    })
    .where(eq(users.id, user.id));
  console.log("更新ok1");

  await db
    .update(accounts)
    .set({
      type: account.type,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      access_token: account.access_token,
      token_type: account.token_type,
      expires_at: account.expires_at,
      scope: account.scope,
      id_token: account.id_token,
    })
    .where(eq(accounts.userId, user.id));
  console.log("更新ok");
}

/**
 * 创建新用户
 * @param profile 用户资料
 * @param account 账户信息
 * @returns 新创建的用户
 */
async function createNewUser(profile, account) {
  console.log("instart");

  const [newUser] = await db
    .insert(users)
    .values({
      email: profile.email,
      name: profile.name,
      image: profile.picture,
      emailVerified: new Date(),
    })
    .returning();
  console.log("newUser", newUser);

  await db.insert(accounts).values({
    userId: newUser.id,
    type: "oauth",
    provider: account.provider,
    providerAccountId: account.providerAccountId,
    access_token: account.access_token,
    token_type: account.token_type,
    expires_at: account.expires_at,
    scope: account.scope,
    id_token: account.id_token,
  });

  await createSessionAndVerificationToken(newUser.id, profile.email, account);

  return newUser;
}

/**
 * 创建会话和验证令牌
 * @param userId 用户ID
 * @param email 用户邮箱
 * @param account 账户信息
 */
async function createSessionAndVerificationToken(userId, email, account) {
  const sessionToken = account.access_token;
  const sessionExpires = new Date(account.expires_at);

  // 尝试更新现有会话
  const existingSession = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .limit(1);
  console.log("回话", existingSession);

  if (existingSession.length > 0) {
    await db
      .update(sessions)
      .set({
        expires: sessionExpires,
        sessionToken: sessionToken,
      })
      .where(eq(sessions.userId, userId));
    console.log("回话长度大于0");
    return;
  } else {
    await db.insert(sessions).values({
      userId: userId,
      expires: sessionExpires,
      sessionToken: sessionToken,
    });
    return;
  }
}

/**
 * 获取或创建会话
 * @param userId 用户ID
 * @returns 会话信息
 */
export async function getOrCreateSession(userId) {
  let [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .limit(1);
  return session;
}

/**
 * 获取或创建验证令牌
 * @param email 用户邮箱
 * @returns 验证令牌信息
 */
export async function getOrCreateVerificationToken(email) {
  let [verificationToken] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.identifier, email))
    .limit(1);

  return verificationToken;
}