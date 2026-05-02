import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/news";

export async function GET() {
  try {
    const digest = await fetchNews();
    return NextResponse.json({
      success: true,
      data: digest,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "获取新闻失败";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
