/**
 * 用户相关类型定义
 */

/** 性别类型 */
export type Gender = 'male' | 'female'

/** 用户档案 */
export interface UserProfile {
  /** 用户ID */
  id: string
  /** 微信 OpenID */
  wxOpenId: string
  /** 昵称 */
  nickname: string
  /** 头像URL */
  avatar: string
  /** 身高(cm) */
  height: number
  /** 目标体重(kg) */
  targetWeight: number
  /** 当前体重(kg) */
  currentWeight: number
  /** 性别 */
  gender: Gender
  /** 情侣ID（可选） */
  coupleId?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/** 用户设置 */
export interface UserSettings {
  /** 用户ID */
  userId: string
  /** 提醒设置 */
  notifications: {
    /** 断食提醒 */
    fasting: boolean
    /** 体重提醒 */
    weight: boolean
    /** 饮水提醒 */
    water: boolean
    /** 情侣提醒 */
    couple: boolean
  }
  /** 提醒时间设置 */
  reminderTimes: {
    /** 断食开始提醒时间 HH:mm */
    fastingStart: string
    /** 断食结束提醒时间 HH:mm */
    fastingEnd: string
    /** 体重记录提醒时间 HH:mm */
    weightRecord: string
  }
  /** 勿扰时间设置 */
  quietHours: {
    /** 是否启用 */
    enabled: boolean
    /** 开始时间 HH:mm */
    startTime: string
    /** 结束时间 HH:mm */
    endTime: string
  }
  /** 单位设置 */
  units: {
    /** 体重单位 */
    weight: 'kg' | 'lb'
    /** 身高单位 */
    height: 'cm' | 'ft'
  }
}
