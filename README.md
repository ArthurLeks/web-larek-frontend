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
 
Данный проект разработан с применением паттерна проектирования MVP (Model-View-Presenter).
Взаимодействия внутри приложения происходят с помощью событий (класс EventEmitter).
Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения.

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
  
Свойства:

_events: Map<EventName, Set<Subscriber>> - хранилище обработчиков событий. Ключ - имя события, значение - множество функций-обработчиков.

Методы:
on<T extends object>(eventName: EventName, callback: (event: T) => void): Подписывает функцию callback на событие eventName. Если события ещё нет в списке, оно создаётся.
off(eventName: EventName, callback: Subscriber): Отписывает функцию callback от события eventName. Если после удаления обработчика у события не остаётся подписчиков, событие удаляется из списка.
emit<T extends object>(eventName: string, data?: T): Генерирует событие eventName с опциональными данными data. Вызывает все функции-обработчики, подписанные на это событие. Поддерживает подписку на события по регулярному выражению.
onAll(callback: (event: EmitterEvent) => void): Подписывает функцию callback на все события.
offAll(): Отписывает все функции-обработчики от всех событий.
trigger<T extends object>(eventName: string, context?: Partial<T>): Создаёт функцию-триггер, которая при вызове генерирует событие eventName с данными, полученными из объединения переданных объектов event и context.

### Класс Component 

Абстрактный класс, служит для работы с DOM элементами в компонентах view слоя.
Класс является дженериком и принимает в переменной T тип данных представляющий собой информацию которая нужна конкретному компоненту.
Содержит методы по работе с различными аттрибутами HTML элементов. 

Свойства:
container: HTMLElement - HTML-элемент, в котором будет размещен компонент. Является защищенным свойством, доступным только внутри класса и его потомков.

Методы:

toggleClass(element: HTMLElement, className: string, force?: boolean): Добавляет или удаляет класс className у элемента element. Параметр force позволяет принудительно установить или снять класс.
setText(element: HTMLElement, value: unknown): Устанавливает текстовое содержимое элемента element равным строковому представлению значения value.
setDisabled(element: HTMLElement, state: boolean): Устанавливает или снимает атрибут disabled у элемента element в зависимости от значения state.
setHidden(element: HTMLElement): Скрывает элемент element, устанавливая его свойство display в значение 'none'.
setVisible(element: HTMLElement): Отображает элемент element, сбрасывая значение его свойства display.
setImage(element: HTMLImageElement, src: string, alt?: string): Устанавливает атрибуты src и alt у элемента изображения element в соответствии с переданными значениями.
render(data?: Partial<T>): HTMLElement:  Отвечает за отображение компонента в DOM. Принимает опциональный параметр data типа Partial<T>, который может содержать данные для обновления состояния компонента перед отображением. Возвращает HTML-элемент компонента (container).

### Класс Model

Абстрактный класс, чтобы можно было отличить ее от простых объектов с данными.
Класс является дженериком и принимает в переменной T тип данных представляющий собой информацию, которую будет содержать модель.

Методы класса:

emitChanges(event: string, payload?: object) - Сообщить что модель поменялась


# Слой представления

представляет собой набор компонент, служащих для отображения различных частей интерфейса приложения. 

### Класс Form

Служит общим классом для форм в проекте. 
Свойства:

container: HTMLFormElement - HTML-элемент формы.
event: IEvents - экземпляр брокера событий для взаимодействия с другими компонентами.
_submit: HTMLButtonElement - кнопка отправки формы.
_errors: HTMLElement - элемент для отображения ошибок валидации.

Методы:

constructor(container: HTMLFormElement, event: IEvents): Конструктор класса. Получает HTML-элемент формы и экземпляр брокера событий. Находит кнопку отправки и элемент для ошибок. Добавляет обработчики событий для отправки формы и изменения значений полей ввода.
set valid(value: boolean): Устанавливает доступность кнопки отправки формы в зависимости от значения value.
set errors(value: string): Устанавливает текст ошибки валидации в элементе _errors.
onInputChange(field: keyof T, value: string): Обработчик события изменения значения поля ввода. Генерирует событие с именем ${this.container.name}.${String(field)}:change и данными об измененном поле.
clearForm(): Сбрасывает форму к начальному состоянию.

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
 
Свойства:
 
_id: string - ID товара.
_category: HTMLElement - элемент для отображения категории товара.
_title: HTMLElement - элемент для отображения названия товара.
_image: HTMLImageElement - элемент изображения товара.
_price: HTMLElement - элемент для отображения цены товара.
_description: HTMLElement - элемент для отображения описания товара.
_button: HTMLButtonElement - кнопка действия с товаром (например, "В корзину").
_deleteButton: HTMLButtonElement - кнопка удаления товара (например, из корзины).
_index: HTMLElement - элемент для отображения порядкового номера товара (например, в корзине).

