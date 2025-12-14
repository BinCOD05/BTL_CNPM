import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User as UserIcon, LogOut, ShoppingCart as CartIcon, ChevronDown } from 'lucide-react';

const navItems = [
  { label: 'Cửa hàng', to: '/store' },
  { label: 'Mac', to: '/Category?keyword=mac' },
  { label: 'iPad', to: '/Category?keyword=ipad' },
  { label: 'iPhone', to: '/Category?keyword=iphone' },
  { label: 'Samsung', to: '/Category?keyword=samsung' },
  { label: 'Watch', to: '/Category?keyword=watch' },
  { label: 'AirPods', to: '/Category?keyword=airpod' },
];

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status
  const checkLoginStatus = () => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    if (token) {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } else {
      setUserInfo(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [location]);

  // Clear temporary active nav when navigating away from homepage
  useEffect(() => {
    if (location.pathname !== '/') setActiveNavItem(null);
  }, [location.pathname]);

  // Listen for storage changes (login from other tab)
  useEffect(() => {
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch cart summary count
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setCartCount(0);
        return;
      }
      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include'
      });
      if (!res.ok) return setCartCount(0);
      const data = await res.json().catch(() => null);
      const result = data?.result || data;
      const total = result?.totalItems ?? (Array.isArray(result?.cartItemResponses) ? result.cartItemResponses.length : 0);
      setCartCount(Number(total) || 0);
    } catch (e) {
      setCartCount(0);
    }
  };

  // Update cart count when auth changes, on mount, on location change, and when other tabs update cart
  useEffect(() => {
    fetchCartCount();

    const onStorage = (e) => {
      if (!e) return;
      // react to cartEvent or authEvent
      if (e.key === 'cartEvent' || e.key === 'authEvent') {
        fetchCartCount();
      }
    };

    window.addEventListener('storage', onStorage);
    // custom event for same-tab updates
    const onCartUpdated = () => fetchCartCount();
    window.addEventListener('cartUpdated', onCartUpdated);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cartUpdated', onCartUpdated);
    };
  }, [location.pathname]);

  // Scroll effect for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setUserInfo(null);
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg' 
        : 'bg-white/95 backdrop-blur-md shadow-sm'
    }`}>
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2 transition-transform duration-300 hover:scale-105">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
            <span className="relative text-2xl font-black tracking-wider text-slate-900 font-Bebas">
              SopPings
            </span>
          </div>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {navItems.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => {
                // on homepage, mark clicked item as active; otherwise let routing determine active
                if (location.pathname === '/') setActiveNavItem(to);
              }}
              className={({ isActive }) => {
                // Determine active by exact query param match when on /Category
                let activeByQuery = false;
                try {
                  const targetUrl = new URL(to, window.location.origin);
                  const targetKeyword = targetUrl.searchParams.get('keyword') || '';
                  const currentKeyword = new URLSearchParams(location.search).get('keyword') || '';
                  activeByQuery = location.pathname === '/Category' && (targetKeyword === currentKeyword);
                } catch (e) {
                  activeByQuery = false;
                }

                const active = isActive || (location.pathname === '/' && activeNavItem === to) || activeByQuery;
                return `relative px-4 py-2 transition-all duration-300 group ${active ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}`;
              }}
            >
              {label}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-slate-900 to-slate-700 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Cart Icon */}
              <Link
                to="/shopping-cart"
                className="relative p-2 rounded-full transition-all duration-300 hover:bg-slate-100 group"
              >
                <CartIcon className="h-6 w-6 text-slate-700 transition-all duration-300 group-hover:text-slate-900 group-hover:scale-110" />
                {cartCount > 0 && (
                  <span aria-live="polite" className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-600 to-red-500 rounded-full">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User Account Button */}
              <div className="relative group">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 transition-all duration-300 group-hover:shadow-md"
                >
                  <div className="p-1 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all duration-300">
                    <UserIcon className="h-4 w-4 text-slate-700" />
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold text-slate-900">Tài khoản</span>
                  <ChevronDown className={`h-4 w-4 text-slate-600 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow border border-slate-100 py-2 top-full">
                    {userInfo && (
                      <div className="px-4 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white rounded-t-2xl">
                        <p className="font-bold text-slate-900 truncate text-sm">{userInfo.username || 'Người dùng'}</p>
                        <p className="text-xs text-slate-500 mt-1">✓ Đã xác thực</p>
                      </div>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="block w-full text-left px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 text-sm font-medium group"
                    >
                      <span className="flex items-center gap-3">
                        <UserIcon className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                        Hồ sơ cá nhân
                      </span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="block w-full text-left px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 text-sm font-medium group"
                    >
                      <span className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 group-hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
                        Đơn hàng của tôi
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 flex items-center gap-3 text-sm font-medium border-t border-slate-100"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/signin"
              className="group relative px-6 py-2 font-semibold text-slate-900 overflow-hidden rounded-full transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
              <span className="relative text-slate-900 group-hover:text-white transition-colors duration-300">
                Đăng nhập
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;


// import { Link } from "react-router"

// function Header(){
//     return(
//         <>
//             <header className="w-full h-[76px] bg-slate-200 flex sticky z-50 items-center justify-between">
//                <div className="w-[1440px] mx-auto flex justify-between items-center">
//                  <div className="group-left flex space-x-2 justify-center items-center gap-3">
//                     <Link to="/">
//                         <h1 className="text-[24px] font-bold text-black font-Bitcount">SopPings</h1>
//                     </Link>
//                     <Link to="/Category">
//                         <div className="group rounded-[700px] px-3 py-2 hover:bg-slate-300 hover:shadow-sm flex flex-col justify-center items-center  transition-all duration-500 ">
//                             <h1 className="text-slate-500 group-hover:text-slate-700">Explore</h1>
//                         </div>
//                     </Link>
//                 </div>
           
//                 <div className="group-right flex space-x-2 justify-between items-center gap-3">
//                     <Link to="/Shopping-Cart">
//                         <div>
//                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 576 512" className="text-slate-700 hover:text-slate-900">
//                             <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
//                           </svg>
//                         </div>
//                     </Link>
//                     <Link to="/User">
//                         <div className="bg-white rounded-[700px] px-3 py-2 hover:shadow-md flex flex-col justify-center items-center  transition-all duration-500 ">
//                             <h1 className="font-semibold">Sign in</h1>
//                         </div>
//                     </Link>
//                 </div>



//                </div>
//             </header>
//         </>
//     )
// }

// export default Header