'use client'

import {useRouter} from 'next/navigation'
import {useI18n} from '../../store'
import {addGPTAction} from '../../action'
import useTree from '../../useTree'

import css from './page.module.css'

export default function Card () {
  const router = useRouter()
  const {t} = useI18n()
  const {mutate} = useTree()

  const clickHandle = () => {
    addGPTAction({}).then(_id => {
      router.push(`/${_id}`)
      mutate()
    })
  }

  return <>
    <div className={css.card}>
      <button className={css.btn} onClick={clickHandle}>
        <span className="i-message-rounded-add"/>
        {t('chat')}
      </button>
    </div>
    <div className={css.card}>
      <button className={css.btn} disabled style={{opacity: '.5'}}>
        <span className="i-microphone"/>
        {t('audio')}
      </button>
    </div>
    <div className={css.card}>
      <button className={css.btn} disabled style={{opacity: '.5'}}>
        <span className="i-image"/>
        {t('image')}
      </button>
    </div>
  </>
}
