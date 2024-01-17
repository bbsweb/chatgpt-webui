/** 节流函数 */
export default (fn: (...args: any[]) => void, ms: number, opt: {leading?: boolean} = {}) => {
  let timer: NodeJS.Timeout | null = null
  let {leading = false} = opt
  let isCancel = false

  const cancel = () => {
    isCancel = true
  }

  const throttled = (...args: any[]) => {
    if (timer) return

    if (leading) {
      fn(...args)
      leading = false
    }

    timer = setTimeout(() => {
      if (isCancel) {
        isCancel = false
        timer = null
        return
      }
      fn(...args)
      timer = null
    }, ms)
  }
  throttled.cancel = cancel

  return throttled
}
