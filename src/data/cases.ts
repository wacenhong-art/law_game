import type { CourtCase } from "@/types";

const civilCauses = [
  "合同纠纷",
  "租赁纠纷",
  "侵权责任",
  "婚姻家庭",
  "继承纠纷",
  "物业服务",
  "买卖合同",
  "借款合同",
  "劳动报酬",
  "网络侵权",
];

const criminalCauses = [
  "盗窃罪",
  "诈骗罪",
  "故意伤害罪",
  "危险驾驶罪",
  "帮信罪",
  "职务侵占罪",
  "掩饰隐瞒犯罪所得",
  "寻衅滋事罪",
  "非法经营罪",
  "交通肇事罪",
];

const commercialCauses = [
  "股权转让",
  "公司决议效力",
  "票据追索",
  "不正当竞争",
  "破产债权确认",
  "保险合同",
  "融资租赁",
  "仓储合同",
  "投资合作",
  "商业保理",
];

const buildCases = (
  category: CourtCase["category"],
  causes: string[],
  lawBook: string,
  prefix: string,
): CourtCase[] =>
  causes.map((cause, index) => ({
    id: `${prefix}-${String(index + 1).padStart(2, "0")}`,
    category,
    cause,
    title: `${category}${String(index + 1).padStart(2, "0")}号${cause}案例`,
    summary: `围绕${cause}展开的基础案例，用于本地演示庭审流程，当前以编号与摘要替代真实案件文本。案件核心争点聚焦事实认定、证据采信与法律适用。`,
    result: `裁判结果示例：结合${lawBook}相关规则，对${cause}争点作出基础裁判结论，可用于训练程序推进与论证表达。`,
    relatedLawIds: [`${prefix}-law-${(index % 5) + 1}`, `${prefix}-law-${((index + 1) % 5) + 1}`],
  }));

export const courtCases: CourtCase[] = [
  ...buildCases("民事", civilCauses, "民法典", "civil"),
  ...buildCases("刑事", criminalCauses, "刑法", "criminal"),
  ...buildCases("商事", commercialCauses, "公司法", "commercial"),
];
