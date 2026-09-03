import { BookOpen, Gavel, ScrollText, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import FeatureCard from "@/components/FeatureCard";
import SectionCard from "@/components/SectionCard";
import { useAppStore, useCurrentUser, useUserMeta } from "@/store/appStore";

const modeConfig = {
  professional: {
    title: "首页总览",
    subtitle: "专业端聚焦模拟法庭与法条检索，强调案例训练、条文适配与结构化复盘。",
    features: [
      {
        title: "案例模拟",
        description: "选择本地案例、分配庭审角色，并按开庭、调查、辩论、宣判完整推进。",
        icon: <Gavel size={20} />,
        path: "/court",
        badge: "优先入口",
      },
      {
        title: "法条检索",
        description: "检索法条原文、释义与关联案例，适合法条适用与论证准备。",
        icon: <ScrollText size={20} />,
        path: "/search",
        badge: "高频",
      },
      {
        title: "普法剧本",
        description: "作为辅助训练模块，用于生活场景中的法律表达与角色应对。",
        icon: <BookOpen size={20} />,
        path: "/scripts",
      },
      {
        title: "个人中心",
        description: "查看段位、勋章、庭审历史、剧本记录与收藏清单。",
        icon: <UserRound size={20} />,
        path: "/profile",
      },
    ],
    path: ["选案例", "走完整庭审流程", "查看评分报告"],
    focusTitle: "专业端定位",
    focusItems: ["优先使用模拟法庭练习流程", "法条检索服务于庭审论证", "评分结果强调结构化复盘"],
  },
  entertainment: {
    title: "首页总览",
    subtitle: "娱乐端聚焦普法剧本与生活化检索，强调情景代入、轻量辩论与快速理解。",
    features: [
      {
        title: "普法剧本",
        description: "优先进入生活法律场景，通过单人对辩完成轻量化普法体验。",
        icon: <BookOpen size={20} />,
        path: "/scripts",
        badge: "优先入口",
      },
      {
        title: "法条检索",
        description: "以简易释义和关联案例为主，快速理解条文在现实生活中的含义。",
        icon: <ScrollText size={20} />,
        path: "/search",
        badge: "易上手",
      },
      {
        title: "个人中心",
        description: "重点查看剧本完成、知识卡片解锁与个人成长结果。",
        icon: <UserRound size={20} />,
        path: "/profile",
      },
      {
        title: "案例模拟",
        description: "保留体验入口，但展示更偏体验化说明，适合作为进阶尝试。",
        icon: <Gavel size={20} />,
        path: "/court",
      },
    ],
    path: ["选剧本", "输入对辩内容", "解锁知识卡片"],
    focusTitle: "娱乐端定位",
    focusItems: ["优先进入普法剧本沉浸体验", "法条检索更强调生活化理解", "个人中心更强调解锁与完成感"],
  },
} as const;

export default function Home() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { rank, exp, unlockedAchievementIds } = useUserMeta();
  const setMode = useAppStore((state) => state.setMode);
  const activeMode = useAppStore((state) => state.activeMode);
  const reports = useAppStore((state) => state.reports);
  const histories = useAppStore((state) => state.histories);
  const favorites = useAppStore((state) => state.favorites);
  const currentConfig = modeConfig[activeMode];
  const scriptCount = histories.filter((item) => item.type === "script").length;
  const courtCount = histories.filter((item) => item.type === "court").length;

  return (
    <AppShell title={currentConfig.title} subtitle={currentConfig.subtitle}>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="双入口切换" subtitle="根据当前使用场景快速切换视角。">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                key: "professional" as const,
                title: "专业端",
                detail: "突出模拟法庭与法条检索，适合课程演示、法学训练与答辩展示。",
              },
              {
                key: "entertainment" as const,
                title: "娱乐端",
                detail: "突出普法剧本与轻量体验，适合大众用户的情景化法律入门。",
              },
            ].map((item) => {
              const active = activeMode === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMode(item.key)}
                  className={`rounded-[28px] border p-5 text-left transition ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white shadow-[0_20px_48px_rgba(15,23,42,0.18)]"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="font-serif text-xl">{item.title}</div>
                  <p className={`mt-3 text-sm leading-6 ${active ? "text-slate-200" : "text-slate-500"}`}>{item.detail}</p>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title={activeMode === "professional" ? "专业快照" : "娱乐快照"}
          subtitle={activeMode === "professional" ? "当前更强调训练成果与复盘状态。" : "当前更强调体验进度与解锁状态。"}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {(activeMode === "professional"
              ? [
                  ["当前用户", user?.nickname ?? "-"],
                  ["庭审完成", `${courtCount} 次`],
                  ["累计经验", `${exp} EXP`],
                ]
              : [
                  ["当前用户", user?.nickname ?? "-"],
                  ["剧本完成", `${scriptCount} 次`],
                  ["当前段位", rank.title],
                ]
            ).map(([label, value]) => (
              <div key={label} className="rounded-[24px] bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</div>
                <div className="mt-2 font-serif text-xl text-slate-900">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[24px] bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {activeMode === "professional"
              ? `已保存庭审报告 ${reports.length} 份，已解锁勋章 ${unlockedAchievementIds.length} 枚。`
              : `已完成剧本 ${scriptCount} 次，已解锁勋章 ${unlockedAchievementIds.length} 枚。`}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {currentConfig.features.map((item) => (
          <FeatureCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            badge={item.badge}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <SectionCard
          title={activeMode === "professional" ? "近期训练" : "近期体验"}
          subtitle={activeMode === "professional" ? "优先展示庭审与训练行为。" : "优先展示剧本与轻量体验行为。"}
        >
          <div className="space-y-3">
            {[
              ...histories.filter((item) => (activeMode === "professional" ? item.type === "court" : item.type === "script")),
              ...histories.filter((item) => (activeMode === "professional" ? item.type === "script" : item.type === "court")),
            ]
              .slice(0, 5)
              .map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-900">{item.title}</span>
                  <span className="text-slate-400">{item.type === "court" ? "庭审" : "剧本"}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.detail}</p>
              </div>
            ))}
            {histories.length === 0 ? <p className="text-sm text-slate-500">当前还没有参与记录。</p> : null}
          </div>
        </SectionCard>

        <SectionCard
          title={activeMode === "professional" ? "专业资源概况" : "轻量资源概况"}
          subtitle={activeMode === "professional" ? "偏重法条与案例积累。" : "偏重剧本完成与收藏理解。"}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-slate-50 p-5">
              <div className="text-sm text-slate-500">{activeMode === "professional" ? "法条收藏" : "剧本完成"}</div>
              <div className="mt-2 font-serif text-3xl">
                {activeMode === "professional" ? favorites.filter((item) => item.type === "law").length : scriptCount}
              </div>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-5">
              <div className="text-sm text-slate-500">{activeMode === "professional" ? "案例收藏" : "法条收藏"}</div>
              <div className="mt-2 font-serif text-3xl">
                {activeMode === "professional"
                  ? favorites.filter((item) => item.type === "case").length
                  : favorites.filter((item) => item.type === "law").length}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={currentConfig.focusTitle} subtitle="当前模式下的主推荐路径。">
          <div className="mb-4 grid gap-3">
            {currentConfig.path.map((item, index) => (
              <div key={item} className="rounded-[22px] bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {index + 1}. {item}
              </div>
            ))}
          </div>
          <ul className="space-y-3 text-sm leading-6 text-slate-600">
            {currentConfig.focusItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}
