import {CircularBuffer} from "@/utils/CircularBuffer.ts";

export class WindowFilter {
    private _avg: number = 0;
    private _windowLength: number;
    private _buffer: (CircularBuffer<number> | undefined);

    constructor(window: number, buffer: CircularBuffer<number> | null = null) {
        this._windowLength = window;
        this._buffer = buffer ? buffer : new CircularBuffer<number>(window);
    }

    update(): (number | undefined) {
        let n = this._buffer?.get(0);
        if (n === undefined) {
            return undefined;
        }

        let o = this._buffer?.get(this._windowLength);

        if (o === undefined) {
            return undefined;
        }

        this._avg = this._avg + n - o;

        if (this._buffer?.size ?? 0 < this._windowLength) {
            return undefined;
        }

        return this._avg / this._windowLength;
    }
}
