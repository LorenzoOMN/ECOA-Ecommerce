'use client';
import { X, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'confirm';
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    message,
    type,
    onConfirm,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
}: ModalProps) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-12 h-12 text-[#8FA895]" />;
            case 'error':
                return <AlertCircle className="w-12 h-12 text-red-500" />;
            case 'warning':
            case 'confirm':
                return <HelpCircle className="w-12 h-12 text-[#A895B5]" />;
            default:
                return <HelpCircle className="w-12 h-12 text-[#A895B5]" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return 'border-[#8FA895]';
            case 'error':
                return 'border-red-500';
            case 'warning':
            case 'confirm':
                return 'border-[#A895B5]';
            default:
                return 'border-gray-300';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Overlay com blur */}
            <div
                className="absolute inset-0 bg-[#3D3D3D]/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full border-4 ${getBorderColor()} transform transition-all duration-300 scale-100`}>
                {/* Botão fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Conteúdo */}
                <div className="p-8 text-center">
                    {/* Ícone */}
                    <div className="flex justify-center mb-4">
                        {getIcon()}
                    </div>

                    {/* Título */}
                    <h3 className="text-2xl font-bold text-[#3D3D3D] mb-3">
                        {title}
                    </h3>

                    {/* Mensagem */}
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {message}
                    </p>

                    {/* Botões */}
                    <div className="flex gap-3">
                        {type === 'confirm' && onConfirm ? (
                            <>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="flex-1 bg-[#A895B5] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#9B8AA8] transition-all shadow-lg hover:shadow-xl"
                                >
                                    {confirmText}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all"
                                >
                                    {cancelText}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className={`w-full px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl ${type === 'error'
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : type === 'success'
                                            ? 'bg-[#8FA895] text-white hover:bg-[#7A8B6F]'
                                            : 'bg-[#A895B5] text-white hover:bg-[#9B8AA8]'
                                    }`}
                            >
                                Entendido
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}