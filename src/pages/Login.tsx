import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import type { UserTag } from "@/types";

export default function Login() {
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);
  const [form, setForm] = useState({
    account: "",
    password: "",
    nickname: "",
    tag: "法学生" as UserTag,
  });
  const [message, setMessage] = useState("首次使用同一账号会自动创建本地账户。");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#20324f_0%,#111827_45%,#0f172a_100%)] px-6 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[36px] border border-white/10 bg-white/6 p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.4)] backdrop-blur">
          <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-tight">法律互动演示台</h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["30+", "基础案例库"],
              ["15", "核心法条条目"],
              ["8", "生活场景剧本"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="font-serif text-3xl text-amber-100">{value}</div>
                <div className="mt-1 text-sm text-slate-300">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] bg-[#f7f5ef] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.26)]">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Local Access</p>
          <h2 className="mt-3 font-serif text-2xl text-slate-900">本地账号登录</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">输入账号、密码、昵称与标签；同账号首次登录即本地注册。</p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const result = login(form);
              setMessage(result.message);
              if (result.ok) navigate("/home");
            }}
          >
            <label className="block">
              <span className="mb-2 block text-sm text-slate-600">账号</span>
              <input
                value={form.account}
                onChange={(event) => setForm((current) => ({ ...current, account: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                placeholder="demo_user"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-600">密码</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                placeholder="local-password"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-600">昵称</span>
              <input
                value={form.nickname}
                onChange={(event) => setForm((current) => ({ ...current, nickname: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                placeholder="庭审体验官"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-600">标签</span>
              <div className="grid grid-cols-2 gap-3">
                {(["法学生", "普通用户"] as UserTag[]).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, tag }))}
                    className={`rounded-2xl border px-4 py-3 text-sm transition ${
                      form.tag === tag ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white transition hover:bg-slate-800"
            >
              进入本地法律演示台
            </button>
          </form>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{message}</div>
        </section>
      </div>
    </div>
  );
}
