import {MongoClient} from 'mongodb'

const client = Object.assign(new MongoClient(process.env.MONGODB_URI!, {serverSelectionTimeoutMS: 5000}), {pending: true})

/** 客户端实例 Promise */
export const _clientPromise = async () => {
  if (client.pending) {
    await client.connect()
    client.pending = false
  }
  return client
}

/**
 * 数据库实例 Promise
 *
 * @param dbName 数据库名称
 */
export const _dbPromise = (dbName?: string) => _clientPromise().then(() => client.db(dbName))
