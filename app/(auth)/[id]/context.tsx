'use client'

import {Fragment} from 'react'
import type {GPT} from '../../mongo'
import css from './context.module.css'

export default function Context ({context, onChange}: {
  context: GPT['context'],
  onChange: (_: GPT['context']) => void
}) {
  return <div className={css.main}>
    <b>上下文</b>
    {context.map((i, index) => <Fragment key={index}>
      <button className="i-plus-circle" onClick={() => {
        const copy = [...context]
        copy.splice(index, 0, {role: 'user', content: ''})
        onChange(copy)
      }}/>
      <div className={css.item}>
        <select className={css.select} value={i.role} onChange={e => {
          const copy = [...context]
          copy[index].role = e.target.value as 'system'|'user'|'assistant'
          onChange(copy)
        }}>
          <option>system</option>
          <option>user</option>
          <option>assistant</option>
        </select>
        <textarea value={i.content} onChange={e => {
          const copy = [...context]
          copy[index].content = e.target.value
          onChange(copy)
        }} className={css.input}/>
        <button className="i-trash" onClick={() => {
          const copy = [...context]
          copy.splice(index, 1)
          onChange(copy)
        }}/>
      </div>
    </Fragment>)}
    <button className="i-plus-circle" onClick={() => {
      const copy = [...context]
      copy.push({role: 'user', content: ''})
      onChange(copy)
    }}/>
  </div>
}
