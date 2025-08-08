import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  en: {
    // Navbar
    home: 'Home',
    marketplace: 'Marketplace',
    searchProducts: 'Search products...',
    userMode: '👤 USER MODE',
    adminMode: '🔧 ADMIN MODE', 
    logout: 'Logout',
    
    // Homepage - Hero Section
    welcomeTitle: 'Indian Spices in Almaty',
    welcomeSubtitle: 'Discover authentic flavors from the heart of India',
    premiumIndianGrocery: 'Premium Indian grocery • Online spice bazaar • Hassle free and authentic ingredients',
    deliveryInfo: '🚚 DELIVERY WITHIN CITY LIMITS',
    deliveryDetails: 'We offer affordable delivery within Almaty via Yandex',
    shopNow: 'Shop Now',
    
    // Homepage - Products Section
    featuredSpices: 'Premium Indian Spices',
    featuredSpicesDesc: 'Hand-selected authentic spices sourced directly from India for your Indian shop in Almaty',
    premiumQuality: 'Premium Quality',
    premiumQualityDesc: 'Sourced from the finest producers worldwide',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'Fresh spices delivered to your doorstep',
    expertCuration: 'Expert Curation',
    expertCurationDesc: 'Hand-picked by culinary professionals',
    
    // Categories (English names for mapping)
    'Whole Spices': 'Whole Spices',
    'Ground Spices': 'Ground Spices',
    'Spice Blends': 'Spice Blends',
    'Herbs': 'Herbs',
    'Salts': 'Salts',
    'Rice & Grains': 'Rice & Grains',
    'Lentils & Beans': 'Lentils & Beans',
    'Oil & Ghee': 'Oil & Ghee',
    'Tea & Coffee': 'Tea & Coffee',
    'Snacks': 'Snacks',
    
    // Product related
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    price: 'Price',
    quantity: 'Quantity',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    productDetails: 'Product Details',
    description: 'Description',
    ingredients: 'Ingredients',
    origin: 'Origin',
    weight: 'Weight',
    manufacturer: 'Manufacturer',
    by: 'by',
    reviews: 'reviews',
    
    // Cart
    cart: 'Cart',
    checkout: 'Proceed to Checkout',
    total: 'Total',
    subtotal: 'Subtotal',
    emptyCart: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    removeFromCart: 'Remove from Cart',
    items: 'items',
    each: 'each',
    
    // Categories
    allCategories: 'All Categories',
    clearFilters: 'Clear Filters',
    productsFound: 'products found',
    viewAllProducts: 'View All Products',
    
    // Admin
    orderManagement: 'Order Management',
    adminPanel: 'Admin Panel',
    adminDashboard: 'Admin Dashboard',
    welcomeBack: 'Welcome back,',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    adminLogin: 'Admin Login',
    email: 'Email',
    emailAddress: 'Email Address',
    password: 'Password',
    login: 'Sign In',
    backToStore: 'Back to Store',
    signInToAccess: 'Sign in to access the admin dashboard',
    secureAdminArea: 'This is a secure admin area. Only authorized personnel have access.',
    productManagement: 'Product Management',
    
    // Order status
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    processing: 'Processing',
    shipped: 'Shipped',
    
    // Forms
    name: 'Name',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    
    // Messages
    loading: 'Loading...',
    signingIn: 'Signing in...',
    deleting: 'Deleting...',
    error: 'Error',
    success: 'Success',
    addedToCart: 'Added to Cart',
    noProductsFound: 'No products found',
    tryAdjusting: 'Try adjusting your search or filter criteria',
    pageNotFound: 'Page Not Found',
    goHome: 'Go Home',
    
    // Common product descriptions (for translation)
    authenticIndianSpice: 'Authentic Indian spice',
    premiumQualitySpice: 'Premium quality spice',
    organicSpice: 'Organic spice',
    traditionalSpice: 'Traditional spice',
    aromatic: 'Aromatic',
    flavorful: 'Flavorful',
    freshlyGround: 'Freshly ground',
    handPicked: 'Hand-picked'
  },
  ru: {
    // Navbar
    home: 'Главная',
    marketplace: 'Магазин',
    searchProducts: 'Поиск товаров...',
    userMode: '👤 РЕЖИМ ПОЛЬЗОВАТЕЛЯ',
    adminMode: '🔧 РЕЖИМ АДМИНИСТРАТОРА',
    logout: 'Выйти',
    
    // Homepage - Hero Section
    welcomeTitle: 'Индийские Специи в Алматы',
    welcomeSubtitle: 'Откройте для себя подлинные вкусы из сердца Индии',
    premiumIndianGrocery: 'Премиум индийские продукты • Онлайн базар специй • Беспроблемные и подлинные ингредиенты',
    deliveryInfo: '🚚 ДОСТАВКА В ПРЕДЕЛАХ ГОРОДА',
    deliveryDetails: 'Мы предлагаем доступную доставку по Алматы через Яндекс',
    shopNow: 'Купить Сейчас',
    
    // Homepage - Products Section
    featuredSpices: 'Премиум Индийские Специи',
    featuredSpicesDesc: 'Отобранные вручную подлинные специи, поставляемые прямо из Индии для вашего индийского магазина в Алматы',
    premiumQuality: 'Премиум Качество',
    premiumQualityDesc: 'Получено от лучших производителей по всему миру',
    fastDelivery: 'Быстрая Доставка',
    fastDeliveryDesc: 'Свежие специи доставлены к вашему порогу',
    expertCuration: 'Экспертный Отбор',
    expertCurationDesc: 'Отобрано вручную кулинарными профессионалами',
    
    // Categories (Russian translations)
    'Whole Spices': 'Цельные Специи',
    'Ground Spices': 'Молотые Специи',
    'Spice Blends': 'Смеси Специй',
    'Herbs': 'Травы',
    'Salts': 'Соли',
    'Rice & Grains': 'Рис и Крупы',
    'Lentils & Beans': 'Чечевица и Бобовые',
    'Oil & Ghee': 'Масло и Гхи',
    'Tea & Coffee': 'Чай и Кофе',
    'Snacks': 'Закуски',
    
    // Product related
    addToCart: 'В корзину',
    viewDetails: 'Подробнее',
    price: 'Цена',
    quantity: 'Количество',
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',
    productDetails: 'Детали Товара',
    description: 'Описание',
    ingredients: 'Ингредиенты',
    origin: 'Происхождение',
    weight: 'Вес',
    manufacturer: 'Производитель',
    by: 'от',
    reviews: 'отзывов',
    
    // Cart
    cart: 'Корзина',
    checkout: 'Оформить заказ',
    total: 'Итого',
    subtotal: 'Промежуточный итог',
    emptyCart: 'Ваша корзина пуста',
    continueShopping: 'Продолжить покупки',
    removeFromCart: 'Удалить из корзины',
    items: 'товаров',
    each: 'за штуку',
    
    // Categories
    allCategories: 'Все Категории',
    clearFilters: 'Очистить Фильтры',
    productsFound: 'товаров найдено',
    viewAllProducts: 'Посмотреть Все Товары',
    
    // Admin
    orderManagement: 'Управление Заказами',
    adminPanel: 'Панель Администратора',
    adminDashboard: 'Панель Администратора',
    welcomeBack: 'Добро пожаловать,',
    addProduct: 'Добавить Товар',
    editProduct: 'Редактировать Товар', 
    deleteProduct: 'Удалить Товар',
    adminLogin: 'Вход Администратора',
    email: 'Электронная почта',
    emailAddress: 'Адрес электронной почты',
    password: 'Пароль',
    login: 'Войти',
    backToStore: 'Вернуться в Магазин',
    signInToAccess: 'Войдите для доступа к панели администратора',
    secureAdminArea: 'Это защищенная область администратора. Доступ имеют только авторизованные лица.',
    productManagement: 'Управление Товарами',
    
    // Order status
    pending: 'Ожидание',
    confirmed: 'Подтвержден',
    preparing: 'Подготовка',
    in_transit: 'В пути',
    delivered: 'Доставлен',
    cancelled: 'Отменён',
    processing: 'Обработка',
    shipped: 'Отправлен',
    
    // Forms
    name: 'Имя',
    submit: 'Отправить',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    edit: 'Редактировать',
    
    // Messages
    loading: 'Загрузка...',
    signingIn: 'Вход в систему...',
    deleting: 'Удаление...',
    error: 'Ошибка',
    success: 'Успех',
    addedToCart: 'Добавлено в корзину',
    noProductsFound: 'Товары не найдены',
    tryAdjusting: 'Попробуйте изменить поисковые или фильтровые критерии',
    pageNotFound: 'Страница не найдена',
    goHome: 'На главную',
    
    // Common product descriptions (for translation)
    authenticIndianSpice: 'Подлинная индийская специя',
    premiumQualitySpice: 'Специя премиум качества',
    organicSpice: 'Органическая специя',
    traditionalSpice: 'Традиционная специя',
    aromatic: 'Ароматная',
    flavorful: 'Вкусная',
    freshlyGround: 'Свежемолотая',
    handPicked: 'Отобранная вручную'
  }
};

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: keyof typeof translations.en | string): string => {
    return translations[language][key as keyof typeof translations.en] || translations.en[key as keyof typeof translations.en] || key;
  };
  
  return { t, language };
};