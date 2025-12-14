import React from 'react';

export default function Banner() {
  return (
    <section className="promo-banner relative overflow-hidden my-10">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">Ưu Đãi Đặc Biệt — Chỉ Trong Thời Gian Ngắn</h2>
            <p className="text-slate-600 mt-2">Những chiếc tai nghe/điện thoại &amp; laptop chọn lọc, giảm giá độc quyền. Mua ngay trước khi hết hàng.</p>
          </div>

          <div className="flex-shrink-0">
            <a href="#products" className="inline-flex items-center gap-3 px-6 py-3 bg-black text-white rounded-lg font-semibold shadow-md hover:opacity-95 transition">Khám phá</a>
          </div>
        </div>
      </div>

      {/* decorative floating shapes */}
      <div className="absolute -left-10 -top-10 w-60 h-60 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 opacity-80 blur-2xl animate-blob" aria-hidden="true"></div>
      <div className="absolute -right-16 -bottom-12 w-72 h-72 rounded-full bg-gradient-to-tr from-slate-50 to-white opacity-90 blur-2xl animate-blob animation-delay-2000" aria-hidden="true"></div>
    </section>
  );
}
