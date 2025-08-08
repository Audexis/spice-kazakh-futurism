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
    
    // Homepage
    welcomeTitle: 'Welcome to Spice Bazaar',
    welcomeSubtitle: 'Discover the finest spices from around the world',
    exploreMarketplace: 'Explore Marketplace',
    featuredSpices: 'Featured Spices',
    premiumQuality: 'Premium Quality',
    premiumQualityDesc: 'Sourced from the finest producers worldwide',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'Fresh spices delivered to your doorstep',
    expertCuration: 'Expert Curation',
    expertCurationDesc: 'Hand-picked by culinary professionals',
    
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
    
    // Cart
    cart: 'Cart',
    checkout: 'Checkout',
    total: 'Total',
    subtotal: 'Subtotal',
    emptyCart: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    removeFromCart: 'Remove from Cart',
    
    // Categories
    allCategories: 'All Categories',
    wholeSpices: 'Whole Spices',
    groundSpices: 'Ground Spices',
    spiceBlends: 'Spice Blends',
    herbs: 'Herbs',
    salts: 'Salts',
    
    // Admin
    orderManagement: 'Order Management',
    adminPanel: 'Admin Panel',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    adminLogin: 'Admin Login',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    
    // Order status
    pending: 'Pending',
    processing: 'Processing', 
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    // Forms
    name: 'Name',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    
    // Messages
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noProductsFound: 'No products found',
    pageNotFound: 'Page Not Found',
    goHome: 'Go Home'
  },
  ru: {
    // Navbar
    home: 'Главная',
    marketplace: 'Магазин',
    searchProducts: 'Поиск товаров...',
    userMode: '👤 РЕЖИМ ПОЛЬЗОВАТЕЛЯ',
    adminMode: '🔧 РЕЖИМ АДМИНИСТРАТОРА',
    logout: 'Выйти',
    
    // Homepage  
    welcomeTitle: 'Добро пожаловать в Базар Специй',
    welcomeSubtitle: 'Откройте для себя лучшие специи со всего мира',
    exploreMarketplace: 'Изучить Магазин',
    featuredSpices: 'Рекомендуемые Специи',
    premiumQuality: 'Премиум Качество',
    premiumQualityDesc: 'Получено от лучших производителей по всему миру',
    fastDelivery: 'Быстрая Доставка',
    fastDeliveryDesc: 'Свежие специи доставлены к вашему порогу',
    expertCuration: 'Экспертный Отбор',
    expertCurationDesc: 'Отобрано вручную кулинарными профессионалами',
    
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
    
    // Cart
    cart: 'Корзина',
    checkout: 'Оформить заказ',
    total: 'Итого',
    subtotal: 'Промежуточный итог',
    emptyCart: 'Ваша корзина пуста',
    continueShopping: 'Продолжить покупки',
    removeFromCart: 'Удалить из корзины',
    
    // Categories
    allCategories: 'Все Категории',
    wholeSpices: 'Цельные Специи',
    groundSpices: 'Молотые Специи',
    spiceBlends: 'Смеси Специй',
    herbs: 'Травы',
    salts: 'Соли',
    
    // Admin
    orderManagement: 'Управление Заказами',
    adminPanel: 'Панель Администратора',
    addProduct: 'Добавить Товар',
    editProduct: 'Редактировать Товар', 
    deleteProduct: 'Удалить Товар',
    adminLogin: 'Вход Администратора',
    email: 'Электронная почта',
    password: 'Пароль',
    login: 'Войти',
    
    // Order status
    pending: 'Ожидание',
    processing: 'Обработка',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменён',
    
    // Forms
    name: 'Имя',
    submit: 'Отправить',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    edit: 'Редактировать',
    
    // Messages
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успех',
    noProductsFound: 'Товары не найдены',
    pageNotFound: 'Страница не найдена',
    goHome: 'На главную'
  }
};

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };
  
  return { t, language };
};