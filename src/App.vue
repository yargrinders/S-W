<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobile = ref(false)
const sidebarOpen = ref(true)
const theme = ref(localStorage.getItem('sw-theme') || 'dark')

const pageTitle = computed(() => route.meta.title || 'Übersicht')
const sidebarIcon = computed(() => sidebarOpen.value ? 'ti-layout-sidebar-left-collapse' : 'ti-layout-sidebar-left-expand')
const themeIcon = computed(() => theme.value === 'dark' ? 'ti-moon' : 'ti-sun')

function syncViewport() {
  isMobile.value = window.matchMedia('(max-width: 900px)').matches
  sidebarOpen.value = isMobile.value ? false : (localStorage.getItem('sw-sidebar') || 'open') === 'open'
}
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
  if (!isMobile.value) localStorage.setItem('sw-sidebar', sidebarOpen.value ? 'open' : 'closed')
}
function closeMobile() {
  if (isMobile.value) sidebarOpen.value = false
}
function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

watch(theme, value => {
  document.documentElement.dataset.theme = value
  localStorage.setItem('sw-theme', value)
}, { immediate: true })
watch(() => route.fullPath, closeMobile)

onMounted(() => {
  syncViewport()
  window.addEventListener('resize', syncViewport)
})
onBeforeUnmount(() => window.removeEventListener('resize', syncViewport))
</script>

<template>
  <div class="app" :data-sidebar="sidebarOpen ? 'open' : 'closed'">
    <aside class="sidebar" aria-label="Hauptnavigation">
      <div class="sidebar__top">
        <RouterLink class="brand" to="/" aria-label="Schneider+Winter Elektrotechnik GmbH">
          <img class="logo logo--wide" src="/S-W/images/logo/S_W.png" alt="Schneider+Winter">
          <span class="logo logo--compact logo--text">S+W</span>
        </RouterLink>
      </div>

      <nav class="nav" aria-label="Menü">
        <RouterLink class="nav__link" to="/" title="Dashboard">
          <i class="ti ti-home" /><span>Dashboard</span>
        </RouterLink>
        <RouterLink class="nav__link" to="/apps" title="Apps">
          <i class="ti ti-apps" /><span>Apps</span>
        </RouterLink>
      </nav>

      <div class="sidebar__bottom">
        <button class="theme-toggle-sidebar" type="button" aria-label="Farbschema wechseln" @click="toggleTheme">
          <i class="ti" :class="themeIcon" /><span class="theme-label">Hell / Dunkel</span>
        </button>
        <button v-if="!isMobile" class="sidebar-toggle" type="button" aria-label="Seitenleiste ein-/ausklappen" @click="toggleSidebar">
          <i class="ti" :class="sidebarIcon" />
        </button>
      </div>
    </aside>

    <div v-if="isMobile && sidebarOpen" class="backdrop" aria-hidden="true" @click="sidebarOpen = false" />

    <main class="main">
      <header class="topbar">
        <button v-if="isMobile" class="mobile-burger" type="button" aria-label="Menü öffnen" @click="sidebarOpen = true">
          <i class="ti ti-menu-2" />
        </button>
        <div class="page-title">
          <span>Schneider+Winter Elektrotechnik</span>
          <h1>{{ pageTitle }}</h1>
        </div>
      </header>
      <RouterView />
    </main>
  </div>
</template>
