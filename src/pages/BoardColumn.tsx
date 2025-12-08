import * as React from 'react';
import BoardCard from './BoardCard';

export interface BoardItem {
    id: number;
    title: string;
    description: string;
    assignee?: string;
    priority?: string;
    tags?: string[];
}

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
}

const BoardColumn: React.FC<BoardColumnProps> = ({
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
}) => {
    return (
        <section
            onDragOver={(event) => onDragOver(event, columnKey)}
            onDrop={(event) => onDrop(event, columnKey)}
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
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{items.length} item(s)</p>
            </div>

            <div className="p-3 space-y-3 overflow-hidden">
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

