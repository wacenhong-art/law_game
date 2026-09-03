import { achievements } from "@/data/achievements";
import { ranks } from "@/data/ranks";
import type {
  CourtDraft,
  CourtReport,
  FavoriteItem,
  HistoryItem,
  RankDefinition,
  ScriptProgress,
  StageKey,
} from "@/types";

const stageOrder: StageKey[] = ["opening", "investigation", "debate", "judgment"];

export const stageLabels: Record<StageKey, string> = {
  opening: "开庭",
  investigation: "调查",
  debate: "辩论",
  judgment: "宣判",
};

export const stageGuides: Record<StageKey, string> = {
  opening: "说明案号、核验角色身份、概括争议焦点。",
  investigation: "整理关键事实、证据来源与证明目的。",
  debate: "围绕适用法条、因果链条与责任分配展开辩论。",
  judgment: "输出裁判结论或处理建议，确保程序闭环。",
};

export const createEmptyDraft = (): CourtDraft => ({
  opening: "",
  investigation: "",
  debate: "",
  judgment: "",
});

export const buildCourtReport = (caseId: string, role: CourtReport["role"], draft: CourtDraft): CourtReport => {
  const fullText = stageOrder.map((key) => draft[key]).join(" ");
  const lawHits = (fullText.match(/法|条|典|罪|责任|合同/g) ?? []).length;
  const logicLength = Math.min(100, Math.round(fullText.length / 5));
  const procedureCount = stageOrder.filter((key) => draft[key].trim().length > 8).length;

  const scoreLawCitation = Math.min(100, 55 + lawHits * 6);
  const scoreLogic = Math.max(45, logicLength);
  const scoreProcedure = Math.min(100, 40 + procedureCount * 15);
  const totalScore = Math.round((scoreLawCitation + scoreLogic + scoreProcedure) / 3);

  return {
    id: `report-${Date.now()}`,
    caseId,
    role,
    scoreLawCitation,
    scoreLogic,
    scoreProcedure,
    totalScore,
    summary: `本次庭审在法条引用、论证结构和程序完整度上形成基础闭环，建议继续强化事实提炼与条文对应能力。`,
    createdAt: new Date().toISOString(),
  };
};

export const computeExperience = (
  reports: CourtReport[],
  histories: HistoryItem[],
  favorites: FavoriteItem[],
  progress: ScriptProgress[],
) => {
  const courtExp = reports.reduce((sum, item) => sum + item.totalScore, 0);
  const scriptExp = progress.filter((item) => item.completed).length * 80;
  const favoriteExp = Math.min(120, favorites.length * 10);
  const activityExp = histories.length * 15;
  return courtExp + scriptExp + favoriteExp + activityExp;
};

export const resolveRank = (exp: number): RankDefinition => {
  return [...ranks].reverse().find((item) => exp >= item.threshold) ?? ranks[0];
};

export const resolveAchievementIds = (
  reports: CourtReport[],
  histories: HistoryItem[],
  favorites: FavoriteItem[],
  progress: ScriptProgress[],
  rankTitle: string,
) => {
  const courtCount = reports.length;
  const scriptCount = progress.filter((item) => item.completed).length;
  const favoriteCount = favorites.length;
  const searchFavoriteCount = favorites.filter((item) => item.type === "law").length;
  const hasCourt = histories.some((item) => item.type === "court");
  const hasScript = histories.some((item) => item.type === "script");

  return achievements
    .filter((item) => {
      switch (item.id) {
        case "first-login":
          return true;
        case "first-court":
          return courtCount >= 1;
        case "three-courts":
          return courtCount >= 3;
        case "ten-courts":
          return courtCount >= 10;
        case "first-script":
          return scriptCount >= 1;
        case "three-scripts":
          return scriptCount >= 3;
        case "fav-collector":
          return favoriteCount >= 5;
        case "logic-master":
          return reports.some((report) => report.totalScore >= 90);
        case "law-hunter":
          return searchFavoriteCount >= 5;
        case "all-rounder":
          return hasCourt && hasScript && searchFavoriteCount >= 1;
        case "ace-lawyer":
          return rankTitle === "王牌大律师";
        default:
          return false;
      }
    })
    .map((item) => item.id);
};
