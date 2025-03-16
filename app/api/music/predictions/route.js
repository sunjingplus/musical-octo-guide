/*
 * @Author: Zane
 * @Date: 2024-03-21 15:46:54
 * @Description:
 * @LastEditors: Zane zanekwok73@gmail.com
 * @LastEditTime: 2024-03-21 18:45:50
 */

import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();

  // 构造后端请求的 payload
  const payload = {
    prompt: data.lyrics, // 使用歌词作为 prompt
    tags: data.style, // 使用风格作为 tags
    // mv: data.mv || "chirp-v4", // 使用 mv 字段，如果没有提供则默认为 "chirp-v4"
    title: data.title, // 使用标题
  };

  try {
    const response = await fetch("https://api.deerapi.com/suno/submit/music", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: payload,
      }),
    });
    // const data = await response.json();
    // console.log("结果数据", data);
    // 检查响应状态
    if (response.ok) {
      const jsonRes = await response.json(response);
      return NextResponse.json(jsonRes, { status: 201 });
    } else {
      // 处理HTTP错误
      console.error("HTTP Error:", response.statusText);
      return NextResponse.json({ message: "error" }, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function GET(req) {
  // 从请求 URL 中获取查询参数
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    // 如果没有提供 id，返回 400 错误
    return NextResponse.json({ message: "Missing 'id' parameter" }, { status: 400 });
  }

  // 构造完整的 API 请求 URL
  const apiUrl = `https://api.deerapi.com/suno/fetch/${id}`;

  try {
    // 发起请求到外部 API
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // 检查响应状态
    if (!response.ok) {
      // 如果响应状态码不是 2xx，返回错误信息
      const error = await response.json();
      console.error("API Error:", error);
      return NextResponse.json({ message: error.message || "API request failed" }, { status: response.status });
    }

    // 解析响应数据
    const jsonRes = await response.json();

    // 检查返回的 JSON 数据中是否有错误信息
    if (jsonRes.code !== "success") {
      return NextResponse.json({ message: jsonRes.message || "API request failed" }, { status: 500 });
    }

    // 返回成功响应
    return NextResponse.json(jsonRes, { status: 200 });
  } catch (error) {
    // 捕获网络请求或其他错误
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}