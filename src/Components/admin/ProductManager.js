import React, { useState, useEffect } from 'react';
import productApi from '../../api/productApi'; // Import cái API mới viết ở bước 3

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ /* ...copy state cũ... */ });
    const [files, setFiles] = useState([]);

    // Load data dùng axios (ngắn hơn fetch nhiều)
    useEffect(() => {
        const load = async () => {
            try {
                const res = await productApi.getAll();
                setProducts(res.result?.content || []); 
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    const handleCreate = async () => {
        try {
            // Gọi hàm create đã viết sẵn ở productApi
            // Không cần lo vụ Blob hay Header nữa
            await productApi.create(form, files);
            alert("Thêm thành công!");
            // load lại list...
        } catch (err) {
            alert("Lỗi: " + err.message);
        }
    };

    return (
        <div>
           {/* COPY NGUYÊN CÁI UI PHẦN PRODUCT TAB VÀO ĐÂY */}
           {/* Form nhập liệu */}
           {/* Bảng danh sách */}
        </div>
    );
};

export default ProductManager;