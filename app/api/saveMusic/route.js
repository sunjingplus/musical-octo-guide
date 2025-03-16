import { db } from "../../../db";
import { music, users } from "../../../db/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../libs/lib/auth";
import { eq,and } from "drizzle-orm";
import { z } from "zod";

// 定义数据验证规则
const MusicItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(100),
  audioUrl: z.string().url(),
  imageUrl: z.string().url(),
  taskId: z.string().optional(),
});

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json(
      { code: "unauthorized", message: "需要登录" },
      { status: 401 }
    );
  }

  try {
    // 获取并验证数据
    const inputData = await req.json();

    // 获取用户ID
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!user?.id) {
      return Response.json(
        { code: "user_not_found", message: "用户不存在" },
        { status: 404 }
      );
    }

    // 处理数据
    const processedData = inputData.map((item) => {
      // 提取纯粹的 URL 部分
      const imageUrl = item.imageUrl.split(">").pop().split("<").shift();
      const audioUrl = item.audioUrl.split(">").pop().split("<").shift();

      return {
        id: item.id,
        title: item.title,
        cover_image: imageUrl,
        audio_url: audioUrl,
        task_id: item.taskId,
        user_id: user.id,
      };
    });

    // 验证并保存数据
    for (const item of processedData) {
      try {
        // 验证数据是否符合标准
        MusicItemSchema.parse({
          id: item.id,
          title: item.title,
          audioUrl: item.audio_url,
          imageUrl: item.cover_image,
          taskId: item.task_id,
        });

        // 检查数据是否已存在
        const existingIds = await db
          .select({ id: music.id })
          .from(music)
          .where(
            and(
              eq(music.id, item.id), // 检查 taskId 是否相等
              eq(music.userId, user.id) // 检查 user_id 是否相等
            )
          );
        if (existingIds.length > 0) {
          console.log("Item already exists:", item.id);
        } else {
          // 插入新数据
          await db.insert(music).values({
            title: item.title,
            audioUrl: item.audio_url,
            coverImage: item.cover_image,
            taskId: item.task_id,
            userId: user.id,
          });
          console.log("Item saved successfully:", item.id);
        }
      } catch (validationError) {
        // 记录验证失败的数据
        console.error("Validation failed for item:", item.id, validationError);
      }
    }

    return Response.json({
      code: "success",
      message: "音乐数据保存成功",
    });
  } catch (error) {
    console.error("保存音乐数据失败:", error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { code: "invalid_data", message: "数据格式错误", errors: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { code: "server_error", message: "服务器错误" },
      { status: 500 }
    );
  }
}
