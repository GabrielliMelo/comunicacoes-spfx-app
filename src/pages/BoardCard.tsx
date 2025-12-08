import * as React from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { BoardItem } from './BoardColumn';

interface BoardCardProps {
    item: BoardItem;
    isPlaying?: boolean;
    checklistSummary?: { done: number; total: number };
    onPlayToggle: (cardId: number) => void;
    onClick: (card: BoardItem) => void;
    onDragStart: (event: React.DragEvent, cardId: number) => void;
    onDragEnd?: () => void;
}

const BoardCard: React.FC<BoardCardProps> = ({
    item,
    isPlaying,
    checklistSummary,
    onPlayToggle,
    onClick,
    onDragStart,
    onDragEnd,
}) => {
    const [elapsedTime, setElapsedTime] = React.useState(0);
    const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

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

    return (
        <article
            draggable
            onDragStart={(event) => onDragStart(event, item.id)}
            onDragEnd={onDragEnd}
            className={`relative rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-white/5 ${
                isPlaying ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''
            }`}
        >
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    onPlayToggle(item.id);
                }}
                className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow ${
                    isPlaying ? 'ring-1 ring-blue-300 dark:ring-blue-600' : ''
                }`}
                aria-label="Iniciar/pausar"
            >
                {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            </button>

            <button
                type="button"
                onClick={() => onClick(item)}
                className="w-full text-left pr-10 space-y-2"
            >
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {item.title}
                    </h3>
                    {item.priority && (
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold capitalize ${
                                item.priority === 'alta'
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
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.description}
                </p>
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

