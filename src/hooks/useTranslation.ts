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
    
    // Product related
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    price: 'Price',
    quantity: 'Quantity',
    
    // Cart
    cart: 'Cart',
    checkout: 'Checkout',
    total: 'Total',
    
    // Admin
    orderManagement: 'Order Management',
    adminPanel: 'Admin Panel',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    
    // Order status
    pending: 'Pending',
    processing: 'Processing', 
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
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
    
    // Product related
    addToCart: 'В корзину',
    viewDetails: 'Подробнее',
    price: 'Цена',
    quantity: 'Количество',
    
    // Cart
    cart: 'Корзина',
    checkout: 'Оформить заказ',
    total: 'Итого',
    
    // Admin
    orderManagement: 'Управление Заказами',
    adminPanel: 'Панель Администратора',
    addProduct: 'Добавить Товар',
    editProduct: 'Редактировать Товар', 
    deleteProduct: 'Удалить Товар',
    
    // Order status
    pending: 'Ожидание',
    processing: 'Обработка',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменён'
  }
};

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };
  
  return { t, language };
};