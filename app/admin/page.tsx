'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Upload, Save, ArrowLeft, Edit2, Trash2, X, Package, LogOut, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Modal from '../components/Modal';
import { TrendingUp } from 'lucide-react';

interface Produto {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    imagem_url: string;
    estoque: number;
    estoque_minimo: number;
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
    const [imagem, setImagem] = useState<File | null>(null);
    const [imagemAtual, setImagemAtual] = useState<string>('');

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
            const { data, error } = await supabase
                .from('produtos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProdutos(data || []);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    };

    const resetarFormulario = () => {
        setNome('');
        setDescricao('');
        setPreco('');
        setEstoque('0');
        setImagem(null);
        setImagemAtual('');
        setModoEdicao(false);
        setProdutoEditando(null);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !preco) {
            setModal({
                isOpen: true,
                title: 'Campos obrigatórios',
                message: 'Por favor, preencha o nome e o preço.',
                type: 'warning',
            });
            return;
        }

        setLoading(true);
        try {
            let imagem_url = imagemAtual;

            if (imagem) {
                const fileExt = imagem.name.split('.').pop();
                const fileName = Date.now() + '.' + fileExt;

                const { error: uploadError } = await supabase.storage
                    .from('imagens-produtos')
                    .upload(fileName, imagem);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('imagens-produtos')
                    .getPublicUrl(fileName);

                imagem_url = publicUrl;
            }

            if (modoEdicao && produtoEditando) {
                const { error: dbError } = await supabase
                    .from('produtos')
                    .update({ 
                        nome, 
                        descricao, 
                        preco: parseFloat(preco.replace(',', '.')), 
                        estoque: parseInt(estoque) || 0,
                        imagem_url 
                    })
                    .eq('id', produtoEditando);

                if (dbError) throw dbError;

                setModal({
                    isOpen: true,
                    title: 'Produto atualizado!',
                    message: 'A peça "' + nome + '" foi atualizada.',
                    type: 'success',
                });
            } else {
                const { error: dbError } = await supabase
                    .from('produtos')
                    .insert({ 
                        nome, 
                        descricao, 
                        preco: parseFloat(preco.replace(',', '.')), 
                        estoque: parseInt(estoque) || 0,
                        imagem_url 
                    });

                if (dbError) throw dbError;

                setModal({
                    isOpen: true,
                    title: 'Produto cadastrado!',
                    message: 'A peça "' + nome + '" foi adicionada.',
                    type: 'success',
                });
            }

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
        setImagemAtual(produto.imagem_url);
        setImagem(null);
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
                    const { error } = await supabase
                        .from('produtos')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;

                    setModal({
                        isOpen: true,
                        title: 'Produto excluído!',
                        message: 'A peça "' + nome + '" foi removida.',
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
                message: `Estoque atualizado com sucesso. Novo total: ${novoEstoque} unidades.`,
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
            <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
                <p className="text-gray-500">Carregando...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#A895B5]">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#A895B5] to-[#7A8B6F] rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#3D3D3D]">Área Restrita</h2>
                            <p className="text-sm text-gray-500 mt-2">Faça login para acessar o painel administrativo</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A895B5]"
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A895B5]"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>

                            {loginError && (
                                <p className="text-red-500 text-sm text-center">{loginError}</p>
                            )}

                            <button type="submit" className="w-full btn-lilas">
                                Entrar
                            </button>
                        </form>

                        <Link href="/" className="block text-center mt-4 text-sm text-gray-500 hover:underline">
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
            <main className="min-h-screen bg-[#FAF7F2] p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#7A8B6F]">
                                <ArrowLeft size={20} /> Voltar para a loja
                            </Link>
                            <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 bg-[#A895B5] text-white rounded-lg font-medium hover:bg-[#9B8AA8] transition-colors text-sm">
                                <TrendingUp size={16} />
                                Dashboard
                            </Link>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm"
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
                            Logado como: <span className="font-semibold text-[#7A8B6F]">{user.email}</span>
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* FORMULÁRIO */}
                        <div className="bg-white p-8 rounded-2xl shadow-md border border-[#A895B5]/30">
                            <h2 className="text-xl font-bold mb-6 text-[#3D3D3D] flex items-center gap-2">
                                <Upload size={24} className="text-[#8FA895]" />
                                {modoEdicao ? 'Editar Peça' : 'Nova Peça'}
                            </h2>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Peça *</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
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
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                            value={preco}
                                            onChange={(e) => setPreco(e.target.value)}
                                            placeholder="0,00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Inicial</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                            value={estoque}
                                            onChange={(e) => setEstoque(e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {modoEdicao ? 'Nova Foto (opcional)' : 'Foto da Peça *'}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                                        onChange={(e) => setImagem(e.target.files ? e.target.files[0] : null)}
                                    />
                                    {imagemAtual && !imagem && (
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-500 mb-1">Imagem atual:</p>
                                            <img src={imagemAtual} alt="Atual" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="submit" disabled={loading} className="flex-1 btn-lilas disabled:opacity-50">
                                        {loading ? 'Salvando...' : (
                                            <>
                                                <Save size={18} />
                                                {modoEdicao ? 'Atualizar Peça' : 'Salvar Peça'}
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
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
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
                                                        {produto.descricao || 'Sem descrição'}
                                                    </p>
                                                    <p className="text-lg font-bold text-[#7A8B6F] mt-2">
                                                        {formatarPreco(produto.preco)}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                            produto.estoque === 0 ? 'bg-red-100 text-red-600' :
                                                            produto.estoque <= (produto.estoque_minimo || 2) ? 'bg-[#C9A87C]/20 text-[#8B7355]' :
                                                            'bg-[#8FA895]/20 text-[#7A8B6F]'
                                                        }`}>
                                                            {produto.estoque === 0 ? 'Sem estoque' : `${produto.estoque} em estoque`}
                                                        </span>
                                                        <button
                                                            onClick={() => {
                                                                setFormEstoque({ tipo: 'entrada', quantidade: '1', motivo: '' });
                                                                setModalEstoque({ isOpen: true, produto });
                                                            }}
                                                            className="text-xs text-[#A895B5] hover:text-[#9B8AA8] font-medium"
                                                        >
                                                            Gerenciar
                                                        </button>
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

            {modalEstoque.isOpen && modalEstoque.produto && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#3D3D3D]/60 backdrop-blur-sm" onClick={() => setModalEstoque({ isOpen: false, produto: null })}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full border-4 border-[#A895B5] p-8">
                        <button onClick={() => setModalEstoque({ isOpen: false, produto: null })} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                        <h3 className="text-2xl font-bold text-[#3D3D3D] mb-6">Gerenciar Estoque</h3>

                        <div className="bg-gray-50 p-4 rounded-xl mb-6">
                            <p className="text-sm text-gray-600 mb-1">Produto</p>
                            <p className="font-bold text-[#3D3D3D]">{modalEstoque.produto.nome}</p>
                            <p className="text-sm text-gray-600 mt-2">Estoque atual</p>
                            <p className="text-2xl font-bold text-[#7A8B6F]">{modalEstoque.produto.estoque} unidades</p>
                        </div>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const qtd = parseInt(formEstoque.quantidade);
                            if (isNaN(qtd) || qtd <= 0) {
                                setModal({ isOpen: true, title: 'Quantidade inválida', message: 'Digite uma quantidade válida.', type: 'warning' });
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Movimentação</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormEstoque({ ...formEstoque, tipo: 'entrada' })}
                                        className={`p-3 rounded-lg border-2 transition-all ${formEstoque.tipo === 'entrada'
                                                ? 'border-[#8FA895] bg-[#8FA895]/10 text-[#7A8B6F]'
                                                : 'border-gray-200 text-gray-600'
                                            }`}
                                    >
                                        <Plus size={20} className="mx-auto mb-1" />
                                        <span className="text-xs font-semibold">Entrada</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormEstoque({ ...formEstoque, tipo: 'saida' })}
                                        className={`p-3 rounded-lg border-2 transition-all ${formEstoque.tipo === 'saida'
                                                ? 'border-red-400 bg-red-50 text-red-600'
                                                : 'border-gray-200 text-gray-600'
                                            }`}
                                    >
                                        <Minus size={20} className="mx-auto mb-1" />
                                        <span className="text-xs font-semibold">Saída</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormEstoque({ ...formEstoque, tipo: 'ajuste' })}
                                        className={`p-3 rounded-lg border-2 transition-all ${formEstoque.tipo === 'ajuste'
                                                ? 'border-[#C9A87C] bg-[#C9A87C]/10 text-[#8B7355]'
                                                : 'border-gray-200 text-gray-600'
                                            }`}
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A895B5]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (opcional)</label>
                                <input
                                    type="text"
                                    value={formEstoque.motivo}
                                    onChange={(e) => setFormEstoque({ ...formEstoque, motivo: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A895B5]"
                                    placeholder="Ex: Nova remessa, venda, quebra..."
                                />
                            </div>

                            <button type="submit" className="w-full btn-lilas">
                                Confirmar Movimentação
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