import type {AudioRecord} from './AudioRecord.ts';
import {BaseRepository} from './BaseRepository';

export class AudioRecordsRepository extends BaseRepository<{
    records: Map<string, AudioRecord>;
}> {
    private static instance: AudioRecordsRepository;

    private constructor() {
        super({
            records: new Map()
        });
        this.storageKey = 'audio-records-repository';
        this.loadFromLocalStorage();
    }

    public static getInstance(): AudioRecordsRepository {
        if (!AudioRecordsRepository.instance) {
            AudioRecordsRepository.instance = new AudioRecordsRepository();
        }
        return AudioRecordsRepository.instance;
    }

    public Add(record: AudioRecord): void {
        this.state.records.set(record.name, record);
        this.saveToLocalStorage();
    }

    public GetByName(name: string): AudioRecord | undefined {
        return this.state.records.get(name);

    }

    public GetAllKeys(): MapIterator<string> {
        return this.state.records.keys();
    }

    // public getUserById(id: string): User | undefined {
    //     return this.state.users.find(user => user.id === id);
    // }
}


// Export a singleton instance
export const audioRecordsRepository = AudioRecordsRepository.getInstance();
