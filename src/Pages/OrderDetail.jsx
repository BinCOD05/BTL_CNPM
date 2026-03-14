import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Truck, CheckCircle, XCircle } from 'lucide-react';

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(dateString));
};

// Map status to steps for timeline
const getStatusStep = (status) => {
  const map = {
    'PENDING': 1,
    'CONFIRMED': 2,
    'SHIPPING': 3,
    'DELIVERED': 4,
    'CANCELED': 0 // Special case
  };
  return map[status] || 1;
};

const getStatusLabel = (status) => {
  const map = {
    'PENDING': 'Chờ xác nhận',
    'CONFIRMED': 'Đã xác nhận',
    'SHIPPING': 'Đang giao hàng',
    'DELIVERED': 'Giao thành công',
    'CANCELED': 'Đã hủy'
  };
  return map[status] || status;
};

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-red-600 bg-red-50 px-6 py-4 rounded-xl border border-red-200">Lỗi: {error}</div>
    </div>
  );

  if (!order) return <div className="p-6 text-center">Không tìm thấy đơn hàng.</div>;

  const currentStep = getStatusStep(order.status);
  const isCanceled = order.status === 'CANCELED';

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20 font-Roboto">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 hover:text-gray-900 transition mb-4 font-medium"
          >
            <ArrowLeft size={18} className="mr-1" /> Quay lại
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                Chi tiết đơn hàng #{order.id}
                <span className={`text-xs px-2 py-1 rounded-full border ${isCanceled ? 'bg-red-100 text-red-700 border-red-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                  {getStatusLabel(order.status)}
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">Mã đơn: {order.code || '---'} • Ngày đặt: {formatDate(order.orderDate)}</p>
            </div>
            
            {/* Action Buttons (Ví dụ: Hủy đơn nếu còn PENDING) */}
            {order.status === 'PENDING' && (
               <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-bold">
                 Hủy đơn hàng
               </button>
            )}
          </div>
        </div>

        {/* Timeline Status */}
        {!isCanceled && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
            <div className="relative flex justify-between items-center text-sm font-medium text-gray-500">
              {/* Progress Bar Background */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
              {/* Active Progress Bar */}
              <div 
                className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 rounded-full transition-all duration-500" 
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>

              {/* Steps */}
              <div className={`flex flex-col items-center gap-2 bg-white px-2 ${currentStep >= 1 ? 'text-green-600' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300'}`}>
                  <Package size={16} />
                </div>
                <span>Đặt hàng</span>
              </div>
              
              <div className={`flex flex-col items-center gap-2 bg-white px-2 ${currentStep >= 2 ? 'text-green-600' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300'}`}>
                  <CheckCircle size={16} />
                </div>
                <span>Xác nhận</span>
              </div>

              <div className={`flex flex-col items-center gap-2 bg-white px-2 ${currentStep >= 3 ? 'text-green-600' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300'}`}>
                  <Truck size={16} />
                </div>
                <span>Giao hàng</span>
              </div>

              <div className={`flex flex-col items-center gap-2 bg-white px-2 ${currentStep >= 4 ? 'text-green-600' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 4 ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300'}`}>
                  <CheckCircle size={16} />
                </div>
                <span>Hoàn tất</span>
              </div>
            </div>
          </div>
        )}

        {isCanceled && (
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6 flex items-center gap-3 text-red-700">
            <XCircle size={24} />
            <span className="font-bold">Đơn hàng đã bị hủy.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Info: Products */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-900 bg-gray-50/50">
                Sản phẩm
              </div>
              <div className="p-6 space-y-6">
                {(order.items || order.orderItems || order.cartItemResponses || []).map((it, idx) => (
                  <div key={it.id || idx} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 border border-gray-200 flex items-center justify-center">
                        {it.productImage ? (
                            <img src={it.productImage} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <Package className="text-gray-400 h-8 w-8" />
                        )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 line-clamp-2">{it.productName || it.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Số lượng: x{it.quantity || it.qty || 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatVND(it.price || it.unitPrice || (it.productPrice || 0))}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
                  <span className="font-black text-xl text-blue-600">{formatVND(order.total || order.amount || (order.totalPrice || 0))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info: Address & Payment */}
          <div className="space-y-6">
            {/* Address */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="text-gray-400" size={18} /> Địa chỉ nhận hàng
              </h3>
              {order.address || order.addressEntity ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-bold text-gray-900">
                    {typeof order.address === 'string' ? order.name : (order.address?.recipient || order.address?.fullName || order.name)}
                  </p>
                  <p>{typeof order.address === 'string' ? order.phoneNumber : (order.address?.phone || order.phoneNumber)}</p>
                  <p className="mt-2 text-gray-500 leading-relaxed">
                    {typeof order.address === 'string' ? order.address : (
                        `${order.address?.line1}, ${order.address?.ward}, ${order.address?.district}, ${order.address?.city}`
                    )}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Không có thông tin địa chỉ</p>
              )}
            </div>

            {/* Payment Method (Placeholder) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="text-gray-400" size={18} /> Thanh toán
              </h3>
              <p className="text-sm text-gray-600">Thanh toán khi nhận hàng (COD)</p>
            </div>

            {/* Note */}
            {order.note && (
                <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6">
                    <h3 className="font-bold text-yellow-800 mb-2 text-sm">Ghi chú</h3>
                    <p className="text-sm text-yellow-700 italic">"{order.note}"</p>
                </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

export default OrderDetail;