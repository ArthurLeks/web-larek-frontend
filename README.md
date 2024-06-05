# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


# Архитектура приложения

## Базовый код (базовые классы)

### class Api 

Отвечает за работу с сервером.

Конструктор класса:

baseUrl: string - url сервера для отправки запросов
options: RequestInit - объект настроек

Методы класса:

handleResponse(response: Response): Promise<object> - обрабатывает ответ от сервера
get(uri: string) - выполняет get запрос
post(uri: string, data: object, method: ApiPostMethods = 'POST') - выполняет post запрос


### Класс EventEmitter

Брокер событий, отвечает за работу с событиями. Позволяет создавать, удалять, вызывать события.

Методы класса:

on - Установить обработчик на событие
off - Снять обработчик с события
emit - Инициировать событие с данными
onAll - Слушать все события
offAll - Сбросить все обработчики
trigger - Сделать коллбек триггер, генерирующий событие при вызове

### Класс Component 

Абстрактный класс, служит для работы с DOM элементами в компонентах view слоя.
Класс является дженериком и принимает в переменной T тип данных представлюящий собой информацию которая нужна конкретному компоненту.
Содержит методы по работе с различными аттрибутами HTML элементов.

### Класс Model

Абстрактный класс, чтобы можно было отличить ее от простых объектов с данными.
Класс является дженериком и принимает в переменной T тип данных представлюящий собой информацию которую будет содержать модель.

Методы класса:

emitChanges(event: string, payload?: object) - Сообщить что модель поменялась

## Компоненты отображения


### Класс Form

Служит общим классом для форм в проекте.

Поля класса:

_submit: HTMLButtonElement;
_errors: HTMLElement;

Методы класса:

set valid(value: boolean) - для установки/снятия атрибута disabled кнопки отправки формы
set errors(value: string) - для установки текста в контейнер с ошибкой
onInputChange(field: keyof T, value: string) - обработчик, который срабатывает на изменение поля ввода
clearForm() - сбрасывает данные формы

### Класс Modal

Служит для отображения модального окна.

Поля класса:

_content: HTMLElement;
_closeButton: HTMLButtonElement;

Методы класса:

set content(value: HTMLElement) - для установки внутреннего контента модального окна
open() - для открытия модального окна
close() - для закрытия модельного окна
render(data: IModal): HTMLElement - для отображения модального окна



### Класс Card

Служит для отображения карточек на главной странице. Наследуется от абстрактного класса Component.

Поля класса: 

_id?: string;
_category?: HTMLElement;
_title: HTMLElement;
_image?: HTMLImageElement;
_price?: HTMLElement;
_description?: HTMLElement;
_button?: HTMLButtonElement;

для каждого поля реализованы геттеры и сеттеры для установки и получения значения из HTML элементов


### Класс Basket

Служит для отображения корзины. Наследуется от абстрактного класса Component.

Поля класса: 

_list: HTMLElement;
_total: HTMLElement;
_button: HTMLElement;

Методы класса:

set list(items: HTMLElement[]) - для добавления товаров в корзину
set total(total: number) - для установки общей цены товаров в корзине


### Класс ContactForm

Служит для отображения формы, хранящей данные клиента. Наследуется от класса Form.

Поля класса:

_name: HTMLInputElement;
_email: HTMLInputElement;

Методы класса:

set name (value: string) - для установки имени
set email (value: string) - для установки email

### Класс OrderForm

Служит для отображения формы, хранящей данные о заказе (выбор способа оплаты и адрес клиента). Наследуется от класса Form.

Поля класса:

_paymentButtons : HTMLButtonElement[];
_address: HTMLInputElement;

Методы класса:

set address (value: string) - для установки адреса
set paymentButton (name: string) - для выбора метода оплаты

clearForm() - очистка формы и сброс выбранного способа оплаты


### Класс Page

Служит для отображения главной страницы приложения. Наследуется от абстрактного класса Component.

Поля класса:

_counter: HTMLElement;
_catalog: HTMLElement;
_basket: HTMLButtonElement;
_wrapper: HTMLElement;

Методы класса:

set counter(value: number) - Установить значение счетчика товаров в корзине
set catalog(cards: HTMLElement[]) -  Установить карточки в галерею
set locked(value: boolean) - Установить/снять блокировку прокрутки страницы

### Класс SuccessForm

Служит для отображения формы, отображающейся после успешного создания заказа. Наследуется от класса Form.

Поля класса:

protected _description: HTMLElement;
protected _closeButton: HTMLButtonElement;

Методы класса:

set total(value: number)  - для установки количества потраченных синапсов после покупки 


### Класс LarekApi

Служит для связи с сервером, отправки get и post запросов в приложении.

Поля класса: 

_cdn: string;

Методы класса:

getProduct(id: string):Promise<IProduct> - для получения одного товара по его id
getProductsCatalog():Promise<IProduct[]> - для получения списка всех товаров
order(data: IOrder): Promise<IOrderResult> - для создания заказа

### Класс AppData 

Служит для хранения и обработки всех данных в приложении. Наследуется от базового класса Model.

Поля класса:

basket: IProduct[] = [];
catalog: IProduct[] = [];
order: IOrder = {
    email: '',
    phone: '',
    address: '',
    payment: '',
};
formErrors: IFormErrors = {};

Методы класса:


setBasket(items: IProduct[])  - для добавления товаров в корзину
getBasket() - для получения всех товаров в корзине
getBasketIds() - для получения id всех товаров в корзине
deleteItemFromBasket(id: string) - для удаления одного товара из корзины
addItemToBasket(item: IProduct) - для добавления одного товара в корзину
clearBasket() - для очистки корзины
getTotal() - для получения суммарной стоимости товаров в корзине
setCatalog(items: IProduct[]) - для установки каталога товаров
setOrderField(field: keyof IOrder, value: string) - для установки значения в поле field объекта order
validateOrder() - для валидации данных о заказе
clearOrder() - для очистки информации о заказе

## Основные типы данных

``` 

export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	price: number | null;
	category: string;
}


export interface IOrderFormData {
	address: string;
	payment: string;
}

export interface IContactFormData {
	email: string;
	phone: string;
}

export interface ISuccessFormData {
	total: number;
}

export type IOrder = IContactFormData & IOrderFormData;

export type IFormErrors = Partial<IOrder>;

export interface IOrderResult {
	id: string;
	total: number;
}
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	order: IOrder;
	formErrors: IFormErrors;
	events: IEvents;

}

```
