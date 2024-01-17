import _chatgpt from './_chatgpt'

const _db = {..._chatgpt}
const db = process.env.NODE_ENV === 'development' ? (globalThis as typeof globalThis & {_mongoDb: typeof _db})._mongoDb ??= _db : _db
export default db

export type {Message, GPT, AddGPT, UpdateGPT, GPTChat, AddGPTChat, GPTRole, AddGPTRole} from './_chatgpt'
