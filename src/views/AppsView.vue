<script setup>
const apps = [
  {
    name: 'Einblas-Protokoll',
    description: 'PDF laden, Daten prüfen und Aufmaß sowie Materialliste als ZIP erzeugen.',
    image: '/S-W/images/logo/p-e_logo.jpg',
    to: '/einblas-protokoll',
    status: 'Aktiv',
  },
]
</script>

<template>
  <section class="sheet" aria-label="Anwendungen">
    <div class="app-body">
      <h2 class="app-title">Apps</h2>
      <p class="app-sub">Wähle eine Anwendung</p>
      <div class="app-grid">
        <RouterLink v-for="app in apps" :key="app.name" :to="app.to" class="app-card">
          <div class="app-card-thumb-placeholder">
            <img :src="app.image" class="app-card-thumb" :alt="app.name">
          </div>
          <div class="app-card-body">
            <div class="app-card-name">{{ app.name }}</div>
            <div class="app-card-desc">{{ app.description }}</div>
            <span class="app-card-badge">{{ app.status }}</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
