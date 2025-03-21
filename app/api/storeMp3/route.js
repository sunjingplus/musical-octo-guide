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

    // 下载 MP3 文件
    const controller = new AbortController();
    const signal = controller.signal;

    let response;
    try {
      response = await fetch(data.mp3Url, { signal });
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

    // 上传到 Google Cloud Storage
    const file = storage.bucket(bucketName).file(destinationBlobName);
    const stream = file.createWriteStream();

    stream.end(Buffer.from(buffer));

    stream.on('finish', () => {
      console.log("File uploaded successfully");
    });

    stream.on('error', (error) => {
      console.error("Upload error:", error.message, error.stack);
      return NextResponse.json(
        { message: "Failed to upload file to Google Cloud Storage", error: error.message },
        { status: 500 }
      );
    });

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