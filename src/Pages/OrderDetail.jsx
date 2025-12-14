import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const formatVND = (value) => {
  try { return new Intl.NumberFormat('vi-VN').format(Number(value)) + ' đ'; } catch (e) { return value + ' đ'; }
};

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem('authToken') || '';

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();
        const res = await fetch(`http://localhost:8081/api/orders/${id}`, {
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Không thể tải chi tiết đơn hàng');
        const data = await res.json();
        setOrder(data.result || data);
      } catch (err) {
        console.error(err);
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-600">Lỗi: {error}</div>;
  if (!order) return <div className="p-6">Không tìm thấy đơn hàng.</div>;

  return (
    <main className="min-h-screen bg-white pb-20 pt-24">
      <div className="mx-auto max-w-4xl px-6">
        <button onClick={() => navigate(-1)} className="mb-4 text-sm text-gray-600">← Quay lại</button>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
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

          {order.address && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600">Giao đến</div>
              <div className="font-semibold">{order.address.recipient || order.address.fullName || order.address.name}</div>
              <div className="text-sm text-gray-600">{order.address.line1 || order.address.address}</div>
              <div className="text-sm text-gray-600">{order.address.phone}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default OrderDetail;
