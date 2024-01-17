'use client'

import {useEffect, useState} from 'react'
import {updateGPTAction} from '../../../action'
import {useI18n} from '../../../store'
import useTree from '../../../useTree'

import css from './header.module.css'

type Prop = {
  id: string
  title?: string
}

export default function HeaderTitle ({id, title}: Prop) {
  const [value, setValue] = useState(title)
  const {t} = useI18n()
  const {mutate} = useTree()

  useEffect(() => {
    const update = setTimeout(() => {
      if (value !== title) updateGPTAction(id, {title: value}).then(() => mutate())
    }, 500)
    return () => clearTimeout(update)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, id])

  return <input value={value} onChange={e => setValue(e.currentTarget.value)} className={css.title} placeholder={t('title placeholder')}/>
}
