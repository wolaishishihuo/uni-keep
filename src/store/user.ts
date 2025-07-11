import type { FastingPlan, FastingRecord, WeightRecord } from '@/models';
import type { UserProfile } from '@/models/user';
import { defineStore } from 'pinia';
import { getFastingPlan, getUnfinishedRecord } from '@/api/fasting';
import { getWxCode, getWxUserInfo, login } from '@/api/login';
import { getUserInfo } from '@/api/user';
import { formatTime } from '@/utils';
import { toast } from '@/utils/toast';
import { useThemeStore } from './theme';

// 初始化用户信息
const initialUserInfo: UserProfile = {
  id: '0',
  wxOpenId: '',
  nickname: '游客',
  avatar: '/static/images/default-avatar.png',
  height: 0,
  targetWeight: 0,
  currentWeight: 0,
  gender: 'male',
  coupleId: '',
  createdAt: '',
  updatedAt: '',
  isSetup: false,
  birthday: formatTime(new Date(), 'YYYY-MM-DD'),
  age: 0
};

export const useUserStore = defineStore(
  'user',
  () => {
    const themeStore = useThemeStore();

    // 状态
    const userInfo = ref<UserProfile>({ ...initialUserInfo });
    const fastingPlan = ref<FastingPlan | null>(null);
    const fastingRecord = ref<FastingRecord | null>(null);
    const weightRecord = ref<WeightRecord[]>([]);

    const token = ref('');
    const loading = ref(false);

    // 计算属性
    const isLoggedIn = computed(() => token.value !== '');

    // 设置用户信息
    const setUserInfo = (val: UserProfile) => {
      userInfo.value = val;
      themeStore.setGenderTheme(val.gender || 'male');
    };

    // 清除用户信息
    const clearUserInfo = () => {
      userInfo.value = { ...initialUserInfo };
      fastingPlan.value = null;
      fastingRecord.value = null;
      weightRecord.value = [];
      token.value = '';
    };

    // 获取用户完整数据（用户信息 + 断食计划）
    const fetchUserData = async (userId = userInfo.value.id) => {
      try {
        loading.value = true;

        // 并行查询用户信息和断食计划
        const [userResult, fastingResult] = await Promise.all([
          getUserInfo(userId),
          getFastingPlan({ userId })
        ]);

        if (fastingResult.code === 1) {
          fastingPlan.value = fastingResult.data;
        }

        // 获取未完成的断食记录
        const unfinishedRecordResult = await getUnfinishedRecord({ userId, planId: fastingResult.data.id });
        if (unfinishedRecordResult.code === 1) {
          fastingRecord.value = unfinishedRecordResult.data || null;
        }

        if (userResult.code === 1) {
          setUserInfo(userResult.data);
        }
      }
      catch (error) {
        console.error('获取用户数据失败:', error);
        throw error;
      }
      finally {
        loading.value = false;
      }
    };

    // 登录后页面跳转
    const navigateAfterLogin = () => {
      if (!userInfo.value.isSetup) {
        uni.reLaunch({ url: '/pages/welcome/index' });
      }
      else {
        uni.reLaunch({ url: '/pages/home/index' });
      }
    };

    // 微信授权登录
    const wxLogin = async () => {
      try {
        loading.value = true;
        toast.info('微信授权登录中...');

        // 1. 获取微信授权
        const wxCodeRes = await getWxCode();
        await getWxUserInfo();

        // 2. 执行登录
        const { data } = await login({ code: wxCodeRes.code });
        token.value = data.token;

        // 3. 获取用户完整数据
        await fetchUserData(data.userInfo.id);

        // 4. 登录成功跳转
        toast.success('授权登录成功!');
        navigateAfterLogin();
      }
      catch (error) {
        console.error('微信登录失败:', error);
        toast.error('微信登录失败');
        throw error;
      }
      finally {
        loading.value = false;
      }
    };

    return {
      // 状态
      userInfo,
      fastingPlan,
      fastingRecord,
      token,
      loading,
      // 计算属性
      isLoggedIn,
      // 方法
      setUserInfo,
      clearUserInfo,
      fetchUserData,
      wxLogin,
      navigateAfterLogin
    };
  },
  {
    persist: {
      key: 'user',
      paths: ['userInfo', 'token', 'fastingPlan', 'weightRecord', 'fastingRecord'],
      storage: localStorage
    }
  }
);
