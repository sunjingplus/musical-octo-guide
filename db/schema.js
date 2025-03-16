// 导入 Drizzle ORM 的 PostgreSQL 核心模块
import {
  uuid,
  text,
  timestamp,
  integer,
  pgSchema,
  bigint,
} from "drizzle-orm/pg-core";

// 定义数据库模式（schema）
export const auth = pgSchema("next_auth");

// 定义用户表（users）
export const users = auth.table("users", {
  id: uuid("id").primaryKey().defaultRandom(), // UUID 主键，默认随机生成
  name: text("name"), // 用户名
  email: text("email").unique().notNull(), // 邮箱，唯一且非空
  password: text("password"), // 密码
  emailVerified: timestamp("email_verified", { withTimezone: true }), // 邮箱验证时间
  image: text("image"), // 用户头像链接
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(), // 创建时间，默认当前时间
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(), // 更新时间，默认当前时间
});
//session表格
export const sessions = auth.table("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
});
//验证token表格
export const verificationTokens = auth.table("verification_tokens", {
  identifier: text("identifier"),
  token: text("token").primaryKey(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

// 定义音乐表（music）
export const music = auth.table("music", {
  id: uuid("id").primaryKey().defaultRandom(), // UUID 主键，默认随机生成
  title: text("title").notNull(), // 音乐标题，非空
  artist: text("artist"), // 艺术家
  audioUrl: text("audio_url").notNull(), // 音频文件链接，非空
  lyrics: text("lyrics"), // 歌词
  coverImage: text("cover_image"), // 封面图片链接
  duration: integer("duration"), // 歌曲时长（秒）
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(), // 创建时间，默认当前时间
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(), // 更新时间，默认当前时间
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // 外键，关联用户表
  taskId: text("task_id"), // 新增字段，保存任务 ID
});

// 定义账户表（accounts）
export const accounts = auth.table("accounts", {
  id: uuid("id").primaryKey().defaultRandom(), // UUID 主键，默认随机生成
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // 外键，关联用户表
  type: text("type").notNull(), // 账户类型（如 "oauth"、"email" 等）
  provider: text("provider").notNull(), // OAuth 提供商（如 "google"、"github" 等）
  providerAccountId: text("provider_account_id").notNull(), // 提供商的用户 ID
  refresh_token: text("refresh_token"), // OAuth 刷新令牌
  access_token: text("access_token"), // OAuth 访问令牌
  expires_at: bigint("expires_at", { mode: "number" }), // 令牌过期时间（时间戳）
  token_type: text("token_type"), // 令牌类型
  scope: text("scope"), // OAuth 范围
  id_token: text("id_token"), // ID 令牌
  session_state: text("session_state"), // 会话状态
  oauth_token_secret: text("oauth_token_secret"), // OAuth 令牌密钥
  oauth_token: text("oauth_token"), // OAuth 令牌
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(), // 创建时间，默认当前时间
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(), // 更新时间，默认当前时间
});
