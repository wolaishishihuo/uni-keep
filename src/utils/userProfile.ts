import type { UserProfile } from '@/models/user';

/**
 * 检查用户信息是否完整
 * @param userInfo 用户信息
 * @returns 是否完整
 */
export function isUserProfileComplete(userInfo: UserProfile): boolean {
  const { height, currentWeight, targetWeight } = userInfo;
  return !!(height && height > 0 && currentWeight && currentWeight > 0 && targetWeight && targetWeight > 0);
}

/**
 * 检查用户是否为新用户（刚注册的用户）
 * @param userInfo 用户信息
 * @returns 是否为新用户
 */
export function isNewUser(userInfo: UserProfile): boolean {
  // 如果基础信息都没有填写，认为是新用户
  const { height, currentWeight, targetWeight, nickname } = userInfo;
  return (!height || height <= 0)
    && (!currentWeight || currentWeight <= 0)
    && (!targetWeight || targetWeight <= 0)
    && (!nickname || nickname === '游客');
}

/**
 * 计算用户信息完成度
 * @param userInfo 用户信息
 * @returns 完成百分比
 */
export function calculateProfileCompleteness(userInfo: UserProfile): number {
  const { height, currentWeight, targetWeight, nickname } = userInfo;
  let completed = 0;
  const total = 4; // 昵称、身高、当前体重、目标体重

  if (nickname && nickname !== '游客')
    completed++;
  if (height && height > 0)
    completed++;
  if (currentWeight && currentWeight > 0)
    completed++;
  if (targetWeight && targetWeight > 0)
    completed++;

  return Math.round((completed / total) * 100);
}

/**
 * 获取缺少的信息项
 * @param userInfo 用户信息
 * @returns 缺少的信息数组
 */
export function getMissingProfileItems(userInfo: UserProfile): string[] {
  const missing = [];
  const { height, currentWeight, targetWeight, nickname } = userInfo;

  if (!nickname || nickname === '游客')
    missing.push('昵称');
  if (!height || height <= 0)
    missing.push('身高');
  if (!currentWeight || currentWeight <= 0)
    missing.push('当前体重');
  if (!targetWeight || targetWeight <= 0)
    missing.push('目标体重');

  return missing;
}

/**
 * 验证用户信息更新数据
 * @param updateData 更新数据
 * @returns 验证结果
 */
export function validateUserUpdateData(updateData: Partial<UserProfile>): { valid: boolean; message?: string } {
  if (updateData.height !== undefined) {
    if (updateData.height < 100 || updateData.height > 250) {
      return { valid: false, message: '身高必须在100-250cm之间' };
    }
  }

  if (updateData.currentWeight !== undefined) {
    if (updateData.currentWeight < 20 || updateData.currentWeight > 500) {
      return { valid: false, message: '体重必须在20-500kg之间' };
    }
  }

  if (updateData.targetWeight !== undefined) {
    if (updateData.targetWeight < 20 || updateData.targetWeight > 500) {
      return { valid: false, message: '目标体重必须在20-500kg之间' };
    }
  }

  if (updateData.nickname !== undefined) {
    if (!updateData.nickname || updateData.nickname.trim() === '') {
      return { valid: false, message: '昵称不能为空' };
    }
  }

  return { valid: true };
}
