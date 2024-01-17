import {useCallback, useEffect, type CSSProperties} from 'react'

import ui from './ui.module.css'

export default ({children, onClose, loading = false, style}: {
  children: React.ReactNode
  /** 关闭回调 */
  onClose?: () => void
  /** 禁止关闭 */
  loading?: boolean
  style?: CSSProperties
}) => {
  const onClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target && onClose && !loading) onClose()
  }

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose && !loading) onClose()
    },
    [loading, onClose]
  )

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.documentElement.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown])

  return <div onClick={onClick} className={ui.dialog} style={style}>{children}</div>
}
