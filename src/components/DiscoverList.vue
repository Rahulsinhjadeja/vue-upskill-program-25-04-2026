<template>
    <div class="container my-4">
        <div class="mb-4">
            <input type="text" class="form-control mb-3" placeholder="Search by title or host..."
                v-model="searchQuery" />

            <div class="d-flex flex-wrap gap-2 mb-3">
                <button v-for="cat in categories" :key="cat" class="btn btn-sm"
                    :class="selCat === cat ? 'btn-primary' : 'btn-outline-primary'"
                    @click="selCat = cat">
                    {{ cat }}
                </button>
            </div>

            <p class="text-muted">
                Showing {{ filteredPodcasts.length }} of {{ totalCount }} podcasts
            </p>
        </div>

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

        <div v-else-if="filteredPodcasts.length === 0" class="alert alert-info">
            No podcasts match your search
        </div>

        <div v-else class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
            <div v-for="podcast in filteredPodcasts" :key="podcast.id" class="col">
                <PodcastCard :podcast="podcast" v-hover-color="podcast.category" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { usePodcastStore } from '@/store/store';
import type { Podcast } from '@/types/types';
import PodcastCard from '@/components/PodcastCard.vue';
import { vHoverColor } from '@/directives/hoverColor';

const store = usePodcastStore();
const searchQuery = ref<string>('');
const delaySearch = ref<string>('');
const selCat = ref<string>('All');

const isLoading = computed(() => store.isLoading);
const error = computed(() => store.error);
const totalCount = computed(() => store.podcasts.length);

let timeoutId: ReturnType<typeof setTimeout>;

watch(searchQuery, (newVal: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        delaySearch.value = newVal;
    }, 300);
});

const categories = computed((): string[] => {
    const uniqueCat = new Set(store.podcasts.map((pod: Podcast) => pod.category));
    return ['All', ...Array.from(uniqueCat).sort()];
});

const filteredPodcasts = computed((): Podcast[] => {
    return store.podcasts.filter((p: Podcast) => {
        const matchesSearch = p.title.toLowerCase().includes(delaySearch.value.toLowerCase()) || p.host.toLowerCase().includes(delaySearch.value.toLowerCase());
        const matchesCat = selCat.value === 'All' || p.category === selCat.value;
        return matchesSearch && matchesCat;
    });
});

onMounted((): void => {
    if (store.podcasts.length === 0) {
        store.fetchPodcasts();
    }
});
</script>
