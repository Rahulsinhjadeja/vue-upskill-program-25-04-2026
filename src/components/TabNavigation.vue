<template>
    <ul class="nav nav-tabs mb-4 sticky-top bg-white">
        <li class="nav-item">
            <RouterLink to="/discover" class="nav-link">Discover</RouterLink>
        </li>
        <li class="nav-item">
            <RouterLink to="/subscriptions" class="nav-link">
                Subscription
                <span v-if="subscriptionCount > 0" class="badge rounded-pill bg-primary ms-1">
                    {{ subscriptionCount }}
                </span>
            </RouterLink>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePodcastStore } from '@/store/store';

const store = usePodcastStore();

const subscriptionCount = computed((): number => store.subscribedIds.length);
</script>

<style scoped>
.nav-link.router-link-active {
    color: #0d6efd !important;
    border-color: #dee2e6 #dee2e6 #fff !important;
}
</style>
