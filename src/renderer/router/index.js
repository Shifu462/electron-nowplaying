import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: require('@/components/Welcome').default
    },
    {
      path: '/main',
      name: 'main',
      component: require('@/components/MainWindow').default
    }
  ]
})
