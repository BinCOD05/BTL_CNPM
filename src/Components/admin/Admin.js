// src/Pages/Admin.js
import React, { useState } from 'react';
import ProductManager from '../components/admin/ProductManager';
import UserManager from '../components/admin/UserManager';
// import OrderManager from '../components/admin/OrderManager';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar đơn giản */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6 font-bold text-xl">Admin Dashboard</div>
                <nav className="p-4 space-y-2">
                    <button onClick={() => setActiveTab('users')} className={`block w-full text-left p-3 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                        Quản lý Users
                    </button>
                    <button onClick={() => setActiveTab('products')} className={`block w-full text-left p-3 rounded ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                        Quản lý Sản phẩm
                    </button>
                    {/* ... */}
                </nav>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-8">
                {activeTab === 'users' && <UserManager />}
                {activeTab === 'products' && <ProductManager />}
                {/* ... */}
            </main>
        </div>
    );
};

export default Admin;