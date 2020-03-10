import Cookies from 'js-cookie'

const TokenKey = 'oops'

export function getToken() {
  return Cookies.get(TokenKey)
}

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: 1 })
  } else {
    return Cookies.set(TokenKey, token)
  }
}
