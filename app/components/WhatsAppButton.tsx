'use client';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const mensagem = 'Ola! Vim pelo site da ECOA e gostaria de saber mais sobre as pecas.';
    const link = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensagem);

    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BD5A] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 hover:shadow-[#25D366]/50 group flex items-center gap-3"
            aria-label="Falar no WhatsApp"
        >
            <MessageCircle size={28} className="fill-white" />
            
            {/* Tooltip que aparece no hover */}
            <span className="absolute right-full mr-3 bg-[#3D3D3D] text-white text-sm font-medium px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                Fale conosco!
            </span>

            {/* Animação de pulse */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"></span>
        </a>
    );
}