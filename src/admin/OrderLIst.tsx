import React from "react";

interface OrdersListProps {
  orders: any[];
}

const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">User Orders</h2>
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
        {orders.length === 0 && <p>No orders yet.</p>}
        {orders.map((order, index) => (
          <div key={index} className="border-b border-gray-300 dark:border-gray-600 p-2">
            <p className="font-semibold">Order #{index + 1}</p>
            <p>User: {order.userEmail}</p>
            <p>Total: ₦{order.total}</p>
            <p>Items:</p>
            <ul className="pl-4 list-disc">
              {order.items.map((item: any, i: number) => (
                <li key={i}>{item.name} {item.size ? `(${item.size})` : ""} - ₦{item.price}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;
