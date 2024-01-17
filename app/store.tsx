'use client'

import {createContext, useContext, useEffect, useState, useReducer, type Dispatch, type ReactNode, type SetStateAction} from 'react'
import {useRouter} from 'next/navigation'
import i18next from './i18n/client'

type Mode = 'light'|'dark'|'auto'

/** 主题 */
type ThemeProp = {
  /** 当前主题模式 */
  mode: Mode
  /** 当前是否为黑暗模式 */
  darkmode: boolean,
  /** 自定义明亮模式颜色变量 */
  light: {[key: string]: string}
  /** 自定义黑暗模式颜色变量 */
  dark: {[key: string]: string}
}

type ThemeAction = {
  /** 更改模式 */
  type: 'changeMode'
  payload: 'light'|'dark'|'auto'
} | {
  /** 更改黑暗模式 */
  type: 'changeDarkmode'
  payload: boolean
}

/** 消息条 */
type SnackProps = {
  /** 消息 */
  message: string
  /** 类型 */
  type: string
}

type ContextProps = {
  theme: ThemeProp
  dispatchTheme: Dispatch<ThemeAction>
  snack: SnackProps
  setSnack: Dispatch<SetStateAction<SnackProps>>
}

const themeReducer = (theme: ThemeProp, action: ThemeAction) => {
  switch (action.type) {
  case 'changeMode':
    return {...theme, mode: action.payload, init: true}
  case 'changeDarkmode':
    return {...theme, darkmode: action.payload}
  default:
    return theme
  }
}

export const useI18n = (ns = 'app') => {
  const router = useRouter()
  const [t, setT] = useState(() => i18next.getFixedT(null, ns))
  const changeLanguage = (lang: string) => {
    document.cookie = `lang=${lang}; max-age=31536000; path=/; samesite=strict`
    i18next.changeLanguage(lang)
    router.refresh()
  }
  useEffect(() => {
    i18next.loadNamespaces(ns, () => setT(() => i18next.getFixedT(null, ns)))
  }, [ns])
  return {t, i18next, changeLanguage}
}

export const StoreContext = createContext({} as ContextProps)
export const useStore = () => useContext<ContextProps>(StoreContext)
export default function Store ({children, lang, mode}: {children: ReactNode, lang: string, mode: Mode}) {
  const [theme, dispatchTheme] = useReducer(themeReducer, {
    mode,
    darkmode: mode === 'dark',
    light: {},
    dark: {}
  })

  const [snack, setSnack] = useState<SnackProps>({
    message: '',
    type: ''
  })

  i18next.changeLanguage(lang)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.onchange = e => {
      if (theme.mode === 'auto') {
        dispatchTheme({type: 'changeDarkmode', payload: e.matches})
      }
    }

    return () => {
      mq.onchange = null
    }
  })

  useEffect(() => {
    switch (theme.mode) {
    case 'light':
      dispatchTheme({type: 'changeDarkmode', payload: false})
      break
    case 'dark':
      dispatchTheme({type: 'changeDarkmode', payload: true})
      break
    default:
      dispatchTheme({type: 'changeDarkmode', payload: window.matchMedia('(prefers-color-scheme: dark)').matches})
      break
    }

    document.cookie = `mode=${theme.mode}; max-age=31536000; path=/; samesite=strict`
    document.documentElement.setAttribute('data-theme', theme.mode)
  }, [theme.mode])

  return <StoreContext.Provider value={{theme, dispatchTheme, snack, setSnack}}>
    {children}
  </StoreContext.Provider>
}
