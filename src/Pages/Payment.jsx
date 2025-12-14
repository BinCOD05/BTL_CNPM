import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Lock, MapPin } from 'lucide-react';

const formatVND = (value) => {
  try {
    return new Intl.NumberFormat('vi-VN').format(Number(value)) + ' đ';
  } catch (e) {
    return value + ' đ';
  }
};

function Payment() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', address: '', city: '', district: '', ward: '' });

  const [cartData, setCartData] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState(null);

  const [note, setNote] = useState('');
  const [voucherCode, setVoucherCode] = useState('');

  const getAuthToken = () => localStorage.getItem('authToken') || '';

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoadingCart(true);
        const token = getAuthToken();
        const res = await fetch('http://localhost:8081/api/cart', {
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Không thể tải giỏ hàng');
        const data = await res.json();
        setCartData(data.result);
        setCartError(null);
      } catch (err) {
        console.error('Fetch cart failed', err);
        setCartError(err.message || String(err));
        setCartData(null);
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
    fetchAddresses();
  }, []);

  // only count selected items for subtotal/total
  const selectedItems = cartData?.cartItemResponses?.filter(i => i.selected) || [];
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;
  const selectedAddr = addresses.find(a => a.id === selectedAddress) || addresses[0];

  const handleAddAddress = () => {
    // POST new address to user addresses endpoint, then refetch addresses
    (async () => {
      try {
        const token = getAuthToken();
        const res = await fetch('http://localhost:8081/api/users/address', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          credentials: 'include',
          body: JSON.stringify({
            recipient: newAddress.fullName,
            phone: newAddress.phone,
            line1: newAddress.address,
            ward: newAddress.ward,
            district: newAddress.district,
            city: newAddress.city,
            defaultAddress: false
          })
        });
        if (!res.ok) throw new Error('Không thể thêm địa chỉ');
        // refetch addresses
        await fetchAddresses();
        setNewAddress({ fullName: '', phone: '', address: '', city: '', district: '', ward: '' });
        setShowAddressForm(false);
      } catch (err) {
        console.error('Add address failed', err);
        alert('Không thể thêm địa chỉ: ' + (err.message || err));
      }
    })();
  };

  const fetchAddresses = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('http://localhost:8081/api/users/address', {
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Không thể tải địa chỉ');
      const data = await res.json();
      const list = data.result || [];
      setAddresses(list);
      // set default selected address if none selected
      const def = list.find(a => a.defaultAddress || a.isDefault) || list[0];
      if (def && !selectedAddress) setSelectedAddress(def.id);
    } catch (err) {
      console.error('Fetch addresses failed', err);
    }
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-white pb-20 pt-24">
        <div className="mx-auto max-w-2xl px-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-4 animate-bounce">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900">Đặt hàng thành công!</h1>
          <p className="text-xl text-gray-600">Cảm ơn bạn đã mua hàng</p>
          
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 space-y-4 text-left">
            <div>
              <p className="text-sm text-gray-600">Mã đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">#ORD-2025-001234</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">Tổng tiền</p>
              <p className="text-2xl font-bold text-gray-900">{formatVND(total)}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-2">Gửi đến</p>
              <p className="text-gray-900 font-semibold">{selectedAddr.fullName}</p>
              <p className="text-gray-600">{selectedAddr.address}</p>
              <p className="text-gray-600">{selectedAddr.phone}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => window.location.href = '/Shopping-Cart'} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg">Tiếp tục mua sắm</button>
            <button onClick={() => window.location.href = '/'} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg">Về trang chủ</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20 pt-24">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Thanh toán</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Selection */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5" />
                <h2 className="text-xl font-bold">Địa chỉ giao hàng</h2>
              </div>

              <div className="space-y-3">
                {addresses.map(addr => (
                  <label key={addr.id} className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${selectedAddress === addr.id ? 'border-gray-900 bg-white' : 'border-gray-300 hover:border-gray-400'}`}>
                    <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-1 mr-4" />
                    <div className="flex-1">
                      <div className="font-semibold">{addr.recipient || addr.fullName}</div>
                      <div className="text-sm text-gray-600">{addr.line1 || addr.address}{addr.line2 ? `, ${addr.line2}` : ''}</div>
                      <div className="text-sm text-gray-600">{addr.ward ? `${addr.ward}, ${addr.district}, ${addr.city}` : ''}</div>
                      <div className="text-sm text-gray-600 mt-2 font-medium">{addr.phone}</div>
                      {(addr.defaultAddress || addr.isDefault) && <div className="inline-block mt-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">Mặc định</div>}
                    </div>
                  </label>
                ))}
              </div>

              <button onClick={() => setShowAddressForm(!showAddressForm)} className="w-full px-4 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-semibold rounded-lg">+ Thêm địa chỉ mới</button>

              {showAddressForm && (
                <div className="space-y-4 p-4 bg-white border border-gray-300 rounded-lg">
                  <h3 className="font-bold">Thêm địa chỉ giao hàng mới</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['fullName', 'phone'].map(field => (
                      <input key={field} type={field === 'phone' ? 'tel' : 'text'} placeholder={field === 'fullName' ? 'Họ và tên' : 'Số điện thoại'} value={newAddress[field]} onChange={(e) => setNewAddress({...newAddress, [field]: e.target.value})} className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    ))}
                    <input type="text" placeholder="Địa chỉ" value={newAddress.address} onChange={(e) => setNewAddress({...newAddress, address: e.target.value})} className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    {['city', 'district', 'ward'].map(field => (
                      <input key={field} type="text" placeholder={field === 'city' ? 'Tỉnh/Thành phố' : field === 'district' ? 'Quận/Huyện' : 'Phường/Xã'} value={newAddress[field]} onChange={(e) => setNewAddress({...newAddress, [field]: e.target.value})} className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleAddAddress} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg">Lưu địa chỉ</button>
                    <button onClick={() => setShowAddressForm(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg">Hủy</button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5" />
                <h2 className="text-xl font-bold">Phương thức thanh toán</h2>
              </div>
              <div className="flex items-center p-4 border-2 border-gray-900 rounded-lg bg-white">
                <input type="radio" checked disabled className="mr-3" />
                <div>
                  <div className="font-semibold">Thanh toán khi nhận hàng (COD)</div>
                  <div className="text-sm text-gray-600">Bạn sẽ thanh toán khi nhân viên giao hàng</div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-24 space-y-6">
              <h2 className="text-xl font-bold">Đơn hàng của bạn</h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loadingCart && <div className="text-sm text-gray-600">Đang tải giỏ hàng...</div>}
                {cartError && <div className="text-sm text-red-600">Lỗi: {cartError}</div>}
                {!loadingCart && !cartError && selectedItems.length === 0 && (
                  <div className="text-sm text-gray-600">Bạn chưa chọn sản phẩm nào. Vui lòng quay lại giỏ hàng để chọn sản phẩm.</div>
                )}
                {!loadingCart && !cartError && selectedItems.length > 0 && selectedItems.map(item => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-300 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"><img src={item.productImage || 'https://via.placeholder.com/96'} alt={item.productName} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.productName}</p>
                      <p className="text-xs text-gray-600">x{item.quantity}</p>
                      <p className="text-sm font-bold">{formatVND(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-300 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính:</span>
                  <span className="font-semibold">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Vận chuyển:</span>
                  <span className="font-semibold">{shipping === 0 ? 'Miễn phí' : formatVND(shipping)}</span>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-bold">Tổng cộng:</span>
                  <span className="text-2xl font-black">{formatVND(total)}</span>
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">Mã giảm giá (nếu có)</label>
                  <input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="Nhập voucher" className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú cho người bán (ví dụ: giờ giao hàng)..." className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <button onClick={async () => {
                  if (!selectedAddress) { alert('Vui lòng chọn địa chỉ'); return; }
                  // build cartItemIds from selected items
                  const selectedItems = cartData?.cartItemResponses?.filter(i => i.selected) || [];
                  if (selectedItems.length === 0) { alert('Vui lòng chọn ít nhất 1 sản phẩm trong giỏ hàng'); return; }

                  const cartItemIds = selectedItems.map(i => i.id);
                  const body = {
                    addressId: Number(selectedAddress),
                    note: note || '',
                    cartItemIds,
                    voucherCode: voucherCode || ''
                  };

                  try {
                    const token = getAuthToken();
                    const res = await fetch('http://localhost:8081/api/orders', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                      credentials: 'include',
                      body: JSON.stringify(body)
                    });
                    if (!res.ok) {
                      const txt = await res.text().catch(() => '');
                      throw new Error(`Lỗi server: ${res.status} ${txt}`);
                    }
                    const data = await res.json().catch(() => ({}));
                    // assume API returns order info
                    // you might want to clear cart or redirect to order detail page
                    setOrderPlaced(true);
                  } catch (err) {
                    console.error('Place order failed', err);
                    alert('Đặt hàng thất bại: ' + (err.message || err));
                  }
                }} disabled={!selectedAddress || loadingCart} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  <Lock className="h-5 w-5" /> Đặt hàng
                </button>

                <p className="text-xs text-gray-600 text-center mt-3 flex items-center justify-center gap-1"><Lock className="h-3 w-3" /> Thanh toán an toàn</p>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2"><span>✓</span><span>Bảo hành 12 tháng</span></div>
                <div className="flex items-start gap-2"><span>✓</span><span>Đổi trả trong 30 ngày</span></div>
                <div className="flex items-start gap-2"><span>✓</span><span>Hỗ trợ 24/7</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Payment;
