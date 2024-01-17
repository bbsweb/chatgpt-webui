'use client'

import {useRouter} from 'next/navigation'
import {deleteGPTAction} from '../../../action'
import useTree from '../../../useTree'

import css from './header.module.css'

export default function HeaderDelete ({id}: {id: string}) {
  const router = useRouter()
  const {data, mutate} = useTree()
  const deleteGPT = () => {
    deleteGPTAction(id).then(() => {
      router.replace('/new')
      mutate(data?.filter(i => i._id !== id))
    })
  }

  return <button onClick={deleteGPT} style={{color: 'var(--error)'}} className={`${css.btn} i-trash`}/>
}
