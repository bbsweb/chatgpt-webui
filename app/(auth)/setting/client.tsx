'use client'

import {useI18n} from '../../store'
import {useGPTContext} from '../../provider'
import {Input, Select, Slider} from '../option'

export default function Setting () {
  const {t} = useI18n()
  const {setting, setSetting} = useGPTContext()

  return <>
    <Select
      label={t('language')}
      value={setting.lang}
      selects={[
        {value: 'zh-CN', label: '简体中文'},
        {value: 'en', label: 'English'}
      ]}
      onChange={lang => setSetting(prev => ({...prev, lang}))}
    />
    <Select
      label={t('theme')}
      value={setting.mode}
      selects={[
        {value: 'auto', label: t('theme auto')},
        {value: 'light', label: t('theme light')},
        {value: 'dark', label: t('theme dark')}
      ]}
      onChange={mode => setSetting(prev => ({...prev, mode: mode as 'auto'|'light'|'dark'}))}
    />
    <Select
      label={t('sendKey')}
      value={setting.sendKey}
      selects={[
        {value: '1', label: 'Ctrl + Enter'},
        {value: '2', label: 'Shift + Enter'},
        {value: '3', label: 'Alt + Enter'},
        {value: '4', label: 'Meta + Enter'}
      ]}
      onChange={sendKey => setSetting(prev => ({...prev, sendKey}))}
    />
    <Input label={t('apiUrl')} value={setting.apiUrl} onChange={apiUrl => setSetting(prev => ({...prev, apiUrl}))}/>
    <Input label={t('apiKey')} value={setting.apiKey} onChange={apiKey => setSetting(prev => ({...prev, apiKey}))}/>
    <Select
      label={t('model')}
      value={setting.chat.model}
      selects={[
        {value: 'gpt-4'},
        {value: 'gpt-4-1106-preview'},
        {value: 'gpt-4-vision-preview'},
        {value: 'gpt-4-32k'},
        {value: 'gpt-3.5-turbo'},
        {value: 'gpt-3.5-turbo-16k'}
      ]}
      onChange={model => setSetting(prev => ({...prev, chat: {...prev.chat, model}}))}
    />
    <Slider
      label={t('frequency_penalty')}
      value={setting.chat.frequency_penalty}
      onChange={frequency_penalty => setSetting(prev => ({...prev, chat: {...prev.chat, frequency_penalty}}))}
      min={-2.0}
      max={2.0}
      step={0.1}
    />
    <Slider
      label={t('presence_penalty')}
      value={setting.chat.presence_penalty}
      onChange={presence_penalty => setSetting(prev => ({...prev, chat: {...prev.chat, presence_penalty}}))}
      min={-2.0}
      max={2.0}
      step={0.1}
    />
    <Slider
      label={t('temperature')}
      value={setting.chat.temperature}
      onChange={temperature => setSetting(prev => ({...prev, chat: {...prev.chat, temperature}}))}
      min={0}
      max={2}
      step={0.1}
    />
    <Slider
      label={t('top_p')}
      value={setting.chat.top_p}
      onChange={top_p => setSetting(prev => ({...prev, chat: {...prev.chat, top_p}}))}
      min={0}
      max={1}
      step={0.1}
    />
    <Slider
      label={t('send_history')}
      value={setting.send_history}
      onChange={send_history => setSetting(prev => ({...prev, send_history}))}
      min={0}
      max={64}
    />
  </>
}
