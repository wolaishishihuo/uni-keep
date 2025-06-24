/**
 * 情侣互动相关类型定义
 */

/** 情侣关系状态 */
export type CoupleStatus = 'pending' | 'active' | 'paused' | 'ended'

/** 互动类型 */
export type InteractionType = 'encourage' | 'reminder' | 'celebration' | 'challenge'

/** 情侣信息 */
export interface CoupleInfo {
  /** 情侣关系ID */
  id: string
  /** 用户1 ID */
  user1Id: string
  /** 用户2 ID */
  user2Id: string
  /** 关系状态 */
  status: CoupleStatus
  /** 情侣昵称 */
  coupleName?: string
  /** 开始日期 */
  startDate: string
  /** 邀请码 */
  inviteCode: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/** 情侣互动记录 */
export interface CoupleInteraction {
  /** 互动ID */
  id: string
  /** 情侣关系ID */
  coupleId: string
  /** 发起用户ID */
  fromUserId: string
  /** 接收用户ID */
  toUserId: string
  /** 互动类型 */
  type: InteractionType
  /** 互动内容 */
  content: string
  /** 是否已读 */
  isRead: boolean
  /** 互动时间 */
  interactionTime: string
  /** 创建时间 */
  createdAt: string
}

/** 情侣数据对比 */
export interface CoupleComparison {
  /** 情侣关系ID */
  coupleId: string
  /** 比较日期 */
  compareDate: string
  /** 用户1数据 */
  user1Data: {
    userId: string
    nickname: string
    avatar: string
    /** 断食数据 */
    fasting: {
      currentStreak: number
      totalFasts: number
      successRate: number
      isCurrentlyFasting: boolean
    }
    /** 体重数据 */
    weight: {
      currentWeight: number
      weightLoss: number
      progress: number
      bmi: number
    }
  }
  /** 用户2数据 */
  user2Data: {
    userId: string
    nickname: string
    avatar: string
    /** 断食数据 */
    fasting: {
      currentStreak: number
      totalFasts: number
      successRate: number
      isCurrentlyFasting: boolean
    }
    /** 体重数据 */
    weight: {
      currentWeight: number
      weightLoss: number
      progress: number
      bmi: number
    }
  }
}
