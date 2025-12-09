import * as React from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { BoardItem } from './BoardColumn';

interface BoardCardProps {
    item: BoardItem;
    isPlaying?: boolean;
    checklistSummary?: { done: number; total: number };
    onPlayToggle: (cardId: number) => void;
    onClick: (card: BoardItem, event: React.MouseEvent) => void;
    onDragStart: (event: React.DragEvent, cardId: number) => void;
    onDragEnd?: () => void;
    isSelected?: boolean;
}

const BoardCard: React.FC<BoardCardProps> = ({
    item,
    isPlaying,
    checklistSummary,
    onPlayToggle,
    onClick,
    onDragStart,
    onDragEnd,
    isSelected = false,
}) => {
    const [elapsedTime, setElapsedTime] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    const labelColors: Record<string, string> = {
        Design: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        Backend: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
        Urgente: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        Bug: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        Documentação: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };

    const handleDragStart = (event: React.DragEvent) => {
        setIsDragging(true);
        onDragStart(event, item.id);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        onDragEnd?.();
    };

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const stopTimer = React.useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const formatTime = (seconds: number) => {
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

    // Restaurar tempo salvo ao montar
    React.useEffect(() => {
        try {
            const stored = localStorage.getItem('boardTimers');
            if (stored) {
                const parsed = JSON.parse(stored) as Record<string, number>;
                const saved = parsed[String(item.id)];
                if (typeof saved === 'number' && saved >= 0) {
                    setElapsedTime(saved);
                }
            }
        } catch {
            // se falhar, ignora
        }
        return () => {
            stopTimer();
        };
    }, [item.id, stopTimer]);

    // Persistir sempre que alterar
    React.useEffect(() => {
        try {
            const stored = localStorage.getItem('boardTimers');
            const parsed = stored ? (JSON.parse(stored) as Record<string, number>) : {};
            parsed[String(item.id)] = elapsedTime;
            localStorage.setItem('boardTimers', JSON.stringify(parsed));
        } catch {
            // ignore storage errors
        }
    }, [elapsedTime, item.id]);

    // Controlar timer conforme card ativo
    React.useEffect(() => {
        stopTimer();
        if (!isPlaying) return;

        timerRef.current = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);

        return () => {
            stopTimer();
        };
    }, [isPlaying, stopTimer]);

    const deadlineStatus = React.useMemo(() => {
        if (!item.deadline) return null;
        const due = new Date(item.deadline).getTime();
        const now = Date.now();
        const diff = due - now;
        const dayMs = 24 * 60 * 60 * 1000;
        if (diff < 0) return 'overdue';
        if (diff < dayMs) return 'soon';
        return 'ok';
    }, [item.deadline]);

    return (
        <article
            draggable
            onDragStartCapture={handleDragStart}
            onDragEndCapture={handleDragEnd}
            className={`relative rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-white/5 ${isPlaying ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''
                } ${isSelected ? 'ring-2 ring-indigo-400 dark:ring-indigo-500' : ''} ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${isDragging ? 'scale-105' : 'scale-100'}`}
        >
            {item.watchers && item.watchers.length > 0 && (
                <div className="absolute -top-3 right-3 flex items-center">
                    {item.watchers.slice(0, 3).map((watcher, idx) => (
                        <span
                            key={watcher + idx}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100 text-xs font-semibold border border-white dark:border-neutral-800"
                            style={{ marginLeft: idx === 0 ? 0 : -12 }}
                            title={watcher}
                        >
                            {watcher.charAt(0).toUpperCase()}
                        </span>
                    ))}
                    {item.watchers.length > 3 && (
                        <span className="ml-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                            +{item.watchers.length - 3}
                        </span>
                    )}
                </div>
            )}
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    onPlayToggle(item.id);
                }}
                className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow ${isPlaying ? 'ring-1 ring-blue-300 dark:ring-blue-600' : ''
                    }`}
                aria-label="Iniciar/pausar"
            >
                {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            </button>

            <button
                type="button"
                onClick={(event) => onClick(item, event)}
                className="w-full text-left pr-10 space-y-2"
            >
                <div className="flex items-center justify-between gap-2">
                    <h3
                        className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate"
                        title={item.title}
                    >
                        {item.title}
                    </h3>
                    {item.priority && (
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold capitalize ${item.priority === 'alta'
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200'
                                : item.priority === 'media'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                                    : item.priority === 'baixa'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                }`}
                        >
                            {item.priority}
                        </span>
                    )}
                </div>
                {item.labels && item.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {item.labels.map((label) => (
                            <span
                                key={label}
                                className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${labelColors[label] ?? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100'}`}
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                )}
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.description}
                </p>
                {item.deadline && (
                    <div
                        className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-[11px] font-semibold ${deadlineStatus === 'overdue'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                            : deadlineStatus === 'soon'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                            }`}
                    >
                        🗓 {new Date(item.deadline).toLocaleDateString('pt-BR')}
                        {deadlineStatus === 'overdue' && <span>(Atrasado)</span>}
                        {deadlineStatus === 'soon' && <span>({'<'}24h)</span>}
                    </div>
                )}
                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 px-2 py-0.5 text-[11px] font-semibold"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-700 dark:text-blue-200">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-1">
                        <PlayIcon className="h-3 w-3" />
                        {formatTime(elapsedTime)}
                    </span>
                </div>
                {checklistSummary && checklistSummary.total > 0 && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-neutral-600 dark:text-neutral-300">
                            <span className="font-semibold">
                                {checklistSummary.done}/{checklistSummary.total} concluído
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800">
                            <div
                                className="h-2 rounded-full bg-blue-500"
                                style={{
                                    width: `${Math.min(100, (checklistSummary.done / checklistSummary.total) * 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                )}
                {item.assignee && (
                    <p className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-200">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100">
                            {item.assignee.charAt(0)}
                        </span>
                        {item.assignee}
                    </p>
                )}
            </button>
        </article>
    );
};

export default BoardCard;

