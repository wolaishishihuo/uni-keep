// 时间选择器类型定义
export type TimePickerType = 'time' | 'date' | 'datetime' | 'year-month';

// 时间选择器配置
export interface TimePickerConfig {
  type?: TimePickerType;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  minHour?: number;
  maxHour?: number;
  minMinute?: number;
  maxMinute?: number;
  formatter?: (type: string, value: string) => string;
  filter?: (type: string, values: number[]) => number[];
}

// 时间选择器实例
export interface TimePickerInstance {
  open: (initialValue?: string) => void;
  close: () => void;
}
