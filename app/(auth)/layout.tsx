import Provider from '../provider'
import Sidebar from './sidebar'

import css from './layout.module.css'

export default ({children}: {children: React.ReactNode}) => <div className={css.chatgpt}>
  <Provider>
    <Sidebar/>
    <div className={css.page}>{children}</div>
  </Provider>
</div>
