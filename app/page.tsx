'use client';
import { Sprout, Heart, Hand, Leaf, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ===== HEADER ===== */}
      <header className="bg-[#7A8B6F] sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="text-[#FAF7F2] w-7 h-7" />
            <h1 className="text-2xl font-bold tracking-widest text-white">ECOA</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#sobre" className="text-white/95 hover:text-white transition-colors font-medium">Sobre</a>
            <a href="#como-funciona" className="text-white/95 hover:text-white transition-colors font-medium">Como Funciona</a>
            <Link href="/catalogo" className="btn-lilas">
              Ver Peças <ArrowRight size={16} />
            </Link>
          </nav>
          <Link href="/admin" className="text-sm text-white/80 hover:text-white underline">
            Área da Dona
          </Link>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-[#7A8B6F] via-[#8FA895] to-[#A895B5] py-28 md:py-36 px-4 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#A895B5]/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/40">
            <Leaf className="w-5 h-5 text-white" />
            <span className="text-sm text-white font-medium">Cerâmica artesanal com alma</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight">
            Da Terra <br />
            <span className="font-semibold">à Sua Casa</span>
          </h2>
          
          <p className="text-xl text-white/95 max-w-3xl mx-auto mb-12 leading-relaxed">
            Peças únicas moldadas à mão com técnicas sustentáveis. 
            Cada cerâmica carrega a energia da natureza.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogo" className="bg-white text-[#7A8B6F] px-8 py-4 rounded-full font-semibold transition-all hover:bg-[#FAF7F2] hover:shadow-xl text-lg inline-flex items-center gap-2">
              Explorar Coleção <ArrowRight size={20} />
            </Link>
            <a href="#sobre" className="bg-[#A895B5]/90 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold transition-all hover:bg-[#9B8AA8] hover:shadow-xl border border-white/40">
              Nossa História
            </a>
          </div>
        </div>
      </section>

      {/* ===== SOBRE ===== */}
      <section id="sobre" className="py-24 px-4 bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-[#A895B5] tracking-wider uppercase mb-4 block">Nossa História</span>
              <h3 className="text-4xl md:text-5xl font-light text-[#3D3D3D] mb-6 leading-tight">
                Do barro à sua casa, <br />
                <span className="font-semibold text-[#7A8B6F]">com propósito</span>
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                A ECOA nasceu do desejo de criar peças que conectem as pessoas à natureza. 
                Cada cerâmica é moldada à mão, usando técnicas tradicionais e materiais sustentáveis.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                Acreditamos que objetos feitos com intenção carregam energia. 
                Cada peça ECOA é única, com suas imperfeições que a tornam especial.
              </p>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-[#7A8B6F]/20">
                  <div className="text-3xl font-bold text-[#7A8B6F] mb-1">100%</div>
                  <div className="text-sm text-gray-600">Feito à mão</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-[#A895B5]/20">
                  <div className="text-3xl font-bold text-[#A895B5] mb-1">Natural</div>
                  <div className="text-sm text-gray-600">Materiais</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-[#8FA895]/20">
                  <div className="text-3xl font-bold text-[#8FA895] mb-1">Único</div>
                  <div className="text-sm text-gray-600">Cada peça</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#7A8B6F] to-[#A895B5] rounded-3xl flex items-center justify-center shadow-2xl">
                <Sprout className="w-36 h-36 text-white/90" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-[#A895B5]/30">
                <Heart className="w-8 h-8 text-[#A895B5] mb-2" />
                <p className="text-sm text-gray-700 font-medium">Feito com amor</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-[#8FA895] p-6 rounded-2xl shadow-xl">
                <Leaf className="w-8 h-8 text-white mb-2" />
                <p className="text-sm text-white font-medium">100% Natural</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALORES ===== */}
      <section className="py-24 px-4 bg-[#F0EBE3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#7A8B6F] tracking-wider uppercase mb-4 block">Nossos Valores</span>
            <h3 className="text-4xl md:text-5xl font-light text-[#3D3D3D]">
              O que nos <span className="font-semibold text-[#A895B5]">move</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#7A8B6F]/20 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#7A8B6F] to-[#8FA895] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-[#3D3D3D] mb-3">Sustentabilidade</h4>
              <p className="text-gray-700 leading-relaxed">
                Materiais naturais e processos que respeitam o meio ambiente. 
                Peças feitas para durar gerações.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#A895B5]/20 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#A895B5] to-[#9B8AA8] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Hand className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-[#3D3D3D] mb-3">Artesanal</h4>
              <p className="text-gray-700 leading-relaxed">
                Cada peça moldada à mão, com tempo e dedicação. 
                Valorizamos o processo, não a produção em massa.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#8FA895]/20 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8FA895] to-[#7A8B6F] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-[#3D3D3D] mb-3">Conexão</h4>
              <p className="text-gray-700 leading-relaxed">
                Objetos que carregam energia. Peças para conectar 
                pessoas à natureza e ao momento presente.
              </p>
            </div>
          </div>
        </div>
      </section>

            {/* ===== COMO FUNCIONA ===== */}
      <section id="como-funciona" className="relative pb-32 px-4 bg-gradient-to-br from-[#7A8B6F] via-[#8FA895] to-[#A895B5]">
        <div className="max-w-6xl mx-auto pt-24">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-white/90 tracking-wider uppercase mb-4 block">Como Funciona</span>
            <h3 className="text-4xl md:text-5xl font-light text-white">
              Simples e <span className="font-semibold">direto</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white/15 backdrop-blur-sm p-8 rounded-3xl border border-white/30">
              <div className="w-16 h-16 bg-[#A895B5] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Escolha sua peça</h4>
              <p className="text-white/90">
                Navegue pelo catálogo e encontre a cerâmica que fala com você.
              </p>
            </div>

            <div className="text-center bg-white/15 backdrop-blur-sm p-8 rounded-3xl border border-white/30">
              <div className="w-16 h-16 bg-[#8FA895] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Fale conosco</h4>
              <p className="text-white/90">
                Clique no botão e converse pelo WhatsApp. Tire dúvidas!
              </p>
            </div>

            <div className="text-center bg-white/15 backdrop-blur-sm p-8 rounded-3xl border border-white/30">
              <div className="w-16 h-16 bg-[#C9A87C] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Receba em casa</h4>
              <p className="text-white/90">
                Combinamos pagamento e entrega de forma segura.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/catalogo" className="bg-white text-[#7A8B6F] px-8 py-4 rounded-full font-semibold transition-all hover:bg-[#FAF7F2] hover:shadow-xl text-lg inline-flex items-center gap-2">
              Ver Catálogo Completo <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* ONDA DE TRANSIÇÃO */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg 
            className="relative block w-full h-[120px]" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C73.71,22.09,142.84,46.57,214.34,56.44Z" 
              className="fill-[#A895B5]"
            ></path>
          </svg>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#A895B5] to-[#9B8AA8]">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Pronto para ter uma peça <br />
            <span className="font-semibold">ECOA</span> na sua casa?
          </h3>
          <p className="text-xl text-white/95 mb-8">
            Cada cerâmica é única, assim como você.
          </p>
          <Link href="/catalogo" className="bg-white text-[#A895B5] px-8 py-4 rounded-full font-semibold transition-all hover:bg-[#FAF7F2] hover:shadow-xl text-lg inline-flex items-center gap-2">
            Explorar Peças <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#3D3D3D] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="text-[#8FA895] w-6 h-6" />
                <h4 className="text-xl font-bold tracking-widest">ECOA</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Cerâmica artesanal feita com amor e sustentabilidade. 
                Cada peça carrega a essência da natureza.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-[#A895B5]">Links</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#sobre" className="hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-[#8FA895]">Contato</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  <span>WhatsApp direto</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
            <p>© 2026 ECOA Cerâmica. Feito com amor e sustentabilidade.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}