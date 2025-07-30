import { useState, useEffect } from 'react';
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
  const [filterRef, setFilterRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (filterRef) {
      const buttons = filterRef.querySelectorAll('.category-btn');
      anime({
        targets: buttons,
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.8, 1],
        duration: 600,
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .6)'
      });
    }
  }, [filterRef, categories]);

  const handleCategoryClick = (categoryId: string | null) => {
    onCategoryChange(categoryId);
    
    // Animate button selection
    const activeBtn = filterRef?.querySelector(`[data-category="${categoryId}"]`);
    if (activeBtn) {
      anime({
        targets: activeBtn,
        scale: [1, 1.1, 1],
        duration: 300,
        easing: 'easeOutBack'
      });
    }
  };

  return (
    <div ref={setFilterRef} className="glass-card p-6 mb-8">
      <h2 className="text-2xl font-bold text-gradient-primary mb-6">
        Explore Categories
      </h2>
      
      <div className="flex flex-wrap gap-3">
        <Button
          data-category={null}
          onClick={() => handleCategoryClick(null)}
          variant={selectedCategory === null ? 'default' : 'outline'}
          className={`category-btn relative overflow-hidden transition-all duration-300 ${
            selectedCategory === null 
              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105' 
              : 'glass hover:scale-105'
          }`}
        >
          <span className="text-lg mr-2">🌟</span>
          All Products
          <Badge variant="secondary" className="ml-2">
            {categories.reduce((sum, cat) => sum, 0)}
          </Badge>
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            data-category={category.id}
            onClick={() => handleCategoryClick(category.id)}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className={`category-btn relative overflow-hidden transition-all duration-300 ${
              selectedCategory === category.id
                ? `bg-gradient-to-r ${getCategoryGradient(category.name)} text-white shadow-lg scale-105`
                : 'glass hover:scale-105'
            }`}
          >
            <span className="text-lg mr-2">
              {getCategoryIcon(category.name)}
            </span>
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};