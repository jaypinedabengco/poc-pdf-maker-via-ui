import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import JsPdfBaseDemo from '@/components/JsPdfBaseDemo'
import PdfMakeViewerListDemo from '@/components/PdfMakeViewerListDemo'
import PdfMakeViewerDemo from '@/components/PdfMakeViewerDemo'
import PdfMakeCreatorDemo from '@/components/PdfMakeCreatorDemo'
import ErrorNotFound from '@/components/ErrorNotFound'
import TestPugAndSass from '@/components/TestPugAndSass'
import RecursiveComponentClient from '@/components/RecursiveComponentClient'

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
    },
    {
      path: '/pdfmake/view',
      component: PdfMakeViewerListDemo
    },
    {
      path: '/pdfmake/view/:form_name',
      name: 'pdfmakeViewerDemoCreate',
      component: PdfMakeViewerDemo
    },
    {
      path: '/pdfmake/view/:form_name/:form_id',
      name: 'pdfmakeViewerDemoEdit',
      component: PdfMakeViewerDemo
    },
    {
      path: '/pdfmake/create',
      name: 'pdfmakeCreatorDemo',
      component: PdfMakeCreatorDemo
    },
    {
      path: '/test-pug-and-scss',
      component: TestPugAndSass
    },
    {
      path: '/recursive-client-test',
      component: RecursiveComponentClient
    },
    {
      path: '/404',
      component: ErrorNotFound
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
