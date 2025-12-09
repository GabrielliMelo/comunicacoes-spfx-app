import * as React from 'react';
import { BarsArrowUpIcon, BarsArrowDownIcon } from '@heroicons/react/24/outline';

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
    onCardClick: (item: BoardItem, columnKey: string, columnTitle: string, event: React.MouseEvent, index: number, visibleItems: BoardItem[]) => void;
    onPlayToggle: (cardId: number) => void;
    stats?: { count: number; totalSeconds: number; doneToday?: number };
    sortConfig?: { field: string; direction: 'asc' | 'desc' };
    onSortChange: (columnKey: string, field: string) => void;
    groupBy?: 'column' | 'assignee';
    isDragging?: boolean;
    selectedIds: number[];
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
    sortConfig,
    onSortChange,
    groupBy = 'column',
    isDragging = false,
    selectedIds,
} = props;

    const sortOptions = [
        { value: 'priority', label: 'Prioridade' },
        { value: 'deadline', label: 'Deadline' },
        { value: 'time', label: 'Tempo trabalhado' },
        { value: 'title', label: 'Título (A-Z)' },
    ];

    const groupedItems = React.useMemo(() => {
        if (groupBy === 'assignee') {
            const groups: Record<string, BoardItem[]> = {};
            items.forEach((item) => {
                const assignee = item.assignee || 'Sem responsável';
                if (!groups[assignee]) {
                    groups[assignee] = [];
                }
                groups[assignee].push(item);
            });
            return groups;
        }
        return null;
    }, [items, groupBy]);
    return (
        <section
            onDragOver={(event: React.DragEvent) => onDragOver(event, columnKey)}
            onDrop={(event: React.DragEvent) => onDrop(event, columnKey)}
            onDragLeave={onDragLeave}
            className={`w-[320px] shrink-0 rounded-xl border transition-all duration-200 ${
                isActiveDrop
                    ? 'ring-4 ring-indigo-400 dark:ring-indigo-500 border-indigo-300 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 translate-y-0.5 shadow-lg'
                    : isDragging
                        ? 'border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900 hover:-translate-y-0.5'
                        : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:-translate-y-0.5'
            }`}
        >
            <div className="px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-neutral-400 dark:bg-neutral-500" aria-hidden="true" />
                        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight">
                            {title}
                        </h2>
                    </div>
                    <div className="relative group">
                        <button
                            type="button"
                            className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition"
                            aria-label="Ordenar"
                        >
                            {sortConfig?.direction === 'asc' ? (
                                <BarsArrowUpIcon className="h-4 w-4" />
                            ) : sortConfig?.direction === 'desc' ? (
                                <BarsArrowDownIcon className="h-4 w-4" />
                            ) : (
                                <BarsArrowUpIcon className="h-4 w-4 opacity-50" />
                            )}
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="py-1">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => onSortChange(columnKey, option.value)}
                                        className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700 transition flex items-center justify-between ${sortConfig?.field === option.value
                                            ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                                            : 'text-neutral-700 dark:text-neutral-300'
                                            }`}
                                    >
                                        <span>{option.label}</span>
                                        {sortConfig?.field === option.value && (
                                            <span className="text-[10px]">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
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

            <div className={`p-3 space-y-3 overflow-y-auto transition-all duration-200 ease-out ${items.length === 0 && isDragging ? 'min-h-[200px]' : ''}`}>
                {items.length === 0 && isDragging && (
                    <div className="flex items-center justify-center min-h-[200px] border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg bg-indigo-50/30 dark:bg-indigo-900/10">
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            Solte aqui
                        </span>
                    </div>
                )}
                {groupBy === 'assignee' && groupedItems ? (
                    Object.entries(groupedItems)
                        .sort(([a], [b]) => {
                            if (a === 'Sem responsável') return 1;
                            if (b === 'Sem responsável') return -1;
                            return a.localeCompare(b);
                        })
                        .map(([assignee, groupItems]) => (
                            <div key={assignee} className="space-y-2">
                                <div className="px-2 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs font-semibold">
                                            {assignee.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                            {assignee}
                                        </span>
                                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                                            ({groupItems.length})
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2 pl-2">
                                    {groupItems.map((item) => (
                                        <BoardCard
                                            key={item.id}
                                            item={item}
                                            isPlaying={activeTaskId === String(item.id)}
                                            checklistSummary={checklists[String(item.id)]}
                                            onPlayToggle={onPlayToggle}
                                            onClick={(card, event) =>
                                                onCardClick(
                                                    card,
                                                    columnKey,
                                                    title,
                                                    event,
                                                    items.findIndex((i) => i.id === card.id),
                                                    items,
                                                )
                                            }
                                            onDragStart={(event, cardId) => onDragStart(event, cardId, columnKey)}
                                            onDragEnd={onDragEnd}
                                            isSelected={selectedIds.includes(item.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                ) : (
                    items.map((item, idx) => (
                        <BoardCard
                            key={item.id}
                            item={item}
                            isPlaying={activeTaskId === String(item.id)}
                            checklistSummary={checklists[String(item.id)]}
                            onPlayToggle={onPlayToggle}
                            onClick={(card, event) => onCardClick(card, columnKey, title, event, idx, items)}
                            onDragStart={(event, cardId) => onDragStart(event, cardId, columnKey)}
                            onDragEnd={onDragEnd}
                            isSelected={selectedIds.includes(item.id)}
                        />
                    ))
                )}
            </div>
        </section>
    );
};

export default BoardColumn;

