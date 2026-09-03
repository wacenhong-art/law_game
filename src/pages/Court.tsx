import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SectionCard";
import StageTimeline from "@/components/StageTimeline";
import { useAppStore } from "@/store/appStore";
import type { CaseCategory, CourtRole, StageKey } from "@/types";
import { createEmptyDraft, stageGuides, stageLabels } from "@/utils/game";

const roles: CourtRole[] = ["法官", "原告律师", "被告律师", "公诉人", "证人"];
const categories: Array<CaseCategory | "全部"> = ["全部", "民事", "刑事", "商事"];

export default function Court() {
  const courtCases = useAppStore((state) => state.cases);
  const saveCourtReport = useAppStore((state) => state.saveCourtReport);
  const activeMode = useAppStore((state) => state.activeMode);
  const [category, setCategory] = useState<CaseCategory | "全部">("全部");
  const [keyword, setKeyword] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState(courtCases[0]?.id ?? "");
  const [role, setRole] = useState<CourtRole>("法官");
  const [activeStage, setActiveStage] = useState<StageKey>("opening");
  const [draft, setDraft] = useState(createEmptyDraft());
  const [reportId, setReportId] = useState("");
  const isEntertainment = activeMode === "entertainment";
  const availableRoles = isEntertainment ? (["原告律师", "被告律师", "证人"] as CourtRole[]) : roles;

  const filteredCases = useMemo(
    () =>
      courtCases.filter((item) => {
        const hitCategory = category === "全部" || item.category === category;
        const hitKeyword = !keyword.trim() || `${item.id} ${item.title} ${item.cause}`.includes(keyword.trim());
        return hitCategory && hitKeyword;
      }),
    [category, courtCases, keyword],
  );

  const selectedCase = filteredCases.find((item) => item.id === selectedCaseId) ?? courtCases.find((item) => item.id === selectedCaseId);

  return (
    <AppShell
      title={isEntertainment ? "趣味庭审体验" : "专业模拟法庭"}
      subtitle={
        isEntertainment
          ? "娱乐端保留案例体验入口，更强调事实理解、角色代入与结果感知。"
          : "本地案例、角色分配、流程引导与评分报告构成核心功能闭环。"
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr_0.8fr]">
        <SectionCard title="案例库" subtitle="民事、刑事、商事各 10 条基础案例。">
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  category === item ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="按案例题目或案由筛选"
            className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
          <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
            {filteredCases.map((item) => {
              const active = item.id === selectedCaseId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCaseId(item.id)}
                  className={`w-full rounded-[24px] border p-4 text-left transition ${
                    active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{item.title}</span>
                    <span className={`text-xs ${active ? "text-amber-200" : "text-slate-400"}`}>{item.category}</span>
                  </div>
                  <div className="mt-2 text-sm">{item.cause}</div>
                  <p className={`mt-2 text-sm leading-6 ${active ? "text-slate-200" : "text-slate-500"}`}>{item.summary}</p>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="庭审配置"
            subtitle={isEntertainment ? "娱乐端保留轻量角色范围与体验化说明。" : "选择角色后进入四步流程。"}
          >
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">当前案例</div>
                <div className="mt-2 font-serif text-xl text-slate-900">{selectedCase?.title ?? "请先选择案例"}</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{selectedCase?.result}</p>
                {isEntertainment ? (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                    娱乐端更推荐从事实概述、关键证据、个人结论三个层次完成输入，不要求完整专业术语。
                  </div>
                ) : null}
                <div className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-400">角色选择</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {availableRoles.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRole(item)}
                      className={`rounded-2xl px-4 py-3 text-sm transition ${
                        role === item ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <StageTimeline activeStage={activeStage} onSelect={setActiveStage} />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title={`${stageLabels[activeStage]}环节`}
            subtitle={stageGuides[activeStage]}
            action={
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                当前角色 <span className="text-slate-900">{role}</span>
              </div>
            }
          >
            <textarea
              value={draft[activeStage]}
              onChange={(event) => setDraft((current) => ({ ...current, [activeStage]: event.target.value }))}
              className="min-h-52 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 outline-none transition focus:border-slate-400"
              placeholder={
                isEntertainment
                  ? `请输入${stageLabels[activeStage]}体验要点：围绕发生了什么、你怎么看、你希望结果是什么。`
                  : `请输入${stageLabels[activeStage]}要点：围绕事实、证据、法条和结论进行整理。`
              }
            />
            <div className="mt-4 flex flex-wrap gap-3">
              {(["opening", "investigation", "debate", "judgment"] as StageKey[]).map((stage, index, array) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setActiveStage(stage)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeStage === stage ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {stageLabels[stage]}
                  {index < array.length - 1 ? " ·" : ""}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  if (!selectedCase) return;
                  const report = saveCourtReport(selectedCase.id, role, draft);
                  setReportId(report.id);
                  setDraft(createEmptyDraft());
                  setActiveStage("opening");
                }}
                className="ml-auto rounded-full bg-amber-500 px-5 py-2 text-sm text-slate-950 transition hover:bg-amber-400"
              >
                {isEntertainment ? "生成体验结果" : "结束庭审并生成评分"}
              </button>
            </div>
          </SectionCard>
        </div>

        <SectionCard title={isEntertainment ? "体验结果" : "评分报告"} subtitle={isEntertainment ? "娱乐端突出整体理解与代入完成度。" : "按法条引用、辩论逻辑、程序合规生成简易结果。"}>
          {reportId ? (
            (() => {
              const report = useAppStore.getState().reports.find((item) => item.id === reportId);
              if (!report) return <p className="text-sm text-slate-500">未找到评分结果。</p>;

              return (
                <div className="space-y-4">
                  {isEntertainment
                    ? [
                        ["剧情理解", report.scoreLogic],
                        ["角色代入", report.scoreProcedure],
                        ["结论表达", report.scoreLawCitation],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-[24px] bg-slate-50 p-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{label}</span>
                            <span className="font-medium text-slate-900">{value} 分</span>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-slate-200">
                            <div className="h-2 rounded-full bg-slate-900" style={{ width: `${value}%` }} />
                          </div>
                        </div>
                      ))
                    : [
                        ["法条引用", report.scoreLawCitation],
                        ["辩论逻辑", report.scoreLogic],
                        ["程序合规", report.scoreProcedure],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-[24px] bg-slate-50 p-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{label}</span>
                            <span className="font-medium text-slate-900">{value} 分</span>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-slate-200">
                            <div className="h-2 rounded-full bg-slate-900" style={{ width: `${value}%` }} />
                          </div>
                        </div>
                      ))}
                  <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4">
                    <div className="text-sm text-amber-700">{isEntertainment ? "体验完成度" : "综合得分"}</div>
                    <div className="mt-2 font-serif text-4xl text-amber-900">{report.totalScore}</div>
                    <p className="mt-3 text-sm leading-6 text-amber-900/80">
                      {isEntertainment
                        ? "娱乐端结果更关注是否理解冲突、是否能清楚表达立场，以及是否顺利完成整段体验。"
                        : report.summary}
                    </p>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="rounded-[24px] bg-slate-50 p-5 text-sm leading-7 text-slate-500">
              {isEntertainment
                ? "选择案例与角色后，按提示完成体验式输入，即可在本地生成轻量结果并保存至个人中心。"
                : "选择案例与角色后，依次完成开庭、调查、辩论、宣判内容录入，即可在本地生成评分报告并保存至个人中心。"}
            </div>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
