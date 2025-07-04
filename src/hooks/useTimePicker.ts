import type { Reactive } from 'vue';
import { formatTimeToHHMM } from '@/utils/time';

export interface TimePickerResult {
  field: string;
  value: string;
}

export function useTimePicker(formData: Reactive<any>, defaultTime = '08:00') {
  const showTimePicker = ref(false);
  const timePickerValue = ref(defaultTime);
  const currentField = ref('');

  // 格式化时间显示
  const formatTimeDisplay = (time: string): string => {
    if (!time)
      return defaultTime;
    return formatTimeToHHMM(time) || time;
  };

  // 打开时间选择器
  const openTimePicker = (field: string, currentValue?: string): void => {
    currentField.value = field;
    timePickerValue.value = currentValue || defaultTime;
    showTimePicker.value = true;
  };

  // 时间确认
  const onTimeConfirm = (value) => {
    formData[currentField.value] = value;
    showTimePicker.value = false;
  };

  // 时间取消
  const onTimeCancel = (): void => {
    showTimePicker.value = false;
  };

  // 重置状态
  const reset = (): void => {
    showTimePicker.value = false;
    timePickerValue.value = defaultTime;
    currentField.value = '';
  };

  return {
    // 状态
    showTimePicker,
    timePickerValue,
    currentField,

    // 方法
    formatTimeDisplay,
    openTimePicker,
    onTimeConfirm,
    onTimeCancel,
    reset
  };
}
