'use client'

import Link from 'next/link'
import {useParams} from 'next/navigation'
import {useI18n} from '../../store'
import Square from '../../ui/skeleton/square'
import useTree from '../../useTree'

import css from './sidebar.module.css'

export default function List () {
  const params = useParams()
  const {data} = useTree()
  const {t} = useI18n()

  if (!data) return <>
    <Square customColor={css.loading}/>
    <Square customColor={css.loading}/>
    <Square customColor={css.loading}/>
  </>

  return data.map(i => <Link
    key={i._id}
    className={`${css.item} ${params.id === i._id ? css.active : ''}`.trimEnd()}
    href={`/${i._id}`}
  >
    <div className={css.itemTitle}>{i.title || t('new chat')}</div>
    {i.config.share && <span className={`${css.itemShare} i-share-alt`}/>}
  </Link>)
}
