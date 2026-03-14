import React from 'react';
import { Truck, Headset, ShieldCheck, RefreshCw } from 'lucide-react';

const services = [
  {
    title: 'Miễn Phí Vận Chuyển',
    description: 'Áp dụng cho đơn hàng trên 500k',
    icon: Truck,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: 'Hỗ Trợ 24/7',
    description: 'Luôn sẵn sàng giải đáp mọi thắc mắc',
    icon: Headset,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    title: 'Thanh Toán An Toàn',
    description: 'Bảo mật thông tin tuyệt đối',
    icon: ShieldCheck,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    title: 'Hoàn Tiền 30 Ngày',
    description: 'Đổi trả miễn phí nếu lỗi',
    icon: RefreshCw,
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
];

function ServicesSection() {
  return (
    <section className="bg-white py-16 font-Roboto border-t border-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="group flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${service.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={32} className={service.color} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 max-w-[200px]">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;