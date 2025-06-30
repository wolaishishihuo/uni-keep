<route lang="json5">
{
  needLogin: true,
  style: {
    navigationBarTitleText: '个人资料',

  }
}
</route>

<script lang="ts" setup>
import type { Gender } from '@/models/user';
import { onLoad } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { getUserInfo as getUserInfoApi, updateInfo } from '@/api/login';
import { useUserStore } from '@/store/user';
import { toast } from '@/utils/toast';

defineOptions({
  name: 'ProfileEdit'
});

// 用户信息管理
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

// 页面来源标识
const fromLogin = ref(false);

// 偏好设置
const reminderSettings = ref({
  fastingStart: '08:00',
  fastingEnd: '18:00',
  weightRecord: '07:00',
  enableNotification: true
});

// 更新用户信息到服务器
async function updateUserInfo(updatedInfo: Partial<typeof userInfo.value>, tipText: string = '更新成功') {
  try {
    // 先更新本地状态
    const newUserInfo = {
      ...userInfo.value,
      ...updatedInfo
    };
    userStore.setUserInfo(newUserInfo);

    // 调用API更新到服务器
    await updateInfo(newUserInfo);

    toast.success(tipText);
  }
  catch (error) {
    console.error('更新用户信息失败:', error);
    toast.error('更新失败，请重试');

    // 如果API调用失败，可以考虑回滚本地状态
    // 这里选择不回滚，让用户可以重试
  }
}

// 头像选择回调
async function onChooseAvatar({ avatarUrl }) {
  console.log(avatarUrl);
  if (avatarUrl) {
    // 更新用户头像到服务器
    await updateUserInfo({ avatar: avatarUrl }, '头像更新成功');
  }
}

// 头像选择错误处理
function onChooseAvatarError(e: any) {
  console.log('头像选择错误:', e);
  const { errMsg } = e.detail;

  if (errMsg.includes('cancel')) {
    return;
  }

  uni.showToast({
    title: '头像选择失败，请重试',
    icon: 'none'
  });
}

// 编辑性别
function editGender() {
  uni.showActionSheet({
    itemList: ['👨 男', '👩 女'],
    success: async (res) => {
      const gender: Gender = res.tapIndex === 0 ? 'male' : 'female';
      await updateUserInfo({ gender }, '性别更新成功');
    }
  });
}

// 编辑身高
function editHeight() {
  uni.showModal({
    title: '修改身高',
    editable: true,
    placeholderText: '请输入身高(cm)',
    success: async (res) => {
      if (res.confirm && res.content) {
        const height = Number(res.content);
        if (height >= 100 && height <= 250) {
          await updateUserInfo({ height }, '身高更新成功');
        }
        else {
          toast.error('请输入有效的身高(100-250cm)');
        }
      }
    }
  });
}

// 编辑当前体重
function editCurrentWeight() {
  uni.showModal({
    title: '修改当前体重',
    editable: true,
    placeholderText: '请输入当前体重(kg)',
    success: async (res) => {
      if (res.confirm && res.content) {
        const weight = Number(res.content);
        if (weight >= 20 && weight <= 500) {
          await updateUserInfo({ currentWeight: weight }, '体重更新成功');
        }
        else {
          toast.error('请输入有效的体重(20-500kg)');
        }
      }
    }
  });
}

// 编辑目标体重
function editTargetWeight() {
  uni.showModal({
    title: '修改目标体重',
    editable: true,
    placeholderText: '请输入目标体重(kg)',
    success: async (res) => {
      if (res.confirm && res.content) {
        const weight = Number(res.content);
        if (weight >= 20 && weight <= 500) {
          await updateUserInfo({ targetWeight: weight }, '目标体重更新成功');
        }
        else {
          toast.error('请输入有效的目标体重(20-500kg)');
        }
      }
    }
  });
}
// 昵称失去焦点时保存
async function onNicknameBlur() {
  // 简单验证
  if (!userInfo.value.nickname || userInfo.value.nickname.trim() === '') {
    toast.error('昵称不能为空');
    return;
  }

  await updateUserInfo({ nickname: userInfo.value.nickname.trim() }, '昵称更新成功');
}

// 获取用户信息
async function getUserInfo() {
  const res = await getUserInfoApi(userInfo.value.id);
  userStore.setUserInfo(res.data[0]);
  console.log(res.data[0]);
}

// 编辑提醒时间
function editReminderTime(type: 'fastingStart' | 'fastingEnd' | 'weightRecord') {
  const titles = {
    fastingStart: '断食开始提醒',
    fastingEnd: '断食结束提醒',
    weightRecord: '体重记录提醒'
  };

  uni.showModal({
    title: titles[type],
    editable: true,
    placeholderText: '请输入时间(HH:mm)',
    content: reminderSettings.value[type],
    success: (res) => {
      if (res.confirm && res.content) {
        // 验证时间格式
        const timeRegex = /^(?:[01]?\d|2[0-3]):[0-5]\d$/;
        if (timeRegex.test(res.content)) {
          reminderSettings.value[type] = res.content;
          toast.success('提醒时间更新成功');
        }
        else {
          toast.error('请输入正确的时间格式(HH:mm)');
        }
      }
    }
  });
}

