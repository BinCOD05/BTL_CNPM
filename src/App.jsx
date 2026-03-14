import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Landing from './Pages/Landing';
import Header from './Components/Header';
import SignIn from './Pages/Signin';
import ShoppingCart from './Pages/ShoppingCart';
import Catogory from './Pages/Category';
import Profile from './Pages/Profile';
import Details from './Pages/Details';
import Payment from './Pages/Payment';
import Orders from './Pages/Orders';
import OrderDetail from './Pages/OrderDetail';
import Admin from './Pages/Admin';

// Component con để sử dụng hook useLocation
function AppContent() {
  const location = useLocation();
  
  // Kiểm tra nếu route bắt đầu bằng /admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Ẩn header nếu là trang admin */}
      {!isAdminRoute && <Header />}
      
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/store' element={<Home />} />
        <Route path='/signin' element={<SignIn/>} />
        <Route path='/Category' element={<Catogory/>} />
        <Route path='/Shopping-Cart' element={<ShoppingCart/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/Details/:id' element={<Details/>} />
        <Route path='/product/detail/:id' element={<Details/>} />
        <Route path='/pay' element={<Payment/>} />
        <Route path='/orders' element={<Orders/>} />
        <Route path='/orders/:id' element={<OrderDetail/>} />
        <Route path='/admin' element={<Admin/>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App;