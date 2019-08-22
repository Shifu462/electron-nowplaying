import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: require('@/components/Root').default
    },
    {
      path: '/main',
      name: 'main',
      component: require('@/components/Main').default
    }
  ]
})
