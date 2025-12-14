import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
import Admin from './Components/admin/Admin ';
function App() {
  return (
    <BrowserRouter>
     <Header/>
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
    </BrowserRouter>
  )
}

export default App
