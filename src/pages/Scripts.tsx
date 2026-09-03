import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SectionCard";
import { useAppStore } from "@/store/appStore";

type DebateMessage = {
  id: string;
  side: "user" | "system";
  role: string;
  content: string;
};

const buildSystemReply = ({
  title,
  theme,
  clues,
  step,
  systemRole,
  userContent,
}: {
  title: string;
  theme: string;
  clues: string[];
  step: string;
  systemRole: string;
  userContent: string;
}) => {
  const keyPoint = clues.slice(0, 2).join("、");
  const userFocus = userContent.length > 36 ? `${userContent.slice(0, 36)}...` : userContent;

  return `作为${systemRole}，我对“${title}”的回应是：你提出的“${userFocus}”只覆盖了部分事实，当前更应围绕${step}展开，并重点核查${keyPoint}。从${theme}争议的一般处理逻辑看，主张是否成立取决于证据完整性、责任边界和法律依据是否能够形成闭环。`;
};

export default function Scripts() {
  const scripts = useAppStore((state) => state.scripts);
  const scriptProgress = useAppStore((state) => state.scriptProgress);
  const completeScript = useAppStore((state) => state.completeScript);
  const activeMode = useAppStore((state) => state.activeMode);
  const [selectedScriptId, setSelectedScriptId] = useState(scripts[0]?.id ?? "");
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState("");
  const [debateInput, setDebateInput] = useState("");
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const isEntertainment = activeMode === "entertainment";

  const selectedScript = scripts.find((item) => item.id === selectedScriptId) ?? null;
  const progressItem = scriptProgress.find((item) => item.scriptId === selectedScriptId);
  const systemRole = useMemo(
    () => selectedScript?.roles.find((role) => role !== selectedRole) ?? selectedScript?.roles[1] ?? "",
    [selectedRole, selectedScript],
  );

  useEffect(() => {
    if (!selectedScript) return;
    setSelectedRole(selectedScript.roles[0] ?? "");
    setStepIndex(0);
    setDebateInput("");
    setMessages([]);
  }, [selectedScriptId, selectedScript]);

  return (
    <AppShell
      title={isEntertainment ? "沉浸式普法剧本" : "轻量化普法剧本"}
      subtitle={
        isEntertainment
          ? "娱乐端优先强调剧情代入、单人对辩和知识卡片解锁。"
          : "专业端将剧本作为生活场景下的辅助训练，强调证据线索与表达结构。"
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard title="剧本列表" subtitle={isEntertainment ? "娱乐端优先进入生活化剧情体验。" : "本地预置 8 个高频生活法律场景。"}>
          <div className="space-y-3">
            {scripts.map((item) => {
              const active = item.id === selectedScriptId;
              const completed = scriptProgress.some((progress) => progress.scriptId === item.id && progress.completed);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedScriptId(item.id)}
                  className={`w-full rounded-[24px] border p-4 text-left transition ${
                    active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{item.title}</span>
                    <span className={`text-xs ${active ? "text-amber-200" : completed ? "text-emerald-600" : "text-slate-400"}`}>
                      {completed ? "已完成" : item.theme}
                    </span>
                  </div>
                  <p className={`mt-2 text-sm leading-6 ${active ? "text-slate-200" : "text-slate-500"}`}>{item.clues.join(" / ")}</p>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title={selectedScript?.title ?? "剧本详情"}
            subtitle={isEntertainment ? `${selectedScript?.theme ?? "请选择剧本"} · 剧情体验优先` : selectedScript?.theme ?? "请选择剧本"}
          >
            {selectedScript ? (
              <div className="space-y-5">
                <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                  <div className="rounded-[24px] bg-slate-50 p-5">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">单人角色模式</div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {selectedScript.roles.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            setSelectedRole(role);
                            setDebateInput("");
                            setMessages([]);
                          }}
                          className={`rounded-full px-4 py-2 text-sm transition ${
                            selectedRole === role ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          扮演 {role}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                      <div>你的角色：{selectedRole}</div>
                      <div>系统角色：{systemRole}</div>
                      <div>
                        {isEntertainment
                          ? "你输入剧情化辩词后，系统会自动以对方角色接续回应，强化代入感。"
                          : "你输入结构化辩论内容后，系统会自动以对方角色补全回应，用于辅助训练表达。"}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
                    <div className="text-xs uppercase tracking-[0.24em] text-amber-700">{isEntertainment ? "剧情线索" : "证据线索"}</div>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900">
                      {selectedScript.clues.map((clue) => (
                        <li key={clue}>- {clue}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-[28px] bg-slate-950 p-6 text-white">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">引导流程 {stepIndex + 1}</div>
                  <div className="mt-3 font-serif text-2xl">{selectedScript.steps[stepIndex]}</div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {isEntertainment
                      ? "围绕当前剧情节点输入你的立场和回应，系统将自动给出对方角色的反驳或补充。"
                      : "围绕当前步骤输入你的辩论内容，系统会自动补全对方角色的回应，形成完整对辩过程。"}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
                    >
                      上一步
                    </button>
                    <button
                      type="button"
                      onClick={() => setStepIndex((current) => Math.min(selectedScript.steps.length - 1, current + 1))}
                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30"
                    >
                      下一步
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{isEntertainment ? "输入剧情回应" : "输入辩论"}</div>
                    <div className="mt-3 text-sm text-slate-600">
                      当前由你扮演 <span className="font-medium text-slate-900">{selectedRole}</span>，请围绕“{selectedScript.steps[stepIndex]}”
                      {isEntertainment ? "输入你的剧情回应与立场。" : "输入你的辩词。"}
                    </div>
                    <textarea
                      value={debateInput}
                      onChange={(event) => setDebateInput(event.target.value)}
                      className="mt-4 min-h-40 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 outline-none transition focus:border-slate-400"
                      placeholder={isEntertainment ? "输入你会怎么回应、你认为什么更合理。" : "输入你的主张、证据和结论。"}
                    />
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const trimmedInput = debateInput.trim();
                          if (!trimmedInput || !selectedRole || !systemRole) return;

                          const userMessage: DebateMessage = {
                            id: `user-${Date.now()}`,
                            side: "user",
                            role: selectedRole,
                            content: trimmedInput,
                          };

                          const systemMessage: DebateMessage = {
                            id: `system-${Date.now() + 1}`,
                            side: "system",
                            role: systemRole,
                            content: buildSystemReply({
                              title: selectedScript.title,
                              theme: selectedScript.theme,
                              clues: selectedScript.clues,
                              step: selectedScript.steps[stepIndex],
                              systemRole,
                              userContent: trimmedInput,
                            }),
                          };

                          setMessages((current) => [...current, userMessage, systemMessage]);
                          setDebateInput("");
                        }}
                        className="rounded-full bg-slate-900 px-5 py-2 text-sm text-white transition hover:bg-slate-800"
                      >
                        {isEntertainment ? "提交回应" : "提交辩论"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDebateInput("");
                          setMessages([]);
                        }}
                        className="rounded-full border border-slate-200 px-5 py-2 text-sm text-slate-600 transition hover:border-slate-400"
                      >
                        清空本轮对辩
                      </button>
                      <button
                        type="button"
                        onClick={() => completeScript(selectedScript.id, selectedScript.title)}
                        disabled={messages.length === 0}
                        className="ml-auto rounded-full bg-amber-500 px-5 py-2 text-sm text-slate-950 transition enabled:hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-200"
                      >
                        {isEntertainment ? "完成剧情并解锁知识卡片" : "完成辩论并解锁知识卡片"}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{isEntertainment ? "剧情对话记录" : "对辩记录"}</div>
                    <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`rounded-[24px] p-4 ${
                            message.side === "user" ? "bg-slate-900 text-white" : "border border-amber-200 bg-amber-50 text-amber-950"
                          }`}
                        >
                          <div className={`text-xs uppercase tracking-[0.24em] ${message.side === "user" ? "text-slate-300" : "text-amber-700"}`}>
                            {message.side === "user" ? (isEntertainment ? "你的回应" : "你的辩词") : "系统回应"} · {message.role}
                          </div>
                          <p className="mt-3 text-sm leading-7">{message.content}</p>
                        </div>
                      ))}
                      {messages.length === 0 ? (
                        <div className="rounded-[24px] bg-white p-4 text-sm leading-7 text-slate-500">
                          {isEntertainment
                            ? "当前还没有剧情对话。提交你的回应后，系统会自动补全对方角色的回应。"
                            : "当前还没有对辩内容。提交你的辩论后，系统会自动补全对方角色的回应。"}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">未选择剧本。</p>
            )}
          </SectionCard>

          <SectionCard title="知识卡片" subtitle={isEntertainment ? "娱乐端更强调完成后的即时收获。" : "完成剧本后在本地解锁并展示。"}>
            {progressItem?.completed && selectedScript ? (
              <div className="grid gap-4 md:grid-cols-2">
                {selectedScript.knowledgeCards.map((card) => (
                  <div key={card} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">已解锁</div>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{card}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] bg-slate-50 p-5 text-sm leading-7 text-slate-500">
                该剧本尚未完成，当前仅展示引导流程与线索。完成后即可在此处查看对应法律知识卡片。
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
