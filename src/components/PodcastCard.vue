<template>
    <div class="card h-100 shadow-sm">
        <div class="position-relative">
            <img :src="podcast.artwork" :alt="podcast.title" class="card-img-top"
                style="height: 200px; object-fit: cover;" />
            <i ref="heartRef" class="fa-solid fa-bell icon-bell" :class="{ active: isSubscribed }"
                data-bs-toggle="tooltip" data-bs-placement="top" title="Click to subscribe!"
                @click="toggleSubscription(podcast.id)"></i>
        </div>

        <div class="card-body d-flex flex-column justify-content-between">
            <div>
                <RouterLink :to="'/podcasts/' + podcast.id">
                    <h5 class="card-title text-truncate">{{ podcast.title }}</h5>
                </RouterLink>
                <p class="card-text text-muted mb-3">Host: {{ podcast.host }}</p>
            </div>
            <div>
                <span class="badge bg-secondary" :class="'badge-' + podcast.category.toLowerCase()">
                    {{ podcast.category }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import "@fortawesome/fontawesome-free/css/all.css";
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Tooltip } from 'bootstrap';
import { usePodcastStore } from '@/store/store';
import type { Podcast } from '@/types/types';

const props = defineProps<{
    podcast: Podcast;
}>();

const store = usePodcastStore();
const heartRef = ref<HTMLElement | null>(null);
let tooltipInstance: Tooltip | null = null;

const isSubscribed = computed((): boolean => {
    return store.subscribedIds.includes(props.podcast.id);
});

const toggleSubscription = (id: string): void => {
    store.toggleSubscription(id);
};

onMounted(() => {
    if (heartRef.value) {
        tooltipInstance = new Tooltip(heartRef.value);
    }
});

onUnmounted(() => {
    tooltipInstance?.dispose();
});
</script>

<style scoped>
.card {
    margin-bottom: 20px;
}

.icon-bell {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 1.2rem;
    color: #ffd000;
    transition: color 0.3s ease;
    background: rgb(255, 255, 255);
    padding: 8px;
    border-radius: 50%;
}

.icon-bell.active {
    background: rgb(234, 0, 255);
}
</style>
