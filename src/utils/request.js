import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = 'JWT' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const code = response.status
    if (code < 200 || code >= 400) {
      Message({
        message: '错误',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    let code
    try {
      code = error.code
    } catch (e) {
      if (error.toString().indexOf('timeout')) {
        Message({
          message: '请求超时',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(error)
      }
    }
    if (code === 401) {
      MessageBox.confirm('您已注销，您可以取消以停留在此页，或重新登录', '确认注销', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
  }
)
export default service

// const res = response.data
// if the custom code is not 200, it is judged as an error.
// if (res.code !== 200) {
//   Message({
//     message: res.message || 'Error',
//     type: 'error',
//     duration: 5 * 1000
//   })
//
//   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//     // to re-login
//     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//       confirmButtonText: 'Re-Login',
//       cancelButtonText: 'Cancel',
//       type: 'warning'
//     }).then(() => {
//       store.dispatch('user/resetToken').then(() => {
//         location.reload()
//       })
//     })
//   }
//   return Promise.reject(new Error(res.message || 'Error'))
// } else {
//   return res
// }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )
// export default service
