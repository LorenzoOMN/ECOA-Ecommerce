'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Upload, Save, ArrowLeft, Edit2, Trash2, X, Package, LogOut, Plus, Minus, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import Modal from '../components/Modal';
import { TrendingUp } from 'lucide-react';

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
    estoque: number;
    estoque_minimo: number;
    imagens?: Imagem[];
}

export default function Admin() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loginError, setLoginError] = useState('');

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState<string | null>(null);

    const [modalEstoque, setModalEstoque] = useState<{
        isOpen: boolean;
        produto: Produto | null;
    }>({ isOpen: false, produto: null });

    const [formEstoque, setFormEstoque] = useState({
        tipo: 'entrada' as 'entrada' | 'saida' | 'ajuste',
        quantidade: '0',
        motivo: '',
    });

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
    const [estoque, setEstoque] = useState('0');
    const [imagens, setImagens] = useState<Imagem[]>([]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setLoading(false);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            carregarProdutos();
        }
    }, [user]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: senha,
        });

        if (error) {
            setLoginError('Email ou senha incorretos');
            setModal({
                isOpen: true,
                title: 'Erro no login',
                message: 'Email ou senha incorretos. Tente novamente.',
                type: 'error',
            });
        } else {
            setUser(data.user);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setEmail('');
        setSenha('');
    };

    const carregarProdutos = async () => {
        try {
            const { data: produtosData, error } = await supabase
                .from('produtos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

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
        }
    };

    const resetarFormulario = () => {
        setNome('');
        setDescricao('');
        setPreco('');
        setEstoque('0');
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
                message: 'Por favor, preencha o nome e o preco.',
                type: 'warning',
            });
            return;
        }

        if (imagens.length === 0 && !modoEdicao) {
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

            if (modoEdicao && produtoEditando) {
                const { error: dbError } = await supabase
                    .from('produtos')
                    .update({
                        nome,
                        descricao,
                        preco: parseFloat(preco.replace(',', '.')),
                        estoque: parseInt(estoque) || 0,
                    })
                    .eq('id', produtoEditando);

                if (dbError) throw dbError;

                const { data: imagensExistentes } = await supabase
                    .from('produto_imagens')
                    .select('id, imagem_url')
                    .eq('produto_id', produtoEditando);

                const idsMantidos = imagens
                    .filter(img => img.isExisting && img.id)
                    .map(img => img.id);

                if (imagensExistentes) {
                    for (const img of imagensExistentes) {
                        if (!idsMantidos.includes(img.id)) {
                            const fileName = img.imagem_url.split('/').pop();
                            if (fileName) {
                                await supabase.storage
                                    .from('imagens-produtos')
                                    .remove([fileName]);
                            }
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
                        estoque: parseInt(estoque) || 0,
                        imagem_url: '',
                    })
                    .select()
                    .single();

                if (dbError) throw dbError;
                produtoId = novoProduto.id;
            }

            const imagensFinais: Imagem[] = [];
            for (let i = 0; i < imagens.length; i++) {
                const img = imagens[i];

                if (img.isExisting && img.id) {
                    await supabase
                        .from('produto_imagens')
                        .update({ ordem: i })
                        .eq('id', img.id);

                    imagensFinais.push({ ...img, ordem: i });
                } else if (img.file) {
                    const fileExt = img.file.name.split('.').pop();
                    const fileName = Date.now() + '_' + i + '.' + fileExt;

                    const { error: uploadError } = await supabase.storage
                        .from('imagens-produtos')
                        .upload(fileName, img.file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('imagens-produtos')
                        .getPublicUrl(fileName);

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
            setModal({
                isOpen: true,
                title: 'Erro ao salvar',
                message: error.message || 'Erro ao salvar produto.',
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
        setEstoque(produto.estoque?.toString() || '0');
        setImagens(produto.imagens || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleExcluir = (id: string, nome: string) => {
        setModal({
            isOpen: true,
            title: 'Excluir produto?',
            message: 'Tem certeza que deseja excluir "' + nome + '"?',
            type: 'confirm',
            onConfirm: async () => {
                setLoading(true);
                try {
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
                        message: error.message || 'Erro ao excluir.',
                        type: 'error',
                    });
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const handleAtualizarEstoque = async (produtoId: string, quantidade: number, tipo: 'entrada' | 'saida' | 'ajuste', motivo: string) => {
        try {
            const { data: produto, error: fetchError } = await supabase
                .from('produtos')
                .select('estoque')
                .eq('id', produtoId)
                .single();

            if (fetchError) throw fetchError;

            const novoEstoque = tipo === 'ajuste' ? quantidade : produto.estoque + quantidade;

            const { error: updateError } = await supabase
                .from('produtos')
                .update({ estoque: novoEstoque })
                .eq('id', produtoId);

            if (updateError) throw updateError;

            const { error: movError } = await supabase
                .from('movimentacoes_estoque')
                .insert({
                    produto_id: produtoId,
                    tipo,
                    quantidade: Math.abs(quantidade),
                    motivo,
                });

            if (movError) throw movError;

            setModal({
                isOpen: true,
                title: 'Estoque atualizado!',
                message: 'Estoque atualizado com sucesso. Novo total: ' + novoEstoque + ' unidades.',
                type: 'success',
            });

            await carregarProdutos();
        } catch (error: any) {
            setModal({
                isOpen: true,
                title: 'Erro ao atualizar estoque',
                message: error.message,
                type: 'error',
            });
        }
    };

    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
    };

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F0F5]">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#927F96]"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F0F5] via-[#F0EBF0] to-[#E8E0E8] p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#927F96]/30">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#6E5A70] to-[#927F96] rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#3D3D3D]">Area Restrita</h2>
                            <p className="text-sm text-gray-500 mt-2">Faca login para acessar o painel administrativo</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#927F96]"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@ecoa.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#927F96]"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>

                            {loginError && (
                                <p className="text-red-500 text-sm text-center">{loginError}</p>
                            )}

                            <button type="submit" className="w-full bg-gradient-to-r from-[#6E5A70] to-[#927F96] text-white py-3 rounded-full font-semibold hover:from-[#5A4A5E] hover:to-[#7A6880] transition-all shadow-lg">
                                Entrar
                            </button>
                        </form>

                        <Link href="/" className="block text-center mt-4 text-sm text-[#927F96] hover:text-[#6E5A70] hover:underline">
                            Voltar para o site
                        </Link>
                    </div>
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
            <main className="min-h-screen bg-gradient-to-b from-[#F5F0F5] via-[#F0EBF0] to-[#E8E0E8] p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#6E5A70] transition-colors">
                                <ArrowLeft size={20} /> Voltar para a loja
                            </Link>
                            <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#927F96] to-[#A895AE] text-white rounded-full font-medium hover:from-[#7A6880] hover:to-[#927F96] transition-all shadow-md text-sm">
                                <TrendingUp size={16} />
                                Dashboard
                            </Link>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full font-medium hover:bg-red-200 transition-colors text-sm"
                        >
                            <LogOut size={16} />
                            Sair
                        </button>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#3D3D3D] mb-2">
                            {modoEdicao ? 'Editar Produto' : 'Cadastrar Nova Peça'}
                        </h1>
                        <p className="text-gray-600">
                            Logado como: <span className="font-semibold text-[#6E5A70]">{user.email}</span>
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-md border border-[#927F96]/20">
                            <h2 className="text-xl font-bold mb-6 text-[#3D3D3D] flex items-center gap-2">
                                <Upload size={24} className="text-[#927F96]" />
                                {modoEdicao ? 'Editar Peça' : 'Nova Peça'}
                            </h2>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Peça *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#927F96]"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Ex: Vaso Terracota"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#927F96]"
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        placeholder="Descreva a peça..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#927F96]"
                                            value={preco}
                                            onChange={(e) => setPreco(e.target.value)}
                                            placeholder="0,00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#927F96]"
                                            value={estoque}
                                            onChange={(e) => setEstoque(e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <ImageIcon size={16} className="inline mr-1" />
                                        Imagens da Peça * (a primeira sera a capa)
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
                                                        alt={'Imagem ' + (index + 1)}
                                                        className="w-16 h-16 object-cover rounded border border-gray-200"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-gray-600">
                                                            {index === 0 ? 'Imagem de capa' : 'Imagem ' + (index + 1)}
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
                                                            className="p-1 text-gray-500 hover:text-[#927F96] disabled:opacity-30"
                                                            title="Mover para cima"
                                                        >
                                                            <ArrowUp size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => moverImagem(index, 'down')}
                                                            disabled={index === imagens.length - 1}
                                                            className="p-1 text-gray-500 hover:text-[#927F96] disabled:opacity-30"
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
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#6E5A70] to-[#927F96] text-white py-3 rounded-full font-semibold hover:from-[#5A4A5E] hover:to-[#7A6880] transition-all shadow-lg disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Salvando...
                                            </>
                                        ) : (
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

                        <div className="bg-white p-8 rounded-2xl shadow-md border border-[#927F96]/20">
                            <h2 className="text-xl font-bold mb-6 text-[#3D3D3D] flex items-center gap-2">
                                <Package size={24} className="text-[#927F96]" />
                                Produtos Cadastrados ({produtos.length})
                            </h2>

                            {produtos.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p>Nenhum produto cadastrado ainda.</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                    {produtos.map((produto) => (
                                        <div
                                            key={produto.id}
                                            className={`border rounded-xl p-4 transition-all ${produtoEditando === produto.id
                                                ? 'border-[#927F96] bg-[#927F96]/5'
                                                : 'border-gray-200 hover:border-[#927F96]'
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
                                                    <p className="text-lg font-bold text-[#6E5A70] mt-2">
                                                        {formatarPreco(produto.preco)}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${produto.estoque === 0 ? 'bg-red-100 text-red-600' :
                                                                produto.estoque <= (produto.estoque_minimo || 2) ? 'bg-[#C9A87C]/20 text-[#8B7355]' :
                                                                    'bg-[#927F96]/20 text-[#6E5A70]'
                                                            }`}>
                                                            {produto.estoque === 0 ? 'Sem estoque' : produto.estoque + ' em estoque'}
                                                        </span>
                                                        {produto.imagens && produto.imagens.length > 1 && (
                                                            <span className="text-xs bg-[#927F96]/20 text-[#6E5A70] px-2 py-1 rounded-full">
                                                                {produto.imagens.length} fotos
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                setFormEstoque({ tipo: 'entrada', quantidade: '1', motivo: '' });
                                                                setModalEstoque({ isOpen: true, produto });
                                                            }}
                                                            className="text-xs text-[#927F96] hover:text-[#6E5A70] font-medium"
                                                        >
                                                            Gerenciar estoque
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() => handleEditar(produto)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#927F96] to-[#A895AE] text-white rounded-lg font-medium hover:from-[#7A6880] hover:to-[#927F96] transition-all text-sm"
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

            {modalEstoque.isOpen && modalEstoque.produto && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#3D3D3D]/60 backdrop-blur-sm" onClick={() => setModalEstoque({ isOpen: false, produto: null })}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full border-4 border-[#927F96] p-8">
                        <button onClick={() => setModalEstoque({ isOpen: false, produto: null })} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                        <h3 className="text-2xl font-bold text-[#3D3D3D] mb-6">Gerenciar Estoque</h3>

                        <div className="bg-gray-50 p-4 rounded-xl mb-6">
                            <p className="text-sm text-gray-600 mb-1">Produto</p>
                            <p className="font-bold text-[#3D3D3D]">{modalEstoque.produto.nome}</p>
                            <p className="text-sm text-gray-600 mt-2">Estoque atual</p>
                            <p className="text-2xl font-bold text-[#6E5A70]">{modalEstoque.produto.estoque} unidades</p>
                        </div>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const qtd = parseInt(formEstoque.quantidade);
                            if (isNaN(qtd) || qtd <= 0) {
                                setModal({ isOpen: true, title: 'Quantidade invalida', message: 'Digite uma quantidade valida.', type: 'warning' });
                                return;
                            }

                            const quantidadeFinal = formEstoque.tipo === 'saida' ? -qtd : qtd;
                            await handleAtualizarEstoque(
                                modalEstoque.produto!.id,
                                quantidadeFinal,
                                formEstoque.tipo,
                                formEstoque.motivo
                            );
                            setModalEstoque({ isOpen: false, produto: null });
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Movimentacao</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormEstoque({ ...formEstoque, tipo: 'entrada' })}
                                        className={'p-3 rounded-lg border-2 transition-all ' + (formEstoque.tipo === 'entrada'
                                            ? 'border-[#927F96] bg-[#927F96]/10 text-[#6E5A70]'
                                            : 'border-gray-200 text-gray-600'
                                        )}
                                    >
                                        <Plus size={20} className="mx-auto mb-1" />
                                        <span className="text-xs font-semibold">Entrada</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormEstoque({ ...formEstoque, tipo: 'saida' })}
                                        className={'p-3 rounded-lg border-2 transition-all ' + (formEstoque.tipo === 'saida'
                                            ? 'border-red-400 bg-red-50 text-red-600'
                                            : 'border-gray-200 text-gray-600'
                                        )}
                                    >
                                        <Minus size={20} className="mx-auto mb-1" />
                                        <span className="text-xs font-semibold">Saida</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormEstoque({ ...formEstoque, tipo: 'ajuste' })}
                                        className={'p-3 rounded-lg border-2 transition-all ' + (formEstoque.tipo === 'ajuste'
                                            ? 'border-[#A895AE] bg-[#A895AE]/10 text-[#7A6880]'
                                            : 'border-gray-200 text-gray-600'
                                        )}
                                    >
                                        <span className="text-2xl mx-auto mb-1">±</span>
                                        <span className="text-xs font-semibold">Ajuste</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={formEstoque.quantidade}
                                    onChange={(e) => setFormEstoque({ ...formEstoque, quantidade: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#927F96]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (opcional)</label>
                                <input
                                    type="text"
                                    value={formEstoque.motivo}
                                    onChange={(e) => setFormEstoque({ ...formEstoque, motivo: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#927F96]"
                                    placeholder="Ex: Nova remessa, venda, quebra..."
                                />
                            </div>

                            <button type="submit" className="w-full bg-gradient-to-r from-[#6E5A70] to-[#927F96] text-white py-3 rounded-full font-semibold hover:from-[#5A4A5E] hover:to-[#7A6880] transition-all shadow-lg">
                                Confirmar Movimentacao
                            </button>
                        </form>
                    </div>
                </div>
            )}

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