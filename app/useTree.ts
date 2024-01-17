import useSWR from 'swr'
import {getGPTsAction} from './action'

/** GPTs Hook */
export default () => useSWR('chatgpt list', getGPTsAction)
