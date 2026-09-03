import type { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  badge?: string;
};

export default function FeatureCard({ icon, title, description, onClick, badge }: FeatureCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full min-h-40 flex-col rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 text-left shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_22px_56px_rgba(148,103,33,0.18)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-amber-200">{icon}</div>
        {badge ? (
          <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs text-amber-700">{badge}</span>
        ) : null}
      </div>
      <h3 className="font-serif text-base text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-auto pt-4 text-xs tracking-[0.28em] text-slate-400 transition group-hover:text-slate-600">ENTER</span>
    </button>
  );
}
