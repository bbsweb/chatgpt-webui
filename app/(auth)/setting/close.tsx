'use client'

import {useRouter} from 'next/navigation'

import css from './page.module.css'

export default function HeaderBack () {
  const router = useRouter()

  return <button onClick={() => router.push('/chatgpt')} className={`${css.close} i-x`}/>
}
