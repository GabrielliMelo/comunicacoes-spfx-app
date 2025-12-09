import * as React from 'react';

import { BoardItem } from './BoardColumn';
import { XMarkIcon, PaperClipIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { CheckIcon, PlusIcon } from '@heroicons/react/24/solid';

type Comment = {
    id: string;
    user: string;
    text: string;
    createdAt: string;
};

type Attachment = {
    id: string;
    name: string;
    size: number;
};

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
    onAddLabel: (label: string) => void;
    onRemoveLabel: (label: string) => void;
    onDeadlineChange: (deadline: string | null) => void;
    onAddWatcher: (watcher: string) => void;
    onRemoveWatcher: (watcher: string) => void;
}

const priorityOptions = [
    { value: 'baixa', label: 'Baixa', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { value: 'media', label: 'Média', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { value: 'alta', label: 'Alta', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    { value: 'urgente', label: 'Urgente', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
];

const pastelPalette = ['bg-pink-100 text-pink-800', 'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-purple-100 text-purple-800', 'bg-orange-100 text-orange-800'];
const currentUser = 'Gabrielli Melo';
const labelPalette: Record<string, string> = {
    Design: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    Backend: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    Urgente: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Bug: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    Documentação: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};
const predefinedLabels = Object.keys(labelPalette);

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
    onAddLabel,
    onRemoveLabel,
    onDeadlineChange,
    onAddWatcher,
    onRemoveWatcher,
}) => {
    const [mounted, setMounted] = React.useState(false);
    const [newTag, setNewTag] = React.useState('');
    const [comments, setComments] = React.useState<Comment[]>([]);
    const [commentText, setCommentText] = React.useState('');
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const commentInputRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [elapsedTime, setElapsedTime] = React.useState(0);
    const [newWatcher, setNewWatcher] = React.useState('');
    const [attachments, setAttachments] = React.useState<Attachment[]>([]);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        setMounted(open && Boolean(card));
        if (open && card) {
            try {
                const stored = localStorage.getItem(`boardAttachments_${card.id}`);
                if (stored) {
                    setAttachments(JSON.parse(stored) as Attachment[]);
                } else {
                    setAttachments([]);
                }
            } catch {
                setAttachments([]);
            }
        }
    }, [open, card]);

    const completion =
        checklist.length > 0
            ? Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100)
            : 0;

    const formatTimeAgo = (iso: string) => {
        const diffMs = Date.now() - new Date(iso).getTime();
        const seconds = Math.max(0, Math.floor(diffMs / 1000));
        if (seconds < 60) return `há ${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `há ${minutes} min`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `há ${hours} h`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `há ${days} d`;
        const weeks = Math.floor(days / 7);
        if (weeks < 5) return `há ${weeks} sem`;
        const months = Math.floor(days / 30);
        if (months < 12) return `há ${months} m`;
        const years = Math.floor(days / 365);
        return `há ${years} a`;
    };

    const adjustTextareaHeight = () => {
        const el = commentInputRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };

    const formatSeconds = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const hours = Math.floor(mins / 60);
        const displayMins = mins % 60;
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${displayMins.toString().padStart(2, '0')}:${secs
                .toString()
                .padStart(2, '0')}`;
        }
        return `${displayMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    React.useEffect(() => {
        adjustTextareaHeight();
    }, [commentText]);

    React.useEffect(() => {
        if (!card) return;
        try {
            const stored = localStorage.getItem(`boardComments_${card.id}`);
            if (stored) {
                setComments(JSON.parse(stored) as Comment[]);
            } else {
                setComments([]);
            }
        } catch {
            setComments([]);
        }
        setCommentText('');
        setEditingId(null);
        requestAnimationFrame(() => adjustTextareaHeight());
    }, [card?.id]);

    React.useEffect(() => {
        if (!card) return;
        try {
            const stored = localStorage.getItem('boardTimers');
            if (stored) {
                const parsed = JSON.parse(stored) as Record<string, number>;
                const saved = parsed[String(card.id)];
                if (typeof saved === 'number' && saved >= 0) {
                    setElapsedTime(saved);
                }
            }
        } catch {
            // ignore
        }
    }, [card?.id]);

    React.useEffect(() => {
        if (!card) return;
        try {
            localStorage.setItem(`boardComments_${card.id}`, JSON.stringify(comments));
        } catch {
            // ignore storage errors
        }
    }, [card?.id, comments]);

    React.useEffect(() => {
        if (!card) return;
        try {
            localStorage.setItem(`boardAttachments_${card.id}`, JSON.stringify(attachments));
        } catch {
            // ignore storage errors
        }
    }, [card?.id, attachments]);

    const handleSubmitComment = (event: React.FormEvent) => {
        event.preventDefault();
        const text = commentText.trim();
        if (!text) return;

        if (editingId) {
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === editingId ? { ...comment, text } : comment
                )
            );
            setEditingId(null);
        } else {
            const newComment: Comment = {
                id: `${card?.id ?? 'card'}-${Date.now()}`,
                user: currentUser,
                text,
                createdAt: new Date().toISOString(),
            };
            setComments((prev) => [newComment, ...prev]);
        }

        setCommentText('');
        requestAnimationFrame(() => adjustTextareaHeight());
    };

    const handleEditComment = (id: string) => {
        const comment = comments.find((c) => c.id === id && c.user === currentUser);
        if (!comment) return;
        setCommentText(comment.text);
        setEditingId(id);
        requestAnimationFrame(() => commentInputRef.current?.focus());
    };

    const handleDeleteComment = (id: string) => {
        setComments((prev) => prev.filter((comment) => comment.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setCommentText('');
            requestAnimationFrame(() => adjustTextareaHeight());
        }
    };

    const deadlineState = React.useMemo(() => {
        if (!card?.deadline) return null;
        const due = new Date(card.deadline).getTime();
        const now = Date.now();
        const diff = due - now;
        const dayMs = 24 * 60 * 60 * 1000;
        if (diff < 0) return 'overdue';
        if (diff < dayMs) return 'soon';
        return 'ok';
    }, [card?.deadline]);

    const handleLabelToggle = (label: string) => {
        if (!card) return;
        const has = (card.labels ?? []).includes(label);
        if (has) {
            onRemoveLabel(label);
        } else {
            onAddLabel(label);
        }
    };

    const handleDeadlineInput = (value: string) => {
        if (!card) return;
        onDeadlineChange(value ? value : null);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach((file) => {
            const newAttachment: Attachment = {
                id: `${card?.id ?? 'card'}-${Date.now()}-${Math.random()}`,
                name: file.name,
                size: file.size,
            };
            setAttachments((prev) => [...prev, newAttachment]);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveAttachment = (id: string) => {
        setAttachments((prev) => prev.filter((att) => att.id !== id));
    };

    if (!open || !card) return null;

    const checklistDone = checklist.filter((c) => c.done).length;
    const totalChecklist = checklist.length;
    const deadlineValue = card.deadline ? card.deadline.slice(0, 10) : '';

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200 ease-out ${mounted ? 'opacity-100' : 'opacity-0'
                } ${isFullscreen ? 'px-0 py-0' : 'px-4 py-10'}`}
        >
            <div
                className={`${isFullscreen ? 'w-full h-full rounded-none' : 'w-[80vw] min-w-[80vw] max-w-[80vw] max-h-[90vh] rounded-2xl'} overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl shadow-xl shadow-black/10 dark:shadow-black/30 p-6 transition-all duration-200 ease-out ${mounted ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-2 opacity-0'
                    }`}
            >
                <header className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">aaDetalhes do card</p>
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                            {card.title}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition"
                            aria-label={isFullscreen ? 'Voltar ao modo normal' : 'Visualizar em tela cheia'}
                        >
                            {isFullscreen ? <ArrowsPointingInIcon className="h-5 w-5" /> : <ArrowsPointingOutIcon className="h-5 w-5" />}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition"
                            aria-label="Fechar"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </header>

                <div className={`flex gap-4 ${isFullscreen ? 'h-[calc(100vh-180px)]' : ''}`}>
                    <div className={`${isFullscreen ? 'flex-[2]' : 'flex-1'} ${isFullscreen ? 'overflow-y-auto pr-4' : ''}`}>
                        <div className={`divide-y divide-neutral-200 dark:divide-neutral-800 ${isFullscreen ? '' : 'overflow-y-auto max-h-[60vh]'}`}>
                            {!isFullscreen && (
                                <div className="py-4 flex items-center gap-3 flex-wrap">
                                    {status && (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 text-xs font-semibold">
                                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                                            {status}
                                        </span>
                                    )}
                                    {card.priority && (
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${priorityOptions.find((p) => p.value === card.priority)?.className ??
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
                            )}

                            <div className="py-4 space-y-2">
                                <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Descrição</p>
                                <div className={`text-sm text-neutral-800 dark:text-neutral-200 ${isFullscreen ? '' : 'max-h-40'} overflow-y-auto leading-relaxed`}>
                                    {card.description}
                                </div>
                            </div>

                            <div className="py-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Watchers</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(card.watchers ?? []).length === 0 && (
                                        <span className="text-sm text-neutral-500 dark:text-neutral-400">Nenhum watcher.</span>
                                    )}
                                    {(card.watchers ?? []).map((watcher) => (
                                        <span
                                            key={watcher}
                                            className="inline-flex items-center gap-2 rounded-full bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 px-3 py-1 text-xs font-semibold"
                                        >
                                            {watcher}
                                            <button
                                                type="button"
                                                onClick={() => onRemoveWatcher && onRemoveWatcher(watcher)}
                                                className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                                                aria-label="Remover watcher"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (newWatcher.trim() && onAddWatcher) {
                                            onAddWatcher(newWatcher.trim());
                                            setNewWatcher('');
                                        }
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        value={newWatcher}
                                        onChange={(e) => setNewWatcher(e.target.value)}
                                        placeholder="Adicionar watcher"
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
                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ${card.priority === option.value
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
                                    <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Labels</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {predefinedLabels.map((label) => {
                                        const active = (card.labels ?? []).includes(label);
                                        return (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={() => handleLabelToggle(label)}
                                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${active
                                                    ? `${labelPalette[label]} ring-2 ring-offset-1 ring-offset-white dark:ring-offset-neutral-900`
                                                    : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                                                    }`}
                                            >
                                                {label}
                                                {active && <span className="text-lg leading-none">×</span>}
                                            </button>
                                        );
                                    })}
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
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Prazo</p>
                                        <input
                                            type="date"
                                            value={deadlineValue}
                                            onChange={(e) => handleDeadlineInput(e.target.value)}
                                            className="w-full bg-transparent text-neutral-800 dark:text-neutral-100 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="py-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Comentários</p>
                                    {editingId && (
                                        <span className="text-xs text-blue-600 dark:text-blue-300 font-semibold">Editando…</span>
                                    )}
                                </div>

                                <form onSubmit={handleSubmitComment} className="space-y-2">
                                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 px-3 py-2 shadow-sm">
                                        <textarea
                                            ref={commentInputRef}
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onInput={adjustTextareaHeight}
                                            rows={1}
                                            placeholder="Adicionar comentário…"
                                            className="w-full resize-none bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                        {editingId && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setCommentText('');
                                                    adjustTextareaHeight();
                                                }}
                                                className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:underline"
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={!commentText.trim()}
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition hover:opacity-90"
                                        >
                                            Enviar
                                        </button>
                                    </div>
                                </form>

                                <div className="space-y-2">
                                    {comments.length === 0 && (
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Sem comentários ainda.</p>
                                    )}
                                    {comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="flex gap-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 px-3 py-3"
                                        >
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100 text-sm font-semibold">
                                                {comment.user.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{comment.user}</p>
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatTimeAgo(comment.createdAt)}</p>
                                                    </div>
                                                    {comment.user === currentUser && (
                                                        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEditComment(comment.id)}
                                                                className="hover:underline"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                className="hover:underline text-red-600 dark:text-red-400"
                                                            >
                                                                Excluir
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-neutral-800 dark:text-neutral-100 whitespace-pre-wrap">
                                                    {comment.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="py-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Anexos</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-4">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={handleFileSelect}
                                            multiple
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex flex-col items-center justify-center cursor-pointer gap-2"
                                        >
                                            <PaperClipIcon className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
                                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                                Clique para adicionar arquivos
                                            </span>
                                            <span className="text-xs text-neutral-500 dark:text-neutral-500">
                                                ou arraste e solte
                                            </span>
                                        </label>
                                    </div>
                                    {attachments.length > 0 && (
                                        <div className="space-y-2">
                                            {attachments.map((attachment) => (
                                                <div
                                                    key={attachment.id}
                                                    className="flex items-center justify-between gap-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-2"
                                                >
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <PaperClipIcon className="h-4 w-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
                                                        <span className="text-sm text-neutral-800 dark:text-neutral-100 truncate">
                                                            {attachment.name}
                                                        </span>
                                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 shrink-0">
                                                            {formatFileSize(attachment.size)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAttachment(attachment.id)}
                                                        className="text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 shrink-0"
                                                        aria-label="Remover anexo"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                    </div>

                    <aside className={`${isFullscreen ? 'w-[300px]' : 'w-[200px]'} shrink-0 border-l border-neutral-200 dark:border-neutral-800 pl-4 ${isFullscreen ? 'overflow-y-auto' : ''} space-y-4`}>
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Prioridade</p>
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${priorityOptions.find((p) => p.value === card.priority)?.className ??
                                    'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100'
                                    }`}
                            >
                                {card.priority ?? '—'}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Responsável</p>
                            <div className="flex items-center gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100">
                                    {card.assignee ? card.assignee.charAt(0) : '—'}
                                </span>
                                <span>{card.assignee ?? '—'}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Deadline</p>
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${deadlineState === 'overdue'
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                    : deadlineState === 'soon'
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                        : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                                    }`}
                            >
                                {card.deadline ? new Date(card.deadline).toLocaleDateString('pt-BR') : '—'}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Labels</p>
                            <div className="flex flex-wrap gap-1">
                                {(card.labels ?? []).length === 0 && <span className="text-xs text-neutral-500 dark:text-neutral-400">Nenhuma</span>}
                                {(card.labels ?? []).map((label) => (
                                    <span
                                        key={label}
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${labelPalette[label] ?? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100'}`}
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Tags</p>
                            <div className="flex flex-wrap gap-1">
                                {(card.tags ?? []).length === 0 && <span className="text-xs text-neutral-500 dark:text-neutral-400">Nenhuma</span>}
                                {(card.tags ?? []).map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 px-2 py-1 text-[11px] font-semibold"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Tempo trabalhado</p>
                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1 text-xs font-semibold">
                                ⏱ {formatSeconds(elapsedTime)}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Comentários</p>
                            <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 px-3 py-1 text-xs font-semibold">
                                💬 {comments.length}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Checklist</p>
                            <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 px-3 py-1 text-xs font-semibold">
                                ✅ {checklistDone}/{totalChecklist || 0}
                            </span>
                        </div>
                    </aside>
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

