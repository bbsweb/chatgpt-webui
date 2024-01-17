'use client'

import {type Dispatch, type SetStateAction, createContext, useContext, useEffect, useState} from 'react'
import {useI18n, useStore} from '../store'
import {getSettingAction, updateSettingAction} from '../action'

/** 默认设置 */
const defaultSetting = {
  /** 语言 */
  lang: 'zh-CN',
  /** 主题 */
  mode: 'auto' as 'auto'|'light'|'dark',
  /**
   * 发送键
   * * 1 —— Ctrl + Enter
   * * 2 —— Shift + Enter
   * * 3 —— Alt + Enter
   * * 4 —— Meta + Enter
   */
  sendKey: '1',
  /** API 地址 */
  apiUrl: 'https://api.openai.com',
  /** API 令牌 */
  apiKey: '',
  /** 聊天设置 */
  chat: {
    /** 模型 */
    model: 'gpt-3.5-turbo',
    /** 频率惩罚 */
    frequency_penalty: 0,
    /** 话题新鲜度 */
    presence_penalty: 0,
    /** 随机性 */
    temperature: 1,
    /** 核采样 */
    top_p: 1
  },
  /** 请求附带历史消息数 */
  send_history: 4
}

type ContextProps = {
  setting: typeof defaultSetting
  setSetting: Dispatch<SetStateAction<typeof defaultSetting>>
}

const GPTContext = createContext<ContextProps>({} as ContextProps)
export const useGPTContext = () => useContext<ContextProps>(GPTContext)
export default function GPTProvider ({children}: {children: React.ReactNode}) {
  const [init, setInit] = useState(false) // 设置是否加载完成
  const [setting, setSetting] = useState(defaultSetting)
  const {i18next, changeLanguage} = useI18n()
  const {dispatchTheme} = useStore()

  /** 数据库加载设置 */
  useEffect(() => {
    getSettingAction().then(doc => {
      doc?.content && setSetting(prev => ({...prev, ...JSON.parse(doc.content)}))
      setInit(true)
    })
  }, [])

  /** 数据库更新设置 */
  useEffect(() => {
    const update = setTimeout(() => {
      if (!init) return

      const copy = {...setting}
      // eslint-disable-next-line guard-for-in
      for (const key in copy) {
        const typedKey = key as keyof typeof defaultSetting
        if (defaultSetting[typedKey] === copy[typedKey]) {
          delete copy[typedKey]
        }
      }
      updateSettingAction(JSON.stringify(copy))
    }, 1000)
    return () => clearTimeout(update)
  }, [init, setting])

  /** 更改语言 */
  useEffect(() => {
    if (init && setting.lang !== i18next.language) {
      changeLanguage(setting.lang)
    }
  }, [changeLanguage, i18next.language, init, setting.lang])

  /** 更改主题 */
  useEffect(() => {
    if (init) dispatchTheme({type: 'changeMode', payload: setting.mode})
  }, [dispatchTheme, init, setting.mode])

  return <GPTContext.Provider value={{setting, setSetting}}>
    {children}
  </GPTContext.Provider>
}
