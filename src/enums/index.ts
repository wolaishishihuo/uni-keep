// 断食计划类型枚举
export enum FastingPlanType {
  TIME_16_8 = 'TIME_16_8', // 16:8时间限制断食
  TIME_18_6 = 'TIME_18_6', // 18:6时间限制断食
  CUSTOM = 'CUSTOM' // 自定义模式
}

// 性别枚举
export enum Gender {
  male = 'male', // 男性
  female = 'female' // 女性
}

// 断食状态枚举
export enum FastingStatus {
  active = 'active', // 进行中
  completed = 'completed', // 已完成
  broken = 'broken', // 已中断
  pending = 'pending' // 未开始
}

// 断食前心情枚举
export enum MoodBefore {
  excited = 'excited', // 兴奋期待
  normal = 'normal', // 平静正常
  worried = 'worried' // 担心焦虑
}

// 断食后心情枚举
export enum MoodAfter {
  great = 'great', // 感觉很棒
  good = 'good', // 感觉良好
  tired = 'tired' // 感觉疲惫
}

// 一般心情枚举
export enum Mood {
  happy = 'happy', // 开心
  normal = 'normal', // 正常
  sad = 'sad' // 难过
}

// 成就类型枚举
export enum AchievementType {
  fasting = 'fasting', // 断食相关成就
  weight = 'weight', // 体重相关成就
  couple = 'couple', // 情侣相关成就
  special = 'special', // 特殊成就
  consistency = 'consistency' // 坚持相关成就
}

// 成就稀有度枚举
export enum AchievementRarity {
  common = 'common', // 普通
  rare = 'rare', // 稀有
  epic = 'epic', // 史诗
  legendary = 'legendary' // 传说
}

// 情侣关系状态枚举
export enum CoupleStatus {
  pending = 'pending', // 待确认
  active = 'active', // 活跃中
  inactive = 'inactive' // 已失效
}

// 鼓励类型枚举
export enum EncouragementType {
  text = 'text', // 文本消息
  emoji = 'emoji', // 表情符号
  achievement = 'achievement' // 成就分享
}

// 通知类型枚举
export enum NotificationType {
  fasting_reminder = 'fasting_reminder', // 断食提醒
  achievement_unlock = 'achievement_unlock', // 成就解锁
  couple_encourage = 'couple_encourage', // 情侣鼓励
  system = 'system', // 系统通知
  weight_reminder = 'weight_reminder' // 体重提醒
}

// 通知状态枚举
export enum NotificationStatus {
  pending = 'pending', // 待发送
  sent = 'sent', // 已发送
  failed = 'failed' // 发送失败
}

// 餐次类型枚举
export enum MealType {
  breakfast = 'breakfast', // 早餐
  lunch = 'lunch', // 午餐
  dinner = 'dinner', // 晚餐
  snack = 'snack' // 零食
}

// 用餐心情枚举
export enum MealMood {
  satisfied = 'satisfied', // 满足
  normal = 'normal', // 正常
  guilty = 'guilty' // 愧疚
}
