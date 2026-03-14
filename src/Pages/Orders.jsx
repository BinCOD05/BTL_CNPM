import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, MapPin, ChevronRight, Search, ShieldCheck, AlertCircle } from 'lucide-react';

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'SHIPPING': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
    case 'CANCELED': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status) => {
  const map = {
    'PENDING': 'Chờ xác nhận',
    'CONFIRMED': 'Đã xác nhận',
    'SHIPPING': 'Đang giao',
    'DELIVERED': 'Giao thành công',
    'CANCELED': 'Đã hủy'
  };
  return map[status] || status;
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Warranty State
  const [imei, setImei] = useState('');
  const [warrantyResult, setWarrantyResult] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch('http://localhost:8081/api/orders', {
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        
        if (!res.ok) throw new Error('Không thể tải đơn hàng');
        const data = await res.json();
        
        // Xử lý data linh hoạt (dù trả về List hay Page)
        const list = Array.isArray(data) ? data : (data.result || []);
        // Sắp xếp đơn mới nhất lên đầu
        setOrders(list.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const checkWarranty = async () => {
    if (!imei.trim()) return alert('Vui lòng nhập IMEI');
    try {
        const res = await fetch(`http://localhost:8081/api/warranty?imei=${imei}`);
        const text = await res.text();
        setWarrantyResult(text); // API trả về String text
    } catch (e) {
        setWarrantyResult("Lỗi kết nối khi tra cứu.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20 font-Roboto">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Lịch sử đơn hàng</h1>
            <p className="text-gray-500 text-sm mt-1">Quản lý và theo dõi quá trình giao hàng</p>
          </div>

          {/* Warranty Check Box */}
          <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 flex items-center w-full md:w-auto">
            <Search className="ml-3 text-gray-400 h-5 w-5" />
            <input 
              value={imei} 
              onChange={e => setImei(e.target.value)} 
              placeholder="Tra cứu bảo hành (IMEI)" 
              className="px-3 py-2 outline-none text-sm w-full md:w-64" 
            />
            <button 
              onClick={checkWarranty}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition"
            >
              Kiểm tra
            </button>
          </div>
        </div>

        {/* Warranty Result Modal/Box */}
        {warrantyResult && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
            <ShieldCheck className="text-blue-600 h-6 w-6 mt-1" />
            <div>
                <h3 className="font-bold text-blue-800">Kết quả tra cứu:</h3>
                <pre className="text-sm text-blue-900 mt-1 whitespace-pre-wrap font-sans">{warrantyResult}</pre>
                <button onClick={() => setWarrantyResult(null)} className="text-xs text-blue-500 underline mt-2">Đóng lại</button>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {loading && (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-500 mt-4">Đang tải dữ liệu...</p>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào.</p>
                <button onClick={() => navigate('/store')} className="mt-4 text-blue-600 font-bold hover:underline">
                    Bắt đầu mua sắm ngay
                </button>
            </div>
          )}

          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              
              {/* Order Header */}
              <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <Package className="text-gray-700 h-6 w-6" />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                            {order.code || `Đơn #${order.id}`}
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                {getStatusLabel(order.status)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Calendar size={12} /> {formatDate(order.orderDate)}
                        </div>
                    </div>
                </div>
                
                <div className="text-right">
                    <span className="text-xs text-gray-500">Tổng tiền</span>
                    <p className="text-xl font-black text-gray-900">{formatVND(order.totalPrice)}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                {order.orderItems?.map((item) => (
                    <div key={item.id} className="flex gap-4 py-3 border-b border-gray-50 last:border-0 last:pb-0">
                        {/* LƯU Ý: Vì JSON chưa có ảnh, mình dùng icon Package làm placeholder 
                           Nếu sau này BE trả về `item.image`, thay thế vào đây.
                        */}
                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                            {item.productImage ? (
                                <img src={item.productImage} alt="" className="h-full w-full object-cover rounded-lg" />
                            ) : (
                                <Package className="text-gray-400 h-8 w-8" />
                            )}
                        </div>
                        
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-sm md:text-base">{item.productName}</h4>
                            <p className="text-xs text-gray-500 mt-1">Số lượng: x{item.quantity}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-sm">{formatVND(item.price)}</p>
                        </div>
                    </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 w-full md:w-auto truncate">
                    <MapPin size={14} />
                    <span className="truncate max-w-[300px]">{order.address}</span>
                </div>
                
                <button 
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="w-full md:w-auto flex items-center justify-center gap-1 text-sm font-bold text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                    Chi tiết <ChevronRight size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Orders;