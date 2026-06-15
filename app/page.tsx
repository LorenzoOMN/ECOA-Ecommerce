'use client';
import { Sprout, Heart, Hand, Leaf, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import WhatsAppButton from './components/WhatsAppButton';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HEADER */}
      <header className="bg-[#6E5A70] sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="text-[#F5F0F5] w-7 h-7" />
            <h1 className="text-2xl font-bold tracking-widest text-white">ECOA</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#sobre" className="text-white/95 hover:text-white transition-colors font-medium">Sobre</a>
            <a href="#como-funciona" className="text-white/95 hover:text-white transition-colors font-medium">Como Funciona</a>
            <Link href="/catalogo" className="bg-[#C4B4C8] text-[#5A4A5E] px-6 py-2 rounded-full font-semibold transition-all hover:bg-[#E0D8E4] hover:shadow-lg flex items-center gap-2">
              Ver Peças <ArrowRight size={16} />
            </Link>
          </nav>
          <Link href="/admin" className="text-sm text-white/80 hover:text-white underline">
            Área da Dona
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#5A4A5E] via-[#6E5A70] via-[#927F96] to-[#A895AE] py-28 md:py-36 px-4 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#C4B4C8]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#927F96]/30 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/40 shadow-lg">
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
            <Link href="/catalogo" className="bg-white text-[#6E5A70] px-8 py-4 rounded-full font-semibold transition-all hover:bg-[#F5F0F5] hover:shadow-2xl hover:scale-105 text-lg inline-flex items-center gap-2">
              Explorar Coleção <ArrowRight size={20} />
            </Link>
            <a href="#sobre" className="bg-[#927F96]/90 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold transition-all hover:bg-[#6E5A70] hover:shadow-2xl border border-white/40 hover:scale-105">
              Nossa História
            </a>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="py-24 px-4 bg-gradient-to-b from-[#F5F0F5] to-[#F0EBF0]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-[#927F96] tracking-wider uppercase mb-4 block">Nossa História</span>
              <h3 className="text-4xl md:text-5xl font-light text-[#3D3D3D] mb-6 leading-tight">
                Do barro à sua casa, <br />
                <span className="font-semibold text-[#6E5A70]">com propósito</span>
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
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#927F96]/10">
                  <div className="text-3xl font-bold text-[#6E5A70] mb-1">100%</div>
                  <div className="text-sm text-gray-600">Feito à mão</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#A895AE]/20">
                  <div className="text-3xl font-bold text-[#927F96] mb-1">Natural</div>
                  <div className="text-sm text-gray-600">Materiais</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#C4B4C8]/30">
                  <div className="text-3xl font-bold text-[#A895AE] mb-1">Único</div>
                  <div className="text-sm text-gray-600">Cada peça</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#6E5A70] via-[#927F96] to-[#C4B4C8] rounded-3xl flex items-center justify-center shadow-2xl">
                <Sprout className="w-36 h-36 text-white/90" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-[#927F96]/20">
                <Heart className="w-8 h-8 text-[#927F96] mb-2" />
                <p className="text-sm text-gray-700 font-medium">Feito com amor</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-[#A895AE] to-[#C4B4C8] p-6 rounded-2xl shadow-xl">
                <Leaf className="w-8 h-8 text-white mb-2" />
                <p className="text-sm text-white font-medium">100% Natural</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#F0EBF0] to-[#E8E0E8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#6E5A70] tracking-wider uppercase mb-4 block">Nossos Valores</span>
            <h3 className="text-4xl md:text-5xl font-light text-[#3D3D3D]">
              O que nos <span className="font-semibold text-[#927F96]">move</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#927F96]/10 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#5A4A5E] via-[#6E5A70] to-[#927F96] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-[#3D3D3D] mb-3">Sustentabilidade</h4>
              <p className="text-gray-700 leading-relaxed">
                Materiais naturais e processos que respeitam o meio ambiente.
                Peças feitas para durar gerações.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#A895AE]/20 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6E5A70] via-[#927F96] to-[#A895AE] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Hand className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-[#3D3D3D] mb-3">Artesanal</h4>
              <p className="text-gray-700 leading-relaxed">
                Cada peça moldada à mão, com tempo e dedicação.
                Valorizamos o processo, não a produção em massa.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#C4B4C8]/30 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#927F96] via-[#A895AE] to-[#C4B4C8] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
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

      {/* SOBRE A DONA */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#F5F0F5] via-[#F0EBF0] to-[#E8E0E8] relative overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#C4B4C8]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#927F96]/10 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#927F96] tracking-wider uppercase mb-4 block">Quem Faz Acontecer</span>
            <h3 className="text-4xl md:text-5xl font-light text-[#3D3D3D]">
              Conheça a <span className="font-semibold text-[#6E5A70]">alma</span> por trás da ECOA
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-[#6E5A70] via-[#927F96] to-[#A895AE] rounded-3xl"></div>

                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                  <img
                    src="/dona-ecoa.jpg"
                    alt="Dona da ECOA"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>

                <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border border-[#927F96]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#6E5A70] to-[#927F96] rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#3D3D3D]">Artesã</p>
                      <p className="text-sm text-[#927F96]">desde 2022</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -left-6 bg-gradient-to-br from-[#A895AE] to-[#C4B4C8] p-4 rounded-2xl shadow-xl">
                  <Sprout className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div>
              <div className="inline-block bg-[#927F96]/10 px-4 py-2 rounded-full mb-6">
                <span className="text-sm font-semibold text-[#927F96]">A artesã</span>
              </div>

              <h4 className="text-3xl md:text-4xl font-bold text-[#3D3D3D] mb-4 leading-tight">
                Olá, sou a <span className="text-[#6E5A70]">Daiany Oliveira</span>
              </h4>

              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Há mais de 4 anos descobri na cerâmica uma forma de conectar pessoas à natureza.
                Cada peça que crio carrega um pouco da minha história, do meu amor pelo trabalho manual
                e do respeito pelos materiais naturais.
              </p>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                A ECOA nasceu do meu desejo de criar objetos que contam histórias.
                Acredito que quando você tem uma peça feita à mão em casa,
                você tem um pedacinho de alma e intenção.
              </p>

              <div className="bg-gradient-to-br from-[#5A4A5E] via-[#6E5A70] to-[#927F96] p-6 rounded-2xl text-white mb-6 relative">
                <div className="absolute -top-3 left-6 text-6xl text-white/30 font-serif">"</div>
                <p className="italic text-lg leading-relaxed relative z-10">
                  Cada peça é única porque cada momento é único.
                  Faço cerâmica para lembrar as pessoas de desacelerar
                  e apreciar as pequenas belezas da vida.
                </p>
                <p className="text-sm text-white/80 mt-3 font-semibold">
                  — Daiany Oliveira, fundadora da ECOA
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-2xl shadow-md border border-[#927F96]/10">
                  <div className="text-2xl font-bold text-[#6E5A70] mb-1">4+</div>
                  <div className="text-xs text-gray-600">Anos de experiência</div>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl shadow-md border border-[#A895AE]/20">
                  <div className="text-2xl font-bold text-[#927F96] mb-1">100+</div>
                  <div className="text-xs text-gray-600">Peças criadas</div>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl shadow-md border border-[#C4B4C8]/30">
                  <div className="text-2xl font-bold text-[#A895AE] mb-1">100%</div>
                  <div className="text-xs text-gray-600">Feito à mão</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="relative pb-32 px-4 bg-gradient-to-br from-[#5A4A5E] via-[#6E5A70] via-[#927F96] to-[#A895AE]">
        <div className="max-w-6xl mx-auto pt-24">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-white/90 tracking-wider uppercase mb-4 block">Como Funciona</span>
            <h3 className="text-4xl md:text-5xl font-light text-white">
              Simples e <span className="font-semibold">direto</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white/15 backdrop-blur-md p-8 rounded-3xl border border-white/30">
              <div className="w-16 h-16 bg-[#C4B4C8] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[#5A4A5E] shadow-lg">
                1
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Escolha sua peça</h4>
              <p className="text-white/90">
                Navegue pelo catálogo e encontre a cerâmica que fala com você.
              </p>
            </div>

            <div className="text-center bg-white/15 backdrop-blur-md p-8 rounded-3xl border border-white/30">
              <div className="w-16 h-16 bg-[#927F96] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Fale conosco</h4>
              <p className="text-white/90">
                Clique no botão e converse pelo WhatsApp. Tire dúvidas!
              </p>
            </div>

            <div className="text-center bg-white/15 backdrop-blur-md p-8 rounded-3xl border border-white/30">
              <div className="w-16 h-16 bg-[#E0D8E4] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[#5A4A5E] shadow-lg">
                3
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Receba em casa</h4>
              <p className="text-white/90">
                Combinamos pagamento e entrega de forma segura.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/catalogo" className="bg-white text-[#6E5A70] px-8 py-4 rounded-full font-semibold transition-all hover:bg-[#F5F0F5] hover:shadow-2xl hover:scale-105 text-lg inline-flex items-center gap-2">
              Ver Catálogo Completo <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* ONDA - Transição suave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-[80px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C73.71,22.09,142.84,46.57,214.34,56.44Z"
              fill="#927F96"
            ></path>
          </svg>
        </div>
      </section>

            {/* CTA FINAL */}
      <section className="relative bg-gradient-to-b from-[#927F96] via-[#7A6880] to-[#6E5A70]">
        <div className="max-w-4xl mx-auto text-center py-20 px-4">
          <h3 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Pronto para ter uma peça <br />
            <span className="font-semibold">ECOA</span> na sua casa?
          </h3>
          <p className="text-xl text-white/95 mb-8">
            Cada cerâmica é única, assim como você.
          </p>
          <Link href="/catalogo" className="bg-white text-[#927F96] px-8 py-4 rounded-full font-semibold transition-all hover:bg-[#F5F0F5] hover:shadow-2xl hover:scale-105 text-lg inline-flex items-center gap-2">
            Explorar Peças <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* SEÇÃO DE CONTATO */}
      <section className="relative bg-gradient-to-b from-[#6E5A70] via-[#5A4A5E] to-[#4A3A4E]">
        <div className="max-w-4xl mx-auto text-center py-20 px-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-6 border border-white/30">
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="text-sm text-white font-medium">Fale diretamente conosco</span>
          </div>

          <h3 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Tem alguma dúvida? <br />
            <span className="font-semibold">Estamos aqui para ajudar!</span>
          </h3>

          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Converse pelo WhatsApp e tire todas as suas dúvidas sobre nossas peças,
            materiais, entrega e muito mais.
          </p>

          <a
            href={'https://wa.me/' + process.env.NEXT_PUBLIC_WHATSAPP_NUMBER + '?text=' + encodeURIComponent('Ola! Vim pelo site da ECOA e gostaria de mais informacoes.')}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-3 transition-all hover:scale-105 shadow-2xl hover:shadow-[#25D366]/50"
          >
            <MessageCircle size={24} className="fill-white" />
            Chamar no WhatsApp
          </a>

          <p className="text-white/70 text-sm mt-6">
            Respondemos rapidamente em horário comercial
          </p>
        </div>
      </section>

      {/* FOOTER - RETO */}
      <footer className="bg-[#3D3D3D] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="text-[#C4B4C8] w-6 h-6" />
                <h4 className="text-xl font-bold tracking-widest">ECOA</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Cerâmica artesanal feita com amor e sustentabilidade.
                Cada peça carrega a essência da natureza.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-[#C4B4C8]">Links</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#sobre" className="hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-[#E0D8E4]">Contato</h5>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a
                    href={'https://wa.me/' + process.env.NEXT_PUBLIC_WHATSAPP_NUMBER + '?text=' + encodeURIComponent('Ola! Vim pelo site da ECOA e gostaria de saber mais.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#25D366] transition-colors group"
                  >
                    <div className="bg-[#25D366]/20 p-2 rounded-full group-hover:bg-[#25D366]/30 transition-colors">
                      <MessageCircle size={16} className="text-[#25D366]" />
                    </div>
                    <span className="font-medium">WhatsApp direto</span>
                  </a>
                </li>
                <li className="text-xs text-gray-500 mt-2">
                  Respondemos em até 24h
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
            <p>© 2026 ECOA Cerâmica. Feito com amor e sustentabilidade.</p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </main>
  );
}