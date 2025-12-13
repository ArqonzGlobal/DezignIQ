import React, { useState } from 'react';
import { Search } from 'lucide-react';

const ProductCard = ({ count, label, variant = 'teal' }) => {
  const bgColor = variant === 'teal' ? 'bg-teal-600' : 'bg-white';
  const textColor = variant === 'teal' ? 'text-white' : 'text-gray-800';
  const labelColor = variant === 'teal' ? 'text-teal-100' : 'text-gray-600';
  
  return (
    <div className={`${bgColor} ${textColor} rounded-2xl p-6 shadow-lg min-w-[140px] flex flex-col items-start justify-center`}>
      <div className="text-4xl font-bold mb-1">{count}</div>
      <div className={`text-sm font-medium ${labelColor}`}>{label}</div>
    </div>
  );
};

export const ProductCatalogBanner = ({ 
  title = "Discover a wide range of products tailored to meet your needs",
  searchPlaceholder = "Search your Products here",
  products = [
    { count: "80k+", label: "Civil", variant: "teal" },
    { count: "15k+", label: "Furniture", variant: "white" },
    { count: "80k+", label: "Flooring", variant: "white" },
    { count: "15k+", label: "Electricals", variant: "teal" },
    { count: "80k+", label: "Wardrobe", variant: "teal" },
    { count: "15k+", label: "Windows", variant: "white" }
  ],
  onSearch = (query) => console.log('Searching for:', query)
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mx-6 max-h-[80vh] bg-gradient-to-br from-teal-500 to-white rounded-3xl p-8  shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Section - Text and Search */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-8 leading-tight">
            {title}
          </h1>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={searchPlaceholder}
              className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-teal-300 shadow-lg"
            />
          </div>
        </div>

        {/* Right Section - Product Cards Grid */}
        <div className="grid grid-cols-2 gap-4 lg:gap-5">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              count={product.count}
              label={product.label}
              variant={product.variant}
            />
          ))}
        </div>
      </div>
    </div>
  );
};