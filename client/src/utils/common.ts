import type { Result } from '../../typings'
import { ElMessage } from 'element-plus'

export const assertSuccess = <T>(result: Result<T>) => {
  return new Promise<Result<T>>((resolve, reject) => {
    if (result.code == 200) {
      ElMessage.success({ message: '操作成功' })
      resolve(result)
    }
    reject(result)
  })
}
