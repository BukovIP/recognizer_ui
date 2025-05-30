<template>
    <div>
        <button @click="startRecording" :disabled="isRecording">Начать запись</button>
        <button @click="stopRecording" :disabled="!isRecording">Остановить запись</button>
        <audio v-if="audioUrl" :src="audioUrl" controls></audio>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isRecording: false,
            mediaRecorder: null,
            audioChunks: [],
            audioUrl: null
        }
    },
    methods: {
        async startRecording() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);
                this.audioChunks = [];

                this.mediaRecorder.ondataavailable = event => {
                    this.audioChunks.push(event.data);
                };

                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                    this.audioUrl = URL.createObjectURL(audioBlob);
                    stream.getTracks().forEach(track => track.stop());
                };

                this.mediaRecorder.start();
                this.isRecording = true;
            } catch (error) {
                console.error('Ошибка доступа к микрофону:', error);
            }
        },
        stopRecording() {
            if (this.mediaRecorder && this.isRecording) {
                this.mediaRecorder.stop();
                this.isRecording = false;
            }
        }
    },
    beforeUnmount() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
        }
    }
}
</script>
