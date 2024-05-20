const prefix = 'api_key';

export const channelMap = {
  get: `${prefix}:get`,
  set: `${prefix}:set`,
  clear: `${prefix}:clear`,
  create: `${prefix}:create`,
  remove: `${prefix}:remove`,
  has: `${prefix}:has`,
  getActive: `${prefix}:get_active`,
  setActive: `${prefix}:set_active`,
} as const;
