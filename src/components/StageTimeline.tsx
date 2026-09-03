import type { StageKey } from "@/types";
import { stageGuides, stageLabels } from "@/utils/game";

type StageTimelineProps = {
  activeStage: StageKey;
  onSelect: (stage: StageKey) => void;
};

const stageOrder: StageKey[] = ["opening", "investigation", "debate", "judgment"];

export default function StageTimeline({ activeStage, onSelect }: StageTimelineProps) {
  return (
    <div className="space-y-3">
      {stageOrder.map((stage, index) => {
        const active = stage === activeStage;
        return (
          <button
            key={stage}
            type="button"
            onClick={() => onSelect(stage)}
            className={`flex w-full items-start gap-4 rounded-3xl border p-4 text-left transition ${
              active
                ? "border-slate-900 bg-slate-900 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${
                active ? "bg-amber-300 text-slate-900" : "bg-slate-100 text-slate-500"
              }`}
            >
              {index + 1}
            </div>
            <div>
              <div className="font-medium">{stageLabels[stage]}</div>
              <p className={`mt-1 text-sm leading-6 ${active ? "text-slate-200" : "text-slate-500"}`}>{stageGuides[stage]}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
