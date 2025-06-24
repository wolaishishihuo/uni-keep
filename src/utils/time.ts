import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(relativeTime)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(weekOfYear)

/** 格式化时间 */
export function formatTime(date: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).format(format)
}

/** 友好时间显示 */
export function fromNow(date: string | number | Date): string {
  return dayjs(date).fromNow()
}

/** 当前时间戳 */
export function getTimestamp(): number {
  return Date.now()
}

/** 时间差（单位：day/hour/minute/second） */
export function diff(
  date1: string | number | Date,
  date2: string | number | Date,
  unit: dayjs.OpUnitType = 'day',
): number {
  return dayjs(date1).diff(dayjs(date2), unit)
}

/** 是否同一天 */
export function isSameDay(date1: string | number | Date, date2: string | number | Date): boolean {
  return dayjs(date1).isSame(dayjs(date2), 'day')
}

/** 获取某天/周/月的起始时间 */
export function getStartOf(date: string | number | Date, unit: dayjs.OpUnitType = 'day'): string {
  return dayjs(date).startOf(unit).format('YYYY-MM-DD HH:mm:ss')
}

/** 字符串转日期对象 */
export function parseDate(str: string): Date {
  return dayjs(str).toDate()
}

/**
 * 格式化时长（秒）为"xx小时xx分钟"或"xx分xx秒"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60)
    return `${seconds}秒`
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes < 60)
    return secs ? `${minutes}分${secs}秒` : `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins ? `${hours}小时${mins}分钟` : `${hours}小时`
}
