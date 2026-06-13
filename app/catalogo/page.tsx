'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { MessageCircle, ArrowLeft, Sprout } from 'lucide-react';
import Link from 'next/link';

interface Produto {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    imagem_url: string;
}

export default function Catalogo() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProdutos() {
            const { data, error } = await supabase
                .from('produtos')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setProdutos(data);
            setLoading(false);
        }
        fetchProdutos();
    }, []);

    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
    };

    const gerarLinkWhatsApp = (produto: Produto) => {
        const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
        const mensagem = `Olá! Vi a peça *${produto.nome}* no site da ECOA e tenho interesse. Poderia me passar mais detalhes?`;
        return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    };

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#E8D5C4]/30">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Sprout className="text-[#D4E2D4] w-8 h-8" />
                        <h1 className="text-2xl font-bold tracking-widest text-[#4A4A48]">ECOA</h1>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/" className="text-gray-600 hover:text-[#4A4A48] transition-colors">
                            Início
                        </Link>
                        <Link href="/admin" className="text-sm text-gray-500 hover:text-[#4A4A48] underline">
                            Área da Dona
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero do Catálogo */}
            <section className="bg-gradient-to-b from-[#FDFBF7] to-[#F4F1EA] py-16 px-4 text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#4A4A48] mb-6 transition-colors">
                    <ArrowLeft size={20} />
                    Voltar para o início
                </Link>
                <h2 className="text-4xl md:text-5xl font-light text-[#4A4A48] mb-4">
                    Nossas <span className="font-semibold text-[#B8C5D6]">Peças</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Cada peça é única e feita à mão. Escolha a sua e fale conosco pelo WhatsApp!
                </p>
            </section>

            {/* Grid de Produtos */}
            <section className="max-w-6xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E8D5C4]"></div>
                        <p className="text-gray-500 mt-4">Carregando belezas...</p>
                    </div>
                ) : produtos.length === 0 ? (
                    <div className="text-center py-20">
                        <Sprout className="w-16 h-16 text-[#E8D5C4] mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Nenhuma peça cadastrada ainda.</p>
                        <p className="text-gray-400 text-sm mt-2">Volte em breve para ver nossas novidades!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {produtos.map((produto) => (
                            <div key={produto.id} className="card-ecoa flex flex-col">
                                <div className="h-72 overflow-hidden bg-gray-100">
                                    <img
                                        src={produto.imagem_url}
                                        alt={produto.nome}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h4 className="text-xl font-semibold mb-2 text-[#4A4A48]">{produto.nome}</h4>
                                    <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed">{produto.descricao}</p>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                        <span className="text-2xl font-bold text-[#4A4A48]">
                                            {formatarPreco(produto.preco)}
                                        </span>
                                        <a
                                            href={gerarLinkWhatsApp(produto)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-ecoa"
                                        >
                                            <MessageCircle size={18} />
                                            Tenho Interesse
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-[#4A4A48] text-white py-8 px-4 mt-20">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-gray-400 text-sm">© 2026 ECOA Cerâmica. Feito com amor e sustentabilidade.</p>
                </div>
            </footer>
        </main>
    );
}