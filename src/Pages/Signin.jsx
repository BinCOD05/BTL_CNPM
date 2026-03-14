import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, User, Mail, Lock, Phone } from 'lucide-react';

function SignIn() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '',
    confirmPassword: '', 
    fullName: '',        
    email: '',           
    phone: ''            
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:8081/auth/access-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');
      
      const token = data.result?.accessToken || data.accessToken;
      if (!token) throw new Error('Lỗi: Không nhận được Token');
      
      // 1. Lưu token
      localStorage.setItem('authToken', token);

      // 2. QUAN TRỌNG: Bắn sự kiện để Header cập nhật lại giao diện (thay nút Đăng nhập bằng Avatar)
      window.dispatchEvent(new Event('authChanged'));

      // 3. Lấy thông tin user để điều hướng (Admin về Dashboard, User về Home)
      const profileRes = await fetch('http://localhost:8081/api/users/me', { headers: { 'Authorization': `Bearer ${token}` } });
      if (profileRes.ok) {
          const profileData = await profileRes.json();
          // Lưu info vào local để Header dùng tạm
          localStorage.setItem('userInfo', JSON.stringify(profileData.result));
          
          const roles = profileData.result?.roleTypes || [];
          navigate(roles.includes('ADMIN') ? '/admin' : '/');
      } else {
          navigate('/');
      }
    } catch (err) { 
        setError(err.message); 
    }
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp!");
        setLoading(false);
        return;
    }
    try {
      const res = await fetch('http://localhost:8081/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: formData.username,
            fullName: formData.fullName,
            password: formData.password,
            phone: formData.phone,
            email: formData.email
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại');
      
      setSuccessMsg("Đăng ký thành công! Hãy đăng nhập ngay.");
      setIsRegister(false);
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (err) { setError(err.message); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg(''); setLoading(true);
    if (isRegister) await handleRegister(); else await handleLogin();
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 px-4 pt-28 pb-12 flex justify-center overflow-y-auto font-sans">
      <div className={`w-full ${isRegister ? 'max-w-2xl' : 'max-w-md'} space-y-6 rounded-2xl bg-white p-8 shadow-2xl h-fit transition-all duration-300`}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {isRegister ? 'Tạo Tài Khoản' : 'Đăng Nhập'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isRegister ? 'Điền thông tin để tham gia cùng chúng tôi' : 'Chào mừng bạn quay trở lại'}
          </p>
        </div>

        {error && <div className="flex items-center gap-2 rounded bg-red-100 p-3 text-red-700 text-sm"><AlertCircle size={18} /> {error}</div>}
        {successMsg && <div className="flex items-center gap-2 rounded bg-green-100 p-3 text-green-700 text-sm"><AlertCircle size={18} /> {successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className={`${isRegister ? 'grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0' : 'space-y-4'}`}>
            
            {/* Username - Full Width */}
            <div className={isRegister ? "md:col-span-2" : ""}>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tài khoản</label>
              <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input id="username" type="text" value={formData.username} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 pl-10 p-3 text-sm focus:border-blue-500 focus:outline-none" placeholder="Nhập username" />
              </div>
            </div>

            {isRegister && (
              <>
                  <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Họ và tên</label>
                      <input id="fullName" type="text" value={formData.fullName} onChange={handleChange} required className="w-full rounded-lg border p-3 text-sm focus:border-blue-500 focus:outline-none" placeholder="Nguyễn Văn A" />
                  </div>
                  <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Số điện thoại</label>
                      <div className="relative">
                          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input id="phone" type="tel" value={formData.phone} onChange={handleChange} required className="w-full rounded-lg border pl-10 p-3 text-sm focus:border-blue-500 focus:outline-none" placeholder="0912..." />
                      </div>
                  </div>
                  <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                      <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input id="email" type="email" value={formData.email} onChange={handleChange} required className="w-full rounded-lg border pl-10 p-3 text-sm focus:border-blue-500 focus:outline-none" placeholder="email@example.com" />
                      </div>
                  </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input id="password" type="password" value={formData.password} onChange={handleChange} required className="w-full rounded-lg border pl-10 p-3 text-sm focus:border-blue-500 focus:outline-none" placeholder="••••••••" />
              </div>
            </div>

            {isRegister && (
              <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                  <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="w-full rounded-lg border pl-10 p-3 text-sm focus:border-blue-500 focus:outline-none" placeholder="Nhập lại mật khẩu" />
                  </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-70 transition-colors mt-6">
            {loading ? <Loader className="animate-spin" size={18} /> : (isRegister ? 'ĐĂNG KÝ NGAY' : 'ĐĂNG NHẬP')}
          </button>
        </form>

        <div className="text-center text-sm">
            <p className="text-gray-600">
                {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); setSuccessMsg(''); }} className="ml-2 font-bold text-blue-600 hover:underline">
                    {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
                </button>
            </p>
        </div>
      </div>
    </main>
  );
}
export default SignIn;