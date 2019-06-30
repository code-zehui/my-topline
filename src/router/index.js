import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
import { getUser } from '@/utils/auth'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/home')
        },
        {
          path: 'publish',
          name: 'publish',
          component: () => import('@/views/publish')
        },
        {
          path: 'publish:id',
          name: 'publish-edit',
          component: () => import('@/views/publish')
        },
        {
          path: 'articleList',
          name: 'articleList',
          component: () => import('@/views/articleList')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login')
    }
  ]
})

router.beforeEach((to, from, next) => {
  nprogress.start()
  const userInfo = getUser()
  if (to.path !== '/login') {
    if (!userInfo) {
      if (from.path === '/login') {
        nprogress.done()
      }
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    if (!userInfo) {
      next()
    } else {
      next({ name: 'home' })
      window.location.reload()
    }
  }
})

router.afterEach((to, from) => {
  nprogress.done()
})

export default router
