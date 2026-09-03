import type { ReactNode } from "react";
import { BookOpen, Gavel, LayoutDashboard, LogOut, ScrollText, UserCircle2 } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppStore, useCurrentUser, useUserMeta } from "@/store/appStore";

type AppShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const links = [
  { to: "/home", label: "首页", icon: LayoutDashboard },
  { to: "/court", label: "案例模拟", icon: Gavel },
  { to: "/search", label: "法条检索", icon: ScrollText },
  { to: "/scripts", label: "普法剧本", icon: BookOpen },
  { to: "/profile", label: "个人中心", icon: UserCircle2 },
];

export default function AppShell({ title, subtitle, children }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { rank } = useUserMeta();
  const logout = useAppStore((state) => state.logout);
  const activeMode = useAppStore((state) => state.activeMode);
  const sortedLinks =
    activeMode === "professional"
      ? links
      : [links[0], links[3], links[2], links[4], links[1]];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f7f2e7_0%,#f4f6f8_32%,#e8edf3_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <header className="mb-6 rounded-[32px] border border-white/70 bg-slate-950 px-6 py-5 text-white shadow-[0_24px_80px_rgba(15,23,42,0.32)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-amber-200/70">Local Legal Arena</p>
              <h1 className="mt-2 font-serif text-2xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{subtitle}</p>
              <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs">
                <span className="text-slate-300">当前模式</span>
                <span className="rounded-full bg-amber-200 px-3 py-1 text-slate-950">
                  {activeMode === "professional" ? "专业端" : "娱乐端"}
                </span>
                <button
                  type="button"
                  onClick={() => navigate("/home")}
                  className="text-amber-200 transition hover:text-amber-100"
                >
                  返回首页切换
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm lg:items-end">
              <div>{user ? `${user.nickname} · ${user.tag}` : "未登录"}</div>
              <div className="text-amber-200">{rank.title}</div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-slate-200 transition hover:border-amber-200 hover:text-amber-100"
              >
                <LogOut size={14} />
                退出登录
              </button>
            </div>
          </div>
        </header>

        <nav className="mb-6 grid gap-3 rounded-[28px] border border-slate-200/70 bg-white/80 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:grid-cols-5">
          {sortedLinks.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm transition ${
                  active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
}
