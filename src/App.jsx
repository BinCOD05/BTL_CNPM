import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Pages/Home';
import Header from './Components/Header';
import User from './Pages/User';
import ShoppingCart from './Pages/ShoppingCart';
import Catogory from './Pages/Category';
function App() {
  return (
    <BrowserRouter>
     <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/User' element={<User/>} />
         <Route path='/Category' element={<Catogory/>} />
        <Route path='/Shopping-Cart' element={<ShoppingCart/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
