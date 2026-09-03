import { useState } from "react";
import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SectionCard";
import { achievements } from "@/data/achievements";
import { ranks } from "@/data/ranks";
import { useAppStore, useCurrentUser, useUserMeta } from "@/store/appStore";
import type { UserTag } from "@/types";

export default function Profile() {
  const user = useCurrentUser();
  const { exp, rank, unlockedAchievementIds } = useUserMeta();
  const favorites = useAppStore((state) => state.favorites);
  const histories = useAppStore((state) => state.histories);
  const reports = useAppStore((state) => state.reports);
  const laws = useAppStore((state) => state.laws);
  const cases = useAppStore((state) => state.cases);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const clearLocalData = useAppStore((state) => state.clearLocalData);
  const activeMode = useAppStore((state) => state.activeMode);
  const [form, setForm] = useState({
    nickname: user?.nickname ?? "",
    password: user?.password ?? "",
    tag: (user?.tag ?? "法学生") as UserTag,
  });

  const favoriteLaws = favorites.filter((item) => item.type === "law");
  const favoriteCases = favorites.filter((item) => item.type === "case");
  const nextRank = ranks.find((item) => item.level === rank.level + 1);
  const progress = nextRank ? Math.min(100, Math.round((exp / nextRank.threshold) * 100)) : 100;
  const isEntertainment = activeMode === "entertainment";
  const courtCount = histories.filter((item) => item.type === "court").length;
  const scriptCount = histories.filter((item) => item.type === "script").length;

  return (
    <AppShell
      title="个人中心"
      subtitle={isEntertainment ? "娱乐端个人中心更强调剧本完成、知识卡片收获与解锁感。" : "专业端个人中心更强调庭审训练、法条积累与成长复盘。"}
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <SectionCard title="基础信息" subtitle="账号信息可直接在本地修改。">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <div className="text-sm text-slate-500">账号</div>
                <div className="mt-2 font-medium text-slate-900">{user?.account ?? "-"}</div>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-5">
                <div className="text-sm text-slate-500">当前标签</div>
                <div className="mt-2 font-medium text-slate-900">{user?.tag ?? "-"}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <input
                value={form.nickname}
                onChange={(event) => setForm((current) => ({ ...current, nickname: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="修改昵称"
              />
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="修改密码"
              />
              <div className="grid grid-cols-2 gap-3">
                {(["法学生", "普通用户"] as UserTag[]).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, tag }))}
                    className={`rounded-2xl px-4 py-3 text-sm transition ${
                      form.tag === tag ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => updateProfile(form)}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white transition hover:bg-slate-800"
              >
                保存账号信息
              </button>
            </div>
          </SectionCard>

          <SectionCard title="角色段位" subtitle={isEntertainment ? "娱乐端更强调完成体验后的成长反馈。" : "共 9 级，从青铜成长为王牌大律师。"}>
            <div className="rounded-[28px] bg-slate-950 p-6 text-white">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">当前段位</div>
              <div className="mt-3 font-serif text-3xl text-amber-200">{rank.title}</div>
              <div className="mt-3 text-sm text-slate-300">累计经验 {exp} EXP</div>
              <div className="mt-4 h-3 rounded-full bg-white/10">
                <div className="h-3 rounded-full bg-amber-400" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-3 text-sm text-slate-400">{nextRank ? `距离 ${nextRank.title} 还需 ${Math.max(0, nextRank.threshold - exp)} EXP` : "已达到最高段位"}</div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <div className="text-sm text-slate-500">{isEntertainment ? "剧本完成数" : "庭审完成数"}</div>
                <div className="mt-2 font-serif text-3xl">{isEntertainment ? scriptCount : courtCount}</div>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-5">
                <div className="text-sm text-slate-500">{isEntertainment ? "法条收藏数" : "案例收藏数"}</div>
                <div className="mt-2 font-serif text-3xl">
                  {isEntertainment ? favoriteLaws.length : favoriteCases.length}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="勋章墙" subtitle={isEntertainment ? "娱乐端更突出完成感与解锁感。" : "基础成就 10+，按本地行为自动解锁。"}>
            <div className="grid gap-3 sm:grid-cols-2">
              {achievements.map((item) => {
                const unlocked = unlockedAchievementIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`rounded-[24px] border p-4 ${unlocked ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"}`}
                  >
                    <div className="font-medium text-slate-900">{item.title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title={isEntertainment ? "体验历史" : "参与历史"} subtitle={isEntertainment ? "娱乐端优先展示剧本完成记录。" : "庭审报告与剧本记录本地保存。"}>
            <div className="space-y-3">
              {[
                ...histories.filter((item) => (isEntertainment ? item.type === "script" : item.type === "court")),
                ...histories.filter((item) => (isEntertainment ? item.type === "court" : item.type === "script")),
              ].slice(0, 10).map((item) => (
                <div key={item.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-slate-900">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.type === "court" ? "庭审" : "剧本"}</div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </div>
              ))}
              {histories.length === 0 ? <p className="text-sm text-slate-500">暂无历史记录。</p> : null}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <div className="text-sm text-slate-500">{isEntertainment ? "剧本总次数" : "庭审总次数"}</div>
                <div className="mt-2 font-serif text-3xl">{isEntertainment ? scriptCount : reports.length}</div>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-5">
                <div className="text-sm text-slate-500">{isEntertainment ? "庭审体验数" : "剧本完成数"}</div>
                <div className="mt-2 font-serif text-3xl">{isEntertainment ? courtCount : scriptCount}</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="收藏清单" subtitle={isEntertainment ? "娱乐端优先看法条理解积累。" : "集中查看法条与案例收藏。"}>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <div className="mb-3 font-medium text-slate-900">{isEntertainment ? "优先法条收藏" : "法条收藏"}</div>
                <div className="space-y-2 text-sm text-slate-600">
                  {favoriteLaws.map((item) => (
                    <div key={item.id}>{laws.find((law) => law.id === item.targetId)?.title ?? item.targetId}</div>
                  ))}
                  {favoriteLaws.length === 0 ? <div>暂无法条收藏。</div> : null}
                </div>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-5">
                <div className="mb-3 font-medium text-slate-900">{isEntertainment ? "进阶案例收藏" : "案例收藏"}</div>
                <div className="space-y-2 text-sm text-slate-600">
                  {favoriteCases.map((item) => (
                    <div key={item.id}>{cases.find((courtCase) => courtCase.id === item.targetId)?.title ?? item.targetId}</div>
                  ))}
                  {favoriteCases.length === 0 ? <div>暂无案例收藏。</div> : null}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="本地设置" subtitle="支持一键清理本地数据。">
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-5">
              <p className="text-sm leading-7 text-rose-900">清理后将移除账号、会话、庭审报告、历史记录、收藏和剧本解锁信息。</p>
              <button
                type="button"
                onClick={() => clearLocalData()}
                className="mt-4 rounded-2xl bg-rose-600 px-4 py-3 text-sm text-white transition hover:bg-rose-500"
              >
                清理全部本地数据
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
