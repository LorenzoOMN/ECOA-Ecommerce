'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import Link from 'next/link';

interface Imagem {
    id: string;
    imagem_url: string;
    ordem: number;
}

interface Produto {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    imagem_url: string;
    imagens: Imagem[];
}

export default function ProdutoDetalhe() {
    const params = useParams();
    const router = useRouter();
    const [produto, setProduto] = useState<Produto | null>(null);
    const [imagemAtual, setImagemAtual] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarProduto();
    }, [params.id]);

    const carregarProduto = async () => {
        try {
            const { data: produtoData, error } = await supabase
                .from('produtos')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) throw error;

            const { data: imagensData } = await supabase
                .from('produto_imagens')
                .select('*')
                .eq('produto_id', params.id)
                .order('ordem', { ascending: true });

            setProduto({
                ...produtoData,
                imagens: imagensData || [],
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
    };

    const gerarLinkWhatsApp = () => {
        if (!produto) return '#';
        const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

        // Formata o preço corretamente com 2 casas decimais
        const precoFormatado = produto.preco.toFixed(2).replace('.', ',');
        const mensagem = `Olá! Vi a peça "${produto.nome}", que está custando "R$ ${precoFormatado}" no site da ECOA e tenho interesse.`;
        return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensagem);
    };

    const proximaImagem = () => {
        if (!produto) return;
        setImagemAtual((prev) => (prev + 1) % produto.imagens.length);
    };

    const imagemAnterior = () => {
        if (!produto) return;
        setImagemAtual((prev) => (prev - 1 + produto.imagens.length) % produto.imagens.length);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#A895B5]"></div>
            </div>
        );
    }

    if (!produto) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
                <p className="text-gray-500">Produto nao encontrado.</p>
            </div>
        );
    }

    const imagens = produto.imagens.length > 0
        ? produto.imagens
        : [{ id: 'main', imagem_url: produto.imagem_url, ordem: 0 }];

    return (
        <main className="min-h-screen bg-[#FAF7F2]">
            {/* Header */}
            <header className="bg-[#7A8B6F] sticky top-0 z-50 shadow-md">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="text-white hover:text-[#FAF7F2] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <ArrowLeft size={20} /> Voltar
                    </button>
                    <h1 className="text-xl font-bold text-white tracking-widest">ECOA</h1>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

                    {/* ===== GALERIA ===== */}
                    <div>
                        {/* Imagem Principal */}
                        <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-lg mb-4 group">
                            <img
                                src={imagens[imagemAtual].imagem_url}
                                alt={produto.nome}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Setas de navegação */}
                            {imagens.length > 1 && (
                                <>
                                    <button
                                        onClick={imagemAnterior}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                                    >
                                        <ChevronLeft size={24} className="text-[#3D3D3D]" />
                                    </button>
                                    <button
                                        onClick={proximaImagem}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                                    >
                                        <ChevronRight size={24} className="text-[#3D3D3D]" />
                                    </button>

                                    {/* Contador */}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#3D3D3D] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                        <Camera size={14} className="text-[#A895B5]" />
                                        <span className="text-sm font-bold">
                                            {imagemAtual + 1} / {imagens.length}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Miniaturas */}
                        {imagens.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {imagens.map((img, index) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setImagemAtual(index)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${imagemAtual === index
                                                ? 'border-[#A895B5] shadow-md scale-105'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={img.imagem_url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ===== INFORMAÇÕES ===== */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#3D3D3D] mb-3 leading-tight">
                                {produto.nome}
                            </h2>
                            <p className="text-3xl font-bold text-[#7A8B6F]">
                                {formatarPreco(produto.preco)}
                            </p>
                        </div>

                        {produto.descricao && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#A895B5]/20">
                                <h3 className="font-bold text-[#3D3D3D] mb-3 text-lg">Sobre a peça:</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {produto.descricao}
                                </p>
                            </div>
                        )}

                        {/* Card de contato */}
                        <div className="bg-gradient-to-br from-[#7A8B6F] to-[#8FA895] p-6 rounded-2xl text-white shadow-lg">
                            <h3 className="font-bold text-xl mb-2">Interessado?</h3>
                            <p className="text-white/90 mb-4 leading-relaxed">
                                Converse diretamente conosco pelo WhatsApp para tirar duvidas e finalizar a compra.
                            </p>
                            <a
                                href={gerarLinkWhatsApp()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-[#7A8B6F] px-6 py-3 rounded-full font-bold inline-flex items-center gap-2 hover:bg-[#FAF7F2] transition-all shadow-lg hover:shadow-xl"
                            >
                                <MessageCircle size={20} />
                                Falar no WhatsApp
                            </a>
                        </div>

                        <Link href="/catalogo" className="inline-flex items-center gap-2 text-[#A895B5] hover:text-[#9B8AA8] font-semibold transition-colors cursor-pointer">
                            <ArrowLeft size={16} /> Ver outras pecas
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}