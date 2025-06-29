import type { UserProfile } from '@/models/user';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getWxCode,
  getWxUserInfo,
  login
} from '@/api/login';
import { toast } from '@/utils/toast';

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
  updatedAt: ''
};

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息状态
    const userInfo = ref<UserProfile>({ ...initialUserInfo });

    // 微信用户信息
    const wxUserInfo = ref<UniApp.GetUserProfileRes | null>(null);

    const token = ref('');

    // 是否登录
    const isLoggedIn = computed(() => {
      return token.value !== '';
    });

    // 设置用户信息
    const setUserInfo = (val: UserProfile) => {
      userInfo.value = val;
    };

    // 微信授权登录
    const wxLogin = async () => {
      try {
        toast.info('微信授权登录中...');
        // 1. 获取微信登录凭证
        // console.log('获取微信登录凭证');
        const wxCodeRes = await getWxCode();
        console.log('微信登录code:', wxCodeRes.code);
        // // 2. 获取用户信息授权
        // console.log('开始微信用户信息授权');
        const wxInfo = await getWxUserInfo();
        wxUserInfo.value = wxInfo;
        console.log('微信用户信息:', wxInfo);

        // 3. 登录
        const { data } = await login({
          code: wxCodeRes.code
        });

        console.log('登录结果:', {
          token: data.token,
          userInfo: data.userInfo
        });
        // 3. 临时设置微信用户信息到userInfo
        setUserInfo(data.userInfo);
        token.value = data.token;
        toast.success('授权登录成功!');
      }
      catch (error) {
        console.error('微信授权失败', error);
        toast.error('微信授权失败');
        throw error;
      }
    };

    return {
      userInfo,
      wxUserInfo,
      token,
      setUserInfo,
      wxLogin,
      isLoggedIn
    };
  },
  {
    persist: {
      key: 'user',
      paths: ['userInfo', 'token'],
      storage: localStorage
    }
  }
);
