import * as React from 'react';

import BoardCard from './BoardCard';

export interface BoardItem {
    id: number;
    title: string;
    description: string;
    assignee?: string;
    priority?: string;
    tags?: string[];
    labels?: string[];
    deadline?: string | null;
    watchers?: string[];
}

const formatSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);
    const displayMins = mins % 60;
    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${displayMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${displayMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface BoardColumnProps {
    title: string;
    items: BoardItem[];
    columnKey: string;
    isActiveDrop: boolean;
    activeTaskId: string | null;
    checklists: Record<string, { done: number; total: number }>;
    onDragStart: (event: React.DragEvent, cardId: number, fromColumnKey: string) => void;
    onDragEnd: () => void;
    onDrop: (event: React.DragEvent, toColumnKey: string) => void;
    onDragOver: (event: React.DragEvent, columnKey: string) => void;
    onDragLeave: () => void;
    onCardClick: (item: BoardItem, columnTitle: string) => void;
    onPlayToggle: (cardId: number) => void;
    stats?: { count: number; totalSeconds: number; doneToday?: number };
}

const BoardColumn: React.FC<BoardColumnProps> = (props) => {
    const {
        title,
        items,
        columnKey,
        isActiveDrop,
        activeTaskId,
        checklists,
        onDragStart,
        onDragEnd,
        onDrop,
        onDragOver,
        onDragLeave,
        onCardClick,
        onPlayToggle,
    } = props;
    return (
        <section
            onDragOver={(event: React.DragEvent) => onDragOver(event, columnKey)}
            onDrop={(event: React.DragEvent) => onDrop(event, columnKey)}
            onDragLeave={onDragLeave}
            className={`w-[320px] shrink-0 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 transition-all duration-200 ${isActiveDrop ? 'ring-2 ring-indigo-200 dark:ring-indigo-500/40 translate-y-0.5' : 'hover:-translate-y-0.5'
                }`}
        >
            <div className="px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-neutral-400 dark:bg-neutral-500" aria-hidden="true" />
                    <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight">
                        {title}
                    </h2>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span>{(props.stats?.count ?? items.length)} item(s)</span>
                    {typeof props.stats?.totalSeconds === 'number' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-700 dark:text-neutral-200">
                            ⏱ {formatSeconds(props.stats.totalSeconds)}
                        </span>
                    )}
                    {props.stats?.doneToday !== undefined && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-[11px] text-green-700 dark:text-green-200">
                            ✅ Hoje: {props.stats.doneToday}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-3 space-y-3 overflow-hidden transition-all duration-200 ease-out">
                {items.map((item) => (
                    <BoardCard
                        key={item.id}
                        item={item}
                        isPlaying={activeTaskId === String(item.id)}
                        checklistSummary={checklists[String(item.id)]}
                        onPlayToggle={onPlayToggle}
                        onClick={(card) => onCardClick(card, title)}
                        onDragStart={(event, cardId) => onDragStart(event, cardId, columnKey)}
                        onDragEnd={onDragEnd}
                    />
                ))}
            </div>
        </section>
    );
};

export default BoardColumn;

