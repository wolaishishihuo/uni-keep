/**
 * 数据模型统一导出
 */

// 成就系统相关模型
export * from './achievement'

// 情侣互动相关模型
export * from './couple'

// 断食相关模型
export * from './fasting'

// 用户相关模型
export * from './user'

// 体重管理相关模型
export * from './weight'

/**
 * 通用类型定义
 */

/** API 响应基础结构 */
export interface ApiResponse<T = any> {
  /** 状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
  /** 是否成功 */
  success: boolean
  /** 时间戳 */
  timestamp: number
}

/** 分页查询响应 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  list: T[]
  /** 当前页码 */
  page: number
  /** 每页数量 */
  limit: number
  /** 总数量 */
  total: number
  /** 总页数 */
  totalPages: number
  /** 是否有下一页 */
  hasNext: boolean
  /** 是否有上一页 */
  hasPrev: boolean
}

/** 分页查询参数 */
export interface PaginationParams {
  /** 页码 */
  page?: number
  /** 每页数量 */
  limit?: number
}

/** 日期范围参数 */
export interface DateRange {
  /** 开始日期 YYYY-MM-DD */
  startDate: string
  /** 结束日期 YYYY-MM-DD */
  endDate: string
}

/** 排序参数 */
export interface SortParams {
  /** 排序字段 */
  field: string
  /** 排序方向 */
  order: 'asc' | 'desc'
}

/** 文件上传响应 */
export interface UploadResponse {
  /** 文件URL */
  url: string
  /** 文件名 */
  filename: string
  /** 文件大小 */
  size: number
  /** 文件类型 */
  type: string
}

/** 错误信息 */
export interface ErrorInfo {
  /** 错误码 */
  code: string
  /** 错误消息 */
  message: string
  /** 错误详情 */
  details?: any
}
