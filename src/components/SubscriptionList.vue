<template>
    <div class="container my-4">
        <div v-if="isLoading" class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
            <div v-for="n in 6" :key="n" class="col">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="bg-secondary bg-opacity-25" style="height: 200px;"></div>
                    <div class="card-body">
                        <div class="bg-secondary bg-opacity-25 mb-2" style="height: 24px; width: 80%;"></div>
                        <div class="bg-secondary bg-opacity-25 mb-3" style="height: 16px; width: 50%;"></div>
                        <div class="bg-secondary bg-opacity-25" style="height: 20px; width: 30%;"></div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="error" class="alert alert-danger" role="alert">
            {{ error }}
        </div>

        <div v-else-if="subscribedPodcasts.length === 0" class="text-center py-5">
            <p>No subscriptions yet. Discover podcasts to subscribe.</p>
        </div>

        <div v-else class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
            <div v-for="podcast in subscribedPodcasts" :key="podcast.id" class="col">
                <PodcastCard :podcast="podcast" v-hover-color="podcast.category" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { usePodcastStore } from '@/store/store';
import PodcastCard from '@/components/PodcastCard.vue';
import { vHoverColor } from '@/directives/hoverColor';

const store = usePodcastStore();

const isLoading = computed(() => store.isLoading);
const error = computed(() => store.error);
const subscribedPodcasts = computed(() => store.subscribedPodcasts);

onMounted((): void => {
    if (store.podcasts.length === 0) {
        store.fetchPodcasts();
    }
});
</script>
