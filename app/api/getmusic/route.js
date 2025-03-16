/*
 * @Author: Zane
 * @Date: 2024-03-21 15:46:54
 * @Description:
 * @LastEditors: Zane zanekwok73@gmail.com
 * @LastEditTime: 2024-03-21 18:45:50
 */

import { NextResponse } from "next/server";
import { db } from "../../../db";
import { music, users } from "../../../db/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../libs/lib/auth";
import { eq } from "drizzle-orm";
export async function GET(req) {
  
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1; // 获取当前页码，默认为 1
  const limit = parseInt(searchParams.get("limit")) || 10; // 每页条数，默认为 20

  // 验证会话
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json(
      { code: "unauthorized", message: "需要登录" },
      { status: 401 }
    );
  }

  // 获取用户ID
  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!user[0]?.id) {
    return Response.json(
      { code: "user_not_found", message: "用户不存在" },
      { status: 404 }
    );
  }
  const userId = user[0].id;
  console.log("userId", userId);

  try {
    // 计算偏移量
    const offset = (page - 1) * limit;
    console.log("userid", userId);

    // 查询用户的所有音乐记录（分页）
    const musicList = await db
      .select()
      .from(music)
      .where(eq(music.userId, userId))
      .limit(limit)
      .offset(offset);
    console.log(musicList);

    // 转换字段名以匹配前端期望的格式
    const transformedList = musicList.map((item) => ({
      id: item.id,
      title: item.title,
      imageUrl: item.coverImage,
      audioUrl: item.audioUrl,
      taskId: item.taskId,
      createdAt: item.createdAt,
    }));

    return NextResponse.json(transformedList, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
