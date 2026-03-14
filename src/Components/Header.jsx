import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User, LogOut, ShoppingCart, ChevronDown, Menu, X, Search, Package, Heart } from 'lucide-react';

const navItems = [
  { label: 'Cửa hàng', to: '/store' },
  { label: 'iPhone', to: '/category?keyword=iphone' },
  { label: 'Mac', to: '/category?keyword=mac' },
  { label: 'iPad', to: '/category?keyword=ipad' },
  { label: 'Samsung', to: '/category?keyword=samsung' },
  { label: 'Watch', to: '/category?keyword=watch' },
];

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // --- LOGIC CHECK LOGIN ---
  const checkLoginStatus = () => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    if (token) {
      // Thử lấy user info từ localStorage nếu có, hoặc gọi API lấy lại
      // Ở đây giả sử bạn đã lưu userInfo khi login, nếu chưa thì nên gọi API /me
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
          try {
              setUserInfo(JSON.parse(storedUserInfo));
          } catch (e) { setUserInfo(null); }
      } else {
          // Nếu có token mà chưa có info, có thể gọi API fetch profile ở đây
          fetchProfile(token);
      }
    } else {
      setUserInfo(null);
    }
  };

  const fetchProfile = async (token) => {
      try {
          const res = await fetch('http://localhost:8081/api/users/me', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
              const data = await res.json();
              setUserInfo(data.result);
              localStorage.setItem('userInfo', JSON.stringify(data.result));
          }
      } catch (e) { console.error(e); }
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { setCartCount(0); return; }
      const res = await fetch('http://localhost:8081/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const items = data.result?.cartItemResponses || data.cartItemResponses || [];
      setCartCount(items.length);
    } catch (e) { setCartCount(0); }
  };

  const handleLogout = () => {
    if(window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
        setUserInfo(null);
        setShowUserMenu(false);
        
        // Dispatch sự kiện để các component khác biết
        window.dispatchEvent(new Event('authChanged'));
        
        navigate('/signin');
    }
  };

  const isLinkActive = (path) => {
    const currentPath = location.pathname.toLowerCase();
    const currentSearch = location.search.toLowerCase();
    const targetUrl = path.toLowerCase();
    const [targetPath, targetQuery] = targetUrl.split('?');
    if (targetPath === '/') return currentPath === '/';
    if (targetQuery) return currentPath === targetPath && currentSearch.includes(targetQuery);
    return currentPath === targetPath && currentSearch === '';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/category?keyword=${encodeURIComponent(searchTerm)}`);
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    // 1. Check lần đầu
    checkLoginStatus();
    fetchCartCount();

    // 2. Lắng nghe sự kiện cuộn
    const handleScroll = () => setScrolled(window.scrollY > 10);
    
    // 3. Lắng nghe sự kiện thay đổi localStorage (chỉ hoạt động giữa các tab khác nhau)
    const handleStorageChange = () => { checkLoginStatus(); fetchCartCount(); };
    
    // 4. Lắng nghe custom event 'cartUpdated' (khi thêm vào giỏ)
    const handleCartUpdate = () => fetchCartCount();

    // 5. QUAN TRỌNG: Lắng nghe custom event 'authChanged' (khi login/logout)
    const handleAuthChange = () => {
        checkLoginStatus();
        fetchCartCount();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('authChanged', handleAuthChange); // <--- Thêm dòng này

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('authChanged', handleAuthChange); // <--- Xóa dòng này
    };
  }, []);

  // Reset menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-gray-200 py-2' : 'bg-white border-transparent py-4'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-slate-900 text-white p-1.5 rounded-lg font-bold text-xl tracking-tighter group-hover:bg-blue-600 transition-colors">SP</div>
              <span className="text-xl font-black tracking-wide text-slate-900 font-Bebas hidden sm:block">SopPings</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = isLinkActive(item.to);
              return (
                <Link key={item.label} to={item.to} className={`px-3 py-2 rounded-full text-sm font-bold transition-all duration-200 ${active ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
              <input type="text" placeholder="Tìm kiếm..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-sm w-32 focus:w-52 transition-all duration-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </form>

            <Link to="/Shopping-Cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors group">
              <ShoppingCart size={22} className="group-hover:text-slate-900" />
              {cartCount > 0 && <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce">{cartCount > 9 ? '9+' : cartCount}</span>}
            </Link>

            {isLoggedIn ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:shadow-sm transition-all bg-white">
                  <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">{userInfo?.username?.charAt(0).toUpperCase() || 'U'}</div>
                  <ChevronDown size={14} className={`text-slate-400 mr-1 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800 truncate">{userInfo?.fullName || userInfo?.username}</p>
                      <p className="text-xs text-slate-500 truncate">{userInfo?.email || 'Thành viên'}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600"><User size={16} /> Hồ sơ cá nhân</Link>
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600"><Package size={16} /> Đơn hàng của tôi</Link>
                      <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600"><Heart size={16} /> Sản phẩm yêu thích</Link>
                    </div>
                    <div className="border-t border-slate-100 py-1">
                      <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"><LogOut size={16} /> Đăng xuất</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="px-5 py-2 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-transform active:scale-95 shadow-md">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl py-4 px-4 flex flex-col gap-2 animate-in slide-in-from-top-5 max-h-[calc(100vh-60px)] overflow-y-auto">
          <form onSubmit={handleSearch} className="mb-4 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Tìm kiếm sản phẩm..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </form>
          {navItems.map((item) => (
             <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-lg text-base font-medium ${isLinkActive(item.to) ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}>
               {item.label}
             </Link>
          ))}
          {!isLoggedIn && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link to="/signin" className="block w-full text-center py-3 rounded-lg bg-slate-900 text-white font-bold">
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;