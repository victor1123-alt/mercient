import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import OrdersList from "./OrderLIst";

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]); // fetched from backend (example endpoints below)
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

  // Example: load products and orders from admin API endpoints
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        // Example endpoints (replace with your backend routes)
        const [pRes, oRes] = await Promise.all([
          fetch("/api/admin/products", { headers: { Authorization: token ? `Bearer ${token}` : "" } }),
          fetch("/api/admin/orders", { headers: { Authorization: token ? `Bearer ${token}` : "" } }),
        ]);

        if (pRes.ok) {
          const pData = await pRes.json();
          setProducts(pData);
        }
        if (oRes.ok) {
          const oData = await oRes.json();
          setOrders(oData);
        }
      } catch (err) {
        console.error("Failed to load admin data (using local state fallback).", err);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Use main site Navbar for consistent look */}
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 flex flex-col gap-8">
        <ProductForm onSubmit={handleAddProduct} initialData={editingProduct} />
        <ProductList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
        <OrdersList orders={orders} />
      </div>
    </div>
  );
};

export default AdminDashboard;
