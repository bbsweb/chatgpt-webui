import type {InitOptions} from 'i18next'

export const supportedLngs = ['zh-CN', 'en']
export const fallbackLng = 'zh-CN'
export const defaultNS = 'app'

export default {
  debug: false,
  load: 'currentOnly',
  supportedLngs,
  fallbackLng,
  defaultNS,
  keySeparator: false
} as InitOptions
