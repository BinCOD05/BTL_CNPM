import React, { useState, useEffect } from 'react';
import { API_BASE, getHeaders } from '../../api/apiConfig';

const PAGE_SIZE = 5;

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State tìm kiếm & phân trang
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // State danh mục & thương hiệu (lấy từ API)
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    // State form
    const [form, setForm] = useState({
        name: '', 
        price: '', 
        stock: '', 
        description: '',
        brandId: '', 
        categoryId: '', 
        color: '', 
        storage: '',
        isActive: true,
        specs: [] 
    });

    // State upload ảnh
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [primaryIndex, setPrimaryIndex] = useState(0);

    // State spec tạm thời
    const [tempSpec, setTempSpec] = useState({ name: '', value: '' });

    // State Modal chi tiết
    const [detailProduct, setDetailProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // --- 1. KHỞI TẠO DỮ LIỆU ---
    useEffect(() => {
        fetchProducts(0, '');
        fetchMetadata(); // Gọi API lấy Hãng & Danh mục ngay khi vào trang
    }, []);

    const fetchMetadata = async () => {
        try {
            // Lấy danh sách Thương hiệu
            const resB = await fetch(`${API_BASE}/brands`, { headers: getHeaders() });
            const dataB = await resB.json();
            const brandList = dataB.result || [];
            setBrands(brandList);

            // Lấy danh sách Danh mục
            const resC = await fetch(`${API_BASE}/categories`, { headers: getHeaders() });
            const dataC = await resC.json();
            const catList = dataC.result || [];
            setCategories(catList);
            
            // Tự động chọn giá trị đầu tiên cho form để không bị rỗng
            setForm(prev => ({
                ...prev,
                brandId: brandList.length > 0 ? brandList[0].id : '',
                categoryId: catList.length > 0 ? catList[0].id : ''
            }));

        } catch (e) { 
            console.error("Lỗi lấy metadata:", e); 
        }
    };

    const fetchProducts = async (pageIndex = 0, searchKeyword = keyword) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', pageIndex);
            params.append('size', PAGE_SIZE);
            if (searchKeyword) params.append('keyword', searchKeyword);

            const res = await fetch(`${API_BASE}/products?${params.toString()}`, { headers: getHeaders() });
            const data = await res.json();
            
            if (data.result && data.result.content) {
                setProducts(data.result.content);
                setTotalPages(data.result.totalPage || 0);
                setPage(pageIndex);
            } else {
                setProducts([]);
                setTotalPages(0);
            }
        } catch (error) { 
            console.error(error); 
            setProducts([]);
        }
        setLoading(false);
    };

    // --- 2. XỬ LÝ FILE ẢNH ---
    const handleFileSelect = (e) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length > 0) {
            setSelectedFiles(prev => [...prev, ...newFiles]);
            e.target.value = null; 
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        if (index === primaryIndex) setPrimaryIndex(0);
        else if (index < primaryIndex) setPrimaryIndex(prev => prev - 1);
    };

    // --- 3. XỬ LÝ SPECS ---
    const addSpec = () => {
        if (tempSpec.name && tempSpec.value) {
            setForm(prev => ({ ...prev, specs: [...prev.specs, tempSpec] }));
            setTempSpec({ name: '', value: '' });
        }
    };
    const removeSpec = (index) => {
        setForm(prev => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));
    };

    // --- 4. TẠO SẢN PHẨM ---
    const handleCreate = async () => {
        try {
            // Validate cơ bản
            if (selectedFiles.length === 0) return alert("⚠️ Vui lòng chọn ít nhất 1 ảnh!");
            if (!form.name || !form.price) return alert("⚠️ Tên và Giá không được để trống!");
            if (!form.brandId || !form.categoryId) return alert("⚠️ Vui lòng chọn Hãng và Danh mục!");

            const fd = new FormData();
            
            // Map thông tin ảnh (cái nào là ảnh chính)
            const imagesMeta = selectedFiles.map((_, index) => ({
                primary: index === primaryIndex, 
                sortOrder: index + 1
            }));

            // Tạo object Product gửi lên
            const productObj = {
                name: form.name,
                price: Number(form.price),
                stock: Number(form.stock),
                description: form.description,
                brandId: Number(form.brandId),
                categoryId: Number(form.categoryId),
                color: form.color,
                storage: form.storage,
                isActive: true,
                specs: form.specs,
                images: imagesMeta 
            };

            // Đóng gói vào FormData
            const jsonBlob = new Blob([JSON.stringify(productObj)], { type: 'application/json' });
            fd.append('product', jsonBlob);
            selectedFiles.forEach((file) => fd.append('files', file));

            const res = await fetch(`${API_BASE}/products`, {
                method: 'POST',
                headers: getHeaders(true), // true để không set Content-Type JSON (để browser tự set multipart)
                body: fd
            });
            
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt);
            }

            alert("✅ Thêm sản phẩm thành công!");
            fetchProducts(0, keyword); 
            
            // Reset form về mặc định
            setSelectedFiles([]);
            setPrimaryIndex(0);
            setForm({
                name: '', price: '', stock: '', description: '',
                brandId: brands.length > 0 ? brands[0].id : '', 
                categoryId: categories.length > 0 ? categories[0].id : '',
                color: '', storage: '', isActive: true, specs: []
            });

        } catch (err) { 
            alert("❌ Lỗi: " + err.message); 
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return;
        try {
            await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: getHeaders() });
            fetchProducts(page, keyword);
        } catch(e) { alert(e.message); }
    };

    const handleSearch = () => fetchProducts(0, keyword);
    const changePage = (newPage) => { if (newPage >= 0 && newPage < totalPages) fetchProducts(newPage, keyword); };

    // --- 5. XEM CHI TIẾT ---
    const handleViewDetail = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/products/${id}`, { headers: getHeaders() });
            const data = await res.json();
            if (res.ok) {
                setDetailProduct(data.result);
                setShowModal(true);
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="bg-white p-6 rounded shadow space-y-6 relative font-sans">
            <h2 className="text-xl font-bold text-gray-800">Quản lý Sản phẩm</h2>
            
            {/* === FORM THÊM MỚI === */}
            <div className="border p-4 rounded bg-gray-50 space-y-4">
                <h3 className="font-bold text-blue-700 border-b pb-2">Thêm sản phẩm mới</h3>
                
                {/* Hàng 1: Tên, Giá, Kho */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Tên sản phẩm (*)</label>
                        <input className="w-full border p-2 rounded mt-1" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Giá bán (*)</label>
                        <input className="w-full border p-2 rounded mt-1" type="number" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Tồn kho</label>
                        <input className="w-full border p-2 rounded mt-1" type="number" value={form.stock} onChange={e=>setForm({...form, stock: e.target.value})} />
                    </div>
                </div>

                {/* Hàng 2: Hãng, Danh mục, Màu, Bộ nhớ */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Thương hiệu</label>
                        <select className="w-full border p-2 rounded mt-1" value={form.brandId} onChange={e=>setForm({...form, brandId: e.target.value})}>
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Danh mục</label>
                        <select className="w-full border p-2 rounded mt-1" value={form.categoryId} onChange={e=>setForm({...form, categoryId: e.target.value})}>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Màu sắc</label>
                        <input className="w-full border p-2 rounded mt-1" placeholder="VD: Titan Black" value={form.color} onChange={e=>setForm({...form, color: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Dung lượng</label>
                        <input className="w-full border p-2 rounded mt-1" placeholder="VD: 256GB" value={form.storage} onChange={e=>setForm({...form, storage: e.target.value})} />
                    </div>
                </div>

                {/* Hàng 3: Mô tả */}
                <div>
                    <label className="text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                    <textarea className="w-full border p-2 rounded mt-1 h-20" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
                </div>

                {/* Hàng 4: Upload Ảnh */}
                <div className="bg-white p-3 border rounded border-dashed border-gray-400">
                    <div className="flex justify-between items-center mb-2">
                        <label className="font-bold text-gray-700">Ảnh sản phẩm:</label>
                        <label className="cursor-pointer bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 transition">
                            + Tải ảnh lên
                            <input type="file" multiple onChange={handleFileSelect} className="hidden" />
                        </label>
                    </div>
                    {selectedFiles.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                            {selectedFiles.map((file, idx) => (
                                <div key={idx} onClick={() => setPrimaryIndex(idx)} className={`relative group border rounded p-1 cursor-pointer transition ${primaryIndex === idx ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`}>
                                    <div className="text-center py-2">
                                        <p className="text-xs text-gray-500 truncate px-1">{file.name}</p>
                                    </div>
                                    {primaryIndex === idx && <span className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] px-1 rounded-br">Ảnh chính</span>}
                                    <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="absolute top-0 right-0 text-red-500 bg-white rounded-bl px-1.5 hover:bg-red-50">×</button>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-gray-400 italic text-center py-2">Chưa có ảnh nào được chọn.</p>}
                </div>

                {/* Hàng 5: Thông số kỹ thuật (Specs) */}
                <div className="bg-white p-3 border rounded">
                    <p className="font-bold text-gray-700 mb-2">Thông số kỹ thuật (Tùy chọn):</p>
                    <div className="flex gap-2 mb-2">
                        <input className="border p-2 rounded flex-1 text-sm" placeholder="Tên thông số (VD: Chipset)" value={tempSpec.name} onChange={e=>setTempSpec({...tempSpec, name: e.target.value})} />
                        <input className="border p-2 rounded flex-1 text-sm" placeholder="Giá trị (VD: Apple A17 Pro)" value={tempSpec.value} onChange={e=>setTempSpec({...tempSpec, value: e.target.value})} />
                        <button onClick={addSpec} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">Thêm</button>
                    </div>
                    {form.specs.length > 0 && (
                        <div className="bg-gray-50 p-2 rounded text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
                            {form.specs.map((s, i) => (
                                <div key={i} className="flex justify-between items-center bg-white border p-2 rounded">
                                    <span className="truncate mr-2"><b>{s.name}:</b> {s.value}</span>
                                    <button onClick={() => removeSpec(i)} className="text-red-500 text-xs hover:underline">Xóa</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={handleCreate} className="w-full bg-blue-700 text-white py-3 rounded font-bold hover:bg-blue-800 shadow-md transform hover:scale-[1.005] transition-all">
                    LƯU SẢN PHẨM
                </button>
            </div>

            {/* === DANH SÁCH SẢN PHẨM === */}
            <div className="flex gap-2 border-t pt-6">
                <input className="border p-2 rounded flex-1" placeholder="🔍 Tìm kiếm theo tên sản phẩm..." value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                <button onClick={handleSearch} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">Tìm kiếm</button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Sản phẩm</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Thông tin</th>
                            <th className="py-2 px-4 border-b text-center text-sm font-semibold text-gray-600">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="3" className="text-center py-4">Đang tải...</td></tr> : products.length === 0 ? (
                            <tr><td colSpan="3" className="text-center py-4 text-gray-500">Không tìm thấy sản phẩm nào.</td></tr>
                        ) : (
                            products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 border-b">
                                        <div className="font-bold text-gray-800">{p.name}</div>
                                        <div className="text-sm text-gray-500">{p.brandName} - {p.categoryName}</div>
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        <div className="text-blue-600 font-bold">{Number(p.price).toLocaleString()}đ</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {p.color && <span className="bg-gray-100 px-1 rounded mr-1">{p.color}</span>}
                                            {p.storage && <span className="bg-gray-100 px-1 rounded">{p.storage}</span>}
                                            <span className="ml-2">Kho: {p.stock}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 border-b text-center space-x-2">
                                        <button onClick={() => handleViewDetail(p.id)} className="text-blue-600 hover:underline text-sm font-medium">Chi tiết</button>
                                        <span className="text-gray-300">|</span>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-sm font-medium">Xóa</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* === PHÂN TRANG === */}
            {totalPages > 0 && (
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <span className="text-sm text-gray-600">Trang <b>{page + 1}</b> / <b>{totalPages}</b></span>
                    <div className="flex gap-2">
                        <button disabled={page === 0} onClick={() => changePage(page - 1)} className="px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50 text-sm">Trước</button>
                        <button disabled={page >= totalPages - 1} onClick={() => changePage(page + 1)} className="px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50 text-sm">Sau</button>
                    </div>
                </div>
            )}

            {/* === MODAL CHI TIẾT === */}
            {showModal && detailProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-gray-800">Chi tiết sản phẩm #{detailProduct.id}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>
                        
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Cột trái: Ảnh */}
                            <div>
                                <h4 className="font-bold text-gray-700 mb-3">Hình ảnh</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {detailProduct.productImages && detailProduct.productImages.map((img, idx) => (
                                        <div key={idx} className="relative border rounded aspect-square flex items-center justify-center bg-gray-50 overflow-hidden">
                                            <img src={img.imageUrl} alt="sp" className="w-full h-full object-contain" />
                                            {img.primary && <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded shadow">Ảnh chính</span>}
                                        </div>
                                    ))}
                                    {(!detailProduct.productImages || detailProduct.productImages.length === 0) && <p className="text-gray-500 italic">Không có ảnh</p>}
                                </div>
                            </div>

                            {/* Cột phải: Thông tin */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{detailProduct.name}</h3>
                                    <p className="text-blue-600 text-xl font-bold mt-1">{Number(detailProduct.price).toLocaleString()}đ</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="flex justify-between border-b py-1"><span>Thương hiệu:</span> <span className="font-medium">{detailProduct.brand?.name || detailProduct.brandName}</span></div>
                                    <div className="flex justify-between border-b py-1"><span>Danh mục:</span> <span className="font-medium">{detailProduct.category?.name || detailProduct.categoryName}</span></div>
                                    <div className="flex justify-between border-b py-1"><span>Màu sắc:</span> <span className="font-medium">{detailProduct.color}</span></div>
                                    <div className="flex justify-between border-b py-1"><span>Bộ nhớ:</span> <span className="font-medium">{detailProduct.storage}</span></div>
                                    <div className="flex justify-between border-b py-1"><span>Tồn kho:</span> <span className="font-medium">{detailProduct.stock || detailProduct.inventory?.quantity}</span></div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Thông số kỹ thuật</h4>
                                    <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                                        {detailProduct.productSpecs && detailProduct.productSpecs.length > 0 ? detailProduct.productSpecs.map((s, i) => (
                                            <div key={i} className="flex justify-between">
                                                <span className="text-gray-500">{s.name}:</span>
                                                <span className="font-medium text-gray-800">{s.value}</span>
                                            </div>
                                        )) : <span className="italic text-gray-400">Không có thông số</span>}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Mô tả</h4>
                                    <p className="text-sm text-gray-600 whitespace-pre-line border p-3 rounded bg-gray-50 max-h-40 overflow-y-auto">
                                        {detailProduct.description || "Không có mô tả"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 text-right border-t">
                            <button onClick={() => setShowModal(false)} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 font-bold">Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;