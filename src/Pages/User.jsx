function User() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-r from-slate-900 to-slate-700 px-6">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white/90 p-8 shadow-xl">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Đăng nhập</h1>
          <p className="mt-2 text-sm text-slate-500">Tiếp tục để quản lý đơn hàng và lưu sản phẩm yêu thích.</p>
        </header>

        <form className="space-y-4">
          <div className="space-y-2 text-left">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-2 text-left">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-blue-500"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Bằng việc tiếp tục, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của SopPings.
        </p>
      </div>
    </main>
  );
}

export default User;