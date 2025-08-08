import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/hooks/useSpiceData';
import anime from 'animejs';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

const getCategoryIcon = (categoryName: string) => {
  const icons: Record<string, string> = {
    'spices': '🌶️',
    'snacks': '🥨',
    'flour': '🌾',
    'lentils': '🫘',
    'sweets': '🍬'
  };
  return icons[categoryName.toLowerCase()] || '🌿';
};

const getCategoryGradient = (categoryName: string) => {
  const gradients: Record<string, string> = {
    'spices': 'from-spice-paprika to-spice-saffron',
    'snacks': 'from-accent to-spice-turmeric',
    'flour': 'from-spice-turmeric to-spice-cardamom',
    'lentils': 'from-spice-cardamom to-primary',
    'sweets': 'from-secondary to-accent'
  };
  return gradients[categoryName.toLowerCase()] || 'from-primary to-secondary';
};

export const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const { t } = useTranslation();
  const [filterRef, setFilterRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (filterRef) {
      const buttons = filterRef.querySelectorAll('.category-btn');
      anime({
        targets: buttons,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 400,
        delay: anime.stagger(50),
        easing: 'easeOutQuart'
      });
    }
  }, [filterRef, categories]);

  const handleCategoryClick = (categoryId: string | null) => {
    onCategoryChange(categoryId);
  };

  return (
     <div ref={setFilterRef} className="card-modern">
       <h2 className="text-xl font-semibold mb-6">
         {t('browse_categories')}
      </h2>
      
      <div className="flex flex-wrap gap-3">
        <Button
          data-category={null}
          onClick={() => handleCategoryClick(null)}
          variant={selectedCategory === null ? 'default' : 'outline'}
          className={`category-btn transition-all duration-200 ${
            selectedCategory === null ? 'shadow-md' : ''
          }`}
        >
           <span className="text-base mr-2">✨</span>
           {t('all_categories')}
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            data-category={category.id}
            onClick={() => handleCategoryClick(category.id)}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className={`category-btn transition-all duration-200 ${
              selectedCategory === category.id ? 'shadow-md' : ''
            }`}
          >
             <span className="text-base mr-2">
               {getCategoryIcon(category.name)}
             </span>
             {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};