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

!Базовый код

1. Класс Component<T>

Находится в основе практически всех частей проекта, реализует методы для управления компонентами (изменения текста/изображения, переключение класса и рендер).
Класс является дженериком и в переменной Т принимает тип данных компонентов.

Конструктор принимает элемент с которым будет происходить взаимодействие.
Класс имеет такие методы:

- setText, setImage, toggleClass для изменения состояния элементов.
- render для заполнения свойств элемента и получения его в формате HTMLElement.

2. Класс Form<T>

Для управления формами проекта, реализует методы для отслеживания изменения состояний свойств, рендера и отправка формы.
Конструктор принимает элемент с которым будет происходить взаимодействие и функцию вызывающаяся для события submit.

Класс имеет такие методы:

- onInputChange для отслеживания изменения свойств формы.
- render для заполнения свойств элемента и получения его в формате HTMLElement.

3. Класс Model<T>

Базовая модель для того что бы ее можно было отличить от простых объектов с данными, реализует методы отслеживания изменений компонентов.
Конструктор принимает компонент для отслеживания.

Класс имеет такие методы:

- emitChanges сообщает об изменение модели

4. Класс EventEmitter

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.
Класс имеет методы on , off , emit — для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.
Дополнительно реализованы методы onAll и offAll — для подписки на все события и сброса всех
подписчиков.
Интересным дополнением является метод trigger , генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти
классы будут генерировать события, не будучи при этом напрямую зависимыми от
класса EventEmitter.

!Компоненты и модели данных (бизнес-логика)

1. Класс AppState

Осуществляет управление состоянием всего приложения (корзина, заказ, главная страница).
Ключевые методы:

- addProductInBasket добавить товар в корзину.
- removeProductFromBasket удалить товар из корзины.
- getBasket получить список товаров.
- setPreview установить превью товара.
- setCatalog установить товары в каталог.
- getTotalPrice получить стоимость всех товаров из корзины.
- clearBasket очистить корзину.
- setOrderField установить значения поля заказа.
- validateOrder валидация полей заказа.
- clearOrder очистить поля заказа.

!Компоненты представления

1. Класс BasketUI
   Выводит в контейнере корзину с товарами.

2. Класс ModalUI
   Отображает и закрывает модальные окна.

3. Класс PageUI
   Отображает в контейнере главную странцу сайта.

4. Класс ProductUI
   Отображает в контейнере данные о товаре.

4.1 Класс BasketItemUI
Расширяет класс ProductUI для отображения товаров в корзине.

4.2 Класс CatalogItemUI
Расширяет класс ProductUI для отображения товаров на главной странице.

5. OrderUI
   Отображет в контейнере страницу оформления заказа.

6. SuccessUI
   Отображает в контейнере результат оформления заказа.

!Ключевые типы данных

interface IBasketView {
items: HTMLElement[];
total: number;
}

interface IProductActions {
onClick: (event: MouseEvent) => void;
}

interface IProductUI<T> {
index: number;
title: string;
description: string;
price: string;
image: string;
category: string;
status: T;
}

type CatalogChangeEvent = {
catalog: IProduct[];
};

interface IFormState {
valid: boolean;
errors: string[];
}

interface IModalData {
content: HTMLElement;
}

interface IPage {
counter: number;
catalog: HTMLElement[];
locked: boolean;
}

interface ISuccess {
title: string;
description: string;
}

interface ISuccessActions {
onClick: () => void;}

interface IProduct {
id: string;
title: string;
price: number;
description: string;
image: string;
category: string;
status: boolean;
}

interface IOrderForm {
email: string;
phone: string;
address: string;
payment: string;
}

interface IOrder extends IOrderForm {
items: string[]
}

type FormErrors = Partial<Record<keyof IOrder, string>>;

interface IOrderResult {
id: string[];
total: number;
error?: string;
}

interface IWebLakerApi {
getProducts: () => Promise<Products>;
getProduct: (id: string) => Promise<IProduct>;
createOrder: (order: IOrder) => Promise<IOrderResult>;
}

!Ивенты

const Events = {
['ITEMS_CHANGED']: 'items:changed',
['ADD_PRODUCT']: 'cart:add-product',
['REMOVE_PRODUCT']: 'cart:remove-product',
['CREATE_ORDER']: 'cart:create_order',
['OPEN_PREVIEW']: 'product:open-preview',
['CHANGED_PREVIEW']: 'product:changed-preview',
['BASKET_OPEN']: 'cart:open',
['FORM_ERRORS_CHANGE']: 'formErrors:changed',
['ORDER_OPEN'] : 'order:open',
['SET_PAYMENT_TYPE'] : 'order:setPaymentType',
['MODAL_OPEN'] : 'modal:open',
['MODAL_CLOSE'] : 'modal:close',
};