Методы:

constructor(blockName: string, container: HTMLElement, actions?: ICardActions): Конструктор класса. Получает название блока, HTML-элемент карточки и объект с действиями. Находит все необходимые элементы внутри карточки и добавляет обработчики событий для кнопок.
set id(value: string): Устанавливает ID товара в dataset элемента карточки.
get id(): string: Возвращает ID товара из dataset элемента карточки.
set category(value: string): Устанавливает категорию товара. Принимает русское название категории, преобразует его в английское и устанавливает соответствующий класс для элемента _category.
set title(value: string): Устанавливает название товара.
get title(): string: Возвращает название товара.
set image(value: string): Устанавливает изображение товара.
set description(value: string): Устанавливает описание товара.
set price(value: number | null): Устанавливает цену товара. Если цена равна null, отображает текст "Бесценно" и блокирует кнопку действия.
get price(): Возвращает цену товара.
set button(value: string): Устанавливает текст кнопки действия.
setButtonText(value: boolean): Устанавливает текст кнопки действия в зависимости от значения value: "Убрать из корзины" или "В корзину".
set index(value: number): Устанавливает порядковый номер товара.


### Класс Basket

Служит для отображения корзины. Наследуется от абстрактного класса Component.
 
Свойства: 

_list: HTMLElement - элемент для отображения списка товаров в корзине.
_total: HTMLElement - элемент для отображения общей стоимости товаров в корзине.
_button: HTMLElement - кнопка оформления заказа.

Методы:

constructor(container: HTMLElement, events: EventEmitter): Конструктор класса. Получает HTML-элемент корзины и экземпляр брокера событий. Находит все необходимые элементы внутри корзины и добавляет обработчик события для кнопки оформления заказа.
set list(items: HTMLElement[]): Устанавливает список товаров в корзине. Если передан пустой массив, отображает сообщение "Корзина пуста". В зависимости от наличия товаров в корзине блокирует или разблокирует кнопку оформления заказа.
get list(): HTMLElement[]: Возвращает массив HTML-элементов товаров в корзине.
set total(total: number): Устанавливает общую стоимость товаров в корзине.
get total(): number: Возвращает общую стоимость товаров в корзине.


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

Служит для отображения формы, отображающейся после успешного создания заказа. Наследуется от класса Component.

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


# Слой модели 

представлен одним классом AppData. Отвечает за работу с данными в приложении.

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
getCatalog() - для получения каталога
validateOrderForm() - для валидации формы оформления
validateContactForm() - для валидации формы контактов
clearOrder() - для очистки информации о заказе
clearAll() - для сброса всех данных


# Cлой Presenter

Представляет собой файл index.ts, где с помощью класса EventEmitter происходит связывание слоя Model и View.
Связь реализована через событийную модель.

Основные события, которые связывают слои Model и View:

order:open - при клике на кнопку оформить в корзине, начинает процесс оформления заказа 
order:ready - событие связано с валидацией. Срабатывает когда все поля ввода при оформлении заказа заполнены корректно.
basket:open - при открытии корзины.
basket:toggleItem - при клике на кнопку добавления/удаления карточки в корзину
basket:deleteItem - при клике на кнопку удаления карточки в корзине
basket:changed - при изменении состояния корзины 
modal:open - при открытии модального окна
modal:close - при закрытии модального окна
catalog:changed - при изменении каталога
card:select - при выборе карточки из каталога (клике)
card:add - при добавлении карточки в корзину
card:remove - при удалении карточки из корзины
order:open - при клике на кнопку оформления заказа
order:submit - при нажатии на кнопку оформления заказа
order:complete - при успешном создании заказа
orderErrors:change - при изменении ошибок в форме оформления заказа
contactErrors:change - при изменении ошибок в форме оформления заказа
order.payment:change - при изменении способа оплаты в форме оформления заказа
order.address:change - при изменении адреса доставки в форме оформления заказа
contacts.email:change - при изменении email в форме оформления заказа
contacts.phone:change - при изменении телефона в форме оформления заказа
order:submit - при нажатии на кнопку далее в форме заказа
order:finish - при нажатии на кнопку "за новыми покупками" в модальном окне с успешным завершением заказа
contacts:submit - при нажатии на кнопку оформления заказа



## Основные типы данных

``` 
 

export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	price: number | null;
	category: string;
	index?: number
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


export type IOrderPost = IOrder & {
	total: number;
	items: string[];
}


```
