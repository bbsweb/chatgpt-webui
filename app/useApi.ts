import type {GPT, Message} from './mongo'
import {useGPTContext} from './provider'

const decoder = new TextDecoder('utf-8')

type CompletionsProp = {
  messages: Message[]
  config: GPT['config']['chat']
  onData?: (_: string) => void
  onDone?: (_: string) => void
  /** 错误回调 */
  onError?: (_: string) => void
}

export default () => {
  const {setting} = useGPTContext()
  const {apiUrl, apiKey} = setting

  /** 创建聊天 */
  const completions = ({messages, config, onData, onDone, onError}: CompletionsProp) => {
    const controller = new AbortController()
    let text = '' // 响应文本

    fetch(`${apiUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        ...setting.chat,
        ...config,
        messages,
        stream: true
      })
    }).then(res => {
      if (res.status > 200) {
        return res.json().then(resp => onError && onError(JSON.stringify(resp, null, '  ')))
      }

      const reader = res.body!.getReader()
      // 读取流数据
      const read = (): Promise<void> => reader.read().
        then(({done, value}) => {
          if (done) {
            onDone && onDone(text)
            return
          }
          // 处理接收到的数据
          const chunk = decoder.decode(value)

          // 提取每行数据
          const lines = chunk.split('\n')

          lines.forEach(line => {
            let jsonStr = line
            if (line.startsWith('data: ')) jsonStr = line.substring(6) // 去除 'data: ' 前缀

            if (!jsonStr) return // 去除前缀后如果为 ''，则跳过

            try {
              const data = JSON.parse(jsonStr)
              text += data.choices[0].delta.content || '' // Content 可能为 undefined
              onData && onData(text)
            } catch (e) {
              if (jsonStr.trim() !== '[DONE]') console.log(e)
            }
          })

          // 继续读取下一块数据
          return read()
        }).
        catch(e => {
          if (e instanceof DOMException) { // 用户手动取消请求
            onDone && onDone(text)
          } else {
            onError && onError(e)
          }
        })

      read()
    }).catch(e => {
      if (e instanceof DOMException) { // 用户手动取消请求
        onDone && onDone(text)
      } else {
        onError && onError(e)
      }
    })

    return {
      cancel: () => controller.abort()
    }
  }

  return {
    chat: {
      completions
    }
  }
}
