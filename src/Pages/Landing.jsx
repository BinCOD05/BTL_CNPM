import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative min-h-screen hero-bg flex items-center">
        <div className="hero-pattern absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-6 py-28 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500
         bg-clip-text text-transparent mb-4">Chào mừng đến với <span className='font-black tracking-wider text-slate-900 font-Bebas'> SopPings</span></h1>
              <p className="text-lg text-slate-700 mb-6">Cửa hàng công nghệ tinh giản — trải nghiệm mua sắm nhanh chóng, dịch vụ tận tâm.</p>

              <div className="flex items-center gap-4">
                <Link to="/store" className="inline-block bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-semibold transition">Mua sắm</Link>
                <a href="#features" className="text-sm text-slate-700 hover:underline">Tìm hiểu thêm</a>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <img src="/public/images/img.jpg" alt="SopPings" className="w-full h-96 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 text-center">
              <h3 className="text-xl font-bold">Tuyển chọn</h3>
              <p className="text-sm text-slate-600">Sản phẩm được lựa chọn theo tiêu chí chất lượng và thiết kế.</p>
            </div>
            <div className="space-y-4 text-center">
              <h3 className="text-xl font-bold">Giao nhanh</h3>
              <p className="text-sm text-slate-600">Giao hàng trong ngày với khu vực nội thành.</p>
            </div>
            <div className="space-y-4 text-center">
              <h3 className="text-xl font-bold">Hỗ trợ tận tâm</h3>
              <p className="text-sm text-slate-600">Đổi trả và bảo hành chính hãng dễ dàng.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-black mb-4">Bắt đầu khám phá</h2>
          <p className="text-slate-600 mb-8">Duyệt qua danh mục sản phẩm hoặc tìm theo thương hiệu yêu thích.</p>
          <Link to="/store" className="inline-block bg-white border border-slate-900 px-6 py-3 rounded-xl font-semibold">Vào cửa hàng</Link>
        </div>
      </section>
    </main>
  );
}

export default Landing;
