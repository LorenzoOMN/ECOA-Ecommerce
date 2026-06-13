'use client';
import { Sprout, Heart, Hand, Leaf, ArrowRight, MessageCircle, Camera } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#E8D5C4]/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="text-[#D4E2D4] w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-widest text-[#4A4A48]">ECOA</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#sobre" className="text-gray-600 hover:text-[#4A4A48] transition-colors">Sobre</a>
            <a href="#como-funciona" className="text-gray-600 hover:text-[#4A4A48] transition-colors">Como Funciona</a>
            <Link href="/catalogo" className="btn-ecoa">
              Ver Peças
              <ArrowRight size={16} />
            </Link>
          </nav>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-[#4A4A48] underline">
            Área da Dona
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FDFBF7] via-[#F4F1EA] to-[#E8D5C4]/20 py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-[#E8D5C4]/30">
            <Leaf className="w-4 h-4 text-[#D4E2D4]" />
            <span className="text-sm text-gray-600">Feito à mão com amor</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-light text-[#4A4A48] mb-6 leading-tight">
            Cerâmica com <br />
            <span className="font-semibold text-[#B8C5D6]">Alma e Natureza</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Cada peça ECOA carrega a essência da terra, moldada com técnicas sustentáveis 
            e muito carinho. Descubra a beleza do feito à mão.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogo" className="btn-ecoa text-lg px-8 py-4">
              Explorar Coleção
              <ArrowRight size={20} />
            </Link>
            <a href="#sobre" className="bg-white/80 backdrop-blur-sm text-[#4A4A48] px-8 py-4 rounded-full font-medium transition-all hover:bg-white hover:shadow-md border border-[#E8D5C4]/30">
              Nossa História
            </a>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#D4E2D4]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#E8D5C4]/30 rounded-full blur-3xl"></div>
      </section>

      {/* Sobre a Marca */}
      <section id="sobre" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-[#B8C5D6] tracking-wider uppercase mb-4 block">Nossa História</span>
              <h3 className="text-4xl font-light text-[#4A4A48] mb-6">
                Do barro à sua casa, <br />
                <span className="font-semibold">com propósito</span>
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                A ECOA nasceu do desejo de criar peças que conectem as pessoas à natureza. 
                Cada cerâmica é moldada à mão, usando técnicas tradicionais e materiais sustentáveis, 
                respeitando o tempo da terra e o ritmo das estações.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Acreditamos que objetos feitos com intenção carregam energia. Por isso, 
                cada peça ECOA é única, com suas pequenas imperfeições que a tornam especial.
              </p>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4A4A48] mb-1">100%</div>
                  <div className="text-sm text-gray-600">Feito à mão</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4A4A48] mb-1">Natural</div>
                  <div className="text-sm text-gray-600">Materiais</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4A4A48] mb-1">Único</div>
                  <div className="text-sm text-gray-600">Cada peça</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#E8D5C4] to-[#D4E2D4] rounded-3xl flex items-center justify-center">
                <Sprout className="w-32 h-32 text-white/60" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg border border-[#E8D5C4]/30">
                <Heart className="w-8 h-8 text-[#E8D5C4] mb-2" />
                <p className="text-sm text-gray-600">Feito com amor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-[#FDFBF7]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#D4E2D4] tracking-wider uppercase mb-4 block">Nossos Valores</span>
            <h3 className="text-4xl font-light text-[#4A4A48]">
              O que nos <span className="font-semibold">move</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E8D5C4]/20 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#D4E2D4]/30 rounded-2xl flex items-center justify-center mb-6">
                <Leaf className="w-7 h-7 text-[#D4E2D4]" />
              </div>
              <h4 className="text-xl font-semibold text-[#4A4A48] mb-3">Sustentabilidade</h4>
              <p className="text-gray-600 leading-relaxed">
                Usamos materiais naturais e processos que respeitam o meio ambiente. 
                Cada peça é pensada para durar gerações.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E8D5C4]/20 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#E8D5C4]/30 rounded-2xl flex items-center justify-center mb-6">
                <Hand className="w-7 h-7 text-[#E8D5C4]" />
              </div>
              <h4 className="text-xl font-semibold text-[#4A4A48] mb-3">Artesanal</h4>
              <p className="text-gray-600 leading-relaxed">
                Cada peça é moldada à mão, com tempo e dedicação. 
                Não usamos produção em massa, valorizamos o processo.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E8D5C4]/20 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#B8C5D6]/30 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-[#B8C5D6]" />
              </div>
              <h4 className="text-xl font-semibold text-[#4A4A48] mb-3">Conexão</h4>
              <p className="text-gray-600 leading-relaxed">
                Acreditamos que objetos carregam energia. Criamos peças para 
                conectar pessoas à natureza e ao momento presente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 px-4 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#B8C5D6] tracking-wider uppercase mb-4 block">Como Funciona</span>
            <h3 className="text-4xl font-light text-[#4A4A48]">
              Simples e <span className="font-semibold">direto</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E8D5C4] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[#4A4A48]">
                1
              </div>
              <h4 className="text-xl font-semibold text-[#4A4A48] mb-3">Escolha sua peça</h4>
              <p className="text-gray-600">
                Navegue pelo nosso catálogo e encontre a cerâmica que fala com você.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4E2D4] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[#4A4A48]">
                2
              </div>
              <h4 className="text-xl font-semibold text-[#4A4A48] mb-3">Fale conosco</h4>
              <p className="text-gray-600">
                Clique no botão e converse diretamente pelo WhatsApp. Tire suas dúvidas!
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#B8C5D6] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[#4A4A48]">
                3
              </div>
              <h4 className="text-xl font-semibold text-[#4A4A48] mb-3">Receba em casa</h4>
              <p className="text-gray-600">
                Combinamos os detalhes de pagamento e entrega de forma segura e personalizada.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/catalogo" className="btn-ecoa text-lg px-8 py-4 inline-flex">
              Ver Catálogo Completo
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#E8D5C4]/30 to-[#D4E2D4]/30">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-light text-[#4A4A48] mb-6">
            Pronto para ter uma peça <br />
            <span className="font-semibold">ECOA</span> na sua casa?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Cada cerâmica é única, assim como você.
          </p>
          <Link href="/catalogo" className="btn-ecoa text-lg px-8 py-4 inline-flex">
            Explorar Peças
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A4A48] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="text-[#D4E2D4] w-6 h-6" />
                <h4 className="text-xl font-bold tracking-widest">ECOA</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Cerâmica artesanal feita com amor e sustentabilidade. 
                Cada peça carrega a essência da natureza.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Links</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#sobre" className="hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Contato</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  <span>WhatsApp direto</span>
                </li>
                <li className="flex items-center gap-2">
                  <Camera size={16} />
                  <span>@ecoa.ceramica</span>
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