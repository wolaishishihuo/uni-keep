<script setup lang="ts">
import type { TimePickerType } from './types';
import dayjs from 'dayjs';

// Props 接口
interface Props {
  modelValue?: string;
  show?: boolean;
  type?: TimePickerType;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  minHour?: number;
  maxHour?: number;
  minMinute?: number;
  maxMinute?: number;
  minDate?: number;
  maxDate?: number;
  formatter?: (type: string, value: string) => string;
  filter?: (type: string, values: number[]) => number[];
}

// Emits 接口
interface Emits {
  'update:modelValue': [value: string];
  'update:show': [show: boolean];
  'confirm': [value: string];
  'cancel': [];
  'change': [value: string];
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  show: false,
  type: 'time',
  title: '请选择',
  confirmText: '确定',
  cancelText: '取消',
  minHour: 0,
  maxHour: 23,
  minMinute: 0,
  maxMinute: 59,
  minDate: new Date(new Date().getFullYear() - 100, 0, 1).getTime(),
  maxDate: new Date(new Date().getFullYear() + 10, 11, 31).getTime()
});

const emit = defineEmits<Emits>();

const isTimestamp = computed(() => props.type === 'date' || props.type === 'datetime' || props.type === 'year-month');

const innerValue = ref<string | number>(
  props.modelValue
    ? (isTimestamp.value ? dayjs(props.modelValue).valueOf() : props.modelValue)
    : (isTimestamp.value ? dayjs().valueOf() : '08:00')
);

const stringValue = computed(() =>
  isTimestamp.value ? dayjs(innerValue.value).format('YYYY-MM-DD') : String(innerValue.value)
);

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    innerValue.value = isTimestamp.value ? dayjs(newValue).valueOf() : newValue;
  }
});

// 重置值
function reset() {
  if (props.modelValue) {
    innerValue.value = isTimestamp.value ? dayjs(props.modelValue).valueOf() : props.modelValue;
  }
  else {
    innerValue.value = isTimestamp.value ? dayjs().valueOf() : '08:00';
  }
}

// 弹窗显示状态
const visible = computed({
  get: () => props.show,
  set: value => emit('update:show', value)
});

// 监听内部值变化，触发 change 事件
watch(() => innerValue.value, () => {
  emit('change', stringValue.value);
});

// 确认选择
function onConfirm() {
  emit('update:modelValue', stringValue.value);
  emit('confirm', stringValue.value);
  visible.value = false;
}

// 取消选择
function onCancel() {
  reset();
  emit('cancel');
  visible.value = false;
}

// 打开选择器
function open(initialValue?: string) {
  if (initialValue !== undefined) {
    innerValue.value = isTimestamp.value ? dayjs(initialValue).valueOf() : initialValue;
  }
  visible.value = true;
}

// 关闭选择器
function close() {
  visible.value = false;
}

// 暴露方法给父组件
defineExpose({
  open,
  close
});
</script>

<template>
  <wd-popup
    v-model="visible"
    position="bottom"
    :safe-area-inset-bottom="true"
    @close="onCancel"
  >
    <view class="time-picker-container">
      <view class="time-picker-header">
        <text class="time-picker-cancel" @click="onCancel">
          {{ cancelText }}
        </text>
        <text class="time-picker-title">
          {{ title }}
        </text>
        <text class="time-picker-confirm" @click="onConfirm">
          {{ confirmText }}
        </text>
      </view>

      <wd-datetime-picker-view
        v-model="innerValue"
        :type="type"
        :min-hour="minHour"
        :max-hour="maxHour"
        :min-minute="minMinute"
        :max-minute="maxMinute"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        :filter="filter"
      />
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.time-picker-container {
  background: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
}

.time-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 40rpx;
  background: #f8f9fa;
  border-bottom: 2rpx solid #e9ecef;
}

.time-picker-cancel,
.time-picker-confirm {
  font-size: 32rpx;
  color: #667eea;
  cursor: pointer;
  transition: opacity 0.2s ease;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;

  &:active {
    opacity: 0.7;
    background: rgba(102, 126, 234, 0.1);
  }
}

.time-picker-cancel {
  color: #6c757d;

  &:active {
    background: rgba(108, 117, 125, 0.1);
  }
}

.time-picker-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  flex: 1;
  text-align: center;
}

// 深色主题适配
.theme-dark {
  .time-picker-container {
    background: #2d3748;
  }

  .time-picker-header {
    background: #1a202c;
    border-bottom-color: #4a5568;
  }

  .time-picker-title {
    color: #e2e8f0;
  }

  .time-picker-cancel {
    color: #a0aec0;
  }

  .time-picker-confirm {
    color: #81e6d9;
  }
}
</style>
