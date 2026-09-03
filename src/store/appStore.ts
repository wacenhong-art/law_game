import { create } from "zustand";
import { courtCases } from "@/data/cases";
import { lawArticles } from "@/data/laws";
import { scriptScenarios } from "@/data/scripts";
import type {
  AppMode,
  CourtReport,
  FavoriteItem,
  HistoryItem,
  ScriptProgress,
  UserProfile,
  UserTag,
} from "@/types";
import { buildCourtReport, computeExperience, resolveAchievementIds, resolveRank } from "@/utils/game";
import { storage, storageKeys } from "@/utils/storage";

type SessionState = {
  account: string | null;
};

type AppState = {
  users: UserProfile[];
  session: SessionState;
  favorites: FavoriteItem[];
  histories: HistoryItem[];
  reports: CourtReport[];
  scriptProgress: ScriptProgress[];
  activeMode: AppMode;
  cases: typeof courtCases;
  laws: typeof lawArticles;
  scripts: typeof scriptScenarios;
  login: (payload: {
    account: string;
    password: string;
    nickname: string;
    tag: UserTag;
  }) => { ok: boolean; message: string };
  logout: () => void;
  setMode: (mode: AppMode) => void;
  updateProfile: (payload: { nickname: string; tag: UserTag; password: string }) => void;
  toggleFavorite: (type: FavoriteItem["type"], targetId: string) => void;
  saveCourtReport: (caseId: string, role: CourtReport["role"], draft: Parameters<typeof buildCourtReport>[2]) => CourtReport;
  completeScript: (scriptId: string, title: string) => void;
  clearLocalData: () => void;
};

const readInitialUsers = () => storage.readJson<UserProfile[]>(storageKeys.users, []);
const readSession = () => storage.readJson<SessionState>(storageKeys.session, { account: null });
const readReports = () => storage.readJson<CourtReport[]>(storageKeys.reports, []);
const readHistories = () => storage.readJson<HistoryItem[]>(storageKeys.history, []);
const readFavorites = () => storage.readJson<FavoriteItem[]>(storageKeys.favorites, []);
const readScriptProgress = () => storage.readJson<ScriptProgress[]>(storageKeys.scriptProgress, []);

const persist = (state: Pick<AppState, "users" | "session" | "reports" | "histories" | "favorites" | "scriptProgress">) => {
  storage.writeJson(storageKeys.users, state.users);
  storage.writeJson(storageKeys.session, state.session);
  storage.writeJson(storageKeys.reports, state.reports);
  storage.writeJson(storageKeys.history, state.histories);
  storage.writeJson(storageKeys.favorites, state.favorites);
  storage.writeJson(storageKeys.scriptProgress, state.scriptProgress);
};

