import React, { useState, useEffect } from 'react';
import { API_BASE, getHeaders } from '../../api/apiConfig';

const PAGE_SIZE = 10;

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // State phân trang & tìm kiếm
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // State form tạo user
    const [form, setForm] = useState({
        username: '', password: '', fullName: '', email: '', phone: ''
    });

    // State cho Modal chi tiết
    const [detailUser, setDetailUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // --- 1. FETCH USERS ---
    const fetchUsers = async (pageIndex = 0, searchKeyword = keyword) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', pageIndex);
            params.append('size', PAGE_SIZE);
            if (searchKeyword) params.append('keyword', searchKeyword);

            const res = await fetch(`${API_BASE}/users/search?${params.toString()}`, {
                method: 'POST',
                headers: getHeaders()
            });
            const data = await res.json();

            if (data.result && data.result.content) {
                setUsers(data.result.content);
                setTotalPages(data.result.totalPage || 0);
                setPage(pageIndex);
            } else {
                setUsers([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error(error);
            setUsers([]);
        }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(0, ''); }, []);

    // --- 2. CÁC HÀM XỬ LÝ ---
    const handleSearch = () => fetchUsers(0, keyword);
    
    const changePage = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) fetchUsers(newPage, keyword);
    };

    const handleCreate = async () => {
        try {
            if(!form.username || !form.password || !form.email) {
                alert("Vui lòng điền đủ Username, Password và Email!");
                return;
            }

            const res = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(form)
            });

            if (!res.ok) throw new Error(await res.text());

            alert("✅ Tạo User thành công!");
            fetchUsers(0, keyword);
            setForm({ username: '', password: '', fullName: '', email: '', phone: '' });

        } catch (err) {
            alert("❌ Lỗi: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa User này?')) return;
        try {
            await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', headers: getHeaders() });
            fetchUsers(page, keyword);
        } catch (e) { alert(e.message); }
    };

    // --- 3. ĐỔI ROLE (CẬP NHẬT: CHỈ CÒN ADMIN VÀ OWNER) ---
    const handleChangeRole = async (userId, newRole) => {
        if(!confirm(`Cấp quyền ${newRole} cho user này?`)) return;
        try {
            const res = await fetch(`${API_BASE}/users/${userId}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ roleType: newRole }) 
            });
            if(res.ok) {
                alert(`✅ Đã cập nhật quyền thành ${newRole}!`);
                fetchUsers(page, keyword);
            } else {
                alert("❌ Lỗi cập nhật quyền!");
            }
        } catch(e) { console.error(e); }
    }

    // --- 4. XEM CHI TIẾT ---
    const handleViewDetail = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/users/${id}`, { headers: getHeaders() });
            const data = await res.json();
            if(res.ok) {
                setDetailUser(data.result);
                setShowModal(true);
            }
        } catch(e) { console.error(e); }
    }

    return (
        <div className="bg-white p-6 rounded shadow space-y-6 relative">
            <h2 className="text-xl font-bold text-gray-800">Quản lý Người dùng</h2>

            {/* FORM TẠO USER NHANH */}
            <div className="bg-gray-50 p-4 rounded border">
                <h3 className="font-bold mb-3 text-sm uppercase text-gray-500">Thêm User Mới</h3>
                <div className="grid grid-cols-5 gap-2">
                    <input className="border p-2 rounded" placeholder="Username" value={form.username} onChange={e=>setForm({...form, username: e.target.value})} />
                    <input className="border p-2 rounded" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} />
                    <input className="border p-2 rounded" placeholder="Họ tên" value={form.fullName} onChange={e=>setForm({...form, fullName: e.target.value})} />
                    <input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
                    <button onClick={handleCreate} className="bg-green-600 text-white rounded font-bold hover:bg-green-700">Thêm</button>
                </div>
            </div>

            {/* SEARCH */}
            <div className="flex gap-2">
                <input 
                    className="border p-2 rounded flex-1" placeholder="🔍 Tìm kiếm user (tên, email...)" 
                    value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">Tìm kiếm</button>
            </div>

            {/* DANH SÁCH USER */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-3 border-b">ID</th>
                            <th className="p-3 border-b">Username</th>
                            <th className="p-3 border-b">Email</th>
                            <th className="p-3 border-b">Quyền (Roles)</th>
                            <th className="p-3 border-b text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading ? <tr><td colSpan="5" className="p-4 text-center">Đang tải...</td></tr> : 
                         users.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-gray-500">Không có user nào.</td></tr> :
                         users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50 border-b last:border-0">
                                <td className="p-3">{u.id}</td>
                                <td className="p-3 font-medium">{u.username}</td>
                                <td className="p-3 text-gray-600">{u.email}</td>
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                        {u.roleTypes && u.roleTypes.map(r => (
                                            <span key={r} className={`px-2 py-0.5 rounded text-xs font-bold ${r === 'OWNER' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                    {/* MENU ĐỔI QUYỀN: CHỈ CÒN ADMIN VÀ OWNER */}
                                    <select 
                                        className="mt-1 text-xs border rounded p-1 bg-white cursor-pointer hover:border-blue-500 focus:outline-none"
                                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                                        value=""
                                    >
                                        <option value="" disabled>-- Cấp quyền --</option>
                                        <option value="ADMIN">Set ADMIN</option>
                                        <option value="OWNER">Set OWNER</option>
                                    </select>
                                </td>
                                <td className="p-3 text-right space-x-2">
                                    <button onClick={() => handleViewDetail(u.id)} className="text-blue-600 hover:underline font-medium">Chi tiết</button>
                                    <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 font-medium">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PHÂN TRANG */}
            {totalPages > 0 && (
                <div className="flex justify-between items-center border-t pt-4">
                    <span className="text-sm text-gray-600">Trang <b>{page + 1}</b> / <b>{totalPages}</b></span>
                    <div className="flex gap-2">
                        <button disabled={page === 0} onClick={() => changePage(page - 1)} className="px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50">&laquo; Trước</button>
                        <button disabled={page >= totalPages - 1} onClick={() => changePage(page + 1)} className="px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50">Sau &raquo;</button>
                    </div>
                </div>
            )}

            {/* MODAL CHI TIẾT */}
            {showModal && detailUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl relative animate-fadeIn">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-xl font-bold">Thông tin User #{detailUser.id}</h3>
                            <button onClick={() => setShowModal(false)} className="text-2xl font-bold text-gray-400 hover:text-red-500">&times;</button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <p><span className="font-bold w-24 inline-block">Username:</span> {detailUser.username}</p>
                            <p><span className="font-bold w-24 inline-block">Họ tên:</span> {detailUser.fullName}</p>
                            <p><span className="font-bold w-24 inline-block">Email:</span> {detailUser.email}</p>
                            <p><span className="font-bold w-24 inline-block">SĐT:</span> {detailUser.phone || 'Chưa cập nhật'}</p>
                            <p><span className="font-bold w-24 inline-block">Ngày tạo:</span> {new Date(detailUser.createdAt).toLocaleString()}</p>
                            <div className="mt-4 pt-4 border-t">
                                <span className="font-bold block mb-1">Các quyền hạn:</span>
                                <div className="flex gap-2">
                                    {detailUser.roleTypes?.map(r => (
                                        <span key={r} className={`px-3 py-1 rounded text-xs font-bold text-white ${r === 'OWNER' ? 'bg-purple-600' : 'bg-red-600'}`}>
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 text-right">
                            <button onClick={() => setShowModal(false)} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManager;