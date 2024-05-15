export const CommonRegexMap = {
  USERNAME: 'USERNAME',
  PASSWORD: 'PASSWORD',
  ADDRESS: 'ADDRESS',
} as const;

export type CommonRegexType = keyof typeof CommonRegexMap;

export const CommonRegex: Record<CommonRegexType, RegExp> = {
  USERNAME: /^[a-zA-Z0-9_-]{8,32}$/,
  PASSWORD:
    /^.*(?=.{8,32})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[.-_!@#$%^&*?]).*$/,
  ADDRESS: /^T[a-zA-Z0-9]{33}$/,
} as const;
