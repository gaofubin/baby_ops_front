import request from '@/utils/request'

export function UserList(params) {
  return request({
    url: '/api/users/',
    method: 'get',
    params
  })
}

export function UserAdd(data) {
  return request({
    url: 'api/users/',
    method: 'post',
    data
  })
}

export function UserDel(id, data) {
  return request({
    url: `api/users/${id}/`,
    method: 'delete',
    data
  })
}

export function UserEdit(id, data) {
  return request({
    url: `api/users/${id}/`,
    method: 'put',
    data
  })
}

export function ShowEditId(id, data) {
  return request({
    url: `api/users/${id}/`,
    method: 'get',
    data
  })
}

export function modifyUserState(id, data) {
  return request({
    url: `api/users/${id}/`,
    method: 'put',
    data
  })
}
