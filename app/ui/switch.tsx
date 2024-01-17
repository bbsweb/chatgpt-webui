'use client'

import {type ChangeEvent, useState} from 'react'

import css from './switch.module.css'

type Prop = {
  className?: string
  label?: string
  value?: boolean
  onChange?: (value: boolean) => void
}

/** 开关 */
export default function Switch ({className, label, value = false, onChange}: Prop) {
  const [checked, setChecked] = useState(value)
  const changeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.currentTarget.checked)
    onChange && onChange(e.currentTarget.checked)
  }

  return <label className={`${css.label} ${className}`}>
    {label && <b>{label}</b>}
    <div className={css.main}>
      <input type="checkbox" checked={checked} onChange={changeHandle}/>
      <span className={css.slider}/>
    </div>
  </label>
}
