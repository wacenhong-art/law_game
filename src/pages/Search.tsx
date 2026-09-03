import { Bookmark, BookmarkCheck } from "lucide-react";
import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SectionCard";
import { useAppStore } from "@/store/appStore";

export default function Search() {
  const laws = useAppStore((state) => state.laws);
  const cases = useAppStore((state) => state.cases);
  const favorites = useAppStore((state) => state.favorites);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const activeMode = useAppStore((state) => state.activeMode);
  const [keyword, setKeyword] = useState("");
  const [selectedLawId, setSelectedLawId] = useState(laws[0]?.id ?? "");
  const isEntertainment = activeMode === "entertainment";

  const filteredLaws = useMemo(
    () =>
      laws.filter((item) => {
        const target = `${item.title} ${item.content} ${item.interpretation} ${item.keywords.join(" ")}`;
        return !keyword.trim() || target.includes(keyword.trim());
      }),
    [keyword, laws],
  );

  const selectedLaw = filteredLaws.find((item) => item.id === selectedLawId) ?? laws.find((item) => item.id === selectedLawId);
  const relatedCases = cases.filter((item) => selectedLaw?.relatedCaseIds.includes(item.id));

  return (
    <AppShell
      title={isEntertainment ? "生活化法律检索" : "法律条文与案例检索"}
      subtitle={isEntertainment ? "娱乐端优先展示简易释义与生活化关联，帮助用户快速理解条文用途。" : "本地法条库支持关键词检索、简易释义展示、关联案例与收藏。"}
    >
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard title={isEntertainment ? "轻量检索" : "法条检索"} subtitle={isEntertainment ? "优先匹配生活关键词与简易理解。" : "覆盖民法典、刑法、公司法等核心条文。"}>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={isEntertainment ? "输入生活问题，如 租房、加班、继承、退款" : "输入关键词，如 合同、侵权、诈骗、股权"}
            className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
          <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
            {filteredLaws.map((item) => {
              const active = item.id === selectedLawId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedLawId(item.id)}
                  className={`w-full rounded-[24px] border p-4 text-left transition ${
                    active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.lawBook}</span>
                    <span className={`text-xs ${active ? "text-amber-200" : "text-slate-400"}`}>{item.relatedCaseIds.length} 关联案例</span>
                  </div>
                  <div className="mt-2 text-sm font-medium">{item.title}</div>
                  <p className={`mt-2 text-sm leading-6 ${active ? "text-slate-200" : "text-slate-500"}`}>
                    {isEntertainment ? `生活理解：${item.interpretation}` : item.interpretation}
                  </p>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title={selectedLaw?.title ?? "法条详情"}
            subtitle={isEntertainment ? `${selectedLaw?.lawBook ?? "请选择法条"} · 娱乐端优先简释` : selectedLaw?.lawBook ?? "请选择法条"}
            action={
              selectedLaw ? (
                <button
                  type="button"
                  onClick={() => toggleFavorite("law", selectedLaw.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-400"
                >
                  {favorites.some((item) => item.type === "law" && item.targetId === selectedLaw.id) ? (
                    <BookmarkCheck size={15} />
                  ) : (
                    <Bookmark size={15} />
                  )}
                  收藏法条
                </button>
              ) : null
            }
          >
            {selectedLaw ? (
              <div className="space-y-5">
                <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-amber-700">{isEntertainment ? "生活化解释" : "简易释义"}</div>
                  <p className="mt-3 text-sm leading-7 text-amber-900">{selectedLaw.interpretation}</p>
                </div>
                <div className="rounded-[24px] bg-slate-50 p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{isEntertainment ? "法条原文参考" : "法条原文"}</div>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{selectedLaw.content}</p>
                </div>
                {isEntertainment ? (
                  <div className="rounded-[24px] bg-white p-5 text-sm leading-7 text-slate-700">
                    当你遇到“{selectedLaw.keywords[0] ?? "相关问题"}”类生活场景时，可先看简易释义，再结合关联案例判断自己更接近哪类事实结构。
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {selectedLaw.keywords.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">未找到匹配法条。</p>
            )}
          </SectionCard>

          <SectionCard title={isEntertainment ? "生活关联案例" : "关联案例"} subtitle={isEntertainment ? "娱乐端优先展示怎么理解这个案例。" : "展示核心背景与裁判结果。"}>
            <div className="space-y-3">
              {relatedCases.map((item) => {
                const favorited = favorites.some((favorite) => favorite.type === "case" && favorite.targetId === item.id);
                return (
                  <div key={item.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-slate-900">{item.title}</div>
                        <div className="mt-1 text-xs text-slate-400">{item.category} · {item.cause}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleFavorite("case", item.id)}
                        className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-slate-400"
                      >
                        {favorited ? "已收藏" : "收藏案例"}
                      </button>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
                    <div className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-700">{item.result}</div>
                    {isEntertainment ? (
                      <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                        生活理解：该案例主要帮助你识别“这类问题通常看什么证据、争什么责任、结果一般怎么落地”。
                      </div>
                    ) : null}
                  </div>
                );
              })}
              {relatedCases.length === 0 ? <p className="text-sm text-slate-500">该法条当前没有关联案例。</p> : null}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
