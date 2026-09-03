export type UserTag = "法学生" | "普通用户";
export type AppMode = "professional" | "entertainment";
export type CaseCategory = "民事" | "刑事" | "商事";
export type CourtRole = "法官" | "原告律师" | "被告律师" | "公诉人" | "证人";
export type StageKey = "opening" | "investigation" | "debate" | "judgment";
export type FavoriteType = "law" | "case";
export type HistoryType = "court" | "script";

export type UserProfile = {
  id: string;
  account: string;
  password: string;
  nickname: string;
  tag: UserTag;
};

export type RankDefinition = {
  level: number;
  title: string;
  threshold: number;
};

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
};

export type CourtCase = {
  id: string;
  category: CaseCategory;
  cause: string;
  title: string;
  summary: string;
  result: string;
  relatedLawIds: string[];
};

export type LawArticle = {
  id: string;
  lawBook: string;
  title: string;
  content: string;
  interpretation: string;
  keywords: string[];
  relatedCaseIds: string[];
};

export type ScriptScenario = {
  id: string;
  title: string;
  theme: string;
  roles: string[];
  clues: string[];
  steps: string[];
  knowledgeCards: string[];
};

export type CourtDraft = Record<StageKey, string>;

export type CourtReport = {
  id: string;
  caseId: string;
  role: CourtRole;
  scoreLawCitation: number;
  scoreLogic: number;
  scoreProcedure: number;
  totalScore: number;
  summary: string;
  createdAt: string;
};

export type FavoriteItem = {
  id: string;
  type: FavoriteType;
  targetId: string;
  createdAt: string;
};

export type HistoryItem = {
  id: string;
  type: HistoryType;
  targetId: string;
  title: string;
  detail: string;
  createdAt: string;
};

export type ScriptProgress = {
  scriptId: string;
  completed: boolean;
  unlockedCards: string[];
  updatedAt: string;
};
