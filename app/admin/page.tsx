'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';  // ← ADICIONE ISSO se não tiver
import { Upload, Save, ArrowLeft, Edit2, Trash2, X, Package, Image as ImageIcon, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import Modal from '../components/Modal';

interface Imagem {
    id?: string;
    url: string;
    ordem: number;
    file?: File;
    isExisting?: boolean;
}

interface Produto {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    imagem_url: string;
    imagens?: Imagem[];
}

export default function Admin() {
    const [autenticado, setAutenticado] = useState(false);
    const [senha, setSenha] = useState('');
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState<string | null>(null);

    const [modal, setModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'error' | 'warning' | 'confirm';
        onConfirm?: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'success',
    });

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [imagens, setImagens] = useState<Imagem[]>([]);

    const router = useRouter();

    useEffect(() => {
        if (autenticado) {
            carregarProdutos();
        }
    }, [autenticado]);

    const carregarProdutos = async () => {
        try {
            const { data: produtosData, error } = await supabase
                .from('produtos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Carregar imagens de cada produto
            const produtosComImagens = await Promise.all(
                (produtosData || []).map(async (produto) => {
                    const { data: imagensData } = await supabase
                        .from('produto_imagens')
                        .select('*')
                        .eq('produto_id', produto.id)
                        .order('ordem', { ascending: true });

                    return {
                        ...produto,
                        imagens: (imagensData || []).map((img) => ({
                            id: img.id,
                            url: img.imagem_url,
                            ordem: img.ordem,
                            isExisting: true,
                        })),
                    };
                })
            );

            setProdutos(produtosComImagens);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            setModal({
                isOpen: true,
                title: 'Erro ao carregar',
                message: 'Nao foi possivel carregar a lista de produtos.',
                type: 'error',
            });
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (senha === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            setAutenticado(true);
        } else {
            setModal({
                isOpen: true,
                title: 'Senha incorreta',
                message: 'A senha digitada nao esta correta.',
                type: 'error',
            });
        }
    };

    const resetarFormulario = () => {
        setNome('');
        setDescricao('');
        setPreco('');
        setImagens([]);
        setModoEdicao(false);
        setProdutoEditando(null);
    };

    const adicionarImagens = (files: FileList | null) => {
        if (!files) return;
        const novasImagens: Imagem[] = Array.from(files).map((file, index) => ({
            url: URL.createObjectURL(file),
            ordem: imagens.length + index,
            file,
            isExisting: false,
        }));
        setImagens([...imagens, ...novasImagens]);
    };

    const removerImagem = (index: number) => {
        setImagens(imagens.filter((_, i) => i !== index));
    };

    const moverImagem = (index: number, direcao: 'up' | 'down') => {
        const novasImagens = [...imagens];
        const targetIndex = direcao === 'up' ? index - 1 : index + 1;
        
        if (targetIndex < 0 || targetIndex >= novasImagens.length) return;
        
        [novasImagens[index], novasImagens[targetIndex]] = [novasImagens[targetIndex], novasImagens[index]];
        
        // Atualizar ordem
        novasImagens.forEach((img, i) => {
            img.ordem = i;
        });
        
        setImagens(novasImagens);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !preco) {
            setModal({
                isOpen: true,
                title: 'Campos obrigatorios',
                message: 'Por favor, preencha o nome e o preco da peca.',
                type: 'warning',
            });
            return;
        }

        if (imagens.length === 0) {
            setModal({
                isOpen: true,
                title: 'Imagem obrigatoria',
                message: 'Adicione pelo menos uma imagem da peca.',
                type: 'warning',
            });
            return;
        }

        setLoading(true);
        try {
            let produtoId = produtoEditando;
            const imagemPrincipal = imagens[0].isExisting ? imagens[0].url : null;

            // CREATE ou UPDATE do produto
            if (modoEdicao && produtoEditando) {
                const updateData: any = {
                    nome,
                    descricao,
                    preco: parseFloat(preco.replace(',', '.')),
                };
                
                // Atualizar imagem principal se a primeira imagem for nova
                if (!imagens[0].isExisting) {
                    updateData.imagem_url = null; // Será atualizado depois
                }
                
                const { error: dbError } = await supabase
                    .from('produtos')
                    .update(updateData)
                    .eq('id', produtoEditando);

                if (dbError) throw dbError;

                // Excluir imagens antigas que foram removidas
                const { data: imagensExistentes } = await supabase
                    .from('produto_imagens')
                    .select('id')
                    .eq('produto_id', produtoEditando);

                const idsMantidos = imagens
                    .filter(img => img.isExisting && img.id)
                    .map(img => img.id);

                if (imagensExistentes) {
                    for (const img of imagensExistentes) {
                        if (!idsMantidos.includes(img.id)) {
                            await supabase.from('produto_imagens').delete().eq('id', img.id);
                        }
                    }
                }
            } else {
                const { data: novoProduto, error: dbError } = await supabase
                    .from('produtos')
                    .insert({
                        nome,
                        descricao,
                        preco: parseFloat(preco.replace(',', '.')),
                        imagem_url: '',
                    })
                    .select()
                    .single();

                if (dbError) throw dbError;
                produtoId = novoProduto.id;
            }

            // Upload de novas imagens
            const imagensFinais: Imagem[] = [];
            for (let i = 0; i < imagens.length; i++) {
                const img = imagens[i];
                
                if (img.isExisting && img.id) {
                    // Imagem existente - apenas atualizar ordem
                    await supabase
                        .from('produto_imagens')
                        .update({ ordem: i })
                        .eq('id', img.id);
                    
                    imagensFinais.push({ ...img, ordem: i });
                } else if (img.file) {
                    // Imagem nova - fazer upload
                    const fileExt = img.file.name.split('.').pop();
                    const fileName = Date.now() + '_' + i + '.' + fileExt;

                    const { error: uploadError } = await supabase.storage
                        .from('imagens-produtos')
                        .upload(fileName, img.file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('imagens-produtos')
                        .getPublicUrl(fileName);

                    // Inserir no banco
                    const { data: novaImagem, error: imgError } = await supabase
                        .from('produto_imagens')
                        .insert({
                            produto_id: produtoId,
                            imagem_url: publicUrl,
                            ordem: i,
                        })
                        .select()
                        .single();

                    if (imgError) throw imgError;

                    imagensFinais.push({
                        id: novaImagem.id,
                        url: publicUrl,
                        ordem: i,
                        isExisting: true,
                    });
                }
            }

            // Atualizar imagem principal do produto (primeira imagem)
            if (imagensFinais.length > 0) {
                await supabase
                    .from('produtos')
                    .update({ imagem_url: imagensFinais[0].url })
                    .eq('id', produtoId);
            }

            setModal({
                isOpen: true,
                title: modoEdicao ? 'Produto atualizado!' : 'Produto cadastrado!',
                message: 'A peca "' + nome + '" foi salva com sucesso.',
                type: 'success',
            });

            resetarFormulario();
            await carregarProdutos();

        } catch (error: any) {
            console.error(error);
            setModal({
                isOpen: true,
                title: 'Erro ao salvar',
                message: error.message || 'Ocorreu um erro ao salvar o produto.',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditar = (produto: Produto) => {
        setModoEdicao(true);
        setProdutoEditando(produto.id);
        setNome(produto.nome);
        setDescricao(produto.descricao || '');
        setPreco(produto.preco.toString());
        setImagens(produto.imagens || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleExcluir = (id: string, nome: string) => {
        setModal({
            isOpen: true,
            title: 'Excluir produto?',
            message: 'Tem certeza que deseja excluir "' + nome + '"? Esta acao nao pode ser desfeita.',
            type: 'confirm',
            onConfirm: async () => {
                setLoading(true);
                try {
                    // Excluir imagens do storage
                    const { data: imagensProduto } = await supabase
                        .from('produto_imagens')
                        .select('imagem_url')
                        .eq('produto_id', id);

                    if (imagensProduto) {
                        const fileNames = imagensProduto
                            .map(img => img.imagem_url.split('/').pop())
                            .filter(Boolean) as string[];
                        
                        if (fileNames.length > 0) {
                            await supabase.storage
                                .from('imagens-produtos')
                                .remove(fileNames);
                        }
                    }

                    // Excluir do banco (CASCADE vai deletar produto_imagens)
                    const { error } = await supabase
                        .from('produtos')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;

                    setModal({
                        isOpen: true,
                        title: 'Produto excluido!',
                        message: 'A peca "' + nome + '" foi removida.',
                        type: 'success',
                    });

                    await carregarProdutos();
                } catch (error: any) {
                    setModal({
                        isOpen: true,
                        title: 'Erro ao excluir',
                        message: error.message || 'Nao foi possivel excluir.',
                        type: 'error',
                    });
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
    };

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    if (!autenticado) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
                    <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#A895B5]">
                        <h2 className="text-2xl font-bold text-center mb-6 text-[#3D3D3D]">Acesso ECOA</h2>
                        <input
                            type="password"
                            placeholder="Digite a senha"
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#A895B5]"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <button type="submit" className="w-full btn-lilas">Entrar</button>
                        <Link href="/" className="block text-center mt-4 text-sm text-gray-500 hover:underline">
                            Voltar para o site
                        </Link>
                    </form>
                </div>
                <Modal
                    isOpen={modal.isOpen}
                    onClose={closeModal}
                    title={modal.title}
                    message={modal.message}
                    type={modal.type}
                    onConfirm={modal.onConfirm}
                />
            </>
        );
    }

    return (
        <>
            <main className="min-h-screen bg-[#FAF7F2] p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#7A8B6F]">
                            <ArrowLeft size={20} /> Voltar para a loja
                        </Link>
                        <button
                            onClick={() => { setAutenticado(false); setSenha(''); }}
                            className="text-sm text-gray-500 hover:text-[#A895B5]"
                        >
                            Sair
                        </button>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#3D3D3D] mb-2">
                            {modoEdicao ? 'Editar Produto' : 'Cadastrar Nova Peca'}
                        </h1>
                        <p className="text-gray-600">
                            {modoEdicao ? 'Altere os dados do produto abaixo.' : 'Preencha os dados para adicionar uma nova peca.'}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* FORMULÁRIO */}
                        <div className="bg-white p-8 rounded-2xl shadow-md border border-[#A895B5]/30">
                            <h2 className="text-xl font-bold mb-6 text-[#3D3D3D] flex items-center gap-2">
                                <Upload size={24} className="text-[#8FA895]" />
                                {modoEdicao ? 'Editar Peca' : 'Nova Peca'}
                            </h2>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Peca *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Ex: Vaso Terracota"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descricao</label>
                                    <textarea
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        placeholder="Descreva a peca, materiais, dimensoes..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preco (R$) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                        value={preco}
                                        onChange={(e) => setPreco(e.target.value)}
                                        placeholder="0,00"
                                    />
                                </div>

                                {/* GALERIA DE IMAGENS */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <ImageIcon size={16} className="inline mr-1" />
                                        Imagens da Peca * (a primeira sera a capa)
                                    </label>
                                    
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 mb-3"
                                        onChange={(e) => adicionarImagens(e.target.files)}
                                    />

                                    {imagens.length > 0 && (
                                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                            {imagens.map((img, index) => (
                                                <div 
                                                    key={index}
                                                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200"
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={`Imagem ${index + 1}`}
                                                        className="w-16 h-16 object-cover rounded border border-gray-200"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-gray-600">
                                                            {index === 0 ? '⭐ Imagem de capa' : `Imagem ${index + 1}`}
                                                        </p>
                                                        <p className="text-xs text-gray-400 truncate">
                                                            {img.isExisting ? 'Ja salva' : 'Nova'}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => moverImagem(index, 'up')}
                                                            disabled={index === 0}
                                                            className="p-1 text-gray-500 hover:text-[#7A8B6F] disabled:opacity-30"
                                                            title="Mover para cima"
                                                        >
                                                            <ArrowUp size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => moverImagem(index, 'down')}
                                                            disabled={index === imagens.length - 1}
                                                            className="p-1 text-gray-500 hover:text-[#7A8B6F] disabled:opacity-30"
                                                            title="Mover para baixo"
                                                        >
                                                            <ArrowDown size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removerImagem(index)}
                                                            className="p-1 text-red-500 hover:text-red-700"
                                                            title="Remover"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-lilas disabled:opacity-50"
                                    >
                                        {loading ? 'Salvando...' : (
                                            <>
                                                <Save size={18} />
                                                {modoEdicao ? 'Atualizar Peca' : 'Salvar Peca'}
                                            </>
                                        )}
                                    </button>

                                    {modoEdicao && (
                                        <button
                                            type="button"
                                            onClick={resetarFormulario}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                                        >
                                            <X size={18} />
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* LISTA DE PRODUTOS */}
                        <div className="bg-white p-8 rounded-2xl shadow-md border border-[#A895B5]/30">
                            <h2 className="text-xl font-bold mb-6 text-[#3D3D3D] flex items-center gap-2">
                                <Package size={24} className="text-[#A895B5]" />
                                Produtos Cadastrados ({produtos.length})
                            </h2>

                            {produtos.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p>Nenhum produto cadastrado ainda.</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                                    {produtos.map((produto) => (
                                        <div
                                            key={produto.id}
                                            className={`border rounded-xl p-4 transition-all ${produtoEditando === produto.id
                                                    ? 'border-[#A895B5] bg-[#A895B5]/5'
                                                    : 'border-gray-200 hover:border-[#8FA895]'
                                                }`}
                                        >
                                            <div className="flex gap-4">
                                                <img
                                                    src={produto.imagem_url}
                                                    alt={produto.nome}
                                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                                />

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-[#3D3D3D] truncate">{produto.nome}</h3>
                                                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                                        {produto.descricao || 'Sem descricao'}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <p className="text-lg font-bold text-[#7A8B6F]">
                                                            {formatarPreco(produto.preco)}
                                                        </p>
                                                        {produto.imagens && produto.imagens.length > 1 && (
                                                            <span className="text-xs bg-[#A895B5]/20 text-[#A895B5] px-2 py-1 rounded-full">
                                                                {produto.imagens.length} fotos
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() => handleEditar(produto)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#8FA895] text-white rounded-lg font-medium hover:bg-[#7A8B6F] transition-colors text-sm"
                                                >
                                                    <Edit2 size={16} />
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleExcluir(produto.id, produto.nome)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm"
                                                >
                                                    <Trash2 size={16} />
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onConfirm={modal.onConfirm}
            />
        </>
    );
}