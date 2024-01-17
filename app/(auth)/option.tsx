import css from './option.module.css'

/** 输入框 */
export const Input = ({label, value, onChange}: {
  label: string
  value: string
  onChange: (_: string) => void
}) => <label className={css.label}>
  <b>{label}</b>
  <input className={css.input} value={value} onChange={e => onChange(e.currentTarget.value)}/>
</label>

/** 数字输入框 */
export const NumberInput = ({label, value, onChange, min, max}: {
  label: string
  value: number
  onChange: (_: number) => void
  min?: number
  max?: number
}) => <label className={css.label}>
  <b>{label}</b>
  <input value={value} onChange={e => onChange(parseInt(e.currentTarget.value, 10))} type="number" min={min} max={max} className={css.input}/>
</label>

/** 选择框 */
export const Select = ({label, value, selects, onChange}: {
  label: string
  /** 初始选中项 */
  value: string
  /** 选择项 */
  selects: {
    value: string
    label?: string
  }[]
  onChange: (i: string) => void
}) => <label className={css.label}>
  <b>{label}</b>
  <select className={css.input} value={value} onChange={e => onChange(e.currentTarget.value)}>
    {selects.map(i => <option key={i.value} value={i.value}>{i.label || i.value}</option>)}
  </select>
</label>

/** 滑动框 */
export const Slider = ({label, value, onChange, min, max, step}: {
  label: string
  value: number
  onChange: (_: number) => void
  min: number
  max: number
  step?: number
}) => {
  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value
    if (v) {
      const num = parseFloat(v)
      if (num < min) onChange(min)
      else if (num > max) onChange(max)
      else onChange(num)
    } else {
      onChange(value)
    }
  }

  return <label className={css.label}>
    <b>{label}</b>
    <div className={css.slider}>
      <input value={value} onChange={changeHandle} className={css.sliderInput} type="number" step={step}/>
      <input value={value} onChange={changeHandle} className={css.sliderRange} type="range" min={min} max={max} step={step}/>
    </div>
  </label>
}
