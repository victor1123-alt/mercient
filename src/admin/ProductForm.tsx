import React, { useState } from "react";

interface ProductFormProps {
  onSubmit: (product: any) => void;
  initialData?: any;
}

const categories = ["Menswear", "Femalewear", "Unisex", "Caps", "Shoes", "Heels", "Bags"];
const sizes = ["S", "M", "L", "XL", "XXL"];

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [category, setCategory] = useState(initialData?.category || categories[0]);
  const [sizeApplicable, setSizeApplicable] = useState(initialData?.sizeApplicable || false);
  const [image, setImage] = useState(initialData?.image || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, price, category, image, sizeApplicable });
    setName(""); setPrice(""); setCategory(categories[0]); setSizeApplicable(false); setImage("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col gap-4">
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="border p-2 rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded dark:bg-gray-700 dark:text-white"
      >
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={sizeApplicable}
          onChange={() => setSizeApplicable(!sizeApplicable)}
        />
        Size Applicable
      </label>
      <button className="bg-primary text-white py-2 px-4 rounded hover:opacity-90">Save Product</button>
    </form>
  );
};

export default ProductForm;
