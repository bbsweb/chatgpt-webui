import type {Metadata} from 'next'
import i18n from '../../i18n'
import Client from './client'
import Close from './close'

import css from './page.module.css'

export const generateMetadata = async (): Promise<Metadata> => {
  const {t} = await i18n()
  return {title: t('chatgpt setting')}
}

export default async () => {
  const {t} = await i18n()
  return <>
    <div className={css.header}>
      <h1>{t('setting')}</h1>
      <Close/>
    </div>
    <div className={css.main}>
      <Client/>
    </div>
  </>
}
