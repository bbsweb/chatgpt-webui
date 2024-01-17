import {cache} from 'react'
import type {Metadata} from 'next'
import db from '../../mongo'
import i18n from '../../i18n'
import AddRole from './addRole'
import Card from './card'
import Role from './role'

import css from './page.module.css'

const getGPTRoles = cache(() => db.getGPTRoles())

export const generateMetadata = async (): Promise<Metadata> => {
  const {t} = await i18n()
  return {title: t('add new chat')}
}

export default async () => {
  const roles = await getGPTRoles()
  const {t} = await i18n()
  return <div style={{overflow: 'auto'}}>
    <h1 style={{textAlign: 'center'}}>{t('start')}</h1>
    <div className={css.cards}>
      <Card/>
    </div>
    <h1  style={{textAlign: 'center'}}>{t('select role')}</h1>
    <div className={css.roles}>
      <AddRole/>
      {roles.map(role => <Role
        key={role._id.toString()}
        id={role._id.toString()}
        defaultName={role.name}
      />)}
    </div>
  </div>
}
