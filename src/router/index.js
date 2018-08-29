import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import JsPdfBaseDemo from '@/components/JsPdfBaseDemo';
import PdfMakeViewerDemo from '@/components/PdfMakeViewerDemo';
import PdfMakeCreatorDemo from '@/components/PdfMakeCreatorDemo';

Vue.use(Router);

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
      path: '/pdfmake/view/:form_name',
      name: 'pdfmakeViewerDemo',
      component: PdfMakeViewerDemo
    }, 
    {
      path: '/pdfmake/create',
      name: 'pdfmakeCreatorDemo',
      component: PdfMakeCreatorDemo
    }
  ]
});
