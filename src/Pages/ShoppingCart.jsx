import React from 'react';
const emptyCartTips = [
  'Khám phá danh mục để tìm sản phẩm yêu thích.',
  'Sử dụng tính năng lọc để chọn đúng nhu cầu của bạn.',
  'Theo dõi khuyến mãi hàng tuần để nhận ưu đãi tốt nhất.',
];

function ShoppingCart() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-24">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Giỏ hàng của bạn</h1>
          <p className="text-sm text-slate-500">Bạn chưa có sản phẩm nào trong giỏ. Hãy tiếp tục mua sắm!</p>
        </header>

        <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
              <path d="M7.02 4.5a2.25 2.25 0 0 1 2.25-2.25h5.25a2.25 2.25 0 0 1 2.25 2.25V6h2.25a.75.75 0 0 1 .74.86l-1.5 10.5A2.25 2.25 0 0 1 15.03 19.5H8.97a2.25 2.25 0 0 1-2.22-2.14L5.25 6.75A.75.75 0 0 1 6 6h1.02V4.5Zm1.5 0V6h6V4.5a.75.75 0 0 0-.75-.75H9.27a.75.75 0 0 0-.75.75Zm.72 5.03a.75.75 0 0 1 .81.69l.3 4.5a.75.75 0 0 1-1.5.1l-.3-4.5a.75.75 0 0 1 .69-.81Zm5.22.81-.3 4.5a.75.75 0 0 1-1.5-.1l.3-4.5a.75.75 0 0 1 1.5.1Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Chưa có sản phẩm</h2>
          <ul className="space-y-2 text-sm text-slate-500">
            {emptyCartTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <a
            href="/category"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-blue-500"
          >
            Khám phá sản phẩm
          </a>
        </div>
      </section>
    </main>
  );
}

export default ShoppingCart;