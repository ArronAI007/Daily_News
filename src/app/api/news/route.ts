import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/news";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const digest = await fetchNews();
    const response = NextResponse.json({
      success: true,
      data: digest,
    });
    // 彻底禁用所有层级的缓存
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "获取新闻失败";
    const response = NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    return response;
  }
}
