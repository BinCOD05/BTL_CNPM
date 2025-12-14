import React, { useEffect, useState } from 'react';
import { API_BASE, getHeaders } from './apiConfig';
// Import các component con (Giả sử bạn đã tạo các file tương tự ProductTab cho User và Order)
import ProductTab from './ProductTab'; 
// import UserTab from './UserTab'; // Bạn tự tách tương tự nhé
// import OrderTab from './OrderTab';

const Admin = () => {
  const [me, setMe] = useState(null);
  const [tab, setTab] = useState('products'); // Mặc định vào Products test cho nhanh

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/me`, { headers: getHeaders() });
        if (res.ok) {
            const data = await res.json();
            setMe(data.result);
        } else {
            setMe(null);
        }
      } catch (err) { setMe(null); }
    };
    checkAuth();
  }, []);

  if (!me) return <div className="p-10 text-center text-red-500 font-bold">Bạn chưa đăng nhập hoặc Token hết hạn!</div>;

  // Check Role
  const roles = me.roleTypes || me.roles || [me.roleType];
  if (!roles.includes('ADMIN')) return <div className="p-10">Bạn không có quyền Admin</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 font-bold text-xl border-b">Admin Panel</div>
        <nav className="flex-1 p-4 space-y-2">
            <button onClick={() => setTab('users')} className={`w-full text-left p-3 rounded ${tab === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>Quản lý Users</button>
            <button onClick={() => setTab('products')} className={`w-full text-left p-3 rounded ${tab === 'products' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>Quản lý Sản phẩm</button>
            <button onClick={() => setTab('orders')} className={`w-full text-left p-3 rounded ${tab === 'orders' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>Quản lý Đơn hàng</button>
        </nav>
        <div className="p-4 border-t text-sm text-gray-500">
            Xin chào, {me.fullName}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 capitalize">{tab === 'users' ? 'Người dùng' : tab === 'products' ? 'Sản phẩm' : 'Đơn hàng'}</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
            {tab === 'products' && <ProductTab />}
            {tab === 'users' && <div>Component UserTab đang xây dựng... (Copy logic cũ vào đây)</div>}
            {tab === 'orders' && <div>Component OrderTab đang xây dựng...</div>}
        </div>
      </main>
    </div>
  );
};

export default Admin;