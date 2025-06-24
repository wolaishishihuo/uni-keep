/**
 * 获取设备安全区域信息的组合式函数
 * 用于适配不同设备的屏幕显示，处理刘海屏、状态栏、底部指示器等区域
 */

interface SafeAreaInsets {
  top: number
  right: number
  bottom: number
  left: number
}

function calcSafeAreaInsets(systemInfo: any): SafeAreaInsets | null {
  if (systemInfo.safeArea) {
    return {
      top: systemInfo.safeArea.top,
      right: systemInfo.windowWidth - systemInfo.safeArea.right,
      bottom: systemInfo.windowHeight - systemInfo.safeArea.bottom,
      left: systemInfo.safeArea.left,
    }
  }
  return null
}

export function useSafeArea(): { safeAreaInsets: SafeAreaInsets, systemInfo: any } {
  let systemInfo: any
  let safeAreaInsets: SafeAreaInsets | null = null

  // #ifdef MP-WEIXIN
  systemInfo = uni.getWindowInfo()
  safeAreaInsets = calcSafeAreaInsets(systemInfo)
  if (!safeAreaInsets) {
    systemInfo = uni.getSystemInfoSync()
    safeAreaInsets = calcSafeAreaInsets(systemInfo)
  }
  // #endif

  // #ifndef MP-WEIXIN
  systemInfo = uni.getSystemInfoSync()
  safeAreaInsets = systemInfo.safeAreaInsets || calcSafeAreaInsets(systemInfo)
  // #endif

  // 兜底
  if (!safeAreaInsets) {
    safeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 }
  }

  return { safeAreaInsets, systemInfo }
}
