import * as React from 'react';
import BoardColumn, { BoardItem } from './BoardColumn';
import BoardCardModal from './BoardCardModal';

interface ColumnConfig {
    key: string;
    title: string;
    items: BoardItem[];
}

interface ChecklistItem {
    id: number;
    text: string;
    done: boolean;
}

interface HistoryEntry {
    id: string;
    action: string;
    timestamp: string;
}


const initialColumns: ColumnConfig[] = [
    {
        key: 'backlog',
        title: 'Backlog',
        items: [
            { id: 1, title: 'Mapear requisitos iniciais', description: 'Entrevistar stakeholders e alinhar escopo', assignee: 'Carla', priority: 'alta', tags: ['descoberta'], labels: ['Design'], deadline: '2025-12-20', watchers: ['Carla', 'Ana'] },
            { id: 2, title: 'Desenhar visão de produto', description: 'Definir metas e indicadores-chave', assignee: 'Bruno', priority: 'media', tags: ['produto'], labels: ['Design'], deadline: '2025-12-22', watchers: ['Bruno'] },
        ],
    },
    {
        key: 'todo',
        title: 'A Fazer',
        items: [
            { id: 3, title: 'Briefing visual', description: 'Guidelines de cores e componentes base', assignee: 'Ana', priority: 'baixa', tags: ['ui', 'design'], labels: ['Design'], deadline: '2025-12-25', watchers: ['Ana', 'João'] },
            { id: 4, title: 'Checklist de integrações', description: 'Listar APIs e autenticação necessária', assignee: 'João', priority: 'alta', tags: ['tech'], labels: ['Backend'], deadline: '2025-12-18', watchers: ['João', 'Bruno'] },
        ],
    },
    {
        key: 'doing',
        title: 'Fazendo',
        items: [
            { id: 5, title: 'Implementar onboarding', description: 'Fluxo inicial e tour guiado', assignee: 'Ana', priority: 'alta', tags: ['frontend', 'experiência'], labels: ['Design', 'Urgente'], deadline: '2025-12-15', watchers: ['Ana', 'Carla'] },
            { id: 6, title: 'Montar layout responsivo', description: 'Grids e breakpoints principais', assignee: 'João', priority: 'media', tags: ['frontend'], labels: ['Bug'], deadline: '2025-12-28', watchers: ['João'] },
        ],
    },
    {
        key: 'waiting',
        title: 'Aguardando',
        items: [
            { id: 7, title: 'Aprovação jurídica', description: 'Revisar termos e políticas', assignee: 'Carlos', priority: 'baixa', tags: ['legal'], labels: ['Documentação'], deadline: '2025-12-30', watchers: ['Carlos'] },
            { id: 8, title: 'Validação de dados', description: 'Aguardando base de testes', assignee: 'Bruno', priority: 'media', tags: ['dados'], labels: ['Backend'], deadline: '2025-12-26', watchers: ['Bruno', 'Ana'] },
        ],
    },
    {
        key: 'done',
        title: 'Concluído',
        items: [
            { id: 9, title: 'Setup do repositório', description: 'Branches, PR template e lint configurados', assignee: 'Ana', priority: 'baixa', tags: ['devops'], labels: ['Documentação'], deadline: '2025-12-05', watchers: ['Ana'] },
            { id: 10, title: 'CI inicial', description: 'Pipeline de build e testes unitários', assignee: 'João', priority: 'alta', tags: ['devops', 'qualidade'], labels: ['Backend'], deadline: '2025-12-10', watchers: ['João', 'Carla'] },
        ],
    },
];

const columnRules: Record<string, string[]> = {
    backlog: ['todo'],
    todo: ['doing'],
    doing: ['waiting', 'done'],
    waiting: ['doing', 'done'],
    done: [],
};

