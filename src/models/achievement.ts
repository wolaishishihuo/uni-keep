/**
 * 成就系统相关类型定义
 */

/** 成就类型 */
export type AchievementType = 'fasting' | 'weight' | 'couple' | 'special'

/** 成就状态 */
export type AchievementStatus = 'locked' | 'unlocked' | 'completed'

/** 成就定义 */
export interface AchievementDefinition {
  /** 成就代码 */
  code: string
  /** 成就类型 */
  type: AchievementType
  /** 成就标题 */
  title: string
  /** 成就描述 */
  description: string
  /** 成就图标 */
  icon: string
  /** 解锁条件 */
  conditions: {
    /** 条件类型 */
    type: 'streak' | 'count' | 'weight_loss' | 'couple_days'
    /** 目标值 */
    target: number
    /** 条件描述 */
    description: string
  }
  /** 奖励积分 */
  points: number
  /** 是否隐藏成就 */
  isHidden: boolean
  /** 排序权重 */
  order: number
}

/** 用户成就记录 */
export interface UserAchievement {
  /** 记录ID */
  id: string
  /** 用户ID */
  userId: string
  /** 成就代码 */
  achievementCode: string
  /** 当前状态 */
  status: AchievementStatus
  /** 当前进度 */
  progress: number
  /** 目标值 */
  target: number
  /** 解锁时间（如果已解锁） */
  unlockedAt?: string
  /** 完成时间（如果已完成） */
  completedAt?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}
