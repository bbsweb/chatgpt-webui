import {ObjectId, type UpdateFilter} from 'mongodb'
import {_dbPromise} from './_promise'

export type Message = {
  role: 'system'|'user'|'assistant'
  content: string
}

export type GPTConfig = {
  model: string
  frequency_penalty: number
  presence_penalty: number
  temperature: number
  top_p: number
}

/** 对话 */
export type GPT = {
  type: 1
  sub_type: 0
  title?: string
  context: Message[]
  config: {
    chat?: {}
    share?: boolean
    send_history?: number
  }
}
/** 新建对话 */
export type AddGPT = {
  title?: string
  context?: Message[]
  config?: {
    chat?: GPTConfig
    share?: boolean
    send_history?: number
  }
}
/** 更新对话 */
export type UpdateGPT = UpdateFilter<GPT>

/** 对话消息 */
export type GPTChat = Message
/** 新建对话消息 */
export type AddGPTChat = Message
/** 更新对话消息 */
export type UpdateGPTChat = {
  content: string
}

/** GPT 设置 */
export type GPTSetting = {
  type: 2
  content: string
}

/** 预设角色 */
export type GPTRole = {
  type: 3
  name: string
  /** 上下文 */
  context: Message[]
  /** 配置 */
  config: GPTConfig
}

export type AddGPTRole = {
  name: string
  /** 上下文 */
  context: Message[]
  /** 配置 */
  config: GPTConfig
}

export default {
  /** 获取对话 */
  getGPT: (id: string) => _dbPromise().
    then(db => ObjectId.isValid(id) ? db.collection<GPT>('chatgpt').findOne({_id: new ObjectId(id), type: 1}) : null),
  /** 获取所有对话 */
  getGPTs: () => _dbPromise().
    then(db => db.collection<GPT>('chatgpt').find({type: 1})).
    then(cursor => cursor.toArray()),
  /** 获取分享对话 */
  getShareGpt: (id: string) => _dbPromise().
    then(db => ObjectId.isValid(id) ? db.collection<GPT>('chatgpt').findOne({_id: new ObjectId(id), type: 1, 'config.share': true}) : null),
  /** 更新对话 */
  updateGPT: (id: string, gpt: UpdateGPT) => _dbPromise().
    then(db => db.collection<GPT>('chatgpt').updateOne({_id: new ObjectId(id), type: 1}, {$set: gpt})),
  /** 添加对话 */
  addGPT: (gpt: AddGPT) => _dbPromise().
    then(db => db.collection('chatgpt').insertOne({...gpt, type: 1})),
  /** 删除对话 */
  deleteGPT: async (id: string) => {
    const db = await _dbPromise()
    const _id = new ObjectId(id)
    await db.collection('chatgpt').deleteOne({_id})
    await db.collection('chatgpt').deleteMany({gpt_id: _id})
  },

  /** 获取对话消息 */
  getGPTChats: (id: string) => _dbPromise().
    then(db => db.collection<GPTChat>('chatgpt').find({gpt_id: new ObjectId(id)}, {projection: {gpt_id: 0}})).
    then(cursor => cursor.toArray()),
  /** 新建对话消息 */
  addGPTChat: (id: string, chat: AddGPTChat) => _dbPromise().
    then(db => db.collection('chatgpt').insertOne({...chat, gpt_id: new ObjectId(id)})),
  /** 更新对话消息 */
  updateGPTChat: (id: string, chat: UpdateGPTChat) => _dbPromise().
    then(db => db.collection('chatgpt').updateOne({_id: new ObjectId(id)}, {$set: chat})),

  /** 获取用户设置 */
  getGPTSetting: () => _dbPromise().
    then(db => db.collection<GPTSetting>('chatgpt').findOne({type: 2})),
  /** 更新用户设置 */
  updateGPTSetting: (content: string) => _dbPromise().
    then(db => db.collection<GPTSetting>('chatgpt').updateOne({type: 2}, {$set: {content}}, {upsert: true})),

  /** 获取所有角色 */
  getGPTRoles: () => _dbPromise().
    then(db => db.collection<GPTRole>('chatgpt').find({type: 3}, {projection: {name: 1}})).
    then(cursor => cursor.toArray()),
  /** 获取角色 */
  getGPTRole: (id: string) =>  _dbPromise().
    then(db => ObjectId.isValid(id) ? db.collection<GPTRole>('chatgpt').findOne({_id: new ObjectId(id)}) : null),
  /** 添加角色 */
  addGPTRole: (role: AddGPTRole) => _dbPromise().
    then(db => db.collection<GPTRole>('chatgpt').insertOne({...role, type: 3})),
  /** 更新角色 */
  updateGPTRole: (id: string, role: AddGPTRole) => _dbPromise().
    then(db => db.collection<GPTRole>('chatgpt').updateOne({_id: new ObjectId(id), type: 3}, {$set: role})),
  /** 删除角色 */
  deleteGPTRole: (id: string) => _dbPromise().
    then(db => db.collection<GPTRole>('chatgpt').deleteOne({_id: new ObjectId(id)}))
}
