import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart as ShoppingCartIcon, Loader } from 'lucide-react';

const formatVND = (value) => {
  try {
    return new Intl.NumberFormat('vi-VN').format(Number(value)) + ' đ';
  } catch (e) {
    return value + ' đ';
  }
};

function ShoppingCart() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const getAuthToken = () => localStorage.getItem('authToken') || '';

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        setError('Vui lòng đăng nhập để xem giỏ hàng');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Không thể tải giỏ hàng');
      const data = await response.json();
      setCartData(data.result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const apiCall = async (url, method, body) => {
    const token = getAuthToken();
    if (!token) throw new Error('No auth token');
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`${response.status}: ${errData.message || 'API Error'}`);
      }
      
      return (await response.json()).result;
    } catch (err) {
      console.error('API Error:', url, err);
      throw err;
    }
  };

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    setUpdatingItems(prev => new Set([...prev, cartItemId]));
    try {
      const result = await apiCall(`/api/cart/items/${cartItemId}`, 'PUT', { quantity: newQuantity });
      setCartData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingItems(prev => { const s = new Set(prev); s.delete(cartItemId); return s; });
    }
  };

  const handleToggleSelection = async (cartItemId, currentSelected) => {
    setUpdatingItems(prev => new Set([...prev, cartItemId]));
    try {
      const result = await apiCall(
        `/api/cart/items/${cartItemId}/select`, 
        'PATCH', 
        { selected: !currentSelected }
      );
      setCartData(result);
    } catch (err) {
      setError(err.message);
      console.error('Toggle selection error:', err);
    } finally {
      setUpdatingItems(prev => { const s = new Set(prev); s.delete(cartItemId); return s; });
    }
  };

  const subtotal = cartData?.cartItemResponses?.reduce((sum, item) => item.selected ? sum + item.price * item.quantity : sum, 0) || 0;
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;
  const selectedCount = cartData?.cartItemResponses?.filter(item => item.selected).length || 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-white pb-20 pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white pb-20 pt-24">
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold mb-4">Lỗi: {error}</p>
            <button 
              onClick={fetchCart}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              Thử lại
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!cartData?.cartItemResponses?.length) {
    return (
      <main className="min-h-screen bg-white pb-20 pt-24">
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6">
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
            <p className="text-sm text-gray-600">Bạn chưa có sản phẩm nào trong giỏ. Hãy tiếp tục mua sắm!</p>
          </header>

          <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-gray-50 p-10 text-center border border-gray-200">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-gray-400">
              <ShoppingCartIcon className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Chưa có sản phẩm</h2>
            <p className="text-gray-600">Khám phá danh mục để tìm sản phẩm yêu thích của bạn</p>
            <a
              href="/Category"
              className="rounded-lg bg-gray-900 hover:bg-gray-800 px-6 py-3 text-sm font-semibold text-white transition duration-300"
            >
              Khám phá sản phẩm
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Giỏ hàng của bạn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartData.cartItemResponses
              .sort((a, b) => a.id - b.id)
              .map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer" onClick={() => handleToggleSelection(item.id, item.selected)}>
                <input
                  type="checkbox"
                  checked={item.selected || false}
                  onChange={() => handleToggleSelection(item.id, item.selected)}
                  disabled={updatingItems.has(item.id)}
                  className="w-5 h-5 rounded cursor-pointer mt-2"
                  onClick={(e) => e.stopPropagation()}
                />
                <img src={item.productImage || 'https://via.placeholder.com/96'} alt={item.productName} className="w-24 h-24 bg-gray-200 rounded-lg object-cover flex-shrink-0 hover:scale-105 transition-transform duration-300" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{item.productName}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.color}</p>
                  <p className="text-lg font-bold text-gray-900">{formatVND(item.price)}</p>
                </div>
                <div className="flex flex-col items-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button onClick={() => handleQuantityChange(item.id, Math.max(0, item.quantity - 1))} disabled={updatingItems.has(item.id)} className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 transition">
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="px-4 py-2 font-semibold text-gray-900 min-w-[40px] text-center">
                      {updatingItems.has(item.id) ? <Loader className="h-4 w-4 animate-spin inline" /> : item.quantity}
                    </span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} disabled={updatingItems.has(item.id)} className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 transition">
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex gap-2 w-full">
                    <button onClick={() => navigate(`/Details/${item.productId}`)} disabled={updatingItems.has(item.id)} className="flex-1 px-4 py-2 border border-gray-300 hover:border-gray-500 bg-white hover:bg-gray-50 text-gray-900 rounded-lg font-semibold text-sm disabled:opacity-50 transition duration-200">
                      Xem chi tiết
                    </button>
                    <button onClick={() => handleQuantityChange(item.id, 0)} disabled={updatingItems.has(item.id)} className="px-4 py-2 border border-gray-300 hover:border-red-400 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg disabled:opacity-50 transition duration-200">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-300">
                <div className="flex justify-between text-gray-700">
                  <span>Số lượng hàng:</span>
                  <span className="font-semibold">{cartData.totalItems}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Sản phẩm được chọn:</span>
                  <span className="font-semibold text-gray-900">{selectedCount}</span>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Tạm tính:</span>
                  <span className="font-bold text-gray-900">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Vận chuyển:</span>
                  <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>{shipping === 0 ? 'Miễn phí' : formatVND(shipping)}</span>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 mb-6 border border-gray-900">
                <div className="flex justify-between text-2xl font-black text-white">
                  <span>Tổng cộng:</span>
                  <span>{formatVND(total)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/pay')} disabled={selectedCount === 0} className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold py-3 rounded-xl mb-3 transition duration-300">Thanh toán</button>
              <a href="/Category" className="block w-full text-center bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 rounded-xl border border-gray-300 transition duration-300">Tiếp tục mua sắm</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ShoppingCart;