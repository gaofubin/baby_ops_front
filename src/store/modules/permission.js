import { constantRoutersMap } from '@/router'
import Layout from '@/layout'

const permission = {
  state: {
    routes: constantRoutersMap,
    addRoutes: []
  },
  mutations: {
    SET_ROUTERS: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutersMap.concat(routes)
    }
  },
  actions: {
    GenerateRouters({ commit }, asyncRouter) {
      commit('SET_ROUTERS', asyncRouter)
    }
  }
}

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = routers.filter(router => {
    if (router.id) {
      // if (!router.children.length) {
      //   router.hidden = true
      // }
    }
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
        console.log(typeof router.component)
      }
    }
    if (router.alwaysShow === 'true') {
      router.alwaysShow = true
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
  return accessedRouters
}
export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

export default permission
