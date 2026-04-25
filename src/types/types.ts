export interface Podcast {
  id: string;
  title: string;
  host: string;
  artwork: string;
  category: string;
}

export interface PodcastDetail extends Podcast {
  language: string;
  totalEpisodes: number;
  rating: number;
  lastUpdated: string;
  tags: string[];
  about: string;
}

export interface Episode {
  id: string;
  episodeTitle: string;
  duration: number;
  publishDate: string;
}

export interface PodcastState {
  podcasts: Podcast[];
  currentPodcast: PodcastDetail | null;
  episodes: Episode[];
  isLoading: boolean;
  error: string | null;
  subscribedIds: string[];
}

export interface Report {
    podcastId: number;
    reason: string;
    description: string;
    email?: string;
    severity: string;
    agreement: boolean;
}