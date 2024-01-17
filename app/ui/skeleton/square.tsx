import css from './skeleton.module.css'

/** 方形骨架 */
export default ({
  className,
  customColor,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {customColor?: string}) => <div className={`${css.anime} ${customColor || css.square} ${className || ''}`.trimEnd()} {...props}/>
