<template>
    <div class="audio-recorder">
        <h2>Аудио Записи</h2>

        <!-- Кнопки управления записью -->
        <div class="controls">
            <button
                @click="toggleRecording"
                :disabled="isProcessing"
                :class="{ 'recording': isRecording }"
            >
                {{ isRecording ? '⏹ Остановить' : '⏺ Начать запись' }}
            </button>
            <button
                @click="deleteAll"
                :disabled="isProcessing || recordings.length === 0"
                class="delete-all"
            >
                🗑 Удалить все
            </button>
        </div>

        <!-- Индикатор записи -->
        <div v-if="isRecording" class="recording-indicator">
            <div class="pulse"></div>
            <span>Идёт запись...</span>
        </div>

        <!-- Список записей -->
        <div class="recordings-list">
            <div
                v-for="(recording, index) in recordings"
                :key="index"
                class="recording-item"
            >
                <audio controls :src="recording.url"></audio>
                <div class="recording-info">
                    <span>Запись {{ index + 1 }}</span>
                    <span>{{ formatDate(recording.date) }}</span>
                </div>
                <button
                    @click="deleteRecording(index)"
                    class="delete-btn"
                    :disabled="isProcessing"
                >
                    ×
                </button>
            </div>

            <div v-if="recordings.length === 0" class="empty-list">
                Нет сохранённых записей
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

interface AudioRecording {
    url: string;
    data: string; // Base64 строка
    date: Date;
}

export default defineComponent({
    name: 'AudioRecorderV2',
    data() {
        return {
            isRecording: false,
            isProcessing: false,
            mediaRecorder: null as MediaRecorder | null,
            audioChunks: [] as Blob[],
            recordings: [] as AudioRecording[],
        };
    },
    created() {
        this.loadRecordings();
    },
    methods: {
        async toggleRecording() {
            if (this.isRecording) {
                await this.stopRecording();
            } else {
                await this.startRecording();
            }
        },

        async startRecording() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({audio: true});
                this.mediaRecorder = new MediaRecorder(stream);
                this.audioChunks = [];

                this.mediaRecorder.ondataavailable = (event) => {
                    this.audioChunks.push(event.data);
                };

                this.mediaRecorder.start();
                this.isRecording = true;
            } catch (error) {
                console.error('Ошибка доступа к микрофону:', error);
                alert('Не удалось получить доступ к микрофону');
            }
        },

        async stopRecording() {
            if (!this.mediaRecorder) return;

            return new Promise<void>((resolve) => {
                this.mediaRecorder!.onstop = async () => {
                    const audioBlob = new Blob(this.audioChunks, {type: 'audio/wav'});
                    const audioUrl = URL.createObjectURL(audioBlob);

                    // Конвертируем Blob в Base64
                    const base64Data = await this.blobToBase64(audioBlob);

                    this.addRecording({
                        url: audioUrl,
                        data: base64Data,
                        date: new Date()
                    });

                    this.isRecording = false;
                    this.mediaRecorder = null;
                    resolve();
                };

                this.mediaRecorder?.stop();
                this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
            });
        },

        // Конвертация Blob в Base64
        blobToBase64(blob: Blob): Promise<string> {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    resolve(result.split(',')[1]); // Убираем префикс data:audio/wav;base64,
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        },

        // Конвертация Base64 обратно в Blob
        base64ToBlob(base64: string, type: string): Blob {
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], {type});
        },

        addRecording(recording: AudioRecording) {
            this.recordings.unshift(recording);
            this.saveRecordings();
        },

        deleteRecording(index: number) {
            this.isProcessing = true;
            URL.revokeObjectURL(this.recordings[index].url);
            this.recordings.splice(index, 1);
            this.saveRecordings();
            this.isProcessing = false;
        },

        deleteAll() {
            if (!confirm('Удалить все записи?')) return;

            this.isProcessing = true;
            this.recordings.forEach(rec => URL.revokeObjectURL(rec.url));
            this.recordings = [];
            this.saveRecordings();
            this.isProcessing = false;
        },

        saveRecordings() {
            const recordingsData = this.recordings.map(rec => ({
                data: rec.data,
                date: rec.date.toISOString()
            }));
            localStorage.setItem('audioRecordings', JSON.stringify(recordingsData));
        },

        async loadRecordings() {
            const saved = localStorage.getItem('audioRecordings');
            if (saved) {
                try {
                    const recordingsData = JSON.parse(saved);
                    this.recordings = await Promise.all(recordingsData.map(async (data: any) => {
                        const blob = this.base64ToBlob(data.data, 'audio/wav');
                        const url = URL.createObjectURL(blob);
                        return {
                            url,
                            data: data.data,
                            date: new Date(data.date)
                        };
                    }));
                } catch (e) {
                    console.error('Ошибка загрузки записей:', e);
                }
            }
        },

        formatDate(date: Date) {
            return new Date(date).toLocaleString();
        }
    },

    beforeUnmount() {
        if (this.isRecording && this.mediaRecorder) {
            this.mediaRecorder.stop();
        }
    }
});
</script>

<style scoped>
.audio-recorder {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

button {
    padding: 10px 15px;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover {
    background: #369f6b;
}

button:disabled {
    background: #cccccc;
    cursor: not-allowed;
}

button.recording {
    background: #e74c3c;
}

button.recording:hover {
    background: #c0392b;
}

.delete-all {
    background: #e74c3c;
}

.delete-all:hover {
    background: #c0392b;
}

.recording-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #e74c3c;
    margin-bottom: 20px;
}

.pulse {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e74c3c;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.3);
        opacity: 0.7;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.recordings-list {
    margin-top: 20px;
}

.recording-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
    margin-bottom: 10px;
}

.recording-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 14px;
}

.delete-btn {
    background: #e74c3c;
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.empty-list {
    text-align: center;
    color: #888;
    padding: 20px;
}
</style>
