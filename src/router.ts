import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    // import("src/views/Home.vue"),
    {
      path: "/",
      name: "home",
      component: () => import("src/modules/oa/index.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("src/modules/oa/index.vue"),
    },
    {
      path: "/oa",
      name: "oa",
      component: () => import("src/modules/oa/index.vue"),
      beforeEnter(to, from, next) {
        debugger
        console.log("next next next", this)
        next()
      }
    },
    {
      path: "/about",
      name: "about",
      component: () => import("src/views/About.vue"),
    },
    {
      path: "/apollo",
      name: "apollo",
      component: () => import("src/components/ApolloExample.vue"),
    },
    {
      path: "/order-management",
      name: "order-management",
      component: () => import("src/views/OrderManagement.vue"),
    },
    {
      path: "/zone-management",
      name: "zone-management",
      component: () => import("src/views/ZoneManagement.vue"),
    },
    {
      path: "/channel-management",
      name: "channel-management",
      component: () => import("src/views/ChannelManagement.vue"),
    },
    {
      path: "/data-query",
      name: "data-query",
      component: () => import("src/views/DataQuery.vue"),
    },

    {
      path: "/axios",
      name: "axios",
      component: () => import("src/modules/example/Axios.vue"),
    },
    {
      path: "/pixel",
      name: "pixel",
      component: () => import("src/modules/example/Pixel.vue"),
    },
    {
      path: "/authority/:component",
      name: "authority",
      component: () => import("src/modules/Authority.vue"),
    },
  ]
});
