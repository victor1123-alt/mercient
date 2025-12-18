import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import OrdersList from "./OrderLIst";

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]); // Later fetched from backend
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleAddProduct = (product: any) => {
    if (editingProduct !== null) {
      const updated = [...products];
      updated[editingProduct.index] = product;
      setProducts(updated);
      setEditingProduct(null);
    } else {
      setProducts([...products, product]);
    }
  };

  const handleEditProduct = (product: any) => {
    const index = products.findIndex((p) => p === product);
    setEditingProduct({ ...product, index });
  };

  const handleDeleteProduct = (index: number) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto p-6 flex flex-col gap-8">
        <ProductForm onSubmit={handleAddProduct} initialData={editingProduct} />
        <ProductList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
        <OrdersList orders={orders} />
      </div>
    </div>
  );
};

export default AdminDashboard;
