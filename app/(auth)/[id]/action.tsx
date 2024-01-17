'use client'

import {useEffect, useMemo, useState} from 'react'
import type {GPT} from '../../mongo'
import {useI18n} from '../../store'
import Alert from '../../ui/alert'
import Dialog from '../../ui/dialog'
import Switch from '../../ui/switch'
import {updateGPTAction} from '../../action'
import {useGPTContext} from '../../provider'
import useTree from '../../useTree'
import {Select, Slider} from '../option'
import Context from './context'

import css from './action.module.css'

export default function Action ({id, defaultContext, defaultConfig}: {id: string, defaultContext: GPT['context'], defaultConfig: GPT['config']}) {
  const [open, setOpen] = useState(false)
  const [context, setContext] = useState(defaultContext)
  const [config, setConfig] = useState(defaultConfig)
  const {setting} = useGPTContext()
  const {t} = useI18n()
  const {mutate} = useTree()

  const chatConfig = useMemo(() => ({...setting.chat, ...config.chat}), [config.chat, setting.chat])

  useEffect(() => {
    const update = setTimeout(() => {
      if (JSON.stringify(context) !== JSON.stringify(defaultContext)) updateGPTAction(id, {context})
    }, 500)
    return () => clearTimeout(update)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, context])

  useEffect(() => {
    const update = setTimeout(() => {
      if (JSON.stringify(config) !== JSON.stringify(defaultConfig)) updateGPTAction(id, {config}).then(() => mutate())
    }, 500)
    return () => clearTimeout(update)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, config])

  return <>
    <button className="i-cog" onClick={() => setOpen(true)}/>
    {open && <Dialog onClose={() => setOpen(false)}>
      <div className={css.dialog}>
        <Context context={context} onChange={i => setContext(i)}/>
        <Switch
          className={css.switch}
          label={t('share')}
          value={config.share}
          onChange={share => setConfig(prev => ({...prev, share}))}
        />
        {config.share && <Alert type="info" style={{width: '100%'}} outline>{t('share at')} <a href={`/share/${id}`} target="_blank" style={{wordBreak: 'break-word', textDecoration: 'underline'}}>{`${process.env.NEXT_PUBLIC_HOST}/share/${id}`}</a></Alert>}
        <Select
          label={t('model')}
          value={chatConfig.model}
          selects={[
            {value: 'gpt-4'},
            {value: 'gpt-4-1106-preview'},
            {value: 'gpt-4-vision-preview'},
            {value: 'gpt-4-32k'},
            {value: 'gpt-3.5-turbo'},
            {value: 'gpt-3.5-turbo-16k'}
          ]}
          onChange={model => setConfig(prev => ({...prev, chat: {...prev.chat, model}}))}
        />
        <Slider
          label={t('frequency_penalty')}
          value={chatConfig.frequency_penalty}
          onChange={frequency_penalty => setConfig(prev => ({...prev, chat: {...prev.chat, frequency_penalty}}))}
          min={-2.0}
          max={2.0}
          step={0.1}
        />
        <Slider
          label={t('presence_penalty')}
          value={chatConfig.presence_penalty}
          onChange={presence_penalty => setConfig(prev => ({...prev, chat: {...prev.chat, presence_penalty}}))}
          min={-2.0}
          max={2.0}
          step={0.1}
        />
        <Slider
          label={t('temperature')}
          value={chatConfig.temperature}
          onChange={temperature => setConfig(prev => ({...prev, chat: {...prev.chat, temperature}}))}
          min={0}
          max={2}
          step={0.1}
        />
        <Slider
          label={t('top_p')}
          value={chatConfig.top_p}
          onChange={top_p => setConfig(prev => ({...prev, chat: {...prev.chat, top_p}}))}
          min={0}
          max={1}
          step={0.1}
        />
        <Slider
          label={t('send_history')}
          value={typeof config.send_history === 'undefined' ? setting.send_history : config.send_history}
          onChange={send_history => setConfig(prev => ({...prev, send_history}))}
          min={0}
          max={64}
        />
      </div>
    </Dialog>}
  </>
}
