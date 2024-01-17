import ui from './ui.module.css'

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: string
  /** 轮廓 */
  outline?: boolean
}

const colorType: {[key: string]: string} = {
  primary: ui.primary,
  info: ui.info,
  success: ui.success,
  warn: ui.warn,
  error: ui.error
}

/** 消息条 */
export default ({
  type = '',
  outline,
  className,
  children,
  ...props
}: AlertProps) => <div
  {...props}
  className={`${ui.alert} ${colorType[type] || ''} ${outline ? ui.outline : ''} ${className || ''}`.trim()}
>{children}</div>
