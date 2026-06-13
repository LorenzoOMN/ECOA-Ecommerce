'use client';
import { useState, useRef } from 'react';
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

    // Senha simples para proteger a página (Mude "ecoa123" para o que quiser)
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (senha === 'ecoa123') {
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
            // 1. Upload da Imagem
            const fileExt = imagem.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('imagens-produtos')
                .upload(fileName, imagem);

            if (uploadError) throw uploadError;

            // 2. Pegar URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('imagens-produtos')
                .getPublicUrl(fileName);

            // 3. Salvar no Banco de Dados
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
            router.refresh(); // Atualiza a página principal

        } catch (error: any) {
            console.error(error);
            alert('Erro ao cadastrar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!autenticado) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#E8D5C4]">
                    <h2 className="text-2xl font-bold text-center mb-6 text-[#4A4A48]">Acesso ECOA</h2>
                    <input
                        type="password"
                        placeholder="Digite a senha"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-[#B8C5D6]"
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
        <main className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#4A4A48] mb-8">
                    <ArrowLeft size={20} /> Voltar para a loja
                </Link>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E8D5C4]/30">
                    <h2 className="text-2xl font-bold mb-6 text-[#4A4A48] flex items-center gap-2">
                        <Upload size={24} className="text-[#D4E2D4]" />
                        Cadastrar Nova Peça
                    </h2>

                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Peça</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B8C5D6]"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                            <textarea
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B8C5D6]"
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
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B8C5D6]"
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