const prefix = 'winget';

export const channelMap = {
  commandAvailable: `${prefix}:command_available`,
  getList: `${prefix}:get_list`,
  getUpgradeList: `${prefix}:get_upgrade_list`,
} as const;
