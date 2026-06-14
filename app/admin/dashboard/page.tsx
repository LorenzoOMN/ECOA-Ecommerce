'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, TrendingUp, DollarSign, Package, ShoppingCart,
    Plus, Calendar, Filter, Trash2, Edit2, CheckCircle,
    XCircle, Clock, Eye, Zap
} from 'lucide-react';
import Link from 'next/link';
import Modal from '@/app/components/Modal';

interface Venda {
    id: string;
    produto_id: string | null;
    produto_nome: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
    status: string;
    observacoes: string;
    data_venda: string;
}

interface Produto {
    id: string;
    nome: string;
    preco: number;
    imagem_url: string;
    estoque: number;
}

type Periodo = '7' | '30' | 'mes' | 'todos';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [vendas, setVendas] = useState<Venda[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [periodo, setPeriodo] = useState<Periodo>('30');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [filtroStatus, setFiltroStatus] = useState<string>('todos');

    const [modalRegistro, setModalRegistro] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalDetalhes, setModalDetalhes] = useState<Venda | null>(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    const [modal, setModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'error' | 'warning' | 'confirm';
        onConfirm?: () => void;
    }>({ isOpen: false, title: '', message: '', type: 'success' });

    // Formulário de venda
    const [formVenda, setFormVenda] = useState({
        produto_id: '',
        produto_nome: '',
        quantidade: '1',
        valor_unitario: '',
        status: 'concluida',
        observacoes: '',
        data_venda: new Date().toISOString().split('T')[0],
    });
    const [vendaEditando, setVendaEditando] = useState<string | null>(null);

    // Verificar autenticação
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                router.push('/admin');
                return;
            }
            setUser(session.user);
            await Promise.all([carregarVendas(), carregarProdutos()]);
            setLoading(false);
        };
        checkUser();
    }, []);

    const carregarVendas = async () => {
        try {
            let query = supabase.from('vendas').select('*').order('data_venda', { ascending: false });

            if (periodo !== 'todos') {
                const dias = periodo === 'mes' ? 30 : parseInt(periodo);
                const dataLimite = new Date();
                dataLimite.setDate(dataLimite.getDate() - dias);
                query = query.gte('data_venda', dataLimite.toISOString());
            }

            if (dataInicio) query = query.gte('data_venda', dataInicio);
            if (dataFim) query = query.lte('data_venda', dataFim + 'T23:59:59');

            const { data, error } = await query;
            if (error) throw error;
            setVendas(data || []);
        } catch (error) {
            console.error('Erro ao carregar vendas:', error);
        }
    };

    const carregarProdutos = async () => {
        try {
            const { data, error } = await supabase
                .from('produtos')
                .select('id, nome, preco, imagem_url, estoque')
                .order('nome');
            if (error) throw error;
            setProdutos(data?.map(p => ({
                ...p,
                estoque: p.estoque || 0
            })) || []);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
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

        } catch (error) {
            console.error('Erro ao atualizar estoque:', error);
            throw error;
        }
    };

    // Calcular métricas
    const vendasFiltradas = filtroStatus === 'todos'
        ? vendas
        : vendas.filter(v => v.status === filtroStatus);

    const totalVendas = vendasFiltradas.length;
    const receitaTotal = vendasFiltradas.reduce((acc, v) => acc + Number(v.valor_total), 0);
    const ticketMedio = totalVendas > 0 ? receitaTotal / totalVendas : 0;
    const pecasVendidas = vendasFiltradas.reduce((acc, v) => acc + v.quantidade, 0);

    // Vendas por dia
    const vendasPorDia = (() => {
        const dias = periodo === '7' ? 7 : periodo === '30' || periodo === 'mes' ? 30 : 7;
        const mapa: { dia: string; valor: number; quantidade: number }[] = [];

        for (let i = dias - 1; i >= 0; i--) {
            const data = new Date();
            data.setDate(data.getDate() - i);
            const dataStr = data.toISOString().split('T')[0];
            const vendasDoDia = vendasFiltradas.filter(v =>
                v.data_venda.split('T')[0] === dataStr
            );
            mapa.push({
                dia: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                valor: vendasDoDia.reduce((acc, v) => acc + Number(v.valor_total), 0),
                quantidade: vendasDoDia.reduce((acc, v) => acc + v.quantidade, 0),
            });
        }
        return mapa;
    })();

    const maxValorDia = Math.max(...vendasPorDia.map(d => d.valor), 1);

    // Produtos mais vendidos
    const produtosMaisVendidos = (() => {
        const mapa: Record<string, { nome: string; qtd: number; valor: number }> = {};
        vendasFiltradas.forEach(v => {
            if (!mapa[v.produto_nome]) {
                mapa[v.produto_nome] = { nome: v.produto_nome, qtd: 0, valor: 0 };
            }
            mapa[v.produto_nome].qtd += v.quantidade;
            mapa[v.produto_nome].valor += Number(v.valor_total);
        });
        return Object.values(mapa).sort((a, b) => b.qtd - a.qtd).slice(0, 5);
    })();

    // ABRIR MODAL DE VENDA RÁPIDA
    const abrirVendaRapida = (produto: Produto) => {
        setProdutoSelecionado(produto);
        setFormVenda({
            produto_id: produto.id,
            produto_nome: produto.nome,
            quantidade: '1',
            valor_unitario: produto.preco.toString(),
            status: 'concluida',
            observacoes: '',
            data_venda: new Date().toISOString().split('T')[0],
        });
        setModalRegistro(true);
    };

    const handleRegistrarVenda = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formVenda.produto_nome || !formVenda.valor_unitario) {
            setModal({ isOpen: true, title: 'Campos obrigatórios', message: 'Preencha o produto e o valor.', type: 'warning' });
            return;
        }

        const quantidade = parseInt(formVenda.quantidade) || 1;
        const valorUnitario = parseFloat(formVenda.valor_unitario.replace(',', '.'));
        const valorTotal = valorUnitario * quantidade;

        try {
            // Verificar estoque se tem produto_id
            if (formVenda.produto_id) {
                const { data: produto } = await supabase
                    .from('produtos')
                    .select('estoque')
                    .eq('id', formVenda.produto_id)
                    .single();

                if (produto && produto.estoque < quantidade) {
                    setModal({
                        isOpen: true,
                        title: 'Estoque insuficiente',
                        message: `Apenas ${produto.estoque} unidade(s) disponível(is).`,
                        type: 'error',
                    });
                    return;
                }
            }

            // Inserir venda
            const { error } = await supabase.from('vendas').insert({
                produto_id: formVenda.produto_id || null,
                produto_nome: formVenda.produto_nome,
                quantidade,
                valor_unitario: valorUnitario,
                valor_total: valorTotal,
                status: formVenda.status,
                observacoes: formVenda.observacoes,
                data_venda: formVenda.data_venda,
            });

            if (error) throw error;

            // Descontar do estoque se tem produto_id
            if (formVenda.produto_id && formVenda.status === 'concluida') {
                await handleAtualizarEstoque(
                    formVenda.produto_id,
                    -quantidade,
                    'saida',
                    `Venda registrada - ${formVenda.produto_nome}`
                );
            }

            setModal({ isOpen: true, title: 'Venda registrada!', message: `${formVenda.produto_nome} vendido com sucesso!`, type: 'success' });
            setModalRegistro(false);
            resetarFormVenda();
            setProdutoSelecionado(null);
            await Promise.all([carregarVendas(), carregarProdutos()]);
        } catch (error: any) {
            setModal({ isOpen: true, title: 'Erro', message: error.message, type: 'error' });
        }
    };

    const handleEditarVenda = (venda: Venda) => {
        setVendaEditando(venda.id);
        setFormVenda({
            produto_id: venda.produto_id || '',
            produto_nome: venda.produto_nome,
            quantidade: venda.quantidade.toString(),
            valor_unitario: venda.valor_unitario.toString(),
            status: venda.status,
            observacoes: venda.observacoes || '',
            data_venda: venda.data_venda.split('T')[0],
        });
        setModalEditar(true);
    };

    const handleAtualizarVenda = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendaEditando) return;

        const quantidade = parseInt(formVenda.quantidade) || 1;
        const valorUnitario = parseFloat(formVenda.valor_unitario.replace(',', '.'));
        const valorTotal = valorUnitario * quantidade;

        try {
            const { error } = await supabase
                .from('vendas')
                .update({
                    produto_id: formVenda.produto_id || null,
                    produto_nome: formVenda.produto_nome,
                    quantidade,
                    valor_unitario: valorUnitario,
                    valor_total: valorTotal,
                    status: formVenda.status,
                    observacoes: formVenda.observacoes,
                    data_venda: formVenda.data_venda,
                })
                .eq('id', vendaEditando);

            if (error) throw error;

            setModal({ isOpen: true, title: 'Venda atualizada!', message: 'As alterações foram salvas.', type: 'success' });
            setModalEditar(false);
            resetarFormVenda();
            await carregarVendas();
        } catch (error: any) {
            setModal({ isOpen: true, title: 'Erro', message: error.message, type: 'error' });
        }
    };

    const handleExcluirVenda = (id: string) => {
        setModal({
            isOpen: true,
            title: 'Excluir venda?',
            message: 'Esta ação não pode ser desfeita.',
            type: 'confirm',
            onConfirm: async () => {
                try {
                    const { error } = await supabase.from('vendas').delete().eq('id', id);
                    if (error) throw error;
                    setModal({ isOpen: true, title: 'Venda excluída!', message: 'A venda foi removida.', type: 'success' });
                    await carregarVendas();
                } catch (error: any) {
                    setModal({ isOpen: true, title: 'Erro', message: error.message, type: 'error' });
                }
            },
        });
    };

    const resetarFormVenda = () => {
        setFormVenda({
            produto_id: '',
            produto_nome: '',
            quantidade: '1',
            valor_unitario: '',
            status: 'concluida',
            observacoes: '',
            data_venda: new Date().toISOString().split('T')[0],
        });
        setVendaEditando(null);
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'concluida': return <CheckCircle size={16} className="text-[#8FA895]" />;
            case 'pendente': return <Clock size={16} className="text-[#C9A87C]" />;
            case 'cancelada': return <XCircle size={16} className="text-red-500" />;
            default: return null;
        }
    };

    const getStatusCor = (status: string) => {
        switch (status) {
            case 'concluida': return 'bg-[#8FA895]/20 text-[#7A8B6F]';
            case 'pendente': return 'bg-[#C9A87C]/20 text-[#8B7355]';
            case 'cancelada': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#A895B5]"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FAF7F2] p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-gray-600 hover:text-[#7A8B6F] transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-[#3D3D3D]">Dashboard</h1>
                            <p className="text-gray-600 text-sm">Acompanhe suas vendas e desempenho</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { resetarFormVenda(); setProdutoSelecionado(null); setModalRegistro(true); }}
                        className="btn-lilas flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Registrar Venda
                    </button>
                </div>

                {/* Cards de Métricas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-[#8FA895]/30">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-[#8FA895]/20 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-[#7A8B6F]" />
                            </div>
                            <span className="text-xs text-gray-500">Receita total</span>
                        </div>
                        <p className="text-3xl font-bold text-[#3D3D3D]">{formatarMoeda(receitaTotal)}</p>
                        <p className="text-xs text-gray-500 mt-1">{totalVendas} vendas no período</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md border border-[#A895B5]/30">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-[#A895B5]/20 rounded-xl flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-[#A895B5]" />
                            </div>
                            <span className="text-xs text-gray-500">Total de vendas</span>
                        </div>
                        <p className="text-3xl font-bold text-[#3D3D3D]">{totalVendas}</p>
                        <p className="text-xs text-gray-500 mt-1">{pecasVendidas} peças vendidas</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md border border-[#C9A87C]/30">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-[#C9A87C]/20 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-[#8B7355]" />
                            </div>
                            <span className="text-xs text-gray-500">Ticket médio</span>
                        </div>
                        <p className="text-3xl font-bold text-[#3D3D3D]">{formatarMoeda(ticketMedio)}</p>
                        <p className="text-xs text-gray-500 mt-1">Por venda</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md border border-[#7A8B6F]/30">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-[#7A8B6F]/20 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-[#7A8B6F]" />
                            </div>
                            <span className="text-xs text-gray-500">Peças vendidas</span>
                        </div>
                        <p className="text-3xl font-bold text-[#3D3D3D]">{pecasVendidas}</p>
                        <p className="text-xs text-gray-500 mt-1">Unidades no período</p>
                    </div>
                </div>

                {/* Gráfico + Top Produtos */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Gráfico de Vendas */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-[#A895B5]/20">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[#3D3D3D] flex items-center gap-2">
                                <TrendingUp size={22} className="text-[#7A8B6F]" />
                                Vendas por Dia
                            </h2>
                            <select
                                value={periodo}
                                onChange={(e) => setPeriodo(e.target.value as Periodo)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#A895B5]"
                            >
                                <option value="7">Últimos 7 dias</option>
                                <option value="30">Últimos 30 dias</option>
                                <option value="mes">Este mês</option>
                                <option value="todos">Todo o período</option>
                            </select>
                        </div>

                        {vendasPorDia.every(d => d.valor === 0) ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                <TrendingUp className="w-16 h-16 mb-4 text-gray-300" />
                                <p className="text-lg font-medium">Nenhuma venda no período selecionado</p>
                                <p className="text-sm mt-2 text-gray-400">Registre sua primeira venda para ver o gráfico</p>
                            </div>
                        ) : (
                            <div className="flex items-end justify-between gap-1 h-64 px-2">
                                {vendasPorDia.map((dia, idx) => {
                                    const mostrarLabel = periodo === '7'
                                        ? true
                                        : periodo === '30' || periodo === 'mes'
                                            ? idx % 3 === 0
                                            : idx % 5 === 0;

                                    const altura = dia.valor > 0 ? (dia.valor / maxValorDia) * 100 : 0;

                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                            <div className="relative w-full flex flex-col justify-end h-48">
                                                {dia.valor > 0 ? (
                                                    <div
                                                        className="w-full bg-gradient-to-t from-[#7A8B6F] to-[#A895B5] rounded-t-lg transition-all group-hover:from-[#A895B5] group-hover:to-[#7A8B6F] relative cursor-pointer"
                                                        style={{ height: `${altura}%` }}
                                                    >
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#3D3D3D] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                            {formatarMoeda(dia.valor)} · {dia.quantidade} peças
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-0"></div>
                                                )}
                                            </div>
                                            {mostrarLabel && (
                                                <span className="text-xs text-gray-500">{dia.dia}</span>
                                            )}
                                            {!mostrarLabel && (
                                                <span className="text-xs text-transparent">.</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Top Produtos */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-[#A895B5]/20">
                        <h2 className="text-xl font-bold text-[#3D3D3D] flex items-center gap-2 mb-6">
                            <Package size={22} className="text-[#A895B5]" />
                            Mais Vendidos
                        </h2>

                        {produtosMaisVendidos.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>Nenhum dado ainda</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {produtosMaisVendidos.map((prod, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-[#C9A87C] text-white' :
                                            idx === 1 ? 'bg-[#A895B5] text-white' :
                                                idx === 2 ? 'bg-[#8FA895] text-white' :
                                                    'bg-gray-200 text-gray-600'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-[#3D3D3D] truncate">{prod.nome}</p>
                                            <p className="text-xs text-gray-500">{prod.qtd} peças · {formatarMoeda(prod.valor)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* PRODUTOS - Venda Rápida */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-[#A895B5]/20 mb-8">
                    <h2 className="text-xl font-bold text-[#3D3D3D] flex items-center gap-2 mb-6">
                        <Zap size={22} className="text-[#C9A87C]" />
                        Venda Rápida - Clique para Registrar
                    </h2>

                    {produtos.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>Nenhum produto cadastrado</p>
                            <Link href="/admin" className="text-[#A895B5] hover:underline text-sm mt-2 inline-block">
                                Cadastrar produtos
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {produtos.map((produto) => (
                                <div
                                    key={produto.id}
                                    className="border border-gray-200 rounded-xl p-4 hover:border-[#A895B5] hover:shadow-md transition-all group"
                                >
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                                        <img
                                            src={produto.imagem_url}
                                            alt={produto.nome}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-[#3D3D3D] text-sm mb-1 truncate">{produto.nome}</h3>
                                    <p className="text-[#7A8B6F] font-bold mb-3">{formatarMoeda(produto.preco)}</p>
                                    <button
                                        onClick={() => abrirVendaRapida(produto)}
                                        className="w-full bg-[#8FA895] hover:bg-[#7A8B6F] text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Zap size={16} />
                                        Vender
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Filtros e Lista de Vendas */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-[#A895B5]/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-[#3D3D3D] flex items-center gap-2">
                            <Calendar size={22} className="text-[#7A8B6F]" />
                            Histórico de Vendas
                        </h2>

                        <div className="flex flex-wrap gap-3">
                            <input
                                type="date"
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#A895B5]"
                            />
                            <input
                                type="date"
                                value={dataFim}
                                onChange={(e) => setDataFim(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#A895B5]"
                            />
                            <select
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#A895B5]"
                            >
                                <option value="todos">Todos os status</option>
                                <option value="concluida">Concluídas</option>
                                <option value="pendente">Pendentes</option>
                                <option value="cancelada">Canceladas</option>
                            </select>
                            <button
                                onClick={() => { setDataInicio(''); setDataFim(''); setFiltroStatus('todos'); setPeriodo('30'); }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                            >
                                Limpar
                            </button>
                        </div>
                    </div>

                    {vendasFiltradas.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg">Nenhuma venda encontrada</p>
                            <p className="text-sm mt-2">Clique em "Vender" em um produto para registrar</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 text-sm text-gray-600">
                                        <th className="text-left py-3 px-2">Data</th>
                                        <th className="text-left py-3 px-2">Produto</th>
                                        <th className="text-center py-3 px-2">Qtd</th>
                                        <th className="text-right py-3 px-2">Valor</th>
                                        <th className="text-center py-3 px-2">Status</th>
                                        <th className="text-right py-3 px-2">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendasFiltradas.map((venda) => (
                                        <tr key={venda.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-2 text-sm text-gray-600">{formatarData(venda.data_venda)}</td>
                                            <td className="py-3 px-2">
                                                <p className="font-semibold text-[#3D3D3D]">{venda.produto_nome}</p>
                                                {venda.observacoes && (
                                                    <p className="text-xs text-gray-500 truncate max-w-xs">{venda.observacoes}</p>
                                                )}
                                            </td>
                                            <td className="py-3 px-2 text-center text-sm">{venda.quantidade}</td>
                                            <td className="py-3 px-2 text-right font-semibold text-[#7A8B6F]">{formatarMoeda(Number(venda.valor_total))}</td>
                                            <td className="py-3 px-2 text-center">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusCor(venda.status)}`}>
                                                    {getStatusIcon(venda.status)}
                                                    {venda.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => setModalDetalhes(venda)}
                                                        className="p-2 text-gray-500 hover:text-[#A895B5] hover:bg-[#A895B5]/10 rounded-lg transition-colors"
                                                        title="Ver detalhes"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditarVenda(venda)}
                                                        className="p-2 text-gray-500 hover:text-[#8FA895] hover:bg-[#8FA895]/10 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleExcluirVenda(venda.id)}
                                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: Registro de Venda */}
            {modalRegistro && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#3D3D3D]/60 backdrop-blur-sm" onClick={() => setModalRegistro(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full border-4 border-[#A895B5] p-8 max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setModalRegistro(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <XCircle size={24} />
                        </button>
                        <h3 className="text-2xl font-bold text-[#3D3D3D] mb-6 flex items-center gap-2">
                            <Zap className="text-[#A895B5]" />
                            Registrar Venda
                        </h3>
                        <form onSubmit={handleRegistrarVenda} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Produto *</label>
                                <select
                                    value={formVenda.produto_id}
                                    onChange={(e) => {
                                        const produto = produtos.find(p => p.id === e.target.value);
                                        if (produto) {
                                            setFormVenda({
                                                ...formVenda,
                                                produto_id: produto.id,
                                                produto_nome: produto.nome,
                                                valor_unitario: produto.preco.toString(),
                                            });
                                        } else {
                                            setFormVenda({ ...formVenda, produto_id: '', produto_nome: '', valor_unitario: '' });
                                        }
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A895B5]"
                                    required
                                >
                                    <option value="">Selecione um produto</option>
                                    {produtos
                                        .filter(p => p.estoque > 0)
                                        .map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.nome} - {formatarMoeda(p.preco)} ({p.estoque} em estoque)
                                            </option>
                                        ))
                                    }
                                </select>

                                {/* Aviso de produtos sem estoque */}
                                {produtos.filter(p => p.estoque === 0).length > 0 && (
                                    <p className="text-xs text-red-500 mt-1">
                                        ⚠️ {produtos.filter(p => p.estoque === 0).length} produto(s) sem estoque - bloqueados para venda
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formVenda.quantidade}
                                        onChange={(e) => setFormVenda({ ...formVenda, quantidade: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A895B5]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Unitário (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formVenda.valor_unitario}
                                        onChange={(e) => setFormVenda({ ...formVenda, valor_unitario: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A895B5]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data da Venda</label>
                                <input
                                    type="date"
                                    value={formVenda.data_venda}
                                    onChange={(e) => setFormVenda({ ...formVenda, data_venda: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A895B5]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formVenda.status}
                                    onChange={(e) => setFormVenda({ ...formVenda, status: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A895B5]"
                                >
                                    <option value="concluida">Concluída ✓</option>
                                    <option value="pendente">Pendente ⏳</option>
                                    <option value="cancelada">Cancelada ✕</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                                <textarea
                                    rows={2}
                                    value={formVenda.observacoes}
                                    onChange={(e) => setFormVenda({ ...formVenda, observacoes: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A895B5]"
                                    placeholder="Ex: Cliente pagou via Pix, entrega combinada..."
                                />
                            </div>

                            <button type="submit" className="w-full btn-lilas">
                                Confirmar Venda
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Editar Venda */}
            {modalEditar && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#3D3D3D]/60 backdrop-blur-sm" onClick={() => setModalEditar(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full border-4 border-[#8FA895] p-8">
                        <button onClick={() => setModalEditar(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <XCircle size={24} />
                        </button>
                        <h3 className="text-2xl font-bold text-[#3D3D3D] mb-6 flex items-center gap-2">
                            <Edit2 className="text-[#8FA895]" />
                            Editar Venda
                        </h3>
                        <form onSubmit={handleAtualizarVenda} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                                <input
                                    type="text"
                                    required
                                    value={formVenda.produto_nome}
                                    onChange={(e) => setFormVenda({ ...formVenda, produto_nome: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formVenda.quantidade}
                                        onChange={(e) => setFormVenda({ ...formVenda, quantidade: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Unitário</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formVenda.valor_unitario}
                                        onChange={(e) => setFormVenda({ ...formVenda, valor_unitario: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                                <input
                                    type="date"
                                    value={formVenda.data_venda}
                                    onChange={(e) => setFormVenda({ ...formVenda, data_venda: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formVenda.status}
                                    onChange={(e) => setFormVenda({ ...formVenda, status: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                >
                                    <option value="concluida">Concluída</option>
                                    <option value="pendente">Pendente</option>
                                    <option value="cancelada">Cancelada</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                                <textarea
                                    rows={2}
                                    value={formVenda.observacoes}
                                    onChange={(e) => setFormVenda({ ...formVenda, observacoes: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                />
                            </div>
                            <button type="submit" className="w-full bg-[#8FA895] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#7A8B6F] transition-colors">
                                Salvar Alterações
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Detalhes da Venda */}
            {modalDetalhes && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#3D3D3D]/60 backdrop-blur-sm" onClick={() => setModalDetalhes(null)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full border-4 border-[#A895B5] p-8">
                        <button onClick={() => setModalDetalhes(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <XCircle size={24} />
                        </button>
                        <h3 className="text-2xl font-bold text-[#3D3D3D] mb-6">Detalhes da Venda</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Produto</span>
                                <span className="font-semibold">{modalDetalhes.produto_nome}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Data</span>
                                <span className="font-semibold">{formatarData(modalDetalhes.data_venda)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Quantidade</span>
                                <span className="font-semibold">{modalDetalhes.quantidade}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Valor unitário</span>
                                <span className="font-semibold">{formatarMoeda(Number(modalDetalhes.valor_unitario))}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Valor total</span>
                                <span className="font-bold text-[#7A8B6F] text-lg">{formatarMoeda(Number(modalDetalhes.valor_total))}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Status</span>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusCor(modalDetalhes.status)}`}>
                                    {getStatusIcon(modalDetalhes.status)}
                                    {modalDetalhes.status}
                                </span>
                            </div>
                            {modalDetalhes.observacoes && (
                                <div className="py-2">
                                    <span className="text-gray-600 block mb-1">Observações</span>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{modalDetalhes.observacoes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal genérico de feedback */}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onConfirm={modal.onConfirm}
            />
        </main>
    );
}