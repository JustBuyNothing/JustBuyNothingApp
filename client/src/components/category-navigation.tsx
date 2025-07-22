import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { sortCategoriesByOrder, getCategoryDisplayName } from '@/lib/categories';

interface CategoryNavigationProps {
  currentCategory?: string;
}

export default function CategoryNavigation({ currentCategory }: CategoryNavigationProps) {
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => api.products.getAll(),
  });

  const categories = [...new Set(products.map(p => p.category))];
  const sortedCategories = sortCategoriesByOrder(categories);

  return (
    <nav className="bg-blue-600 border-t border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12 text-sm">
          <div className="flex items-center space-x-6 overflow-x-auto">
            <span className="text-white font-medium whitespace-nowrap">Categories:</span>
            {sortedCategories.slice(0, 8).map(category => (
              <Link
                key={category}
                href={`/category/${category}`}
                className={`text-blue-100 hover:text-white hover:bg-blue-700 transition-colors whitespace-nowrap px-2 py-1 rounded ${
                  currentCategory === category ? 'text-white bg-blue-700' : ''
                }`}
              >
                {getCategoryDisplayName(category)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}