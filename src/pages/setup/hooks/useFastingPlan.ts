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
  difficulty: number;
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
      suitable: '适合初学者和想要尝试断食的人群',
      difficulty: 2
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
      suitable: '适合有一定断食经验的人',
      difficulty: 3
    }
  ]);

  return {
    fastingPlans
  };
}
