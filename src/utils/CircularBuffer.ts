export class CircularBuffer<T> {
    private buffer: (T | undefined)[];
    private head: number = 0;
    private tail: number = 0;
    private _size: number = 0;
    private readonly capacity: number;
    private readonly overwrite: boolean;

    constructor(capacity: number, overwrite: boolean = false) {
        this.capacity = capacity;
        this.buffer = new Array(capacity);
        this.overwrite = overwrite;
    }

    // Добавление элемента (с перезаписью при необходимости)
    enqueue(item: T): void {
        if (this.isFull) {
            if (this.overwrite) {
                this.dequeue(); // Удаляем самый старый элемент
            } else {
                throw new Error("Buffer is full and overwrite is disabled");
            }
        }

        this.buffer[this.tail] = item;
        this.tail = (this.tail + 1) % this.capacity;
        this._size = Math.min(this._size + 1, this.capacity);
    }

    // Извлечение элемента
    dequeue(): T | undefined {
        if (this.isEmpty) return undefined;

        const item = this.buffer[this.head];
        this.buffer[this.head] = undefined;
        this.head = (this.head + 1) % this.capacity;
        this._size--;

        return item;
    }

    // Доступ по индексу (0 - самый старый элемент)
    get(index: number): T | undefined {
        if (index < 0 || index >= this._size) return undefined;
        const actualIndex = (this.head + index) % this.capacity;
        return this.buffer[actualIndex];
    }

    // Индексатор для синтаксиса buffer[index]
    [index: number]: T | undefined;

    // Прокси для индексатора
    private setupIndexer() {
        return new Proxy(this, {
            get(target, prop) {
                if (typeof prop === 'string' && !isNaN(parseInt(prop))) {
                    return target.get(parseInt(prop));
                }
                return (target as any)[prop];
            }
        });
    }

    // Свойства
    get size(): number { return this._size; }
    get isFull(): boolean { return this._size === this.capacity; }
    get isEmpty(): boolean { return this._size === 0; }

    // Итератор
    *[Symbol.iterator](): IterableIterator<T> {
        for (let i = 0; i < this._size; i++) {
            const item = this.get(i);
            if (item !== undefined) yield item;
        }
    }

    // Преобразование в массив
    toArray(): T[] {
        return Array.from(this);
    }

    // Очистка буфера
    clear(): void {
        this.buffer = new Array(this.capacity);
        this.head = 0;
        this.tail = 0;
        this._size = 0;
    }
}

// // Использование с индексатором
// const buffer = new CircularBuffer<number>(3, true).setupIndexer();
// buffer.enqueue(1);
// buffer.enqueue(2);
// buffer.enqueue(3);
//
// console.log(buffer[0]); // 1 (через индексатор)
// console.log(buffer.get(1)); // 2 (через метод)
// console.log([...buffer]); // [1, 2, 3] (итератор)
