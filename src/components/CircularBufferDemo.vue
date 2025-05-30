<script setup lang="ts">
import { ref } from 'vue';
import {CircularBuffer} from "@/utils/CircularBuffer.ts";

const buffer = ref(new CircularBuffer<number>(3, true));
const inputValue = ref('');
const message = ref('');

function enqueue() {
    try {
        buffer.value.enqueue(Number(inputValue.value));
        message.value = `Added: ${inputValue.value}`;
        inputValue.value = '';
    } catch (e) {
        message.value = e instanceof Error ? e.message : String(e);
    }
}

function dequeue() {
    const item = buffer.value.dequeue();
    message.value = item !== undefined
        ? `Removed: ${item}`
        : "Buffer is empty";
}
</script>

<template>
    <div class="demo">
        <h2>Circular Buffer Demo</h2>

        <div class="controls">
            <input
                v-model.number="inputValue"
                type="number"
                placeholder="Enter number"
            >
            <button @click="enqueue">Enqueue</button>
            <button @click="dequeue">Dequeue</button>
        </div>

        <div class="state">
            <p>Status: {{ buffer.isEmpty ? 'EMPTY' : buffer.isFull ? 'FULL' : 'READY' }}</p>
            <p>Items: {{ buffer.toArray().join(', ') }}</p>
            <p class="message">{{ message }}</p>
        </div>
    </div>
</template>

<style scoped>
.demo {
    max-width: 500px;
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid #ddd;
}
.controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.state {
    margin-top: 1rem;
}
.message {
    color: #666;
}
</style>
