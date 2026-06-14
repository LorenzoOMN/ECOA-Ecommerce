'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

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

interface ProductCardProps {
    produto: Produto;
}

export default function ProductCard({ produto }: ProductCardProps) {
    const [imagemAtual, setImagemAtual] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const imagens = produto.imagens && produto.imagens.length > 0 
        ? produto.imagens 
        : [{ id: 'main', imagem_url: produto.imagem_url, ordem: 0 }];

    const temMultiplasFotos = imagens.length > 1;
    const semEstoque = produto.estoque === 0 || produto.estoque === undefined;

    useEffect(() => {
        if (!isHovered || !temMultiplasFotos) return;
        
        const interval = setInterval(() => {
            setImagemAtual((prev) => (prev + 1) % imagens.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [isHovered, temMultiplasFotos, imagens.length]);

    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
    };

    const proximaImagem = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImagemAtual((prev) => (prev + 1) % imagens.length);
    };

    const imagemAnterior = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImagemAtual((prev) => (prev - 1 + imagens.length) % imagens.length);
    };

    return (
        <div className="relative">
            {/* Badge de sem estoque - BLOQUEIO TOTAL */}
            {semEstoque && (
                <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                    <div className="text-center text-white p-6">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-[#C9A87C]" />
                        <p className="font-bold text-lg">Esgotado</p>
                        <p className="text-sm text-white/80 mt-1">Produto temporariamente indisponível</p>
                    </div>
                </div>
            )}

            {/* Badge de estoque baixo */}
            {produto.estoque && produto.estoque > 0 && produto.estoque <= 3 && (
                <div className="absolute top-4 left-4 z-40 bg-[#C9A87C] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    Últimas {produto.estoque} peças!
                </div>
            )}

            <Link 
                href={semEstoque ? '#' : '/catalogo/' + produto.id}
                className={`block group ${semEstoque ? 'pointer-events-none opacity-75' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); setImagemAtual(0); }}
            >
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-md border border-[#A895B5]/20 transition-all hover:-translate-y-2 hover:shadow-2xl">
                    <div className="relative aspect-square bg-[#F0EBE3] overflow-hidden">
                        {temMultiplasFotos && imagens.slice(1, 3).map((img, idx) => (
                            <div
                                key={img.id + '-stack'}
                                className="absolute inset-3 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    transform: `rotate(${idx % 2 === 0 ? 3 : -3}deg) scale(0.95)`,
                                    zIndex: imagens.length - idx,
                                }}
                            >
                                <img
                                    src={img.imagem_url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}

                        <div 
                            className="absolute inset-0 transition-all duration-500 ease-out"
                            style={{
                                transform: isHovered && temMultiplasFotos 
                                    ? 'scale(1.05) rotate(-1deg)' 
                                    : 'scale(1) rotate(0)',
                                zIndex: 10,
                            }}
                        >
                            <img
                                src={imagens[imagemAtual].imagem_url}
                                alt={produto.nome}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                        {temMultiplasFotos && (
                            <>
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#3D3D3D] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-30">
                                    <Camera size={14} className="text-[#A895B5]" />
                                    <span className="text-xs font-bold">{imagens.length}</span>
                                </div>

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
                                    {imagens.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                idx === imagemAtual
                                                    ? 'w-6 bg-white'
                                                    : 'w-1.5 bg-white/50'
                                            }`}
                                        />
                                    ))}
                                </div>

                                <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none">
                                    <button
                                        onClick={imagemAnterior}
                                        className="pointer-events-auto bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                                        aria-label="Foto anterior"
                                    >
                                        <ChevronLeft size={18} className="text-[#3D3D3D]" />
                                    </button>
                                    <button
                                        onClick={proximaImagem}
                                        className="pointer-events-auto bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                                        aria-label="Próxima foto"
                                    >
                                        <ChevronRight size={18} className="text-[#3D3D3D]" />
                                    </button>
                                </div>

                                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[#7A8B6F] text-white text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 translate-y-2 group-hover:translate-y-0">
                                    Ver galeria completa
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-6">
                        <h3 className="text-xl font-bold text-[#3D3D3D] mb-2 group-hover:text-[#7A8B6F] transition-colors">
                            {produto.nome}
                        </h3>
                        
                        {produto.descricao && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {produto.descricao}
                            </p>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <span className="text-2xl font-bold text-[#7A8B6F]">
                                {formatarPreco(produto.preco)}
                            </span>
                            
                            <span className="text-sm font-semibold text-[#A895B5] group-hover:text-[#9B8AA8] flex items-center gap-1">
                                Ver detalhes
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}