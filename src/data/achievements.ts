import type { AchievementDefinition } from "@/types";

export const achievements: AchievementDefinition[] = [
  { id: "first-login", title: "初入法域", description: "完成首次本地登录" },
  { id: "first-court", title: "首次开庭", description: "完成 1 次模拟法庭" },
  { id: "three-courts", title: "连开三庭", description: "完成 3 次模拟法庭" },
  { id: "ten-courts", title: "庭审老将", description: "完成 10 次模拟法庭" },
  { id: "first-script", title: "剧情入门", description: "完成 1 次普法剧本" },
  { id: "three-scripts", title: "普法达人", description: "完成 3 次普法剧本" },
  { id: "fav-collector", title: "法条收藏家", description: "收藏达到 5 项" },
  { id: "logic-master", title: "逻辑锋芒", description: "任一庭审总分达到 90 分" },
  { id: "law-hunter", title: "条文猎手", description: "完成 5 次法条检索收藏" },
  { id: "all-rounder", title: "全能实践者", description: "完成庭审、检索、剧本三类核心行为" },
  { id: "ace-lawyer", title: "王牌候选", description: "角色段位达到王牌大律师" },
];
