<script setup lang="ts">
import type { Message, MessageType } from '@/hooks/useMessage';

interface Props {
  messages: Message[];
}

interface Emits {
  close: [id: string];
}

defineProps<Props>();
defineEmits<Emits>();

// 获取消息图标
function getMessageIcon(type: MessageType): string {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  return icons[type] || icons.info;
}
</script>

<template>
  <view class="message-container">
    <transition-group name="message" tag="view" class="message-list">
      <view
        v-for="message in messages"
        :key="message.id"
        class="message-item"
        :class="[`message-${message.type}`, { 'message-show': message.show }]"
        @click="$emit('close', message.id)"
      >
        <view class="message-icon">
          {{ getMessageIcon(message.type) }}
        </view>
        <text class="message-content">
          {{ message.content }}
        </text>
        <view class="message-close" @click.stop="$emit('close', message.id)">
          ✕
        </view>
      </view>
    </transition-group>
  </view>
</template>

<style lang="scss" scoped>
.message-container {
  position: relative;
  width: 100%;
  z-index: 100;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.message-item {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  margin: 0 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  border-left: 8rpx solid;
  opacity: 0;
  transform: translateY(-20rpx);
  transition: all 0.3s ease;

  &.message-show {
    opacity: 1;
    transform: translateY(0);
  }

  &.message-success {
    border-left-color: #00b894;
    background: linear-gradient(135deg, #ffffff 0%, #f8fff9 100%);
  }

  &.message-error {
    border-left-color: #e17055;
    background: linear-gradient(135deg, #ffffff 0%, #fff8f8 100%);
  }

  &.message-warning {
    border-left-color: #fdcb6e;
    background: linear-gradient(135deg, #ffffff 0%, #fffdf8 100%);
  }

  &.message-info {
    border-left-color: #74b9ff;
    background: linear-gradient(135deg, #ffffff 0%, #f8fcff 100%);
  }
}

.message-icon {
  font-size: 32rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  font-size: 28rpx;
  line-height: 1.4;
  color: #333333;
}

.message-close {
  font-size: 24rpx;
  color: #999999;
  padding: 8rpx;
  margin-left: 16rpx;
  flex-shrink: 0;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #666666;
  }
}

// 动画样式
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(-30rpx);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-30rpx);
}

.message-move {
  transition: transform 0.3s ease;
}

// 深色主题适配
.theme-dark {
  .message-item {
    background: #2d3748;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);

    &.message-success {
      background: linear-gradient(135deg, #2d3748 0%, #1a2f1a 100%);
    }

    &.message-error {
      background: linear-gradient(135deg, #2d3748 0%, #2f1a1a 100%);
    }

    &.message-warning {
      background: linear-gradient(135deg, #2d3748 0%, #2f2a1a 100%);
    }

    &.message-info {
      background: linear-gradient(135deg, #2d3748 0%, #1a252f 100%);
    }
  }

  .message-content {
    color: #e2e8f0;
  }

  .message-close {
    color: #a0aec0;

    &:hover {
      color: #cbd5e0;
    }
  }
}
</style>
