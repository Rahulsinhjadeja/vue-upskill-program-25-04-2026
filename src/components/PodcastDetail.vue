<template>
    <div class="container my-4">
        <div class="mb-3">
            <button @click="router.back()" class="btn btn-danger">
                <i class="fa-solid fa-arrow-left me-2"></i>Back
            </button>
        </div>

        <div v-if="isLoading" class="row">
            <div class="col-md-4">
                <div class="card border-0 shadow-sm">
                    <div class="bg-secondary bg-opacity-25 rounded" style="height: 350px;"></div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="bg-secondary bg-opacity-25 mb-3" style="height: 48px; width: 60%;"></div>
                <div class="bg-secondary bg-opacity-25 mb-2" style="height: 24px; width: 30%;"></div>
                <div class="bg-secondary bg-opacity-25 mb-4" style="height: 20px; width: 20%;"></div>
                <div class="bg-secondary bg-opacity-25" style="height: 150px; width: 100%;"></div>
            </div>
        </div>

        <div v-else-if="error" class="alert alert-danger" role="alert">
            {{ error }}
        </div>

        <div v-else-if="!currentPodcast" class="alert alert-warning" role="alert">
            Podcast not found.
        </div>

        <div v-else class="row">
            <div class="col-md-4 mb-4">
                <div class="card shadow-sm border-0 position-relative">
                    <img :src="currentPodcast.artwork" :alt="currentPodcast.title"
                        class="card-img-top rounded shadow-sm" />
                    <i class="fa-solid fa-bell icon-bell"
                        :class="{ active: isSubscribed }"
                        @click="toggleSubscription(currentPodcast.id)"></i>
                </div>
            </div>

            <div class="col-md-8">
                <h1 class="display-5 fw-bold">{{ currentPodcast.title }}</h1>
                <p class="lead text-muted">by {{ currentPodcast.host }}</p>

                <div class="mb-3 d-flex flex-wrap gap-2 align-items-center">
                    <span class="badge bg-primary">{{ currentPodcast.category }}</span>
                    <span class="text-secondary">| {{ currentPodcast.language }}</span>
                    <span class="text-secondary">| {{ currentPodcast.totalEpisodes }} episodes</span>
                </div>

                <div class="mb-3 text-warning">
                    <span v-for="star in 5" :key="star">
                        <i v-if="star <= Math.floor(currentPodcast.rating)" class="fa-solid fa-star"></i>
                        <i v-else class="fa-regular fa-star text-muted"></i>
                    </span>
                    <span class="ms-2 text-muted small">from {{ currentPodcast.rating }}</span>
                </div>

                <p class="text-muted small mb-4">Last Updated: {{ formatDate(currentPodcast.lastUpdated) }}</p>

                <div class="mb-4">
                    <span v-for="tag in currentPodcast.tags" :key="tag"
                        class="badge rounded-pill bg-light text-dark border me-1">#{{ tag }}</span>
                </div>

                <button @click="showReportModal = true" class="btn btn-outline-danger m-3 ms-2">
                    Report Podcast
                </button>

                <div class="card shadow-sm border-0 mb-4">
                    <div class="card-body">
                        <h5 class="card-title">About</h5>
                        <div class="card-text" v-html="currentPodcast.about"></div>
                    </div>
                </div>

                <h3 class="mb-3">Episodes ({{ episodes.length }})</h3>
                <div class="list-group shadow-sm mb-3">
                    <div v-for="episode in visibleEpisodes" :key="episode.id"
                        class="list-group-item border-0 border-bottom">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1 fw-bold">{{ episode.episodeTitle }}</h6>
                                <small class="text-muted">{{ formatDate(episode.publishDate) }}</small>
                            </div>
                            <span class="badge bg-light text-dark border">{{ formatDuration(episode.duration) }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="visibleLimit < episodes.length" class="text-center">
                    <button class="btn btn-outline-primary" @click="visibleLimit += 5">
                        Show 5 more ({{ episodes.length - visibleLimit }} remaining)
                    </button>
                </div>
            </div>
        </div>
    </div>
    <ReportModal v-if="showReportModal" @close="showReportModal = false" />
</template>

<script setup lang="ts">
import "@fortawesome/fontawesome-free/css/all.css";
import { ref, computed, onMounted, onUnmounted, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePodcastStore } from '@/store/store';
import type { Episode } from '@/types/types';
import ReportModal from '@/components/ReportModal.vue';

const store = usePodcastStore();
const route = useRoute();
const router = useRouter();
const visibleLimit = ref<number>(5);
const showReportModal = ref(false);

const isLoading = computed(() => store.isLoading);
const error = computed(() => store.error);
const currentPodcast = computed(() => store.currentPodcast);
const episodes = computed(() => store.episodes);
const isSubscribed = computed(() => currentPodcast.value ? store.subscribedIds.includes(currentPodcast.value.id) : false);

const toggleSubscription = (id: string) => store.toggleSubscription(id);

provide('podcastId', route.params.podcastId);

const visibleEpisodes = computed((): Episode[] => {
    return store.sortedEpisodes.slice(0, visibleLimit.value);
});

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m} min`;
};

onMounted(async (): Promise<void> => {
    const podcastId = route.params.podcastId as string;
    if (podcastId) {
        await store.fetchPodcastDetail(podcastId);
        await store.fetchEpisodes(podcastId);
    }
});

onUnmounted((): void => {
    store.clearCurrentPodcast();
});
</script>

<style scoped>
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
