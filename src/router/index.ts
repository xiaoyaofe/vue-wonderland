import Vue from "vue"
import Router, { RouteConfig } from "vue-router"

Vue.use(Router)

const routes: RouteConfig[] = []
const routerContext = require.context("./", false, /\.ts$/)
routerContext.keys().forEach(route => {
  if (route.startsWith("./index")) { // 如果是根目录的 index.js 、不处理
    return
  }
  const routerModule = routerContext(route)
  /**
  * 兼容 import export 和 require module.export 两种规范
  */
  routes.push((routerModule.default || routerModule))
})

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})