<script setup lang="ts">
import { RouterView } from 'vue-router';
import TabNavigation from './components/TabNavigation.vue';

</script>

<template>
  <div id="app">
    <header class="app-header">
      <h1 class="app-title">🎧 PodStream</h1>
      <nav class="tab-nav">
      </nav>
    </header>

    <main class="app-content">
        <TabNavigation></TabNavigation>
        <RouterView></RouterView>
    </main>
  </div>
</template>

<style scoped>
.app-header {
  background-color: var(--color-primary);
  color: white;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}
.app-title { margin: 0 0 0.75rem 0; font-size: 1.5rem; }
.tab-nav { display: flex; gap: 1rem; }
.tab-nav a {
  color: rgba(255,255,255,0.7); text-decoration: none;
  padding: 0.5rem 1rem; border-radius: 6px; transition: all 0.2s;
}
.tab-nav a:hover { color: white; background-color: rgba(255,255,255,0.1); }
.tab-nav a.router-link-active {
  color: white; background-color: rgba(255,255,255,0.2); font-weight: 600;
}
.app-content { max-width: 1200px; margin: 0 auto; padding: 2rem; }
</style>