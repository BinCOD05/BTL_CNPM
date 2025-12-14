import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Lock, LogOut, Loader, AlertCircle, CheckCircle, MapPin, Trash2, Plus } from 'lucide-react';

const API_BASE_URL = '/api';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [animateItems, setAnimateItems] = useState(false);
  
  // Address management states
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState(null);
  
  const [addressForm, setAddressForm] = useState({
    recipient: '',
    phone: '',
    line1: '',
    line2: '',
    ward: '',
    district: '',
    city: '',
    addressType: 'HOME',
    defaultAddress: false
  });

  const [passwordForm, setPasswordForm] = useState({
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const getAuthToken = () => localStorage.getItem('authToken') || '';

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        setError('Vui lòng đăng nhập');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Không thể tải thông tin');
      const data = await response.json();
      setUserData(data.result);
      setError(null);
      setAnimateItems(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/users/address`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Không thể tải địa chỉ');
      const data = await response.json();
      setAddresses(data.result || []);
      setAddressError(null);
    } catch (err) {
      setAddressError(err.message);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddressError(null);

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/users/address`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(addressForm)
      });

      if (!response.ok) throw new Error('Không thể thêm địa chỉ');
      
      await fetchAddresses();
      setAddressForm({
        recipient: '',
        phone: '',
        line1: '',
        line2: '',
        ward: '',
        district: '',
        city: '',
        addressType: 'HOME',
        defaultAddress: false
      });
      setShowAddressForm(false);
    } catch (err) {
      setAddressError(err.message);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/users/address/${addressId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Không thể cập nhật địa chỉ');
      
      await fetchAddresses();
    } catch (err) {
      setAddressError(err.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/users/address/${addressId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Không thể xóa địa chỉ');
      
      await fetchAddresses();
    } catch (err) {
      setAddressError(err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu mới không khớp');
      return;
    }

    setChangingPassword(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/users/change-pwd`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          password: passwordForm.password,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Không thể đổi mật khẩu');
      }

      setPasswordSuccess('Đổi mật khẩu thành công');
      setPasswordForm({ password: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowChangePassword(false), 2000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    navigate('/signin');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-12 flex items-center justify-center">
        <style>{`
          @keyframes spin-slow {
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 2s linear infinite;
          }
        `}</style>
        <Loader className="h-12 w-12 animate-spin-slow text-gray-900" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-12">
        <style>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideDown {
            animation: slideDown 0.5s ease-out;
          }
        `}</style>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="bg-gray-100 border-2 border-gray-900 rounded-xl p-8 text-center animate-slideDown">
            <AlertCircle className="h-12 w-12 text-gray-900 mx-auto mb-4" />
            <p className="text-gray-900 font-bold font-Roboto text-xl mb-6">Lỗi: {error}</p>
            <button 
              onClick={fetchProfile}
              className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-lg font-bold font-Roboto transition hover:scale-105 active:scale-95"
            >
              Thử lại
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white pt-24 pb-12">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse-light {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1); }
          50% { box-shadow: 0 0 0 8px rgba(0, 0, 0, 0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }
        .animate-pulse-light {
          animation: pulse-light 2s infinite;
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }
      `}</style>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 animate-fadeInUp">
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-2 tracking-wider">TÀI KHOẢN CỦA BẠN</h1>
          <div className="h-1 w-20 bg-gray-900 rounded-full"></div>
          <p className="text-gray-700 text-lg mt-4 font-medium">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
        </div>

        {userData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info - Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border-2 border-gray-900 p-8 sticky top-24 animate-slideInLeft shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6 animate-scaleIn stagger-1">
                    <div className="absolute inset-0 bg-gray-900 rounded-full opacity-20 animate-pulse-light"></div>
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gray-900">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1 font-Bebas">
                    {userData.fullName || userData.username}
                  </h2>
                  <p className="text-sm text-gray-600 mb-6 font-medium">@{userData.username}</p>
                  <div className="w-full pt-6 border-t-2 border-gray-900 animate-fadeInUp stagger-2">
                    <p className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">Thành viên từ</p>
                    <p className="font-black text-gray-900 font-Bebas">
                      {new Date(userData.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Right */}
            <div className="lg:col-span-2 space-y-8">
              {/* Account Information */}
              <div className="bg-white rounded-xl border-2 border-gray-900 p-8 animate-slideInRight shadow-lg">
                <h3 className="text-3xl font-black text-gray-900 mb-8 font-Roboto flex items-center gap-3 uppercase tracking-wider">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  Thông tin tài khoản
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className={`opacity-0 animate-fadeInUp stagger-1 ${animateItems ? 'opacity-100' : ''}`}>
                    <label className="block text-xs font-black text-gray-700 mb-3 uppercase tracking-wider">Tên đăng nhập</label>
                    <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 transition-all duration-300 hover:border-gray-500">
                      <p className="text-gray-900 font-bold">{userData.username}</p>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className={`opacity-0 animate-fadeInUp stagger-2 ${animateItems ? 'opacity-100' : ''}`}>
                    <label className="block text-xs font-black text-gray-700 mb-3 uppercase tracking-wider">Họ và tên</label>
                    <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 transition-all duration-300 hover:border-gray-500">
                      <p className="text-gray-900 font-bold">{userData.fullName || '-'}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className={`md:col-span-2 opacity-0 animate-fadeInUp stagger-3 ${animateItems ? 'opacity-100' : ''}`}>
                    <label className="flex text-xs font-black text-gray-700 mb-3 gap-2 uppercase tracking-wider">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 transition-all duration-300 hover:border-gray-500">
                      <p className="text-gray-900 font-bold">{userData.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className={`opacity-0 animate-fadeInUp stagger-4 ${animateItems ? 'opacity-100' : ''}`}>
                    <label className="flex text-xs font-black text-gray-700 mb-3 gap-2 uppercase tracking-wider">
                      <Phone className="h-4 w-4" />
                      Số điện thoại
                    </label>
                    <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 transition-all duration-300 hover:border-gray-500">
                      <p className="text-gray-900 font-bold">{userData.phone || '-'}</p>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className={`opacity-0 animate-fadeInUp stagger-5 ${animateItems ? 'opacity-100' : ''}`}>
                    <label className="block text-xs font-black text-gray-700 mb-3 uppercase tracking-wider">Giới tính</label>
                    <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 transition-all duration-300 hover:border-gray-500">
                      <p className="text-gray-900 font-bold">{userData.gender || '-'}</p>
                    </div>
                  </div>

                  {/* Created At */}
                  <div className={`opacity-0 animate-fadeInUp stagger-6 ${animateItems ? 'opacity-100' : ''}`}>
                    <label className="flex text-xs font-black text-gray-700 mb-3 gap-2 uppercase tracking-wider">
                      <Calendar className="h-4 w-4" />
                      Ngày tạo
                    </label>
                    <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 transition-all duration-300 hover:border-gray-500">
                      <p className="text-gray-900 font-bold">
                        {new Date(userData.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Management */}
              <div className="bg-white rounded-xl border-2 border-gray-900 p-8 shadow-lg animate-fadeInUp">
                <h3 className="text-3xl font-black text-gray-900 mb-6 font-Roboto flex items-center gap-3 uppercase tracking-wide">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  Quản lý địa chỉ
                </h3>

                {addressError && (
                  <div className="flex items-center gap-3 rounded-lg bg-gray-100 border-2 border-gray-900 p-4 mb-6 animate-slideInLeft">
                    <AlertCircle className="h-5 w-5 text-gray-900 flex-shrink-0" />
                    <p className="text-gray-900 font-bold">{addressError}</p>
                  </div>
                )}

                {/* Address List */}
                <div className="mb-6 space-y-4">
                  {loadingAddresses ? (
                    <div className="flex justify-center py-8">
                      <Loader className="h-8 w-8 animate-spin text-gray-900" />
                    </div>
                  ) : addresses.length > 0 ? (
                    addresses.map((addr, idx) => (
                      <div key={addr.id} className={`border-2 border-gray-300 rounded-lg p-4 relative opacity-0 animate-fadeInUp ${animateItems ? 'opacity-100' : ''}`} style={{animationDelay: `${idx * 0.1}s`}}>
                        {addr.defaultAddress && (
                          <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded">
                            ★ Địa chỉ chính
                          </div>
                        )}
                        <div className="pr-40">
                          <p className="font-black text-gray-900 text-lg">{addr.recipient}</p>
                          <p className="text-sm text-gray-600">{addr.line1}{addr.line2 && `, ${addr.line2}`}</p>
                          <p className="text-sm text-gray-600">{addr.ward}, {addr.district}, {addr.city}</p>
                          <p className="text-sm text-gray-600 mt-2 font-medium">
                            <Phone className="inline h-4 w-4 mr-1" />
                            {addr.phone}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          {!addr.defaultAddress && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-2 rounded-lg text-sm transition-all hover:scale-105 active:scale-95"
                            >
                              Đặt chính
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 rounded-lg text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 py-8">Chưa có địa chỉ nào</p>
                  )}
                </div>

                {/* Add Address Button */}
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-lg transition-all flex items-center justify-center gap-2 font-Roboto text-lg uppercase tracking-wider hover:scale-105 active:scale-95 hover:shadow-lg"
                  >
                    <Plus className="h-5 w-5" />
                    Thêm địa chỉ mới
                  </button>
                )}

                {/* Add Address Form */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="space-y-4 p-6 bg-gray-50 rounded-lg border-2 border-gray-300 animate-scaleIn">
                    <h4 className="font-black text-lg text-gray-900 font-Roboto uppercase">Thêm địa chỉ</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Tên người nhận"
                        value={addressForm.recipient}
                        onChange={(e) => setAddressForm({...addressForm, recipient: e.target.value})}
                        required
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 font-medium"
                      />
                      <input
                        type="tel"
                        placeholder="Số điện thoại"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                        required
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Đường/Số nhà"
                        value={addressForm.line1}
                        onChange={(e) => setAddressForm({...addressForm, line1: e.target.value})}
                        required
                        className="md:col-span-2 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Đường/Số nhà (tiếp)"
                        value={addressForm.line2}
                        onChange={(e) => setAddressForm({...addressForm, line2: e.target.value})}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 font-medium"
                      />
                      <select
                        value={addressForm.addressType}
                        onChange={(e) => setAddressForm({...addressForm, addressType: e.target.value})}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 font-medium bg-white"
                      >
                        <option value="HOME">Nhà riêng</option>
                        <option value="OFFICE">Văn phòng</option>
                        <option value="OTHER">Khác</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Phường/Xã"
                        value={addressForm.ward}
                        onChange={(e) => setAddressForm({...addressForm, ward: e.target.value})}
                        required
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Quận/Huyện"
                        value={addressForm.district}
                        onChange={(e) => setAddressForm({...addressForm, district: e.target.value})}
                        required
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Tỉnh/Thành phố"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                        required
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 font-medium"
                      />
                    </div>

                    {/* Default Address Checkbox */}
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-300">
                      <input
                        type="checkbox"
                        id="defaultAddress"
                        checked={addressForm.defaultAddress}
                        onChange={(e) => setAddressForm({...addressForm, defaultAddress: e.target.checked})}
                        className="w-5 h-5 cursor-pointer accent-gray-900"
                      />
                      <label htmlFor="defaultAddress" className="font-bold text-gray-900 cursor-pointer flex-1">
                        ★ Đặt làm địa chỉ chính
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gray-900 hover:bg-black text-white font-black py-3 rounded-lg transition-all font-Roboto text-lg uppercase tracking-wider hover:scale-105 active:scale-95"
                      >
                        <Plus className="inline h-5 w-5 mr-2" />
                        Thêm
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setAddressForm({
                            recipient: '',
                            phone: '',
                            line1: '',
                            line2: '',
                            ward: '',
                            district: '',
                            city: '',
                            addressType: 'HOME',
                            defaultAddress: false
                          });
                        }}
                        className="flex-1 bg-white hover:bg-gray-100 text-gray-900 font-black py-3 rounded-lg border-2 border-gray-900 transition-all font-Roboto text-lg uppercase tracking-wider hover:scale-105 active:scale-95"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Security Section */}
              <div className="bg-white rounded-xl border-2 border-gray-900 p-8 shadow-lg animate-fadeInUp">
                <h3 className="text-3xl font-black text-gray-900 mb-6 font-Roboto flex items-center gap-3 uppercase tracking-wide">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  Bảo mật
                </h3>

                {!showChangePassword && (
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-Roboto text-lg uppercase tracking-wider hover:scale-105 active:scale-95 hover:shadow-lg"
                  >
                    <Lock className="h-5 w-5" />
                    Thay đổi mật khẩu
                  </button>
                )}

                {showChangePassword && (
                  <form onSubmit={handleChangePassword} className="space-y-5 animate-scaleIn">
                    {passwordError && (
                      <div className="flex items-center gap-3 rounded-lg bg-gray-100 border-2 border-gray-900 p-4 animate-slideInLeft">
                        <AlertCircle className="h-5 w-5 text-gray-900 flex-shrink-0" />
                        <p className="text-gray-900 font-bold">{passwordError}</p>
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="flex items-center gap-3 rounded-lg bg-gray-100 border-2 border-gray-900 p-4 animate-slideInLeft">
                        <CheckCircle className="h-5 w-5 text-gray-900 flex-shrink-0" />
                        <p className="text-gray-900 font-bold">{passwordSuccess}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-3 uppercase tracking-wider">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        value={passwordForm.password}
                        onChange={(e) => setPasswordForm({...passwordForm, password: e.target.value})}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition-all font-medium"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-3 uppercase tracking-wider">Mật khẩu mới</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition-all font-medium"
                        placeholder="Nhập mật khẩu mới"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-3 uppercase tracking-wider">Xác nhận mật khẩu</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition-all font-medium"
                        placeholder="Xác nhận mật khẩu mới"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="flex-1 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-black py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-Roboto text-lg uppercase tracking-wider hover:scale-105 active:scale-95 disabled:hover:scale-100"
                      >
                        {changingPassword ? (
                          <>
                            <Loader className="h-5 w-5 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5" />
                            Lưu mật khẩu
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowChangePassword(false);
                          setPasswordForm({ password: '', newPassword: '', confirmPassword: '' });
                          setPasswordError(null);
                          setPasswordSuccess(null);
                        }}
                        className="flex-1 bg-white hover:bg-gray-100 text-gray-900 font-black py-3 rounded-lg border-2 border-gray-900 transition-all font-Roboto text-lg uppercase tracking-wider hover:scale-105 active:scale-95"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-lg flex items-center justify-center gap-2 transition-all font-Bebas text-lg uppercase tracking-wider hover:scale-105 active:scale-95 animate-fadeInUp shadow-lg hover:shadow-xl"
              >
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Profile;
