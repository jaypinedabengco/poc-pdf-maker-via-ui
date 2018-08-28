import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import JsPdfBaseDemo from '@/components/JsPdfBaseDemo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Base',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/jspdf/base-demo',
      name: 'JspdfBaseDemo',
      component: JsPdfBaseDemo
    }
  ]
})
