import { $commit } from "../store";
const $module = "oa"
export default {
  path: `/${$module}`,
  name: $module,
  component: () => import(`src/modules/${$module}/index.vue`),
  beforeEnter(to, from, next) {
    $commit("$module", $module)
    next()
  }
}