'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Sprout } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';

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
    estoque: number;
    imagens?: Imagem[];
}

export default function Catalogo() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            const { data: produtosData, error } = await supabase
                .from('produtos')
                .select('id, nome, descricao, preco, imagem_url, estoque')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Erro ao buscar produtos:', error);
                throw error;
            }

            const produtosComImagens = await Promise.all(
                (produtosData || []).map(async (produto) => {
                    const { data: imagensData } = await supabase
                        .from('produto_imagens')
                        .select('*')
                        .eq('produto_id', produto.id)
                        .order('ordem', { ascending: true });

                    return {
                        ...produto,
                        estoque: produto.estoque || 0,
                        imagens: imagensData || [],
                    };
                })
            );

            setProdutos(produtosComImagens);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FAF7F2]">
            {/* Header */}
            <header className="bg-[#7A8B6F] sticky top-0 z-50 shadow-md">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Sprout className="text-[#FAF7F2] w-7 h-7" />
                        <h1 className="text-2xl font-bold tracking-widest text-white">ECOA</h1>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/" className="text-white/95 hover:text-white transition-colors font-medium">
                            Início
                        </Link>
                        <Link href="/admin" className="text-sm text-white/80 hover:text-white underline">
                            Área da Dona
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero do Catálogo */}
            <section className="bg-gradient-to-br from-[#7A8B6F] via-[#8FA895] to-[#A895B5] py-16 px-4 text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} />
                    Voltar para o início
                </Link>
                <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
                    Nossas <span className="font-semibold">Peças</span>
                </h2>
                <p className="text-lg text-white/90 max-w-2xl mx-auto">
                    Cada peça é única e feita à mão. Passe o mouse para ver mais fotos e clique para ver a galeria completa.
                </p>
            </section>

            {/* Grid de Produtos */}
            <section className="max-w-6xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#A895B5]"></div>
                        <p className="text-gray-500 mt-4">Carregando belezas...</p>
                    </div>
                ) : produtos.length === 0 ? (
                    <div className="text-center py-20">
                        <Sprout className="w-16 h-16 text-[#A895B5] mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Nenhuma peça cadastrada ainda.</p>
                        <p className="text-gray-400 text-sm mt-2">Volte em breve para ver nossas novidades!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {produtos.map((produto) => (
                            <ProductCard key={produto.id} produto={produto} />
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-[#3D3D3D] text-white py-8 px-4 mt-20">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-gray-400 text-sm">© 2026 ECOA Cerâmica. Feito com amor e sustentabilidade.</p>
                </div>
            </footer>
        </main>
    );
}