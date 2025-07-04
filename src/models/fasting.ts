/**
 * 断食相关类型定义
 */

/** 断食状态 */
export type FastingStatus = 'active' | 'completed' | 'broken' | 'pending';

/** 断食阶段 */
export type FastingPhase = 'fasting' | 'eating';

/** 断食计划 */
export interface FastingPlan {
  /** 计划ID */
  id: string;
  /** 用户ID */
  userId: string;
  /** 计划名称 */
  name: string;
  /** 禁食小时数 */
  fastingHours: number;
  /** 进食小时数 */
  eatingHours: number;
  /** 进食开始时间 HH:mm */
  startTime: string;
  /** 进食结束时间 HH:mm */
  endTime: string;
  /** 是否当前活跃计划 */
  isActive: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/** 断食记录 */
export interface FastingRecord {
  /** 记录ID */
  id: string;
  /** 用户ID */
  userId: string;
  /** 计划ID */
  planId: string;
  /** 日期 YYYY-MM-DD */
  date: string;
  /** 开始时间 ISO 字符串 */
  startTime: string;
  /** 结束时间 ISO 字符串（可选） */
  endTime?: string;
  /** 实际断食小时数 */
  actualHours: number;
  /** 计划断食小时数 */
  plannedHours: number;
  /** 断食状态 */
  status: FastingStatus;
  /** 中断原因（可选） */
  breakReason?: string;
  /** 备注 */
  note?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/** 当前断食状态 */
export interface CurrentFastingState {
  /** 是否正在断食 */
  isFasting: boolean;
  /** 当前阶段 */
  phase: FastingPhase;
  /** 当前记录ID */
  currentRecordId?: string;
  /** 阶段开始时间 */
  phaseStartTime?: string;
  /** 下个阶段开始时间 */
  nextPhaseTime?: string;
  /** 剩余时间（秒） */
  remainingSeconds: number;
  /** 进度百分比 0-100 */
  progress: number;
}

/** 断食统计数据 */
export interface FastingStats {
  /** 用户ID */
  userId: string;
  /** 统计日期范围 */
  dateRange: {
    start: string;
    end: string;
  };
  /** 总断食次数 */
  totalFasts: number;
  /** 成功完成次数 */
  completedFasts: number;
  /** 成功率 */
  successRate: number;
  /** 连续成功天数 */
  currentStreak: number;
  /** 最长连续天数 */
  longestStreak: number;
  /** 平均断食时长（小时） */
  averageFastingHours: number;
  /** 总断食时长（小时） */
  totalFastingHours: number;
}
