import type { Gender } from '@/models/user';
import { computed, reactive, ref } from 'vue';
import { useMessage } from '@/hooks/useMessage';
import { useUserStore } from '@/store/user';

// 表单数据接口
export interface SetupFormData {
  // 基础信息
  nickname: string;
  gender: Gender | '';
  age: string;
  // 身体数据
  height: string;
  currentWeight: string;
  targetWeight: string;
  // 提醒设置
  enableNotification: boolean;
  fastingStart: string;
  fastingEnd: string;
  weightRecord: string;
}

// 默认表单数据
const defaultFormData: SetupFormData = {
  // 基础信息
  nickname: '',
  gender: '',
  age: '',
  // 身体数据
  height: '',
  currentWeight: '',
  targetWeight: '',
  // 提醒设置
  enableNotification: true,
  fastingStart: '08:00',
  fastingEnd: '18:00',
  weightRecord: '07:00'
};

export function useSetupForm() {
  const userStore = useUserStore();
  const message = useMessage();

  // 步骤相关
  const currentStep = ref(1);
  const totalSteps = 3;
  const saving = ref(false);

  // 表单数据
  const formData = reactive<SetupFormData>({ ...defaultFormData });

  // 计算BMI状态
  const bmiStatus = computed(() => {
    const { height, currentWeight } = formData;
    if (!height || !currentWeight)
      return null;

    const h = Number(height) / 100;
    const w = Number(currentWeight);
    const bmi = w / (h * h);

    if (bmi < 18.5)
      return { text: '偏瘦', color: '#74b9ff' };
    if (bmi < 24)
      return { text: '正常', color: '#00b894' };
    if (bmi < 28)
      return { text: '超重', color: '#fdcb6e' };
    return { text: '肥胖', color: '#e17055' };
  });

  // 验证第一步表单
  const validateStep1 = (): boolean => {
    const { nickname, gender, age, height, currentWeight, targetWeight } = formData;

    // 验证基础信息
    if (!nickname || nickname.trim().length < 2) {
      message.error('请输入至少2个字符的昵称');
      return false;
    }

    if (nickname.trim().length > 20) {
      message.error('昵称不能超过20个字符');
      return false;
    }

    if (!gender) {
      message.error('请选择性别');
      return false;
    }

    if (!age || Number(age) < 10 || Number(age) > 100) {
      message.error('请输入有效的年龄 (10-100岁)');
      return false;
    }

    // 验证身体数据
    if (!height || Number(height) < 100 || Number(height) > 250) {
      message.error('请输入有效的身高 (100-250cm)');
      return false;
    }

    if (!currentWeight || Number(currentWeight) < 20 || Number(currentWeight) > 500) {
      message.error('请输入有效的当前体重 (20-500kg)');
      return false;
    }

    if (!targetWeight || Number(targetWeight) < 20 || Number(targetWeight) > 500) {
      message.error('请输入有效的目标体重 (20-500kg)');
      return false;
    }

    if (Math.abs(Number(targetWeight) - Number(currentWeight)) < 0.1) {
      message.error('目标体重应与当前体重有所不同');
      return false;
    }

    return true;
  };

  // 完成设置
  const completeSetup = async (): Promise<void> => {
    try {
      saving.value = true;

      const setupData = {
        // 基础信息
        nickname: formData.nickname.trim(),
        gender: formData.gender as Gender,
        age: Number(formData.age),
        // 身体数据
        height: Number(formData.height),
        currentWeight: Number(formData.currentWeight),
        targetWeight: Number(formData.targetWeight),
        // 提醒设置
        reminderSettings: {
          enableNotification: formData.enableNotification,
          fastingStart: formData.fastingStart,
          fastingEnd: formData.fastingEnd,
          weightRecord: formData.weightRecord
        }
      };

      const success = await userStore.updateUserInfo(setupData);

      if (success) {
        uni.vibrateShort({ type: 'heavy' });
        message.success('设置完成！欢迎使用坚持有你', 2000);

        setTimeout(() => {
          uni.reLaunch({ url: '/pages/index/index' });
        }, 2000);
      }
    }
    catch (error) {
      console.error('设置失败:', error);
      message.error('设置失败，请重试');
    }
    finally {
      saving.value = false;
    }
  };

  // 下一步
  const nextStep = async (): Promise<void> => {
    try {
      if (currentStep.value === 1) {
        if (!validateStep1())
          return;
        uni.vibrateShort({ type: 'light' });
        currentStep.value++;
      }
      else if (currentStep.value === 2) {
        uni.vibrateShort({ type: 'light' });
        currentStep.value++;
      }
      else {
        await completeSetup();
      }
    }
    catch (error) {
      console.error('步骤处理失败:', error);
      message.error('操作失败，请重试');
    }
  };

  // 上一步
  const prevStep = (): void => {
    if (currentStep.value > 1) {
      uni.vibrateShort({ type: 'light' });
      currentStep.value--;
    }
  };

  // 跳过设置
  const skipSetup = (): void => {
    uni.showModal({
      title: '确认跳过设置',
      content: '跳过设置将无法使用完整功能，您可以随时在个人中心完善信息',
      cancelText: '继续设置',
      confirmText: '跳过',
      confirmColor: '#fa5151',
      success: (res) => {
        if (res.confirm) {
          uni.vibrateShort({ type: 'light' });
          uni.reLaunch({ url: '/pages/index/index' });
        }
      }
    });
  };

  // 初始化表单数据
  const initFormData = (userInfo: any): void => {
    if (userInfo?.height && userInfo?.currentWeight && userInfo?.targetWeight) {
      message.success('您已完成初始设置');
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/index/index' });
      }, 1000);
      return;
    }

    // 初始化基础信息
    if (userInfo?.nickname) {
      formData.nickname = userInfo.nickname;
    }
    if (userInfo?.gender) {
      formData.gender = userInfo.gender;
    }
    if (userInfo?.age) {
      formData.age = userInfo.age.toString();
    }

    // 初始化身体数据
    if (userInfo?.height) {
      formData.height = userInfo.height.toString();
    }
    if (userInfo?.currentWeight) {
      formData.currentWeight = userInfo.currentWeight.toString();
    }
    if (userInfo?.targetWeight) {
      formData.targetWeight = userInfo.targetWeight.toString();
    }
  };

  return {
    // 状态
    currentStep,
    totalSteps,
    saving,
    formData,
    bmiStatus,

    // 方法
    nextStep,
    prevStep,
    skipSetup,
    initFormData,

    // 消息提示
    ...message
  };
}