export const useAppStore = create<AppState>((set, get) => ({
  users: readInitialUsers(),
  session: readSession(),
  favorites: readFavorites(),
  histories: readHistories(),
  reports: readReports(),
  scriptProgress: readScriptProgress(),
  activeMode: "professional",
  cases: courtCases,
  laws: lawArticles,
  scripts: scriptScenarios,
  login: ({ account, password, nickname, tag }) => {
    const trimmedAccount = account.trim();
    const trimmedPassword = password.trim();
    const trimmedNickname = nickname.trim();

    if (!trimmedAccount || !trimmedPassword || !trimmedNickname) {
      return { ok: false, message: "请完整填写账号、密码和昵称。" };
    }

    const state = get();
    const existing = state.users.find((item) => item.account === trimmedAccount);
    let nextUsers = state.users;

    if (existing && existing.password !== trimmedPassword) {
      return { ok: false, message: "本地账号密码不匹配。" };
    }

    if (!existing) {
      nextUsers = [
        ...state.users,
        {
          id: `user-${Date.now()}`,
          account: trimmedAccount,
          password: trimmedPassword,
          nickname: trimmedNickname,
          tag,
        },
      ];
    }

    const session = { account: trimmedAccount };
    set({ users: nextUsers, session });
    persist({
      users: nextUsers,
      session,
      reports: state.reports,
      histories: state.histories,
      favorites: state.favorites,
      scriptProgress: state.scriptProgress,
    });
    return { ok: true, message: existing ? "登录成功。" : "本地账号已创建并登录。" };
  },
  logout: () => {
    const state = get();
    const session = { account: null };
    set({ session });
    persist({
      users: state.users,
      session,
      reports: state.reports,
      histories: state.histories,
      favorites: state.favorites,
      scriptProgress: state.scriptProgress,
    });
  },
  setMode: (mode) => set({ activeMode: mode }),
  updateProfile: ({ nickname, tag, password }) => {
    const state = get();
    const currentAccount = state.session.account;
    if (!currentAccount) return;

    const users = state.users.map((item) =>
      item.account === currentAccount
        ? {
            ...item,
            nickname: nickname.trim() || item.nickname,
            tag,
            password: password.trim() || item.password,
          }
        : item,
    );

    set({ users });
    persist({
      users,
      session: state.session,
      reports: state.reports,
      histories: state.histories,
      favorites: state.favorites,
      scriptProgress: state.scriptProgress,
    });
  },
  toggleFavorite: (type, targetId) => {
    const state = get();
    const exists = state.favorites.find((item) => item.type === type && item.targetId === targetId);
    const favorites = exists
      ? state.favorites.filter((item) => item.id !== exists.id)
      : [
          {
            id: `fav-${Date.now()}`,
            type,
            targetId,
            createdAt: new Date().toISOString(),
          },
          ...state.favorites,
        ];

    set({ favorites });
    persist({
      users: state.users,
      session: state.session,
      reports: state.reports,
      histories: state.histories,
      favorites,
      scriptProgress: state.scriptProgress,
    });
  },
  saveCourtReport: (caseId, role, draft) => {
    const state = get();
    const report = buildCourtReport(caseId, role, draft);
    const relatedCase = state.cases.find((item) => item.id === caseId);
    const reports = [report, ...state.reports];
    const histories = [
      {
        id: `history-${Date.now()}`,
        type: "court" as const,
        targetId: caseId,
        title: relatedCase?.title ?? caseId,
        detail: `${role}完成模拟法庭，综合得分 ${report.totalScore} 分`,
        createdAt: report.createdAt,
      },
      ...state.histories,
    ];

    set({ reports, histories });
    persist({
      users: state.users,
      session: state.session,
      reports,
      histories,
      favorites: state.favorites,
      scriptProgress: state.scriptProgress,
    });
    return report;
  },
  completeScript: (scriptId, title) => {
    const state = get();
    const existing = state.scriptProgress.find((item) => item.scriptId === scriptId);
    const script = state.scripts.find((item) => item.id === scriptId);
    const nextProgressItem: ScriptProgress = {
      scriptId,
      completed: true,
      unlockedCards: script?.knowledgeCards ?? [],
      updatedAt: new Date().toISOString(),
    };
    const scriptProgress = existing
      ? state.scriptProgress.map((item) => (item.scriptId === scriptId ? nextProgressItem : item))
      : [nextProgressItem, ...state.scriptProgress];
    const histories = [
      {
        id: `history-${Date.now()}`,
        type: "script" as const,
        targetId: scriptId,
        title,
        detail: `已完成剧本体验，解锁 ${nextProgressItem.unlockedCards.length} 张知识卡片`,
        createdAt: nextProgressItem.updatedAt,
      },
      ...state.histories,
    ];

    set({ scriptProgress, histories });
    persist({
      users: state.users,
      session: state.session,
      reports: state.reports,
      histories,
      favorites: state.favorites,
      scriptProgress,
    });
  },
  clearLocalData: () => {
    storage.clearAll();
    set({
      users: [],
      session: { account: null },
      favorites: [],
      histories: [],
      reports: [],
      scriptProgress: [],
      activeMode: "professional",
      cases: courtCases,
      laws: lawArticles,
      scripts: scriptScenarios,
    });
  },
}));

export const useCurrentUser = () => {
  const users = useAppStore((state) => state.users);
  const session = useAppStore((state) => state.session);
  return users.find((item) => item.account === session.account) ?? null;
};

export const useUserMeta = () => {
  const reports = useAppStore((state) => state.reports);
  const histories = useAppStore((state) => state.histories);
  const favorites = useAppStore((state) => state.favorites);
  const scriptProgress = useAppStore((state) => state.scriptProgress);
  const exp = computeExperience(reports, histories, favorites, scriptProgress);
  const rank = resolveRank(exp);
  const unlockedAchievementIds = resolveAchievementIds(reports, histories, favorites, scriptProgress, rank.title);

  return {
    exp,
    rank,
    unlockedAchievementIds,
  };
};
