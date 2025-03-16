import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";
import fetch from "node-fetch";

const bucketName = "eclicktech_test_0312";

// 初始化 Google Cloud Storage 客户端
const serviceAccountKey = JSON.parse(
  Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, "base64").toString("utf-8")
);
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: serviceAccountKey,
});

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data || !data.mp3Url) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const uniqueId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const destinationBlobName = `audio-files/${uniqueId}.mp3`;
    console.log("Destination Blob Name:", destinationBlobName);
    console.log("MP3 URL:", data.mp3Url);

    // 下载 MP3 文件
    let response;
    try {
      response = await fetch(data.mp3Url);
      if (!response.ok) {
        throw new Error(`Failed to fetch MP3 file: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      return NextResponse.json(
        { message: "Failed to fetch MP3 file", error: error.message },
        { status: 500 }
      );
    }

    const buffer = await response.arrayBuffer();
    console.log("File downloaded successfully. Buffer length:", buffer.byteLength);

    // 上传到 Google Cloud Storage
    try {
      await storage
        .bucket(bucketName)
        .file(destinationBlobName)
        .save(Buffer.from(buffer));
      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error.message, error.stack);
      return NextResponse.json(
        { message: "Failed to upload file to Google Cloud Storage", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "MP3 file stored successfully",
        path: `gs://${bucketName}/${destinationBlobName}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error storing MP3 file:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}