import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Users, 
    Package, 
    LogOut, 
    Menu, 
    X,
    BarChart3,
    Ticket // <-- Import icon Ticket
} from 'lucide-react';

// Import các component quản lý
import ProductManager from '../Components/admin/ProductManager';
import UserManager from '../Components/admin/UserManager';
import OrderManager from '../Components/admin/OrderManager';
import VoucherManager from '../Components/admin/VoucherManager'; // Import VoucherManager

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/signin');
        }
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?")) {
            localStorage.removeItem('authToken');
            navigate('/signin');
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <ProductManager />;
            case 'users':
                return <UserManager />;
            case 'orders':
                return <OrderManager />;
            case 'vouchers':
                return <VoucherManager />;
            default:
                return (
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center animate-fadeInUp">
                        <div className="mb-4 flex justify-center">
                            <BarChart3 className="h-24 w-24 text-blue-600 opacity-20" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Chào mừng trở lại, Admin!</h2>
                        <p className="text-gray-500 mt-2">Chọn một mục để bắt đầu quản lý hệ thống.</p>
                        
                        {/* --- GRID MENU (Đã thêm Voucher) --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 text-left">
                            
                            {/* Card Đơn hàng */}
                            <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer hover:shadow-md transition transform hover:-translate-y-1" onClick={() => setActiveTab('orders')}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-blue-800 text-lg">Đơn hàng</h3>
                                    <ShoppingCart className="text-blue-400" size={24}/>
                                </div>
                                <p className="text-sm text-blue-600">Kiểm tra và xử lý các đơn hàng mới.</p>
                            </div>

                            {/* Card Sản phẩm */}
                            <div className="p-6 bg-purple-50 rounded-xl border border-purple-100 cursor-pointer hover:shadow-md transition transform hover:-translate-y-1" onClick={() => setActiveTab('products')}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-purple-800 text-lg">Sản phẩm</h3>
                                    <Package className="text-purple-400" size={24}/>
                                </div>
                                <p className="text-sm text-purple-600">Quản lý kho, giá và thông tin SP.</p>
                            </div>

                            {/* Card Người dùng */}
                            <div className="p-6 bg-green-50 rounded-xl border border-green-100 cursor-pointer hover:shadow-md transition transform hover:-translate-y-1" onClick={() => setActiveTab('users')}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-green-800 text-lg">Người dùng</h3>
                                    <Users className="text-green-400" size={24}/>
                                </div>
                                <p className="text-sm text-green-600">Quản lý khách hàng và phân quyền.</p>
                            </div>

                            {/* Card Voucher (Mới thêm) */}
                            <div className="p-6 bg-orange-50 rounded-xl border border-orange-100 cursor-pointer hover:shadow-md transition transform hover:-translate-y-1" onClick={() => setActiveTab('vouchers')}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-orange-800 text-lg">Mã giảm giá</h3>
                                    <Ticket className="text-orange-400" size={24}/>
                                </div>
                                <p className="text-sm text-orange-600">Tạo và quản lý các mã khuyến mãi.</p>
                            </div>

                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-Roboto">
            
            {/* SIDEBAR */}
            <aside 
                className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${
                    isSidebarOpen ? 'w-64' : 'w-20'
                } fixed h-full z-20 md:relative shadow-xl`}
            >
                <div className="h-16 flex items-center justify-between px-4 bg-gray-950 shadow-md">
                    {isSidebarOpen ? (
                        <span className="text-xl font-black tracking-wider text-white">ADMIN PANEL</span>
                    ) : (
                        <span className="text-xl font-black mx-auto">AP</span>
                    )}
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-2">
                    <NavItem 
                        icon={<LayoutDashboard size={20} />} 
                        label="Tổng quan" 
                        isOpen={isSidebarOpen} 
                        isActive={activeTab === 'dashboard'} 
                        onClick={() => setActiveTab('dashboard')} 
                    />
                    <NavItem 
                        icon={<ShoppingCart size={20} />} 
                        label="Đơn hàng" 
                        isOpen={isSidebarOpen} 
                        isActive={activeTab === 'orders'} 
                        onClick={() => setActiveTab('orders')} 
                    />
                    <NavItem 
                        icon={<Package size={20} />} 
                        label="Sản phẩm" 
                        isOpen={isSidebarOpen} 
                        isActive={activeTab === 'products'} 
                        onClick={() => setActiveTab('products')} 
                    />
                    <NavItem 
                        icon={<Users size={20} />} 
                        label="Người dùng" 
                        isOpen={isSidebarOpen} 
                        isActive={activeTab === 'users'} 
                        onClick={() => setActiveTab('users')} 
                    />
                    <NavItem 
                        icon={<Ticket size={20} />} 
                        label="Mã giảm giá" 
                        isOpen={isSidebarOpen} 
                        isActive={activeTab === 'vouchers'} 
                        onClick={() => setActiveTab('vouchers')} 
                    />
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${!isSidebarOpen && 'justify-center'}`}
                        title="Đăng xuất"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-bold">Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                <header className="bg-white shadow-sm h-16 flex items-center px-6 md:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-bold text-gray-800">Quản trị hệ thống</span>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>

            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

// Component NavItem
const NavItem = ({ icon, label, isOpen, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            } ${!isOpen ? 'justify-center' : 'gap-3'}`}
            title={!isOpen ? label : ''}
        >
            <div className={`${isActive ? 'animate-pulse' : ''}`}>{icon}</div>
            {isOpen && <span className="font-medium text-sm">{label}</span>}
        </button>
    );
};

export default Admin;