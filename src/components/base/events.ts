// Определение типа EventName как строки или регулярного выражения
type EventName = string | RegExp;

// Определение типа Subscriber как функции
type Subscriber = Function;

// Определение структуры EmitterEvent
type EmitterEvent = {
    eventName: string;
    data: unknown;
};

// Определение интерфейса IEvents с методами для работы с событиями
export interface IEvents {
    on<T extends object>(event: string, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

// Реализация класса EventEmitter, который реализует интерфейс IEvents
class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    // Конструктор для инициализации карты _events
    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    // Метод для подписки на определенное событие
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        // Создание нового набора подписчиков, если событие не существует в карте
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        // Добавление функции обратного вызова в набор подписчиков для события
        this._events.get(eventName)?.add(callback);
    }

    // Метод для отписки от определенного события
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            // Удаление функции обратного вызова из набора подписчиков
            this._events.get(eventName)!.delete(callback);
            // Если больше нет подписчиков для события, удалить событие из карты
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    // Метод для генерации события с опциональными данными
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            // Проверка, совпадает ли имя события с текущим событием в карте
            if (
                (name instanceof RegExp && name.test(eventName)) ||
                name === eventName
            ) {
                // Вызов функции обратного вызова каждого подписчика с данными
                subscribers.forEach((callback) => callback(data));
            }
        });
    }

    // Метод для подписки на все события
    onAll(callback: (event: EmitterEvent) => void) {
        this.on('*', callback);
    }

    // Метод для отписки от всех событий
    offAll() {
        // Сброс карты _events до пустой карты
        this._events = new Map<string, Set<Subscriber>>();
    }

    // Метод для вызова события с контекстными данными
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            // Генерация события с объединенными данными из события и контекста
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {}),
            });
        };
    }
}

// Экспорт экземпляра класса EventEmitter
export default new EventEmitter();
