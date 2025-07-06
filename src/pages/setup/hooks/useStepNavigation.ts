/**
 * 步骤导航控制Hook
 * @param stepsCount 总步骤数
 * @param validateStepFn 验证步骤函数
 * @param saveProfileFn 保存用户资料函数
 */
export function useStepNavigation(
  stepsCount: number,
  validateStepFn: (step: number) => boolean,
  saveProfileFn: () => Promise<boolean>
) {
  // 当前步骤
  const currentStep = ref(1);
  // 总步骤数
  const totalSteps = ref(stepsCount);
  // 保存中状态
  const saving = ref(false);
  // 每个步骤的验证状态
  const stepValidStatus = ref<Record<number, boolean>>({});

  // 是否可以进入下一步
  const canMoveNext = computed(() => {
    return validateStepFn(currentStep.value);
  });

  // 下一步操作
  const nextStep = async () => {
    // 验证当前步骤
    if (!validateStepFn(currentStep.value)) {
      return;
    }

    // 如果是最后一步，执行保存操作
    if (currentStep.value === totalSteps.value) {
      saving.value = true;
      const success = await saveProfileFn();
      saving.value = false;

      // 保存成功跳转到主页
      if (success) {
        uni.switchTab({
          url: '/pages/index/index'
        });
      }
      return;
    }

    // 前进到下一步
    currentStep.value += 1;
  };

  // 上一步操作
  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value -= 1;
    }
  };

  // 跳过设置
  const skipSetup = () => {
    uni.switchTab({
      url: '/pages/index/index'
    });
  };

  // 设置步骤验证状态
  const setStepValid = (step: number, isValid: boolean) => {
    stepValidStatus.value[step] = isValid;
  };

  return {
    currentStep,
    totalSteps,
    saving,
    canMoveNext,
    nextStep,
    prevStep,
    skipSetup,
    setStepValid
  };
}
