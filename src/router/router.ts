import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: "/discover"
    },
    {
        path: "/discover",
        component: () => import("@/components/DiscoverList.vue"),
        name: "discover-list"
    },
    {
        path: "/subscriptions",
        component: () => import("@/components/SubscriptionList.vue"),
        name: "subscription-list"
    },
    {
        path: "/podcasts/:podcastId",
        component: () => import("@/components/PodcastDetail.vue"),
        name: "podcast-detail",
        props: true
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import("@/components/NotFound.vue"),
        name: "not-found"
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
