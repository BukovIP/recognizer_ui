import { describe, expect, it } from 'vitest'
import { CircularBuffer } from '@/utils/CircularBuffer'

describe('CircularBuffer', () => {
    describe('Базовые операции', () => {
        it('должен корректно добавлять и извлекать элементы', () => {
            const buffer = new CircularBuffer<number>(3)
            buffer.enqueue(1)
            buffer.enqueue(2)
            expect(buffer.dequeue()).toBe(1)
            expect(buffer.dequeue()).toBe(2)
        })

        it('должен возвращать undefined при извлечении из пустого буфера', () => {
            const buffer = new CircularBuffer<number>(2)
            expect(buffer.dequeue()).toBeUndefined()
        })
    })

    describe('Режим перезаписи', () => {
        it('должен перезаписывать старые элементы при переполнении', () => {
            const buffer = new CircularBuffer<number>(3, true)
            buffer.enqueue(1)
            buffer.enqueue(2)
            buffer.enqueue(3)
            buffer.enqueue(4) // Перезаписывает 1

            expect(buffer.toArray()).toEqual([2, 3, 4])
            expect(buffer.dequeue()).toBe(2)
        })

        it('должен корректно обрабатывать последовательную перезапись', () => {
            const buffer = new CircularBuffer<number>(2, true)
            buffer.enqueue(1)
            buffer.enqueue(2)
            buffer.enqueue(3) // [2, 3]
            buffer.enqueue(4) // [3, 4]

            expect(buffer.toArray()).toEqual([3, 4])
        })

        it('должен выбрасывать ошибку при переполнении без перезаписи', () => {
            const buffer = new CircularBuffer<number>(2)
            buffer.enqueue(1)
            buffer.enqueue(2)
            expect(() => buffer.enqueue(3)).toThrow("Buffer is full")
        })
    })

    describe('Доступ по индексу', () => {
        it('должен возвращать элементы по индексу', () => {
            const buffer = new CircularBuffer<number>(3)
            buffer.enqueue(10)
            buffer.enqueue(20)
            buffer.enqueue(30)

            expect(buffer.get(0)).toBe(10)
            expect(buffer.get(1)).toBe(20)
            expect(buffer.get(2)).toBe(30)
        })

        it('должен возвращать undefined для невалидных индексов', () => {
            const buffer = new CircularBuffer<number>(2)
            buffer.enqueue(1)

            expect(buffer.get(-1)).toBeUndefined()
            expect(buffer.get(1)).toBeUndefined()
        })

        it('должен корректно работать с индексами после перезаписи', () => {
            const buffer = new CircularBuffer<number>(3, true)
            buffer.enqueue(1)
            buffer.enqueue(2)
            buffer.enqueue(3)
            buffer.enqueue(4) // [2, 3, 4]

            expect(buffer.get(0)).toBe(2)
            expect(buffer.get(1)).toBe(3)
            expect(buffer.get(2)).toBe(4)
        })
    })

    describe('Итерация и преобразование', () => {
        it('должен корректно работать с for...of', () => {
            const buffer = new CircularBuffer<number>(3)
            buffer.enqueue(1)
            buffer.enqueue(2)

            const items = []
            for (const item of buffer) {
                items.push(item)
            }

            expect(items).toEqual([1, 2])
        })

        it('должен преобразовываться в массив', () => {
            const buffer = new CircularBuffer<string>(2)
            buffer.enqueue('a')
            buffer.enqueue('b')

            expect(buffer.toArray()).toEqual(['a', 'b'])
        })
    })

    describe('Edge-кейсы', () => {
        it('должен корректно обрабатывать буфер размером 1', () => {
            const buffer = new CircularBuffer<number>(1, true)
            buffer.enqueue(1)
            buffer.enqueue(2)

            expect(buffer.toArray()).toEqual([2])
            expect(buffer.dequeue()).toBe(2)
            expect(buffer.isEmpty).toBe(true)
        })

        it('должен корректно работать после очистки', () => {
            const buffer = new CircularBuffer<number>(2)
            buffer.enqueue(1)
            buffer.clear()

            expect(buffer.isEmpty).toBe(true)
            expect(buffer.toArray()).toEqual([])
        })
    })
})