const BoardPage: React.FC = () => {
    const [columns, setColumns] = React.useState<ColumnConfig[]>(initialColumns);
    const [activeDropColumn, setActiveDropColumn] = React.useState<string | null>(null);
    const [activeTaskId, setActiveTaskId] = React.useState<string | null>(null);
    const [selectedCard, setSelectedCard] = React.useState<{ card: BoardItem; status: string } | null>(null);
    const [filters, setFilters] = React.useState<{ user: string | null; priority: string | null; status: string | null; overdue: boolean }>({
        user: null,
        priority: null,
        status: null,
        overdue: false,
    });
    const [searchTerm, setSearchTerm] = React.useState('');
    const [debouncedSearch, setDebouncedSearch] = React.useState('');
    const [checklists, setChecklists] = React.useState<Record<string, ChecklistItem[]>>({});
    const [history, setHistory] = React.useState<Record<string, HistoryEntry[]>>({});

    const handleDragStart = (event: React.DragEvent, cardId: number, fromColumnKey: string) => {
        event.dataTransfer.setData(
            'application/json',
            JSON.stringify({ cardId, fromColumnKey }),
        );
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (event: React.DragEvent, columnKey: string) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setActiveDropColumn(columnKey);
    };

    const handleDragLeave = () => {
        setActiveDropColumn(null);
    };

    const pushHistory = React.useCallback((cardId: number, action: string) => {
        setHistory((prev) => {
            const list = prev[cardId] ?? [];
            const entry: HistoryEntry = {
                id: `${cardId}-${Date.now()}`,
                action,
                timestamp: new Date().toISOString(),
            };
            return {
                ...prev,
                [cardId]: [...list, entry],
            };
        });
    }, []);

    const handleDrop = (event: React.DragEvent, toColumnKey: string) => {
        event.preventDefault();
        const payload = event.dataTransfer.getData('application/json');
        setActiveDropColumn(null);

        if (!payload) return;

        try {
            const { cardId, fromColumnKey } = JSON.parse(payload) as { cardId: number; fromColumnKey: string };
            if (!cardId || !fromColumnKey) return;

            const fromKey = fromColumnKey;
            const toKey = toColumnKey;

            setColumns((prev) => {
                const sourceIndex = prev.findIndex((col) => col.key === fromKey);
                const targetIndex = prev.findIndex((col) => col.key === toKey);
                if (sourceIndex === -1 || targetIndex === -1) return prev;

                const card = prev[sourceIndex].items.find((item) => item.id === cardId);
                if (!card) return prev;

                // Caso arraste para a mesma coluna, apenas mantém a posição atual
                if (fromKey === toKey) return prev;

                const allowedTargets = columnRules[fromKey] ?? [];
                const isAllowed = allowedTargets.includes(toKey);
                if (!isAllowed) {
                    return prev;
                }

                if (toKey === 'done') {
                    const confirmFinish = window.confirm('Deseja realmente marcar esta tarefa como concluída?');
                    if (!confirmFinish) return prev;
                }

                const updatedColumns = prev.map((col, index) => {
                    if (index === sourceIndex) {
                        return {
                            ...col,
                            items: col.items.filter((item) => item.id !== cardId),
                        };
                    }
                    if (index === targetIndex) {
                        return {
                            ...col,
                            items: [...col.items, card],
                        };
                    }
                    return col;
                });

                pushHistory(cardId, `Moveu de ${prev[sourceIndex].title} para ${prev[targetIndex].title}`);
                if (toKey === 'done') {
                    pushHistory(cardId, 'Concluiu tarefa');
                }

                return updatedColumns;
            });
        } catch (_err) {
            // ignora payload inválido
            return;
        }
    };

    const handleCardClick = (card: BoardItem, status: string) => {
        setSelectedCard({ card, status });
        pushHistory(card.id, 'Abriu modal');
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };

    const handleToggleChecklistItem = React.useCallback((cardId: number, itemId: number) => {
        setChecklists((prev) => {
            const list = prev[cardId] ?? [];
            const updated = list.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item
            );
            return { ...prev, [cardId]: updated };
        });
    }, []);

    const handlePriorityChange = React.useCallback((cardId: number, priority: string) => {
        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                items: col.items.map((item) =>
                    item.id === cardId ? { ...item, priority } : item
                ),
            }))
        );
    }, []);

    const handleAddTag = React.useCallback((cardId: number, tag: string) => {
        if (!tag.trim()) return;
        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                items: col.items.map((item) =>
                    item.id === cardId
                        ? {
                            ...item,
                            tags: item.tags
                                ? Array.from(new Set([...item.tags, tag.trim()]))
                                : [tag.trim()],
                        }
                        : item
                ),
            }))
        );
        setSelectedCard((prev) =>
            prev && prev.card.id === cardId
                ? { ...prev, card: { ...prev.card, tags: prev.card.tags ? Array.from(new Set([...prev.card.tags, tag.trim()])) : [tag.trim()] } }
                : prev
        );
    }, []);

    const handleRemoveTag = React.useCallback((cardId: number, tag: string) => {
        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                items: col.items.map((item) =>
                    item.id === cardId
                        ? { ...item, tags: (item.tags ?? []).filter((t) => t !== tag) }
                        : item
                ),
            }))
        );
        setSelectedCard((prev) =>
            prev && prev.card.id === cardId
                ? { ...prev, card: { ...prev.card, tags: (prev.card.tags ?? []).filter((t) => t !== tag) } }
                : prev
        );
    }, []);

    const handleAddLabel = React.useCallback((cardId: number, label: string) => {
        if (!label.trim()) return;
        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                items: col.items.map((item) =>
                    item.id === cardId
                        ? {
                            ...item,
                            labels: item.labels
                                ? Array.from(new Set([...item.labels, label]))
                                : [label],
                        }
                        : item
                ),
            }))
        );
        setSelectedCard((prev) =>
            prev && prev.card.id === cardId
                ? { ...prev, card: { ...prev.card, labels: prev.card.labels ? Array.from(new Set([...prev.card.labels, label])) : [label] } }
                : prev
        );
    }, []);

    const handleRemoveLabel = React.useCallback((cardId: number, label: string) => {
        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                items: col.items.map((item) =>
                    item.id === cardId
                        ? { ...item, labels: (item.labels ?? []).filter((l) => l !== label) }
                        : item
                ),
            }))
        );
        setSelectedCard((prev) =>
            prev && prev.card.id === cardId
                ? { ...prev, card: { ...prev.card, labels: (prev.card.labels ?? []).filter((l) => l !== label) } }
                : prev
        );
    }, []);

    const handleDeadlineChange = React.useCallback((cardId: number, deadline: string | null) => {
        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                items: col.items.map((item) =>
                    item.id === cardId ? { ...item, deadline } : item
                ),
            }))
        );
        setSelectedCard((prev) =>
            prev && prev.card.id === cardId ? { ...prev, card: { ...prev.card, deadline } } : prev
        );
    }, []);

    const handleAddWatcher = React.useCallback((cardId: number, watcher: string) => {
        if (!watcher.trim()) return;
        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                items: col.items.map((item) =>
                    item.id === cardId
                        ? { ...item, watchers: item.watchers ? Array.from(new Set([...item.watchers, watcher.trim()])) : [watcher.trim()] }
                        : item
                ),
            }))
        );
        setSelectedCard((prev) =>
            prev && prev.card.id === cardId
                ? {
                    ...prev,
                    card: {
                        ...prev.card,
                        watchers: prev.card.watchers ? Array.from(new Set([...prev.card.watchers, watcher.trim()])) : [watcher.trim()],
                    },
                }
                : prev
        );
    }, []);

    const handleRemoveWatcher = React.useCallback((cardId: number, watcher: string) => {
        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                items: col.items.map((item) =>
                    item.id === cardId
                        ? { ...item, watchers: (item.watchers ?? []).filter((w) => w !== watcher) }
                        : item
                ),
            }))
        );
        setSelectedCard((prev) =>
            prev && prev.card.id === cardId
                ? { ...prev, card: { ...prev.card, watchers: (prev.card.watchers ?? []).filter((w) => w !== watcher) } }
                : prev
        );
    }, []);

    const handlePlayToggle = (cardId: number) => {
        const cardKey = String(cardId);

        if (!activeTaskId) {
            setActiveTaskId(cardKey);
            pushHistory(cardId, 'Iniciou tarefa (play)');
            return;
        }

        if (activeTaskId === cardKey) {
            setActiveTaskId(null);
            pushHistory(cardId, 'Pausou tarefa');
            return;
        }

        pushHistory(Number(activeTaskId), 'Pausou tarefa');
        pushHistory(cardId, 'Iniciou tarefa (play)');
        setActiveTaskId(cardKey);
    };

    const handleFilterChange = (key: 'user' | 'priority' | 'status', value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || null,
        }));
    };

    const handleClearFilters = () => {
        setFilters({ user: null, priority: null, status: null, overdue: false });
    };

    const assignees = React.useMemo(() => {
        const set = new Set<string>();
        columns.forEach((col) => {
            col.items.forEach((item) => {
                if (item.assignee) set.add(item.assignee);
            });
        });
        return Array.from(set);
    }, [columns]);

    const priorities = React.useMemo(() => {
        const set = new Set<string>();
        columns.forEach((col) => {
            col.items.forEach((item) => {
                if (item.priority) set.add(item.priority);
            });
        });
        return Array.from(set);
    }, [columns]);

    const statuses = React.useMemo(() => columns.map((col) => ({ key: col.key, title: col.title })), [columns]);
    const overdueCount = React.useMemo(() => {
        const nowTs = Date.now();
        let count = 0;
        columns.forEach((col) => {
            col.items.forEach((item) => {
                if (item.deadline && new Date(item.deadline).getTime() < nowTs) {
                    count += 1;
                }
            });
        });
        return count;
    }, [columns]);

    const timersByCard = React.useMemo(() => {
        try {
            const stored = localStorage.getItem('boardTimers');
            if (stored) {
                return JSON.parse(stored) as Record<string, number>;
            }
        } catch {
            // ignore
        }
        return {};
    }, [history, columns]);

    const columnStats = React.useMemo(() => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayMs = todayStart.getTime();
        const stats: Record<string, { count: number; totalSeconds: number; doneToday?: number }> = {};
        columns.forEach((col) => {
            let totalSeconds = 0;
            let doneToday = 0;
            col.items.forEach((item) => {
                const elapsed = timersByCard[String(item.id)] ?? 0;
                totalSeconds += elapsed;
                if (col.key === 'done') {
                    const events = history[item.id] ?? [];
                    if (events.some((e) => e.action.includes('Concluiu tarefa') && new Date(e.timestamp).getTime() >= todayMs)) {
                        doneToday += 1;
                    }
                }
            });
            stats[col.key] = { count: col.items.length, totalSeconds, doneToday: col.key === 'done' ? doneToday : undefined };
        });
        return stats;
    }, [columns, history, timersByCard]);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm.trim().toLowerCase());
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Carregar checklists e histórico
    React.useEffect(() => {
        try {
            const storedChecklists = localStorage.getItem('boardChecklists');
            if (storedChecklists) {
                setChecklists(JSON.parse(storedChecklists) as Record<string, ChecklistItem[]>);
            } else {
                // cria defaults
                const defaults: Record<string, ChecklistItem[]> = {};
                columns.forEach((col) => {
                    col.items.forEach((item) => {
                        defaults[item.id] = [
                            { id: 1, text: 'Ler requisitos', done: false },
                            { id: 2, text: 'Planejar tarefa', done: false },
                            { id: 3, text: 'Executar', done: false },
                        ];
                    });
                });
                setChecklists(defaults);
            }
        } catch {
            // ignore
        }

        try {
            const storedHistory = localStorage.getItem('boardHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory) as Record<string, HistoryEntry[]>);
            }
        } catch {
            // ignore
        }
    }, []);

    React.useEffect(() => {
        localStorage.setItem('boardChecklists', JSON.stringify(checklists));
    }, [checklists]);

    React.useEffect(() => {
        localStorage.setItem('boardHistory', JSON.stringify(history));
    }, [history]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
            <header className="sticky top-0 z-20 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Board</h1>
            </header>

            <main className="flex-1 overflow-hidden">
                <div className="h-full overflow-x-auto px-6 py-6 space-y-4">
                    <div className="flex flex-col gap-3 bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Filtros</span>
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:underline"
                                >
                                    Limpar filtros
                                </button>
                            </div>

                            <div className="w-full sm:w-72">
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar tarefas…"
                                    className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
                                Responsável
                                <select
                                    value={filters.user ?? ''}
                                    onChange={(e) => handleFilterChange('user', e.target.value)}
                                    className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="">Todos</option>
                                    {assignees.map((user) => (
                                        <option key={user} value={user}>
                                            {user}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
                                Prioridade
                                <select
                                    value={filters.priority ?? ''}
                                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                                    className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="">Todas</option>
                                    {priorities.map((priority) => (
                                        <option key={priority} value={priority}>
                                            {priority}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
                                Status
                                <select
                                    value={filters.status ?? ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="">Todos</option>
                                    {statuses.map((status) => (
                                        <option key={status.key} value={status.key}>
                                            {status.title}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                <input
                                    type="checkbox"
                                    checked={filters.overdue}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, overdue: e.target.checked }))}
                                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 dark:border-white/20 dark:bg-gray-800"
                                />
                                <span className="flex items-center gap-1">
                                    Atrasados
                                    {overdueCount > 0 && (
                                        <span className="inline-flex min-w-[1.5rem] justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200 text-xs font-semibold px-2">
                                            {overdueCount}
                                        </span>
                                    )}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-5 min-w-full">
                        {columns.map((column) => (
                            <BoardColumn
                                key={column.key}
                                title={column.title}
                                items={column.items.filter((item) => {
                                    if (filters.user && item.assignee !== filters.user) return false;
                                    if (filters.priority && item.priority !== filters.priority) return false;
                                    if (filters.status && column.key !== filters.status) return false;
                                    if (filters.overdue) {
                                        if (!item.deadline) return false;
                                        const due = new Date(item.deadline).getTime();
                                        if (due >= Date.now()) return false;
                                    }

                                    if (debouncedSearch) {
                                        const term = debouncedSearch;
                                        const hay = `${item.title} ${item.description}`.toLowerCase();
                                        if (!hay.includes(term)) return false;
                                    }
                                    return true;
                                })}
                                columnKey={column.key}
                                isActiveDrop={activeDropColumn === column.key}
                                activeTaskId={activeTaskId}
                                checklists={column.items.reduce<Record<string, { done: number; total: number }>>((acc, item) => {
                                    const list = checklists[item.id] ?? [];
                                    const done = list.filter((c) => c.done).length;
                                    acc[String(item.id)] = { done, total: list.length || 0 };
                                    return acc;
                                }, {})}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragLeave}
                                onDrop={handleDrop}
                                onDragOver={(event) => handleDragOver(event, column.key)}
                                onDragLeave={handleDragLeave}
                                onCardClick={handleCardClick}
                                onPlayToggle={handlePlayToggle}
                                stats={columnStats[column.key]}
                            />
                        ))}
                    </div>
                </div>
            </main>

            <BoardCardModal
                open={Boolean(selectedCard)}
                card={selectedCard?.card ?? null}
                status={selectedCard?.status}
                onClose={handleCloseModal}
                checklist={selectedCard ? checklists[selectedCard.card.id] ?? [] : []}
                onToggleChecklist={(itemId) =>
                    selectedCard && handleToggleChecklistItem(selectedCard.card.id, itemId)
                }
                history={selectedCard ? history[selectedCard.card.id] ?? [] : []}
                onPriorityChange={(priority) =>
                    selectedCard && handlePriorityChange(selectedCard.card.id, priority)
                }
                onAddTag={(tag) => selectedCard && handleAddTag(selectedCard.card.id, tag)}
                onRemoveTag={(tag) => selectedCard && handleRemoveTag(selectedCard.card.id, tag)}
                isPlaying={selectedCard ? activeTaskId === String(selectedCard.card.id) : false}
                onTogglePlay={(cardId) => handlePlayToggle(cardId)}
                onAddLabel={(label) => selectedCard && handleAddLabel(selectedCard.card.id, label)}
                onRemoveLabel={(label) => selectedCard && handleRemoveLabel(selectedCard.card.id, label)}
                onDeadlineChange={(deadline) => selectedCard && handleDeadlineChange(selectedCard.card.id, deadline)}
                onAddWatcher={(w) => selectedCard && handleAddWatcher(selectedCard.card.id, w)}
                onRemoveWatcher={(w) => selectedCard && handleRemoveWatcher(selectedCard.card.id, w)}
            />
        </div>
    );
};

export default BoardPage;

