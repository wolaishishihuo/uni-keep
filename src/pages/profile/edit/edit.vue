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
import { getUserInfo as getUserInfoApi, updateInfo } from '@/api/login';
import { useUserStore } from '@/store/user';
import { toast } from '@/utils/toast';

defineOptions({
  name: 'ProfileEdit'
});

// 用户信息管理
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

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

onLoad(() => {
  console.log('个人资料页面加载完成');
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
  </view>
</template>

<style lang="scss">
@import './index.scss';
</style>
