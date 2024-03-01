export const CommonMessageKey = {
  REQUIRED: 'REQUIRED',
  INVALID_ID: 'INVALID_ID',
  INVALID_TYPE_ERROR: 'INVALID_TYPE_ERROR',
  INVALID_USERNAME: 'INVALID_USERNAME',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INVALID_TOKEN_LENGTH: 'INVALID_TOKEN_LENGTH',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  INVALID_COLOR_STRING: 'INVALID_COLOR_STRING',
} as const;

export type CommonMessageType = keyof typeof CommonMessageKey;

export const CommonMessage: Record<CommonMessageType, string> = {
  REQUIRED: '必填',
  INVALID_ID: '无效ID',
  INVALID_TYPE_ERROR: '无效类型',
  INVALID_USERNAME:
    '无效用户名, 长度在8到32个字符之间, 可包含大小写英文字母, 数字, 下划线。',
  INVALID_PASSWORD:
    '无效密码, 长度在8到32个字符之间, 并且包含至少一个数字、一个大写字母、一个小写字母和一个特殊字符 ( - _ ! @ # $ % ^ & * ? )',
  INVALID_TOKEN_LENGTH: '无效验证码长度, 请输入6位验证码',
  INVALID_ADDRESS: '无效的地址',
  INVALID_COLOR_STRING: '无效的颜色字符串',
} as const;
