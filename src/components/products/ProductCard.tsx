  import React, { useState } from 'react';
  import { Heart } from 'lucide-react';
  import '@/styles/productCard.css'

  interface ProductCardProps {
    productId: string;
    productName: string;
    productImage: string;
    originalPrice: number;
    offerPrice: number;
    offerPercentage: number;
    moq: number;
    rating: number;
    onNavigate?: (productId: string) => void;
    onWishlistToggle?: (productId: string, isAdded: boolean) => void;
  }

  export const ProductCard: React.FC<ProductCardProps> = ({
    productId,
    productName,
    productImage,
    originalPrice,
    offerPrice ,
    offerPercentage,
    moq,
    rating,
    onNavigate,
    onWishlistToggle
  }) => {
    const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

    const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.stopPropagation();
      setIsWishlisted(!isWishlisted);
      onWishlistToggle?.(productId, !isWishlisted);
    };

    const handleCardClick = (): void => {
      onNavigate?.(productId);
    };

    const truncateName = (name: string, maxLength: number = 35): string => {
      return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
    };

    return (
      <div 
        onClick={handleCardClick}
        className="bg-gradient-to-b from-white to-slate-100 max-h-80 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 w-auto"
        title={productName}
      >
        {/* Product Image */}
        <div className="relative p-3">
          <img 
            src={productImage} 
            alt={productName}
            className="w-full rounded-[10px] h-36 object-cover"
          />
          <button
            onClick={handleWishlistClick}
            className="absolute top-4 right-4 w-9 h-9 bg-gradient-to-b from-white to-slate-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Heart 
              size={20}
              className={isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'}
            />
          </button>
        </div>

        {/* Product Details */}
        <div className="px-4 pb-4 bg-gradient-to-b from-white to-slate-100 ">
          {/* Product Name */}
          <h3 className="card-text text-gray-800 text-sm font-normal mb-3 leading-relaxed w-52 h-auto min-h-10">
            {truncateName(productName)}
          </h3>

          {/* MOQ */}
          <div className="mb-2">
            <span className="text-gray-600 text-sm card-text">MOQ: </span>
            <span className="text-gray-800 text-sm font-medium card-text">{moq}</span>
          </div>

          {/* Price and Rating Row */}
          <div className="flex items-center justify-between">
            {/* Price Section */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 card-text">₹{offerPrice.toLocaleString('en-IN')}</span>
              <span className="text-sm text-gray-500 line-through card-text">₹{originalPrice.toLocaleString('en-IN')}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-teal-700 px-2 py-1 rounded">
              <span className="text-white text-sm font-semibold card-text">{rating}</span>
              <span className="text-white text-xs">★</span>
            </div>
          </div>

          {/* Offer Percentage */}
          <div className="pb-2">
            <span className="text-red-600 text-sm font-medium">{offerPercentage}% off</span>
          </div>
        </div>
      </div>
    );
  };