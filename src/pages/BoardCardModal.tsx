import * as React from 'react';
import { BoardItem } from './BoardColumn';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface BoardCardModalProps {
    open: boolean;
    card: BoardItem | null;
    status?: string;
    onClose: () => void;
}

const BoardCardModal: React.FC<BoardCardModalProps> = ({ open, card, status, onClose }) => {
    if (!open || !card) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-4 py-10 animate-in fade-in duration-150">
            <div className="w-full max-w-[480px] max-h-[90vh] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl shadow-xl shadow-black/10 dark:shadow-black/30 p-6 animate-in fade-in zoom-in duration-200">
                <header className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">Detalhes do card</p>
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                            {card.title}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition"
                        aria-label="Fechar"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </header>

                <div className="divide-y divide-neutral-200 dark:divide-neutral-800 overflow-y-auto max-h-[60vh]">
                    <div className="py-4 flex items-center gap-3 flex-wrap">
                        {status && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 text-xs font-semibold">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                {status}
                            </span>
                        )}
                        {card.assignee && (
                            <div className="inline-flex items-center gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100">
                                    {card.assignee.charAt(0)}
                                </span>
                                <span>{card.assignee}</span>
                            </div>
                        )}
                    </div>

                    <div className="py-4 space-y-2">
                        <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Descrição</p>
                        <div className="text-sm text-neutral-800 dark:text-neutral-200 max-h-40 overflow-y-auto leading-relaxed">
                            {card.description}
                        </div>
                    </div>

                    <div className="py-4 space-y-3">
                        <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Datas</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 px-3 py-2">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Criação</p>
                                <p className="text-neutral-800 dark:text-neutral-100">—</p>
                            </div>
                            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 px-3 py-2">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Início</p>
                                <p className="text-neutral-800 dark:text-neutral-100">—</p>
                            </div>
                            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 px-3 py-2">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Prazo</p>
                                <p className="text-neutral-800 dark:text-neutral-100">—</p>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="pt-4 mt-2 flex flex-wrap items-center justify-end gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100 transition"
                    >
                        ▶ Iniciar
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100 transition"
                    >
                        ✏️ Editar
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100 transition"
                    >
                        ↔ Mover coluna
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100 transition"
                    >
                        Fechar
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default BoardCardModal;

