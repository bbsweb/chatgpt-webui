import {cookies} from 'next/headers'
import {fallbackLng, supportedLngs} from './i18n/setting'
import Store from './store'

import './app.css'
import './icon/i.css'

/** 从 cookie 值中获取并检查 lang 值 */
const getLang = () => {
  const cookie = cookies().get('lang')
  const value = cookie?.value
  if (value && supportedLngs.includes(value)) {
    return value
  }
  return fallbackLng
}

/** 从 cookie 值中获取并检查 mode 值 */
const getMode = () => {
  const cookie = cookies().get('mode')
  switch (cookie?.value) {
  case 'light':
    return 'light'
  case 'dark':
    return 'dark'
  default:
    return 'auto'
  }
}

export default ({children}: {children: React.ReactNode}) => {
  const lang = getLang()
  const mode = getMode()
  return <html lang={lang} data-theme={mode}>
    <body>
      <Store lang={lang} mode={mode}>{children}</Store>
    </body>
  </html>
}
