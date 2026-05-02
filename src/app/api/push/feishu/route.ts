import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/news";
import { NewsItem, NewsCategory, categoryLabels } from "@/types/news";

type FeishuContentBlock =
  | { tag: "text"; text: string }
  | { tag: "a"; text: string; href: string }
  | { tag: "at"; user_id: string };

interface FeishuPostMessage {
  msg_type: string;
  content: {
    post: {
      zh_cn: {
        title: string;
        content: Array<Array<FeishuContentBlock>>;
      };
    };
  };
}

function formatNewsForFeishu(news: NewsItem[]): FeishuPostMessage {
  const now = new Date();
  const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`;

  const content: Array<Array<FeishuContentBlock>> = [
    [
      { tag: "text", text: `📅 ${dateStr} 每日简报\n\n` },
    ],
  ];

  const categories: NewsCategory[] = ["ai", "finance", "global", "deep"];

  for (const cat of categories) {
    const items = news.filter((n) => n.category === cat).slice(0, 2);
    if (items.length === 0) continue;

    content.push([
      { tag: "text", text: `\n${categoryLabels[cat]}\n` },
    ]);

    for (const item of items) {
      content.push([
        { tag: "text", text: `• ` },
        { tag: "a", text: item.title, href: item.url },
        { tag: "text", text: `\n  ${item.summary.slice(0, 60)}...\n` },
      ]);
    }
  }

  content.push([
    { tag: "text", text: `\n---\n` },
    { tag: "text", text: `📎 更多详情：` },
    { tag: "a", text: "查看完整简报", href: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" },
  ]);

  return {
    msg_type: "post",
    content: {
      post: {
        zh_cn: {
          title: `🌅 Daily Brief — ${dateStr} 晨报`,
          content,
        },
      },
    },
  };
}

export async function POST(request: Request) {
  try {
    const { webhookUrl } = await request.json();

    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, error: "缺少 webhook URL" },
        { status: 400 }
      );
    }

    const digest = await fetchNews();
    const message = formatNewsForFeishu(digest.items);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`飞书 API 错误: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.code !== 0) {
      throw new Error(`飞书返回错误: ${result.msg || "未知错误"}`);
    }

    return NextResponse.json({
      success: true,
      data: { messageId: result.data?.message_id },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "推送失败";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
