import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import DashboardView from './views/DashboardView.vue'
import AppsView from './views/AppsView.vue'
import EpView from './views/EpView.vue'
import './assets/main.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView, meta: { title: 'Übersicht' } },
    { path: '/apps', name: 'apps', component: AppsView, meta: { title: 'Apps' } },
    { path: '/einblas-protokoll', name: 'ep', component: EpView, meta: { title: 'Einblas-Protokoll' } },
  ],
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'Portal'} — Schneider+Winter`
})

createApp(App).use(router).mount('#app')
