import i18next, {type ReadCallback} from 'i18next'
import {cookies} from 'next/headers'
import setting, {defaultNS} from './setting'

/** I18next 实例初始化（服务端）*/
export default async (ns = defaultNS) => {
  const cookie = cookies().get('lang')
  const t = (key: string) => i18next.t(key, {ns})
  await i18next.
    use({
      type: 'backend',
      read (l: string, n: string, cb: ReadCallback) {
        import(`./${l}/${n}.json`).then(data => cb(null, data))
      }
    }).
    init({
      ...setting,
      lng: cookie?.value,
      ns
    })
  return {t, i18next}
}
