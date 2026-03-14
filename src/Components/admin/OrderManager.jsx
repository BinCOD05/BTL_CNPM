import React, { useState, useEffect } from 'react';
import { API_BASE, getHeaders } from '../../api/apiConfig';

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State quản lý Modal và IMEI
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [imeiInputs, setImeiInputs] = useState({});

    // --- 1. LẤY DANH SÁCH ĐƠN HÀNG ---
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/admin/orders`, { headers: getHeaders() });
            const data = await res.json();
            
            // Xử lý dữ liệu trả về an toàn (dù là List hay Page)
            const list = Array.isArray(data) ? data : (data.result || []);
            
            // Sắp xếp ID mới nhất lên đầu
            setOrders(list.sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, []);

    // --- 2. XEM CHI TIẾT ---
    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setImeiInputs({}); // Reset ô nhập IMEI
        setShowModal(true);
    };

    // --- 3. CẬP NHẬT TRẠNG THÁI (GỬI "CANCELLED" 2 CHỮ L) ---
    const updateStatus = async (id, newStatus) => {
        // Confirm trước khi bấm
        const confirmMsg = newStatus === 'CANCELLED' 
            ? "⚠️ Bạn có chắc muốn HỦY đơn hàng này? Kho sẽ được hoàn lại."
            : `Cập nhật trạng thái đơn #${id} sang ${newStatus}?`;

        if(!confirm(confirmMsg)) return;

        try {
            const res = await fetch(`${API_BASE}/admin/orders/${id}/status?status=${newStatus}`, {
                method: 'PUT',
                headers: getHeaders()
            });

            if(res.ok) {
                alert(`✅ Cập nhật thành công: ${newStatus}`);
                fetchOrders(); // Load lại danh sách bên ngoài
                setShowModal(false); // Đóng modal
            } else {
                const text = await res.text();
                alert("❌ Lỗi: " + text);
            }
        } catch (e) {
            alert("Lỗi kết nối: " + e.message);
        }
    };

    // --- 4. LƯU IMEI ---
    const handleSaveImei = async (orderItemId) => {
        const imei = imeiInputs[orderItemId];
        if(!imei) return alert("Vui lòng nhập số IMEI!");

        try {
            const res = await fetch(`${API_BASE}/admin/order-items/${orderItemId}/imei?imei=${imei}`, {
                method: 'PUT',
                headers: getHeaders()
            });

            if(res.ok) {
                alert("✅ Đã lưu IMEI thành công!");
                // Cập nhật giao diện ngay lập tức (UI Optimistic Update)
                const updatedOrder = {...selectedOrder};
                updatedOrder.orderItems = updatedOrder.orderItems.map(item => 
                    item.id === orderItemId ? {...item, imei: imei} : item
                );
                setSelectedOrder(updatedOrder);
            } else {
                alert("Lỗi lưu IMEI");
            }
        } catch (e) { console.error(e); }
    };

    // --- HELPER: MÀU SẮC TRẠNG THÁI ---
    const getStatusColor = (status) => {
        // Map cả trường hợp 1 chữ L (DB) và 2 chữ L (FE gửi) cho chắc
        switch(status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'SHIPPING': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELED':   // Case của Backend
            case 'CANCELLED':  // Case của Frontend
                return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Quản lý Đơn hàng</h2>

            {/* BẢNG DANH SÁCH */}
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-xs uppercase font-bold text-gray-600">
                        <tr>
                            <th className="p-4 border-b">Mã đơn</th>
                            <th className="p-4 border-b">Khách hàng</th>
                            <th className="p-4 border-b">Ngày đặt</th>
                            <th className="p-4 border-b">Tổng tiền</th>
                            <th className="p-4 border-b">Trạng thái</th>
                            <th className="p-4 border-b text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="6" className="p-6 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="6" className="p-6 text-center text-gray-500">Chưa có đơn hàng nào.</td></tr>
                        ) : (
                            orders.map(o => (
                                <tr key={o.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <span className="font-bold text-gray-800">#{o.id}</span>
                                        <br/>
                                        <span className="text-xs text-gray-400">{o.code}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{o.name || o.user?.fullName}</div>
                                        <div className="text-xs text-gray-500">{o.phoneNumber || o.phone}</div>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {o.orderDate ? new Date(o.orderDate).toLocaleDateString('vi-VN') : '---'}
                                    </td>
                                    <td className="p-4 font-bold text-blue-600">
                                        {Number(o.totalPrice || o.totalMoney).toLocaleString()}đ
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(o.status)}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleViewDetail(o)} 
                                            className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded font-medium transition"
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL CHI TIẾT */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                        
                        {/* Header Modal */}
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-xl">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-gray-800">Đơn hàng #{selectedOrder.id}</h3>
                                <span className={`text-xs px-3 py-1 rounded-full border font-bold ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 text-3xl leading-none">&times;</button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Cột Trái: Thông tin khách & Action */}
                            <div className="lg:col-span-1 space-y-6 border-r lg:pr-6">
                                {/* Thông tin khách */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Thông tin giao hàng</h4>
                                    <div className="bg-gray-50 p-4 rounded border">
                                        <p className="font-bold text-gray-900">{selectedOrder.name || selectedOrder.user?.fullName}</p>
                                        <p className="text-sm text-gray-600 mt-1">{selectedOrder.phoneNumber || selectedOrder.phone}</p>
                                        <p className="text-sm text-gray-500 mt-1 italic">{selectedOrder.address || `${selectedOrder.shipLine1}, ${selectedOrder.shipWard}, ${selectedOrder.shipDistrict}, ${selectedOrder.shipCity}`}</p>
                                        {selectedOrder.note && (
                                            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-red-500">
                                                <span className="font-bold">Ghi chú:</span> {selectedOrder.note}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Thông tin thanh toán */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Thanh toán</h4>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Tổng tiền:</span>
                                        <span className="text-2xl font-bold text-blue-600">{Number(selectedOrder.totalPrice).toLocaleString()}đ</span>
                                    </div>
                                    <div className="text-sm text-gray-500 text-right">Thanh toán khi nhận hàng (COD)</div>
                                </div>

                                {/* Nút thao tác (Action Buttons) */}
                                <div className="pt-6 border-t">
                                    <h4 className="font-bold text-gray-700 mb-3">Cập nhật trạng thái:</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button onClick={() => updateStatus(selectedOrder.id, 'CONFIRMED')} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium transition">
                                            ✅ Xác nhận đơn
                                        </button>
                                        <button onClick={() => updateStatus(selectedOrder.id, 'SHIPPING')} className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 font-medium transition">
                                            🚚 Đang giao hàng
                                        </button>
                                        <button onClick={() => updateStatus(selectedOrder.id, 'DELIVERED')} className="bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium transition">
                                            🎉 Giao thành công
                                        </button>
                                        {/* Gửi chuỗi CANCELLED (2 chữ L) */}
                                        <button onClick={() => updateStatus(selectedOrder.id, 'CANCELLED')} className="bg-red-100 text-red-600 py-2 rounded hover:bg-red-200 font-medium transition mt-2">
                                            ❌ Hủy đơn hàng
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Cột Phải: Danh sách sản phẩm */}
                            <div className="lg:col-span-2">
                                <h4 className="font-bold text-gray-700 mb-4 border-b pb-2 flex justify-between">
                                    <span>Danh sách sản phẩm</span>
                                    <span className="text-gray-500 font-normal text-sm">SL: {selectedOrder.orderItems?.length || 0}</span>
                                </h4>
                                
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {selectedOrder.orderItems?.map((item, index) => (
                                        <div key={item.id || index} className="flex gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow transition">
                                            {/* Ảnh Placeholder */}
                                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs font-bold border">
                                                IMG
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="font-bold text-gray-800 text-lg">{item.productName || item.product?.name}</div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    Đơn giá: {Number(item.price).toLocaleString()}đ &nbsp; x &nbsp; <span className="font-bold text-black">{item.quantity}</span>
                                                </div>
                                                <div className="text-blue-600 font-bold mt-1">
                                                    = {Number(item.price * item.quantity).toLocaleString()}đ
                                                </div>
                                            </div>

                                            {/* Khu vực nhập IMEI */}
                                            <div className="w-56 border-l pl-4 flex flex-col justify-center">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">IMEI / Serial Number</label>
                                                {item.imei ? (
                                                    <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded border border-green-200 text-sm font-medium">
                                                        <span className="truncate">{item.imei}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-1">
                                                        <input 
                                                            className="w-full border p-1.5 rounded text-sm focus:ring-2 ring-blue-500 outline-none transition"
                                                            placeholder="Nhập IMEI..."
                                                            onChange={(e) => setImeiInputs({ ...imeiInputs, [item.id]: e.target.value })}
                                                        />
                                                        <button 
                                                            onClick={() => handleSaveImei(item.id)}
                                                            className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700 shadow"
                                                            title="Lưu IMEI"
                                                        >
                                                            💾
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManager;