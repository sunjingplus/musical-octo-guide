/*
 * @Author: Zane
 * @Date: 2024-03-21 16:17:41
 * @Description:
 * @LastEditors: Zane zanekwok73@gmail.com
 * @LastEditTime: 2024-03-21 18:46:21
 */
import { NextResponse } from "next/server";

export async function POST(req) {
  const apiUrl = process.env.NEXTAUTH_URL + "/api/music/predictions";
  const data = await req.json();

  // 构造后端请求的 payload
  const payload = {
    prompt: data.lyrics, // 使用歌词作为 prompt
    tags: data.style,    // 使用风格作为 tags
    mv: data.mv || "chirp-v4", // 使用 mv 字段，如果没有提供则默认为 "chirp-v4"
    title: data.title,   // 使用标题
  };


  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 确保设置正确的 Content-Type
        "X-API-Key": process.env.X_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (response.status !== 201) {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }

    const responseData = await response.json();
    return NextResponse.json(responseData, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong 1012." },
      { status: 500 }
    );
  }
}