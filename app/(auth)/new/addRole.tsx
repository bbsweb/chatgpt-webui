'use client'

import {useState} from 'react'
import type {Message} from '../../mongo'
import {useI18n} from '../../store'
import Dialog from '../../ui/dialog'
import {addGPTRoleAction} from '../../action'
import {Input, Select, Slider} from '../option'
import Context from '../[id]/context'

import css from './page.module.css'

export default function AddRole () {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [context, setContext] = useState<Message[]>([])
  const [config, setConfig] = useState({
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
  })
  const {t} = useI18n()

  return <>
    <button onClick={() => setOpen(true)} className={css.add}>
      <span className="i-plus"/>
      {t('add role')}
    </button>
    {open && <Dialog onClose={() => !loading && setOpen(false)}>
      <div className={css.dialog}>
        <div className={css.dialogMain}>
          <Input label={t('role name')} value={name} onChange={v => setName(v)}/>
          <Context context={context} onChange={i => setContext(i)}/>
          <Select
            label={t('model')}
            value={config.model}
            selects={[
              {value: 'gpt-4'},
              {value: 'gpt-4-1106-preview'},
              {value: 'gpt-4-vision-preview'},
              {value: 'gpt-4-32k'},
              {value: 'gpt-3.5-turbo'},
              {value: 'gpt-3.5-turbo-16k'}
            ]}
            onChange={model => setConfig({...config, model})}
          />
          <Slider
            label={t('frequency_penalty')}
            value={config.frequency_penalty}
            onChange={frequency_penalty => setConfig({...config, frequency_penalty})}
            min={-2.0}
            max={2.0}
            step={0.1}
          />
          <Slider
            label={t('presence_penalty')}
            value={config.presence_penalty}
            onChange={presence_penalty => setConfig({...config, presence_penalty})}
            min={-2.0}
            max={2.0}
            step={0.1}
          />
          <Slider
            label={t('temperature')}
            value={config.temperature}
            onChange={temperature => setConfig({...config, temperature})}
            min={0}
            max={2}
            step={0.1}
          />
          <Slider
            label={t('top_p')}
            value={config.top_p}
            onChange={top_p => setConfig({...config, top_p})}
            min={0}
            max={1}
            step={0.1}
          />
        </div>
        <div className={css.dialogAction}>
          <button disabled={loading} onClick={() => {
            setLoading(true)
            addGPTRoleAction({name, context, config}).then(() => {
              setLoading(false)
              setOpen(false)
            })
          }} style={{background: 'var(--info-bg)', color: 'var(--info)'}}>添加</button>
          <button disabled={loading} onClick={() => setOpen(false)} style={{background: 'var(--accent2)'}}>取消</button>
        </div>
      </div>
    </Dialog>}
  </>
}
