import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AudioRecorder from "@/components/AudioRecorder.vue";
import CircularBufferDemo from "@/components/CircularBufferDemo.vue";
import ВизуализацияХуялизация from "@/views/ВизуализацияХуялизация.vue";
import ЗаписьХуяпись from "@/views/ЗаписьХуяпись.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue'),
        },
        {
            path: '/recording',
            name: 'recording',
            component: ЗаписьХуяпись
        },
        {
            path: '/visualisation',
            name: 'visualisation',
            component: ВизуализацияХуялизация
        },
        {
            path: '/circular_buffer_demo',
            name: 'circular_buffer_demo',
            component: CircularBufferDemo
        }
    ],
})

export default router
