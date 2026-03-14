import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

export default function SearchFilter({ defaultKeyword = '', onSearch }) {
  const [keyword, setKeyword] = useState(defaultKeyword);

  const submit = (e) => {
    e?.preventDefault();
    if (onSearch) onSearch({ keyword: keyword.trim() || '' });
  };

  return (
    <form onSubmit={submit} className="w-full max-w-3xl mx-auto relative z-20">
      <div className="relative group">
        
        {/* Icon Search bên trái */}
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          aria-label="Tìm kiếm sản phẩm"
          placeholder="Tìm tên sản phẩm, thương hiệu (VD: iPhone 15, MacBook Pro...)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="block w-full pl-12 pr-36 py-4 bg-gray-100 border-2 border-transparent rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-inner focus:shadow-lg text-base"
        />

        {/* Nút Submit nằm bên trong */}
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            type="submit"
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl"
          >
            Tìm kiếm
          </button>
        </div>

      </div>
    </form>
  );
}