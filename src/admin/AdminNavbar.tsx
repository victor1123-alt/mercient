import React from "react";

const AdminNavbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-primary">Mercient Admin</h1>
      <div>
        <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
