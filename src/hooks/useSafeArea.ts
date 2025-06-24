/**
 * 获取设备安全区域信息的组合式函数
 * 用于适配不同设备的屏幕显示，处理刘海屏、状态栏、底部指示器等区域
 */
export function useSafeArea() {
  let safeAreaInsets
  let systemInfo

  // #ifdef MP-WEIXIN
  // 微信小程序使用新的API
  systemInfo = uni.getWindowInfo()
  safeAreaInsets = systemInfo.safeArea
    ? {
        top: systemInfo.safeArea.top,
        right: systemInfo.windowWidth - systemInfo.safeArea.right,
        bottom: systemInfo.windowHeight - systemInfo.safeArea.bottom,
        left: systemInfo.safeArea.left,
      }
    : null
  // #endif

  // #ifndef MP-WEIXIN
  // 其他平台继续使用uni API
  systemInfo = uni.getSystemInfoSync()
  safeAreaInsets = systemInfo.safeAreaInsets
  // #endif
  return {
    safeAreaInsets,
    systemInfo,
  }
}
