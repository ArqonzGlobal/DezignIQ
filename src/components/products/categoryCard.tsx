import React from 'react';

interface CategoryCardProps {
    catergoryId: string;
    categoryName: string;
    categoryImage: string;
    subcategories: {
        id: string;
        name: string;
        image: string;
    }[];
    onNavigate?: (catergoryId: string) => void;  
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
    catergoryId,
    categoryName,
    categoryImage,
    subcategories,
    onNavigate
}) => { 
    return(
        <div className="rounded-3xl overflow-hidden shadow-lg flex-none w-[320px] min-w-[280px] h-[300px] pb-3 mb-4 bg-[#e8ddd4]">
            <div className="grid grid-cols-[1.7fr_1fr] gap-2 w-full h-full p-2 bg-[#e8ddd4]">
                {/* Main Category - Large Box (Left Side) */}
                <div 
                    onClick={() => onNavigate?.(catergoryId)}
                    className="cursor-pointer relative bg-[#e8ddd4]  transition-all overflow-hidden rounded-2xl"
                >
                    <div className="absolute inset-0 flex flex-col">
                        <div className="flex-1 p-2 pb-0">
                            <img 
                                src={categoryImage} 
                                alt={categoryName}
                                className="w-full max-h-[120px] object-cover rounded-t-xl"
                            />
                        </div>
                        <div className="p-2 h-20">
                            <h2 className="text-2xl font-bold text-black leading-tight">
                                {categoryName}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Subcategories - 3 Small Boxes (Right Side) */}
                <div className="grid grid-rows-3 gap-2">
                    {subcategories.map((subcategory, index) => (
                        <div 
                            key={subcategory.id}
                            onClick={() => onNavigate?.(subcategory.id)}
                            className="cursor-pointer relative bg-white hover:brightness-95 transition-all rounded-2xl overflow-hidden"
                        >
                            <div className="absolute inset-0 p-2 flex flex-col gap-1.5">
                                <div className="flex-1 rounded-md overflow-hidden bg-gray-50">
                                    <img 
                                        src={subcategory.image} 
                                        alt={subcategory.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-black leading-tight truncate ">
                                        {subcategory.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}