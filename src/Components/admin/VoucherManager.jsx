import React, { useState, useEffect } from 'react';
import { API_BASE, getHeaders } from '../../api/apiConfig';
import { Ticket, Trash2, Plus, RefreshCw, Calendar, Loader } from 'lucide-react';

const VoucherManager = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [form, setForm] = useState({
        code: '',
        discountAmount: '',
        quantity: '',
        expirationDate: ''
    });

    // --- 1. LẤY DANH SÁCH VOUCHER ---
    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/vouchers`, { headers: getHeaders() });
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.result || []);
            setVouchers(list);
        } catch (error) {
            console.error("Lỗi tải voucher:", error);
        }
        setLoading(false);
    };

    useEffect(() => { fetchVouchers(); }, []);

    // --- 2. TẠO VOUCHER MỚI ---
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // Validate dữ liệu trống
            if (!form.code || !form.discountAmount || !form.quantity || !form.expirationDate) {
                alert("Vui lòng điền đầy đủ thông tin!");
                return;
            }

            // === LOGIC QUAN TRỌNG: FIX LỖI NGÀY THÁNG ===
            // Input datetime-local trả về dạng: "2025-12-30T09:30" (Dài 16 ký tự)
            // Backend cần dạng: "2025-12-30T09:30:00" (Thêm :00 vào đuôi)
            let fixedDate = form.expirationDate;
            if (fixedDate.length === 16) {
                fixedDate = fixedDate + ":00";
            }
            // ============================================

            // Tạo payload đúng chuẩn JSON backend yêu cầu
            const payload = {
                code: form.code,
                discountAmount: Number(form.discountAmount), // Ép kiểu số
                quantity: Number(form.quantity),             // Ép kiểu số
                expirationDate: fixedDate                    // Ngày đã thêm giây
            };

            // Log ra console để bạn kiểm tra (Nhấn F12 -> Console để xem)
            console.log("Dữ liệu gửi đi:", payload);

            const res = await fetch(`${API_BASE}/admin/vouchers`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("✅ Tạo mã giảm giá thành công!");
                fetchVouchers(); 
                // Reset form
                setForm({ code: '', discountAmount: '', quantity: '', expirationDate: '' }); 
            } else {
                const text = await res.text();
                // Backend trả về lỗi gì thì hiển thị nguyên văn
                alert("❌ Lỗi từ Server: " + text);
            }
        } catch (err) {
            alert("Lỗi kết nối: " + err.message);
        }
    };

    // --- 3. XÓA VOUCHER ---
    const handleDelete = async (id) => {
        if (!confirm("Bạn chắc chắn muốn xóa mã này?")) return;
        try {
            const res = await fetch(`${API_BASE}/admin/vouchers/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            
            if (res.ok) {
                alert("Đã xóa thành công!");
                fetchVouchers();
            } else {
                const text = await res.text();
                alert("Lỗi xóa: " + text);
            }
        } catch (e) { console.error(e); }
    };

    const generateCode = () => {
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        setForm({ ...form, code: `SALE-${random}` });
    };

    return (
        <div className="bg-white p-6 rounded shadow space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Ticket className="text-orange-500" /> Quản lý Mã Giảm Giá
            </h2>

            {/* FORM */}
            <div className="bg-orange-50 p-5 rounded border border-orange-200">
                <h3 className="font-bold text-orange-800 mb-3 text-sm uppercase">Tạo mã mới</h3>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    
                    <div className="md:col-span-1">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Mã Code</label>
                        <div className="flex">
                            <input 
                                className="w-full border p-2 rounded-l focus:outline-none uppercase font-bold text-gray-700" 
                                placeholder="VD: CHUEMTHIROT" 
                                value={form.code}
                                onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                                required
                            />
                            <button type="button" onClick={generateCode} className="bg-gray-200 px-3 rounded-r hover:bg-gray-300" title="Random">
                                <RefreshCw size={16} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Giảm (VNĐ)</label>
                        <input 
                            type="number" 
                            className="w-full border p-2 rounded" 
                            placeholder="50000" 
                            value={form.discountAmount}
                            onChange={e => setForm({...form, discountAmount: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Số lượng</label>
                        <input 
                            type="number" 
                            className="w-full border p-2 rounded" 
                            placeholder="10" 
                            value={form.quantity}
                            onChange={e => setForm({...form, quantity: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Hết hạn</label>
                        <input 
                            type="datetime-local" 
                            className="w-full border p-2 rounded text-sm" 
                            value={form.expirationDate}
                            onChange={e => setForm({...form, expirationDate: e.target.value})}
                            required
                        />
                    </div>

                    <button type="submit" className="bg-orange-600 text-white font-bold py-2 rounded hover:bg-orange-700 flex justify-center items-center gap-2 h-[42px]">
                        <Plus size={18} /> Thêm
                    </button>
                </form>
            </div>

            {/* DANH SÁCH */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-xs uppercase font-bold text-gray-600">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Mã Code</th>
                            <th className="p-3">Giảm giá</th>
                            <th className="p-3">Còn lại</th>
                            <th className="p-3">Hết hạn</th>
                            <th className="p-3 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="6" className="p-4 text-center"><Loader className="animate-spin inline mr-2"/>Đang tải...</td></tr>
                        ) : vouchers.length === 0 ? (
                            <tr><td colSpan="6" className="p-4 text-center text-gray-500">Chưa có mã giảm giá nào.</td></tr>
                        ) : (
                            vouchers.map(v => (
                                <tr key={v.id} className="hover:bg-gray-50">
                                    <td className="p-3 text-gray-500">#{v.id}</td>
                                    <td className="p-3">
                                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-mono font-bold border border-orange-200">
                                            {v.code}
                                        </span>
                                    </td>
                                    <td className="p-3 font-bold text-green-600">-{Number(v.discountAmount).toLocaleString()}đ</td>
                                    <td className="p-3 font-bold">{v.quantity}</td>
                                    <td className="p-3 text-gray-600 flex items-center gap-2">
                                        <Calendar size={14} />
                                        {v.expirationDate ? new Date(v.expirationDate).toLocaleString('vi-VN') : 'Không thời hạn'}
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VoucherManager;