/**
 * 用户信息
 */
export interface IUserInfoVo {
  id: number;
  username: string;
  avatar: string;
  token: string;
  level: number;
  continuousDays: number;
  totalDays: number;
  partner: string;
  isConnected: boolean;
}

/**
 * 登录返回的信息
 */
export interface IUserLogin {
  token: string;
  userInfo: IUserInfoVo;
}

/**
 * 获取验证码
 */
export interface ICaptcha {
  captchaEnabled: boolean;
  uuid: string;
  image: string;
}
/**
 * 上传成功的信息
 */
export interface IUploadSuccessInfo {
  fileId: number;
  originalName: string;
  fileName: string;
  storagePath: string;
  fileHash: string;
  fileType: string;
  fileBusinessType: string;
  fileSize: number;
}
/**
 * 更新用户信息
 */
export interface IUpdateInfo {
  id: number;
  name: string;
  sex: string;
}
/**
 * 更新用户信息
 */
export interface IUpdatePassword {
  id: number;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
