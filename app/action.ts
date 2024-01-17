'use server'

import {revalidatePath} from 'next/cache'
import db, {type AddGPTRole, type AddGPT, type AddGPTChat, type UpdateGPT} from './mongo'

/** 获取 Session */
export const getSession = async () => {
  // 二次开发
}

export const getGPTsAction = () => getSession().
  then(() => db.getGPTs()).
  then(gpts => gpts.map(gpt => ({...gpt, _id: gpt._id.toString()})))

export const addGPTAction = (gpt: AddGPT) => getSession().
  then(() => db.addGPT({context: [], config: {}, ...gpt})).
  then(res => res.insertedId.toString())

export const addGPTByRoleAction = (id: string) => getSession().
  then(() => db.getGPTRole(id)).
  then(role => {
    if (role) {
      return db.addGPT({title: role.name, context: role.context, config: {chat: role.config}})
    }
    throw new Error('role not exist')
  }).
  then(res => res.insertedId.toString())

export const updateGPTAction = (id: string, gpt: UpdateGPT) => getSession().
  then(() => db.updateGPT(id, gpt)).
  then(() => revalidatePath(`/${id}`))

export const deleteGPTAction = (id: string) => getSession().
  then(() => db.deleteGPT(id))

export const addGPTChatAction = (id: string, chat: AddGPTChat) => getSession().
  then(() => db.getGPT(id)).
  then(gpt => {
    if (gpt) {
      return db.addGPTChat(id, chat).then(res => {
        revalidatePath(`/${id}`)
        return {_id: res.insertedId.toString(), ...chat}
      })
    }
    throw new Error('chat not exist')
  })

export const updateGPTChatAction = (id: string, gptId: string, content: string) => getSession().
  then(() => db.updateGPTChat(id, {content})).
  then(() => revalidatePath(`/${gptId}`))

export const getGPTRoleAction = (id: string) => getSession().
  then(() => db.getGPTRole(id)).
  then(role => role ? {...role, _id: role._id.toString()} : role)

export const addGPTRoleAction = (role: AddGPTRole) => getSession().
  then(() => db.addGPTRole(role)).
  then(() => revalidatePath('/new'))

export const updateGPTRoleAction = (id: string, role: AddGPTRole) => getSession().
  then(() => db.updateGPTRole(id, role)).
  then(() => revalidatePath('/new'))

export const deleteGPTRoleAction = (id: string) => getSession().
  then(() => db.deleteGPTRole(id)).
  then(() => revalidatePath('/new'))

export const getSettingAction = () => getSession().
  then(() => db.getGPTSetting()).
  then(res => {
    if (res) {
      return {...res, _id: res._id.toString()}
    }
    return null
  })

export const updateSettingAction = (content: string) => getSession().
  then(() => db.updateGPTSetting(content)).
  then(() => revalidatePath('/setting'))
