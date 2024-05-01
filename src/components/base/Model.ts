import { IEvents } from './events';

// Проверка, является ли объект экземпляром класса Model
export const isModel = (obj: unknown): obj is Model<any> => {
	return obj instanceof Model;
};
// Абстрактный класс Model с обобщенным типом T
export abstract class Model<T> {
    
    private _data: T;
// Конструктор класса, принимающий частичные данные и интерфейс событий
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    
    get data(): T {
        return this._data;
    }

// Метод для генерации событий изменений
    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }
}
