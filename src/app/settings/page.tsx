"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleTestPush() {
    if (!webhookUrl.trim()) {
      setStatus("error");
      setMessage("请输入飞书 Webhook 地址");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/push/feishu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: webhookUrl.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage("测试推送成功！请检查飞书消息");
      } else {
        setStatus("error");
        setMessage(data.error || "推送失败");
      }
    } catch (error) {
      console.error("[Settings] Test push failed:", error);
      setStatus("error");
      setMessage("网络请求失败");
    }
  }

  return (
    <main className="flex-1">
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-3xl font-bold text-[var(--color-text)] mb-2">
            推送设置
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-8">
            配置飞书机器人 Webhook，每日自动接收新闻简报
          </p>

          <div className="space-y-8">
            {/* Feishu Webhook */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#3370FF] flex items-center justify-center text-white text-xs font-bold">
                  飞
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--color-text)]">
                    飞书推送
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    推荐 | 最稳定
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                    Webhook 地址
                  </label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => {
                      setWebhookUrl(e.target.value);
                      setStatus("idle");
                    }}
                    placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/xxxxx"
                    aria-invalid={status === "error"}
                    aria-describedby={status !== "idle" && status !== "loading" ? "push-status" : undefined}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  />
                </div>

                <div className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-4">
                  <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                    配置步骤
                  </h3>
                  <ol className="text-sm text-[var(--color-text-secondary)] space-y-1.5 list-decimal list-inside">
                    <li>在飞书群聊中点击「设置」→「群机器人」</li>
                    <li>添加「自定义机器人」，复制 Webhook 地址</li>
                    <li>粘贴到上方输入框，点击「测试推送」验证</li>
                  </ol>
                </div>

                <button
                  onClick={handleTestPush}
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-text)] text-[var(--color-surface)] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      推送中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      测试推送
                    </>
                  )}
                </button>

                {status === "success" && (
                  <motion.div
                    id="push-status"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-emerald-500"
                    role="status"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {message}
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    id="push-status"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-red-500"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {message}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Other platforms (placeholders) */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 opacity-60">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#0089FF] flex items-center justify-center text-white text-xs font-bold">
                  钉
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--color-text)]">
                    钉钉推送
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    即将支持
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 opacity-60">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#07C160] flex items-center justify-center text-white text-xs font-bold">
                  微
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--color-text)]">
                    企业微信推送
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    即将支持
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
