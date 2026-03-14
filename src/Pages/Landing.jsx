import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Zap, ShoppingBag } from 'lucide-react';

function Landing() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-black selection:text-white">
      
      {/* --- Ambient Background Glows --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[120px]" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center pt-20 pb-10 z-10">
        <div className="mx-auto max-w-7xl px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-sm font-medium text-slate-600">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                Bộ sưu tập Mùa Đông 2025 đã có mặt
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1]">
                Tech <br />
                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                  Redefined.
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed">
                Chào mừng đến với <span className="font-bold text-slate-900">SopPings</span>. 
                Nơi hội tụ tinh hoa công nghệ. Thiết kế tối giản, hiệu năng tối đa, trải nghiệm mua sắm đẳng cấp.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
                <Link to="/store" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl overflow-hidden transition-all hover:bg-black hover:shadow-2xl hover:shadow-slate-900/20">
                  <span className="relative z-10 font-semibold">Khám phá ngay</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
                <a href="#features" className="px-8 py-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:bg-white transition-all font-semibold text-slate-700">
                  Tìm hiểu thêm
                </a>
              </motion.div>
            </motion.div>

            {/* Right Image (Parallax & Floating) */}
            <div className="relative hidden lg:block h-[600px]">
                {/* Decorative floating elements */}
                <motion.div style={{ y: y2 }} className="absolute top-10 right-10 z-0 w-64 h-64 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full opacity-50 blur-3xl" />
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="relative z-10 w-full h-full"
                >
                  <div className="relative w-full h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border-8 border-white">
                     {/* Placeholder Image - thay bằng ảnh sản phẩm thật của bạn */}
                    <img 
                      src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2000&auto=format&fit=crop"
                      alt="Luxury Tech" 
                      className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700" 
                    />
                    
                    {/* Floating Glass Card */}
                    <motion.div 
                      style={{ y: y1 }}
                      className="absolute bottom-8 left-8 right-8 p-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Featured</p>
                          <h3 className="text-xl font-bold text-slate-900">iPad Pro M4</h3>
                        </div>
                        <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">New</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-32 relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Tại sao chọn chúng tôi?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Chúng tôi không chỉ bán sản phẩm, chúng tôi trao gửi trải nghiệm công nghệ hoàn hảo nhất.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Star className="w-8 h-8 text-orange-500" />}
              title="Tuyển chọn tinh tế"
              desc="Mỗi sản phẩm đều trải qua quy trình kiểm duyệt khắt khe về thẩm mỹ và chất lượng."
              delay={0}
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-blue-500" />}
              title="Giao hàng siêu tốc"
              desc="Nhận hàng trong vòng 2h tại nội thành. Đóng gói cao cấp, bảo vệ tuyệt đối."
              delay={0.2}
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
              title="Bảo hành VIP"
              desc="Chính sách 1 đổi 1 trong 30 ngày. Hỗ trợ kỹ thuật trọn đời sản phẩm."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION (CTA) --- */}
      <section className="py-24 relative z-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-12 md:p-24 text-center">
            {/* Abstract Background inside CTA */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
               <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 blur-[150px] rounded-full animate-pulse" />
            </div>

            <div className="relative z-10 space-y-8">
              <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-white/80" />
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Nâng tầm phong cách sống</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Đừng bỏ lỡ những siêu phẩm công nghệ mới nhất. Hàng ngàn khách hàng đã hài lòng. Bạn thì sao?
              </p>
              <div className="pt-4">
                <Link to="/store" className="inline-block bg-white text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-200 hover:scale-105 transition-all shadow-xl shadow-white/10">
                  Vào Cửa Hàng Ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-10 text-center text-slate-400 text-sm relative z-10">
        <p>&copy; 2025 SopPings. Designed with precision.</p>
      </footer>
    </main>
  );
}

// Component phụ cho thẻ Feature để code gọn hơn
function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay }}
      className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-2 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:scale-110 transition-all duration-300">
        <div className="group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default Landing;