// 切换通知开关
function toggleNotification() {
  reminderSettings.value.enableNotification = !reminderSettings.value.enableNotification;
  toast.success(reminderSettings.value.enableNotification ? '已开启通知' : '已关闭通知');
}

// 完成编辑
function handleComplete() {
  // 验证必填信息
  if (!userInfo.value.nickname || userInfo.value.nickname.trim() === '') {
    toast.error('请填写昵称');
    return;
  }

  if (!userInfo.value.height) {
    toast.error('请填写身高');
    return;
  }

  if (!userInfo.value.currentWeight) {
    toast.error('请填写当前体重');
    return;
  }

  if (!userInfo.value.targetWeight) {
    toast.error('请填写目标体重');
    return;
  }

  // 保存偏好设置到本地存储
  uni.setStorageSync('user_reminder_settings', reminderSettings.value);

  toast.success('个人资料完善成功！');

  // 根据来源决定跳转页面
  setTimeout(() => {
    if (fromLogin.value) {
      // 从登录页面来的，跳转到首页
      uni.switchTab({
        url: '/pages/index/index'
      });
    }
    else {
      // 从其他页面来的，返回上一页
      uni.navigateBack();
    }
  }, 1500);
}

// 跳过设置
function handleSkip() {
  uni.switchTab({
    url: '/pages/index/index'
  });
}

onLoad((options) => {
  console.log('个人资料页面加载完成');

  // 检查是否从登录页面跳转过来
  if (options?.from === 'login') {
    fromLogin.value = true;
  }

  // 加载已保存的偏好设置
  const savedSettings = uni.getStorageSync('user_reminder_settings');
  if (savedSettings) {
    reminderSettings.value = { ...reminderSettings.value, ...savedSettings };
  }

  // getUserInfo();
});
</script>

<template>
  <view class="profile-container">
    <!-- 头像 -->
    <wd-cell-group>
      <wd-cell title="头像" is-link>
        <wd-button
          type="default"
          size="small"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
          @error="onChooseAvatarError"
        >
          <image
            :src="userInfo.avatar || '/static/images/default-avatar.png'"
            class="avatar-image"
            mode="aspectFill"
          />
        </wd-button>
      </wd-cell>
    </wd-cell-group>

    <!-- 基本信息 -->
    <wd-cell-group>
      <wd-cell title="用户名" is-link>
        <input
          v-model="userInfo.nickname"
          type="nickname"
          size="large"
          @blur="onNicknameBlur"
        >
      </wd-cell>

      <wd-cell title="性别" is-link @click="editGender">
        <template #value>
          <text class="cell-value">
            {{ userInfo.gender === 'female' ? '女' : '男' }}
          </text>
        </template>
      </wd-cell>
    </wd-cell-group>

    <!-- 身体数据 -->
    <wd-cell-group>
      <wd-cell title="身高" is-link @click="editHeight">
        <template #value>
          <text class="cell-value">
            {{ userInfo.height ? `${userInfo.height}cm` : '未设置' }}
          </text>
        </template>
      </wd-cell>

      <wd-cell title="当前体重" is-link @click="editCurrentWeight">
        <template #value>
          <text class="cell-value">
            {{ userInfo.currentWeight ? `${userInfo.currentWeight}kg` : '未设置' }}
          </text>
        </template>
      </wd-cell>

      <wd-cell title="目标体重" is-link @click="editTargetWeight">
        <template #value>
          <text class="cell-value">
            {{ userInfo.targetWeight ? `${userInfo.targetWeight}kg` : '未设置' }}
          </text>
        </template>
      </wd-cell>
    </wd-cell-group>

    <!-- 偏好设置 -->
    <wd-cell-group>
      <wd-cell title="提醒设置">
        <template #value>
          <wd-switch
            v-model="reminderSettings.enableNotification"
            @change="toggleNotification"
          />
        </template>
      </wd-cell>

      <template v-if="reminderSettings.enableNotification">
        <wd-cell title="断食开始提醒" is-link @click="editReminderTime('fastingStart')">
          <template #value>
            <text class="cell-value">
              {{ reminderSettings.fastingStart }}
            </text>
          </template>
        </wd-cell>

        <wd-cell title="断食结束提醒" is-link @click="editReminderTime('fastingEnd')">
          <template #value>
            <text class="cell-value">
              {{ reminderSettings.fastingEnd }}
            </text>
          </template>
        </wd-cell>

        <wd-cell title="体重记录提醒" is-link @click="editReminderTime('weightRecord')">
          <template #value>
            <text class="cell-value">
              {{ reminderSettings.weightRecord }}
            </text>
          </template>
        </wd-cell>
      </template>
    </wd-cell-group>

    <!-- 完成按钮 -->
    <view class="complete-section">
      <wd-button
        type="primary"
        size="large"
        custom-style="margin: 40rpx 32rpx; border-radius: 24rpx;"
        @click="handleComplete"
      >
        {{ fromLogin ? '完成设置，开始使用' : '保存设置' }}
      </wd-button>

      <!-- 仅在从登录页面来时显示跳过按钮 -->
      <wd-button
        v-if="fromLogin"
        type="info"
        size="large"
        plain
        custom-style="margin: 0 32rpx 40rpx; border-radius: 24rpx;"
        @click="handleSkip"
      >
        跳过，稍后设置
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss">
@import './index.scss';
</style>
