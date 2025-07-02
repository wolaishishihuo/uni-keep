import { computed, ref } from 'vue';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  duration?: number;
  show?: boolean;
}

export function useMessage() {
  const messages = ref<Message[]>([]);

  // 生成唯一ID
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  // 隐藏消息
  const hideMessage = (id: string) => {
    const index = messages.value.findIndex(msg => msg.id === id);
    if (index !== -1) {
      messages.value[index].show = false;
      // 延迟移除，给动画时间
      setTimeout(() => {
        messages.value.splice(index, 1);
      }, 300);
    }
  };

  // 显示消息
  const showMessage = (type: MessageType, content: string, duration = 3000) => {
    const id = generateId();
    const message: Message = {
      id,
      type,
      content,
      duration,
      show: true
    };

    messages.value.push(message);

    // 自动隐藏
    if (duration > 0) {
      setTimeout(() => {
        hideMessage(id);
      }, duration);
    }

    return id;
  };

  // 清空所有消息
  const clearMessages = () => {
    messages.value.forEach((msg) => {
      msg.show = false;
    });
    setTimeout(() => {
      messages.value = [];
    }, 300);
  };

  // 快捷方法
  const success = (content: string, duration?: number) => showMessage('success', content, duration);
  const error = (content: string, duration?: number) => showMessage('error', content, duration);
  const warning = (content: string, duration?: number) => showMessage('warning', content, duration);
  const info = (content: string, duration?: number) => showMessage('info', content, duration);

  // 当前显示的消息
  const visibleMessages = computed(() =>
    messages.value.filter(msg => msg.show)
  );

  return {
    messages: visibleMessages,
    showMessage,
    hideMessage,
    clearMessages,
    success,
    error,
    warning,
    info
  };
}
