const prefix = 'winget';

export const channelMap = {
  // original
  configure: `${prefix}:configure`,
  download: `${prefix}:download`,
  export: `${prefix}:export`,
  features: `${prefix}:features`,
  hash: `${prefix}:hash`,
  import: `${prefix}:import`,
  install: `${prefix}:install`,
  add: `${prefix}:add`,
  list: `${prefix}:list`,
  ls: `${prefix}:ls`,
  pin: `${prefix}:pin`,
  search: `${prefix}:search`,
  find: `${prefix}:find`,
  settings: `${prefix}:settings`,
  config: `${prefix}:config`,
  show: `${prefix}:show`,
  view: `${prefix}:view`,
  source: `${prefix}:source`,
  uninstall: `${prefix}:uninstall`,
  remove: `${prefix}:remove`,
  rm: `${prefix}:rm`,
  upgrade: `${prefix}:upgrade`,
  update: `${prefix}:update`,
  validate: `${prefix}:validate`,
  // shortcuts
  version: `${prefix}:version`,
  formattedList: `${prefix}:formatted:list`,
  formattedUpgradableList: `${prefix}:formatted:upgradable_list`,
} as const;
