import React, { useState } from 'react';

export default function SearchFilter({ defaultKeyword = '', onSearch }) {
  const [keyword, setKeyword] = useState(defaultKeyword);

  const submit = (e) => {
    e?.preventDefault();
    if (onSearch) onSearch({ keyword: keyword || '' });
  };

  return (
    <form onSubmit={submit} className="max-w-4xl mx-auto mt-6 mb-8 px-4">
      <div className="rounded-2xl p-3 flex items-center gap-3 border border-gray-200/20 bg-transparent shadow-sm">
        <input
          aria-label="Từ khóa"
          placeholder="Tìm kiếm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 border border-transparent rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-gray-400 bg-transparent text-slate-800"
        />

        <button type="submit" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium shadow hover:scale-105 transform transition">Tìm</button>
      </div>
    </form>
  );
}
