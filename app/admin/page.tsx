'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Upload, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Admin() {
    const [autenticado, setAutenticado] = useState(false);
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [imagem, setImagem] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (senha === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            setAutenticado(true);
        } else {
            alert('Senha incorreta!');
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imagem || !nome || !preco) {
            alert('Preencha nome, preço e selecione uma imagem.');
            return;
        }

        setLoading(true);
        try {
            const fileExt = imagem.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('imagens-produtos')
                .upload(fileName, imagem);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('imagens-produtos')
                .getPublicUrl(fileName);

            const { error: dbError } = await supabase
                .from('produtos')
                .insert({
                    nome,
                    descricao,
                    preco: parseFloat(preco.replace(',', '.')),
                    imagem_url: publicUrl,
                });

            if (dbError) throw dbError;

            alert('Produto cadastrado com sucesso! 🌿');
            setNome('');
            setDescricao('');
            setPreco('');
            setImagem(null);
            router.refresh();

        } catch (error: any) {
            console.error(error);
            alert('Erro ao cadastrar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!autenticado) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#C9A87C]">
                    <h2 className="text-2xl font-bold text-center mb-6 text-[#3D3D3D]">Acesso ECOA</h2>
                    <input
                        type="password"
                        placeholder="Digite a senha"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#8FA895]"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <button type="submit" className="w-full btn-ecoa">Entrar</button>
                    <Link href="/" className="block text-center mt-4 text-sm text-gray-500 hover:underline">
                        Voltar para o site
                    </Link>
                </form>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F5F0EB] p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#3D3D3D] mb-8">
                    <ArrowLeft size={20} /> Voltar para a loja
                </Link>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#A89F91]/30">
                    <h2 className="text-2xl font-bold mb-6 text-[#3D3D3D] flex items-center gap-2">
                        <Upload size={24} className="text-[#8FA895]" />
                        Cadastrar Nova Peça
                    </h2>

                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Peça</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                            <textarea
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA895]"
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Foto da Peça</label>
                            <input
                                type="file"
                                accept="image/*"
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                                onChange={(e) => setImagem(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-ecoa mt-4 disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : <><Save size={18} /> Salvar Peça</>}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}