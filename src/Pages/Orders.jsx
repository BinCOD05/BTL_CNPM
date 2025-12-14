import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const formatVND = (value) => {
  try {
    return new Intl.NumberFormat('vi-VN').format(Number(value)) + ' đ';
  } catch (e) {
    return value + ' đ';
  }
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imei, setImei] = useState('');
  const [warrantyResult, setWarrantyResult] = useState(null);
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem('authToken') || '';

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();
        const res = await fetch('http://localhost:8081/api/orders', {
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Không thể tải đơn hàng');
        const data = await res.json();
        const list = data.result || data || [];
        setOrders(Array.isArray(list) ? list : [list]);
        setError(null);
      } catch (err) {
        console.error('Fetch orders failed', err);
        setError(err.message || String(err));
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const checkWarranty = async () => {
    if (!imei) return setWarrantyResult({ error: 'Vui lòng nhập IMEI' });
    setWarrantyResult(null);
    try {
      const token = getAuthToken();
      const url = `http://localhost:8081/api/warranty?imei=${encodeURIComponent(imei)}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'text/plain', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include'
      });
      const text = await res.text();
      let parsed = text;
      try { parsed = JSON.parse(text); } catch (e) { }
      setWarrantyResult({ status: res.status, ok: res.ok, body: parsed });
    } catch (err) {
      console.error('Warranty check failed', err);
      setWarrantyResult({ error: err.message || String(err) });
    }
  };

  return (
    <main className="min-h-screen bg-white pb-20 pt-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900">Đơn hàng của tôi</h1>
          <div className="flex items-center gap-3">
            <input value={imei} onChange={e => setImei(e.target.value)} placeholder="Nhập IMEI để kiểm tra bảo hành" className="px-4 py-2 border border-gray-300 rounded-lg" />
            <button onClick={checkWarranty} className="px-4 py-2 bg-gray-900 text-white rounded-lg">Kiểm tra bảo hành</button>
          </div>
        </div>

        {warrantyResult && (
          <div className="mb-6 p-4 rounded-lg border bg-gray-50">
            <div className="font-semibold mb-2">Kết quả kiểm tra bảo hành</div>
            {warrantyResult.error && <div className="text-red-600">Lỗi: {warrantyResult.error}</div>}
            {!warrantyResult.error && (
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{typeof warrantyResult.body === 'string' ? warrantyResult.body : JSON.stringify(warrantyResult.body, null, 2)}</pre>
            )}
          </div>
        )}

        <div className="space-y-4">
          {loading && <div className="text-sm text-gray-600">Đang tải đơn hàng...</div>}
          {error && <div className="text-sm text-red-600">Lỗi: {error}</div>}
          {!loading && orders.length === 0 && <div className="text-sm text-gray-600">Bạn chưa có đơn hàng nào.</div>}

          {orders.map(order => (
            <div key={order.id || order.orderId} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-gray-600">Mã đơn hàng</div>
                  <div className="font-bold text-lg">{order.code || `#${order.id || order.orderId}`}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Trạng thái</div>
                  <div className="font-semibold">{order.status || order.orderStatus || '—'}</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                {(order.items || order.orderItems || order.cartItemResponses || []).map((it, idx) => (
                  <div key={it.id || idx} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden"><img src={it.productImage || it.image || 'https://via.placeholder.com/96'} alt={it.productName || it.name} className="w-full h-full object-cover" /></div>
                    <div className="flex-1">
                      <div className="font-semibold truncate">{it.productName || it.name}</div>
                      <div className="text-sm text-gray-600">Số lượng: {it.quantity || it.qty || 1}</div>
                      <div className="text-sm font-bold mt-1">{formatVND(it.price || it.unitPrice || (it.productPrice || 0))}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">Tổng</div>
                <div className="font-bold">{formatVND(order.total || order.amount || (order.totalPrice || 0))}</div>
              </div>

              <div className="mt-4 flex gap-3">
                <button onClick={() => navigate(`/orders/${order.id || order.orderId || ''}`)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg">Xem chi tiết</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Orders;
