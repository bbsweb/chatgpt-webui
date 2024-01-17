'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useI18n} from '../../store'
import Tree from './tree'

import css from './sidebar.module.css'

export default function Sidebar () {
  const pathname = usePathname()
  const {t} = useI18n()

  return <div className={`${css.main} ${pathname === '/' ? css.full : css.close}`}>
    <Link href="/new" className={css.btn}>
      <span className="i-message-rounded-add"/>
      {t('add new chat')}
    </Link>
    <ul className={css.list}>
      <Tree/>
    </ul>
    <div className={css.footer}>
      <Link href="/setting" className={`${css.btn} i-cog`}/>
    </div>
  </div>
}
