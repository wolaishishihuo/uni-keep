/**
 * 体重管理相关类型定义
 */

/** 心情类型 */
export type Mood = 'happy' | 'normal' | 'sad'

/** 体重记录 */
export interface WeightRecord {
  /** 记录ID */
  id: string
  /** 用户ID */
  userId: string
  /** 体重(kg) */
  weight: number
  /** 日期 YYYY-MM-DD */
  date: string
  /** 心情 */
  mood: Mood
  /** 备注 */
  note?: string
  /** 对比照片URL */
  photo?: string
  /** 是否生理期 */
  isPeriod?: boolean
  /** 是否生病 */
  isSick?: boolean
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/** 体重趋势数据 */
export interface WeightTrend {
  /** 日期 */
  date: string
  /** 体重 */
  weight: number
  /** 相比前一天的变化 */
  change: number
  /** 相比起始体重的变化 */
  totalChange: number
}

/** 体重统计数据 */
export interface WeightStats {
  /** 用户ID */
  userId: string
  /** 统计日期范围 */
  dateRange: {
    start: string
    end: string
  }
  /** 起始体重 */
  startWeight: number
  /** 当前体重 */
  currentWeight: number
  /** 目标体重 */
  targetWeight: number
  /** 总减重 */
  totalWeightLoss: number
  /** 剩余减重 */
  remainingWeightLoss: number
  /** 进度百分比 */
  progress: number
  /** 当前BMI */
  currentBMI: number
  /** 目标BMI */
  targetBMI: number
  /** 平均周减重 */
  averageWeeklyLoss: number
  /** 预计达成目标日期 */
  estimatedTargetDate?: string
}

/** BMI 分类 */
export interface BMICategory {
  /** 分类名称 */
  category: 'underweight' | 'normal' | 'overweight' | 'obese'
  /** 分类描述 */
  description: string
  /** BMI 范围 */
  range: {
    min: number
    max: number
  }
  /** 建议 */
  advice: string
}
