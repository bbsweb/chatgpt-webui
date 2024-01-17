'use client'

import {useRouter} from 'next/navigation'

import css from './header.module.css'

export default function HeaderBack () {
  const router = useRouter()

  return <button onClick={() => router.push('/chatgpt')} className={`${css.btn} i-x`}/>
}
