import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {audioRecordsRepository} from "@/repositories/AudioRecordsRepository.ts";

const app = createApp(App)

app.use(router)

app.provide('audioRecordsRepository', audioRecordsRepository);

app.mount('#app')
