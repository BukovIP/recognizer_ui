// src/repositories/BaseRepository.ts
import {reactive} from 'vue';

export abstract class BaseRepository<T> {
    protected state: T;
    protected storageKey: string | null = null;

    constructor(initialState: T) {
        this.state = reactive(initialState as object) as T;
    }

    public getState(): T {
        return this.state;
    }

    protected saveToLocalStorage(): void {
        if (this.storageKey) {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        }
    }

    protected loadFromLocalStorage(): void {
        if (this.storageKey) {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                Object.assign(this.state as object, JSON.parse(data));
            }
        }
    }

    public clearStorage(): void {
        if (this.storageKey) {
            localStorage.removeItem(this.storageKey);
        }
    }
}
