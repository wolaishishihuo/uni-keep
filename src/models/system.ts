/**
 * 系统配置键枚举
 */
export enum SystemConfigKey {
  // 应用基础配置
  APP_VERSION = 'app_version', // 应用版本
  APP_NAME = 'app_name', // 应用名称

  // 断食相关配置
  DEFAULT_FASTING_HOURS = 'default_fasting_hours', // 默认断食时间
  DEFAULT_EATING_HOURS = 'default_eating_hours', // 默认进食时间
  MAX_FASTING_HOURS = 'max_fasting_hours', // 最大断食时间
  MIN_FASTING_HOURS = 'min_fasting_hours', // 最小断食时间

  // 体重记录配置
  MAX_DAILY_WEIGHT_RECORDS = 'max_daily_weight_records', // 最大每日体重记录数
  WEIGHT_UNIT = 'weight_unit', // 体重单位
  HEIGHT_UNIT = 'height_unit', // 身高单位

  // 通知配置
  ENABLE_PUSH_NOTIFICATIONS = 'enable_push_notifications', // 是否启用推送通知
  DEFAULT_FASTING_REMINDER = 'default_fasting_reminder', // 默认断食提醒
  DEFAULT_WEIGHT_REMINDER_TIME = 'default_weight_reminder_time', // 默认体重提醒时间

  // 成就系统配置
  ENABLE_ACHIEVEMENTS = 'enable_achievements', // 是否启用成就系统
  ACHIEVEMENT_NOTIFICATION = 'achievement_notification', // 成就通知

  // 情侣功能配置
  ENABLE_COUPLE_FEATURE = 'enable_couple_feature', // 是否启用情侣功能
  MAX_ENCOURAGEMENT_LENGTH = 'max_encouragement_length', // 最大鼓励长度

  // 数据限制配置
  MAX_PHOTO_SIZE_MB = 'max_photo_size_mb', // 最大照片大小
  MAX_NOTE_LENGTH = 'max_note_length' // 最大笔记长度
}
