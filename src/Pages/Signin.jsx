import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertCircle } from 'lucide-react';

// 1. Hàm tiện ích để giải mã JWT Token (không cần cài thư viện)
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

function SignIn() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hàm handle input chung cho gọn
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gọi API
      const res = await fetch('http://localhost:8081/auth/access-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Sai tên đăng nhập hoặc mật khẩu');
      }

      // Xử lý khi thành công
      const token = data.result?.accessToken || data.accessToken;
      
      if (!token) throw new Error('Không tìm thấy Token!');

      // Lưu token
      localStorage.setItem('authToken', token);
      
      // 2. LOGIC CHUYỂN HƯỚNG QUAN TRỌNG Ở ĐÂY
      const decoded = parseJwt(token);
      
      // Spring Boot thường để role trong field "scope" hoặc "roles"
      // Ví dụ: scope: "ROLE_ADMIN ROLE_USER"
      const userRoles = decoded?.scope || decoded?.roles || "";

      if (userRoles.includes('ADMIN')) {
          // Nếu là Admin -> vào trang quản lý
          navigate('/admin'); 
      } else {
          // Nếu là khách -> vào trang chủ
          navigate('/'); 
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Đăng Nhập</h1>
          <p className="mt-2 text-sm text-gray-500">Chào mừng bạn quay trở lại</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded bg-red-100 p-3 text-red-700 text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tài khoản</label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded border p-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded border p-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center items-center gap-2 rounded bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? <Loader className="animate-spin" size={18} /> : 'ĐĂNG NHẬP'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default SignIn;