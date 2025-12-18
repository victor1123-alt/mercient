import React from "react";

interface ProductListProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
        {products.map((product, index) => (
          <div key={index} className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 p-2">
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm">₦{product.price} - {product.category}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit(product)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => onDelete(index)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
