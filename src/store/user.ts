import type { WeightRecord } from '@/models';
import type { UserProfile } from '@/models/user';
import { defineStore } from 'pinia';
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
    const weightRecord = ref<WeightRecord[]>([]);
    const token = ref('');

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
      weightRecord.value = [];
      token.value = '';
    };

    // 获取用户信息
    const fetchUserData = async (userId = userInfo.value.id) => {
      try {
        // 查询用户信息
        const userResult = await getUserInfo(userId);
        if (userResult.code === 200) {
          setUserInfo(userResult.data);
        }
      }
      catch (error) {
        console.error('获取用户数据失败:', error);
        throw error;
      }
    };

    // 登录后页面跳转
    const navigateAfterLogin = async () => {
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
        toast.info('微信授权登录中...');

        // 1. 获取微信授权
        const wxCodeRes = await getWxCode();
        await getWxUserInfo();

        // 2. 执行登录
        const { data } = await login({ code: wxCodeRes.code });

        token.value = data.token;
        setUserInfo(data.userInfo);
      }
      catch (error) {
        console.error('微信登录失败:', error);
        toast.error('微信登录失败');
        throw error;
      }
    };

    return {
      // 状态
      userInfo,
      weightRecord,
      token,
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
      paths: ['userInfo', 'token', 'weightRecord'],
      storage: localStorage
    }
  }
);
