import { ref } from 'vue';

/**
 * 断食计划类型接口
 */
export interface FastingPlan {
  id: string;
  name: string;
  icon: string;
  pattern: string;
  fastingHours: number;
  eatingHours: number;
  description: string;
  benefits: string[];
  suitable: string;
}

/**
 * 断食计划数据Hook
 * 提供断食计划相关数据
 */
export function useFastingPlan() {
  // 所有断食计划数据
  const fastingPlans = ref<FastingPlan[]>([
    {
      id: 'plan16_8',
      name: '16:8 间歇性断食',
      icon: '⏱️',
      pattern: '16小时断食 / 8小时进食',
      fastingHours: 16,
      eatingHours: 8,
      description: '最受欢迎的断食方案，在16小时内不进食，将一天的饮食安排在连续的8小时内完成。',
      benefits: [
        '有助于减轻体重',
        '改善胰岛素敏感性',
        '增强细胞自噬'
      ],
      suitable: '适合初学者和想要尝试断食的人群'
    },
    {
      id: 'plan18_6',
      name: '18:6 断食法',
      icon: '🕙',
      pattern: '18小时断食 / 6小时进食',
      fastingHours: 18,
      eatingHours: 6,
      description: '进阶断食方案，将每日进食时间缩短到6小时，延长断食时间至18小时，能够产生更强的代谢效应。',
      benefits: [
        '更高效的脂肪燃烧',
        '提升生长激素分泌',
        '改善血脂指标'
      ],
      suitable: '适合有一定断食经验的人'
    },
    {
      id: 'plan20_4',
      name: '勇士饮食',
      icon: '🛡️',
      pattern: '20小时断食 / 4小时进食',
      fastingHours: 20,
      eatingHours: 4,
      description: '高强度断食方案，每天只在4小时内进食，其余20小时保持断食状态。',
      benefits: [
        '显著提高脂肪氧化率',
        '快速进入酮症状态',
        '强化自律能力'
      ],
      suitable: '适合断食经验丰富者'
    },
    {
      id: 'plan5_2',
      name: '5:2 断食法',
      icon: '📅',
      pattern: '每周5天正常饮食/2天限制热量',
      fastingHours: 0,
      eatingHours: 0,
      description: '一周中5天正常饮食，另外2天(非连续)限制热量摄入(女性500大卡/男性600大卡)。',
      benefits: [
        '降低胰岛素和IGF-1水平',
        '减轻体重',
        '改善心血管健康'
      ],
      suitable: '维持社交生活更轻松，适合难以坚持每日断食的人'
    }
  ]);

  return {
    fastingPlans
  };
}
