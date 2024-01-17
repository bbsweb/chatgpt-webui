import i18next, {type ReadCallback} from 'i18next'
import setting, {defaultNS} from './setting'

/** I18next 实例初始化（客户端）*/
i18next.
  use({
    type: 'backend',
    read (l: string, n: string, cb: ReadCallback) {
      import(`./${l}/${n}.json`).then(data => cb(null, data))
    }
  }).
  init({
    ...setting,
    ns: defaultNS
  })

export default i18next
