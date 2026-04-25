import { defineStore } from 'pinia';
import type { Podcast, PodcastDetail, Episode, PodcastState } from '@/types/types';

export const usePodcastStore = defineStore('podcast', {
    state: (): PodcastState => ({
        podcasts: [],
        currentPodcast: null,
        episodes: [],
        isLoading: false,
        error: null,
        subscribedIds: JSON.parse(localStorage.getItem('subscriptions') || '[]')
    }),

    getters: {
        getPodcastById: (state) => {
            return (id: string): Podcast | undefined => {
                return state.podcasts.find((podcast) => podcast.id === id);
            };
        },

        totalPodcastsCount: (state): number => {
            return state.podcasts.length;
        },

        currentPodcastTitle: (state): string => {
            return state.currentPodcast ? state.currentPodcast.title : '';
        },

        subscribedPodcasts: (state): Podcast[] => {
            return state.podcasts.filter((podcast) => 
                state.subscribedIds.includes(podcast.id)
            );
        },

        sortedEpisodes: (state: PodcastState): Episode[] => {
            return [...state.episodes].sort((a, b) => 
                new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
            );
        }
    },

    actions: {
        async fetchPodcasts(): Promise<void> {
            this.$subscribe((_mutation, state) => {
                if (state.podcasts.length === 0 && !state.isLoading && !state.error) {
                    this.error = 'No podcasts found';
                }
            });

            this.isLoading = true;
            this.error = null;
            try {
                const response = await fetch('/podcasts');
                if (!response.ok) {
                    throw new Error('Failed to fetch podcasts');
                }
                const data: Podcast[] = await response.json();
                this.podcasts = data;
            } catch (err: unknown) {
                this.error = err instanceof Error ? err.message : 'An unknown error occurred';
            } finally {
                this.isLoading = false;
            }
        },

        async fetchPodcastDetail(id: string): Promise<void> {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await fetch(`/podcasts/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch podcast details');
                }
                const data: PodcastDetail = await response.json();
                this.currentPodcast = data;
            } catch (err: unknown) {
                this.error = err instanceof Error ? err.message : 'An unknown error occurred';
            } finally {
                this.isLoading = false;
            }
        },

        async fetchEpisodes(id: string): Promise<void> {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await fetch(`/podcasts/${id}/episodes`);
                if (!response.ok) {
                    throw new Error('Failed to fetch episodes');
                }
                const data: Episode[] = await response.json();
                this.episodes = data;
            } catch (err: unknown) {
                this.error = err instanceof Error ? err.message : 'An unknown error occurred';
            } finally {
                this.isLoading = false;
            }
        },

        clearCurrentPodcast(): void {
            this.currentPodcast = null;
            this.episodes = [];
        },

        toggleSubscription(podcastId: string): void {
            const index = this.subscribedIds.indexOf(podcastId);
            if (index === -1) {
                this.subscribedIds.push(podcastId);
            } else {
                this.subscribedIds.splice(index, 1);
            }
            localStorage.setItem('subscriptions', JSON.stringify(this.subscribedIds));
        }
    }
});
