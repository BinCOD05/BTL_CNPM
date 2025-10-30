import CategoryGrid from '../Components/CategoryGrid';

function Category() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-white pb-20 pt-10">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-sm uppercase tracking-widest text-blue-600">Khám phá sản phẩm</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Danh mục nổi bật</h1>
        <p className="mt-4 text-base text-slate-600">
          Chọn lựa những sản phẩm công nghệ hàng đầu được cập nhật liên tục theo xu hướng mới nhất trên thị trường.
        </p>
      </div>

      <CategoryGrid />
    </main>
  );
}

export default Category;