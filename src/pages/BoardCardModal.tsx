import * as React from 'react';
import { BoardItem } from './BoardColumn';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckIcon, PlusIcon } from '@heroicons/react/24/solid';

interface BoardCardModalProps {
    open: boolean;
    card: BoardItem | null;
    status?: string;
    onClose: () => void;
    checklist: { id: number; text: string; done: boolean }[];
    onToggleChecklist: (itemId: number) => void;
    history: { id: string; action: string; timestamp: string }[];
    onPriorityChange: (priority: string) => void;
    onAddTag: (tag: string) => void;
    onRemoveTag: (tag: string) => void;
    isPlaying?: boolean;
    onTogglePlay?: (cardId: number) => void;
}

const priorityOptions = [
    { value: 'baixa', label: 'Baixa', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { value: 'media', label: 'Média', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { value: 'alta', label: 'Alta', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    { value: 'urgente', label: 'Urgente', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
];

const pastelPalette = ['bg-pink-100 text-pink-800', 'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-purple-100 text-purple-800', 'bg-orange-100 text-orange-800'];

const BoardCardModal: React.FC<BoardCardModalProps> = ({
    open,
    card,
    status,
    onClose,
    checklist,
    onToggleChecklist,
    history,
    onPriorityChange,
    onAddTag,
    onRemoveTag,
    isPlaying,
    onTogglePlay,
}) => {
    if (!open || !card) return null;

    const completion =
        checklist.length > 0
            ? Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100)
            : 0;

    const [newTag, setNewTag] = React.useState('');

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
                        {card.priority && (
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                    priorityOptions.find((p) => p.value === card.priority)?.className ??
                                    'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100'
                                }`}
                            >
                                Prioridade: {card.priority}
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
                        <div className="flex items-center justify-between">
                            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Checklist</p>
                            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">{completion}%</span>
                        </div>
                        <div className="space-y-2">
                            {checklist.map((item) => (
                                <label key={item.id} className="flex items-start gap-2 text-sm text-neutral-800 dark:text-neutral-200">
                                    <input
                                        type="checkbox"
                                        checked={item.done}
                                        onChange={() => onToggleChecklist(item.id)}
                                        className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800"
                                    />
                                    <span className={item.done ? 'line-through text-neutral-500 dark:text-neutral-400' : ''}>{item.text}</span>
                                </label>
                            ))}
                            <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                                <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${completion}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="py-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Prioridade</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {priorityOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => onPriorityChange(option.value)}
                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ${
                                        card.priority === option.value
                                            ? `${option.className} ring-2 ring-offset-1 ring-offset-white dark:ring-offset-neutral-900`
                                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                                    }`}
                                >
                                    {card.priority === option.value && <CheckIcon className="h-4 w-4" />}
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="py-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Tags</p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (newTag.trim()) {
                                        onAddTag(newTag.trim());
                                        setNewTag('');
                                    }
                                }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Nova tag"
                                    className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-3 py-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100 transition"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                </button>
                            </form>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {(card.tags ?? []).map((tag, idx) => (
                                <span
                                    key={tag}
                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${pastelPalette[idx % pastelPalette.length]}`}
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => onRemoveTag(tag)}
                                        className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                                        aria-label="Remover tag"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
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

                    <div className="py-4 space-y-2">
                        <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Histórico</p>
                        <div className="space-y-2">
                            {history.length === 0 && (
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">Sem eventos ainda.</p>
                            )}
                            {history
                                .slice()
                                .reverse()
                                .map((entry) => (
                                    <div key={entry.id} className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                                        <div className="space-y-1">
                                            <p className="text-sm text-neutral-800 dark:text-neutral-100">{entry.action}</p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                {new Date(entry.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                <footer className="pt-4 mt-2 flex flex-wrap items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => onTogglePlay && card && onTogglePlay(card.id)}
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100 transition"
                    >
                        {isPlaying ? '⏸ Pausar' : '▶ Iniciar'}
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

