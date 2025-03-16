import { db } from "../../db/index";
import { accounts, users, sessions, verificationTokens } from "../../db/schema";
import { eq } from "drizzle-orm";
const tokenExpires = new Date(Date.now() + 48 * 60 * 60 * 1000); // 24 小时后过期
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

  if (userdb && userdb.length > 0) {
    const user = userdb[0];
    await updateExistingUser(user, profile, account);
    // 更新会话和验证令牌

    await createSessionAndVerificationToken(user.id, profile.email, account); // {{ edit_1 }}

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

  await db
    .update(accounts)
    .set({
      type: account.type,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      access_token: account.access_token,
      refresh_token: account.refresh_token, 
      token_type: account.token_type,
      expires_at: account.expires_at,
      scope: account.scope,
      id_token: account.id_token,
    })
    .where(eq(accounts.userId, user.id));
}

/**
 * 创建新用户
 * @param profile 用户资料
 * @param account 账户信息
 * @returns 新创建的用户
 */
async function createNewUser(profile, account) {

  const [newUser] = await db
    .insert(users)
    .values({
      email: profile.email,
      name: profile.name,
      image: profile.picture,
      emailVerified: new Date(),
    })
    .returning();

  await db.insert(accounts).values({
    userId: newUser.id,
    type: "oauth",
    provider: account.provider,
    providerAccountId: account.providerAccountId,
    access_token: account.access_token,
    refresh_token: account.refresh_token, // 存储 Refresh Token
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
  const sessionExpires = new Date(account.expires_at * 1000); // 转换为毫秒

  // 尝试更新现有会话
  const existingSession = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .limit(1);

  if (existingSession.length > 0) {
    await db
      .update(sessions)
      .set({
        expires: sessionExpires,
        sessionToken: sessionToken,
      })
      .where(eq(sessions.userId, userId));
  } else {
    await db.insert(sessions).values({
      userId: userId,
      expires: sessionExpires,
      sessionToken: sessionToken,
    });
  }

  // 生成独立的验证令牌
  const verificationTokenValue = generateToken(); // 生成随机令牌
  // const tokenExpires = new Date(Date.now() + 3600 * 1000); // 1 小时后过期
  // 尝试更新现有验证令牌
  const existingToken = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.identifier, email))
    .limit(1);

  if (existingToken.length > 0) {
    await db
      .update(verificationTokens)
      .set({
        token: verificationTokenValue, // 使用生成的验证令牌
        expires: tokenExpires,
      })
      .where(eq(verificationTokens.identifier, email));
      
  } else {
    await db.insert(verificationTokens).values({
      identifier: email,
      token: verificationTokenValue, // 使用生成的验证令牌
      expires: tokenExpires,
    });
  }
}

/**
 * 生成随机令牌
 * @returns 随机生成的令牌
 */
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
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
  // 查询现有的验证令牌
  let [verificationToken] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.identifier, email))
    .limit(1);

  // 如果 Token 存在但已过期，删除旧的 Token
  if (verificationToken && new Date() > new Date(verificationToken.expires)) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, email));
    verificationToken = null;
  }

  // 如果 Token 不存在或已过期，创建新的 Token
  if (!verificationToken) {
    const newToken = {
      identifier: email,
      token: generateToken(), // 生成令牌的逻辑
      expires: tokenExpires, // 1 小时后过期
    };

    await db.insert(verificationTokens).values(newToken);

    // 手动查询新创建的记录
    [verificationToken] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.identifier, email))
      .limit(1);
  }

  return verificationToken;
}
