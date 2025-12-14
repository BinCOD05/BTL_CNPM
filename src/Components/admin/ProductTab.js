import React, { useState, useEffect } from 'react';
import { API_BASE, getHeaders } from './apiConfig'; // Import từ file config trên

const ProductTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  
  // Form state
  const [form, setForm] = useState({
    name: '', price: '', stock: '', description: '',
    brandId: '', categoryId: '', color: '', storage: '',
    isActive: true,
    specs: [{ name: '', value: '' }],
    images: [{ primary: true, sortOrder: 1 }]
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`, { headers: getHeaders() });
      const data = await res.json();
      setProducts(data.result?.content || data.result || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // --- LOGIC QUAN TRỌNG NHẤT: GỬI FORM DATA CHO SPRING BOOT ---
  const handleCreate = async () => {
    try {
      const fd = new FormData();

      // 1. Chuẩn bị Object DTO
      const productDTO = {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        color: form.color,
        storage: form.storage,
        isActive: form.isActive,
        brandId: Number(form.brandId),
        categoryId: Number(form.categoryId),
        specs: form.specs,
        images: form.images // Metadata (primary, sortOrder)
      };

      // 2. BỌC JSON VÀO BLOB (BẮT BUỘC VỚI SPRING BOOT @RequestPart)
      const jsonBlob = new Blob([JSON.stringify(productDTO)], { type: 'application/json' });
      fd.append('product', jsonBlob);

      // 3. Append Files
      if (files && files.length > 0) {
        Array.from(files).forEach(file => fd.append('files', file));
      }

      // 4. Gửi Request (Header isMultipart = true để không set Content-Type json)
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getHeaders(true), // true = multipart
        body: fd
      });

      if (!res.ok) throw new Error(await res.text());
      
      alert('Tạo sản phẩm thành công!');
      fetchProducts();
      // Reset form logic here if needed...
      setFiles([]);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa nhé?')) return;
    try {
        await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: getHeaders() });
        fetchProducts();
    } catch(e) { alert(e.message) }
  };

  // --- Helper để update specs/images trong form ---
  const updateSpec = (idx, field, val) => {
    const newSpecs = [...form.specs];
    newSpecs[idx][field] = val;
    setForm({ ...form, specs: newSpecs });
  };

  return (
    <div className="space-y-6">
      {/* Form Tạo */}
      <div className="bg-gray-50 p-4 rounded border grid grid-cols-2 gap-4">
        <input className="p-2 border rounded" placeholder="Tên SP" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input className="p-2 border rounded" placeholder="Giá" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
        <input className="p-2 border rounded" placeholder="Brand ID" type="number" value={form.brandId} onChange={e => setForm({...form, brandId: e.target.value})} />
        <input className="p-2 border rounded" placeholder="Category ID" type="number" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} />
        <input className="p-2 border rounded" placeholder="Kho" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
        
        {/* Input File */}
        <div className="col-span-2">
            <label className="block text-sm font-medium">Ảnh sản phẩm:</label>
            <input type="file" multiple onChange={e => setFiles(e.target.files)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        </div>

        {/* Specs Dynamic Form */}
        <div className="col-span-2">
            <h4 className="font-semibold">Thông số kỹ thuật:</h4>
            {form.specs.map((spec, i) => (
                <div key={i} className="flex gap-2 mt-2">
                    <input placeholder="Tên (VD: RAM)" value={spec.name} onChange={e => updateSpec(i, 'name', e.target.value)} className="border p-1 flex-1"/>
                    <input placeholder="Giá trị (VD: 8GB)" value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} className="border p-1 flex-1"/>
                    <button onClick={() => {
                        const newSpecs = form.specs.filter((_, idx) => idx !== i);
                        setForm({...form, specs: newSpecs});
                    }} className="text-red-500">Xóa</button>
                </div>
            ))}
            <button onClick={() => setForm({...form, specs: [...form.specs, {name: '', value: ''}]})} className="text-blue-600 text-sm mt-1">+ Thêm thông số</button>
        </div>

        <button onClick={handleCreate} className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Tạo Sản Phẩm Mới</button>
      </div>

      {/* List Products */}
      {loading ? <p>Đang tải...</p> : (
        <div className="grid grid-cols-1 gap-3">
          {products.map(p => (
            <div key={p.id} className="border p-3 rounded flex justify-between items-center bg-white shadow-sm">
              <div>
                <p className="font-bold">{p.name}</p>
                <p className="text-sm text-gray-600">{p.price.toLocaleString()} VNĐ - Kho: {p.stock}</p>
              </div>
              <button onClick={() => handleDelete(p.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded">Xóa</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductTab;