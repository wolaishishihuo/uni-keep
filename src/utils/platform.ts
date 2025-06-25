/*
 * @Author: 菲鸽
 * @Date: 2024-03-28 19:13:55
 * @Last Modified by: 菲鸽
 * @Last Modified time: 2024-03-28 19:24:55
 */
export const platform = import.meta.env.__UNI_PLATFORM__
export const isH5 = import.meta.env.__UNI_PLATFORM__ === 'h5'
export const isApp = import.meta.env.__UNI_PLATFORM__ === 'app'
export const isMp = import.meta.env.__UNI_PLATFORM__.startsWith('mp-')
export const isMpWeixin = import.meta.env.__UNI_PLATFORM__.startsWith('mp-weixin')
export const isMpAplipay = import.meta.env.__UNI_PLATFORM__.startsWith('mp-alipay')
export const isMpToutiao = import.meta.env.__UNI_PLATFORM__.startsWith('mp-toutiao')

const PLATFORM = {
  platform,
  isH5,
  isApp,
  isMp,
  isMpWeixin,
  isMpAplipay,
  isMpToutiao,
}
export default PLATFORM
