import type { Message } from '@/hooks/useMessage';
import type { Gender } from '@/models/user';
import { computed, reactive, ref } from 'vue';
import { completeSetupApi } from '@/api/user';
import { useMessage } from '@/hooks/useMessage';
import { SystemConfigKey } from '@/models/system';
import { useUserStore } from '@/store/user';

// 表单数据接口
export interface SetupFormData {
  // 基础信息
  nickname: string;
  gender: Gender | '';
  birthday: string;
  // 身体数据
  height: string;
  currentWeight: string;
  targetWeight: string;
  // 断食计划
  fastingPlanId: string;
  eatingStartTime: string;
  // 提醒设置
  fastingStartNotify: boolean;
  fastingStartAdvanceMinutes: number;
  eatingWindowStartNotify: boolean;
  eatingWindowEndNotify: boolean;
  eatingWindowAdvanceMinutes: number;
  achievementNotify: boolean;
  milestoneNotify: boolean;
  // 情侣互动提醒
  partnerFastingNotify: boolean;
  partnerEncourageNotify: boolean;
}

// 默认表单数据
const defaultFormData: SetupFormData = {
  // 基础信息
  nickname: '',
  gender: 'male',
  birthday: '',
  // 身体数据
  height: '',
  currentWeight: '',
  targetWeight: '',
  // 断食计划
  fastingPlanId: 'plan16_8',
  eatingStartTime: '08:00', // 进食开始时间
  // 提醒设置
  fastingStartNotify: true, // 断食开始提醒
  fastingStartAdvanceMinutes: 15, // 断食开始提前提醒分钟
  eatingWindowStartNotify: true, // 进食窗口开始提醒
  eatingWindowEndNotify: true, // 进食窗口结束提醒
  eatingWindowAdvanceMinutes: 30, // 进食窗口提前提醒分钟
  achievementNotify: true, // 成就解锁提醒
  milestoneNotify: true, // 坚持里程碑提醒
  // 情侣互动提醒
  partnerFastingNotify: true, // 伙伴坚持状态提醒
  partnerEncourageNotify: true // 伙伴鼓励提醒
};

// 表单数据
const formData = reactive<SetupFormData>({ ...defaultFormData });

// 系统配置映射表
const systemConfigMap = [
  { key: SystemConfigKey.FASTING_START_NOTIFY, field: 'fastingStartNotify', toValue: (v: boolean) => v ? '1' : '0' },
  { key: SystemConfigKey.FASTING_START_ADVANCE, field: 'fastingStartAdvanceMinutes', toValue: (v: number) => String(v) },
  { key: SystemConfigKey.EAT_START_NOTIFY, field: 'eatingWindowStartNotify', toValue: (v: boolean) => v ? '1' : '0' },
  { key: SystemConfigKey.EAT_START_ADVANCE, field: 'eatingWindowAdvanceMinutes', toValue: (v: number) => String(v) },
  { key: SystemConfigKey.EAT_END_NOTIFY, field: 'eatingWindowEndNotify', toValue: (v: boolean) => v ? '1' : '0' },
  { key: SystemConfigKey.ACHIEVEMENT_NOTIFY, field: 'achievementNotify', toValue: (v: boolean) => v ? '1' : '0' },
  { key: SystemConfigKey.MILESTONE_NOTIFY, field: 'milestoneNotify', toValue: (v: boolean) => v ? '1' : '0' },
  { key: SystemConfigKey.PARTNER_STATUS_NOTIFY, field: 'partnerFastingNotify', toValue: (v: boolean) => v ? '1' : '0' },
  { key: SystemConfigKey.PARTNER_ENCOURAGE_NOTIFY, field: 'partnerEncourageNotify', toValue: (v: boolean) => v ? '1' : '0' }
];

/**
 * 设置表单数据管理Hook
 * 职责：管理表单数据、表单验证、数据保存
 */
export function useSetupForm() {
  const message = useMessage();
  const userStore = useUserStore();

  // 保存中状态
  const saving = ref(false);

  // 消息提示数组
  const messages = ref<Message[]>([]);

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

  /**
   * 验证个人信息
   */
  const validatePersonalInfo = (): boolean => {
    const { nickname, gender, birthday, height, currentWeight, targetWeight } = formData;

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

    if (!birthday) {
      message.error('请选择出壳日');
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

  /**
   * 验证步骤
   * @param step 当前步骤
   * @returns 是否验证通过
   */
  const validateStep = (step: number): boolean => {
    console.log('validateStep', step);

    switch (step) {
      case 1: // 个人信息
        return validatePersonalInfo();
      case 2: // 断食计划
        return !!formData.fastingPlanId;
      case 3: // 提醒设置
        return true;
      default:
        return true;
    }
  };

  /**
   * 保存用户信息
   * @returns 是否保存成功
   */
  const saveUserProfile = async (): Promise<boolean> => {
    try {
      saving.value = true;

      // 准备断食计划数据
      const fastingPlan = {
        startTime: formData.eatingStartTime,
        isActive: '1',
        fastingType: formData.fastingPlanId
      };

      const systemConfig = systemConfigMap.map(item => ({
        key: item.key,
        value: item.toValue(formData[item.field] as never)
      }));

      const { code } = await completeSetupApi({
        fastingPlan,
        systemConfig,
        userId: userStore.userInfo.id,
        userInfo: {
          nickname: formData.nickname,
          birthday: formData.birthday,
          gender: formData.gender as Gender,
          height: Number(formData.height),
          currentWeight: Number(formData.currentWeight),
          targetWeight: Number(formData.targetWeight)
        }
      });

      if (code === 1) {
        await userStore.fetchUserData();
        uni.vibrateShort({ type: 'heavy' });
        message.success('设置完成！欢迎使用坚持有你', 2000);
        return true;
      }

      return false;
    }
    catch (error) {
      console.error('设置失败:', error);
      message.error('保存失败，请重试');
      return false;
    }
    finally {
      saving.value = false;
    }
  };

  /**
   * 初始化表单数据
   * @param userInfo 用户信息
   */
  const initFormData = (userInfo: any): void => {
    if (userInfo?.isSetup) {
      message.success('您已完成初始设置');
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/index/index' });
      }, 1000);
      return;
    }

    // 填充现有用户数据
    if (userInfo?.nickname) {
      formData.nickname = userInfo.nickname;
    }
    if (userInfo?.birthday) {
      formData.birthday = userInfo.birthday;
    }
    if (userInfo?.gender) {
      formData.gender = userInfo.gender;
    }
    if (userInfo?.height) {
      formData.height = String(userInfo.height);
    }
    if (userInfo?.currentWeight) {
      formData.currentWeight = String(userInfo.currentWeight);
    }
    if (userInfo?.targetWeight) {
      formData.targetWeight = String(userInfo.targetWeight);
    }
  };

  /**
   * 隐藏消息
   * @param index 消息索引
   */
  const hideMessage = (index: number): void => {
    messages.value.splice(index, 1);
  };

  return {
    // 状态
    formData,
    saving,
    bmiStatus,
    messages,

    // 方法
    validateStep,
    saveUserProfile,
    initFormData,
    hideMessage,

    // 使用message钩子
    ...message
  };
}
