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
    const [columnSorts, setColumnSorts] = React.useState<Record<string, { field: string; direction: 'asc' | 'desc' }>>({});
    const [groupBy, setGroupBy] = React.useState<'column' | 'assignee'>('column');
    const [isDragging, setIsDragging] = React.useState(false);
    const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
    const scrollIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
    const lastSelectedRef = React.useRef<{ columnKey: string; index: number } | null>(null);
    const [bulkMoveTarget, setBulkMoveTarget] = React.useState<string>('todo');
    const [bulkPriority, setBulkPriority] = React.useState<string>('alta');
    const [bulkTag, setBulkTag] = React.useState<string>('');

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

    const handleDragStart = (event: React.DragEvent, cardId: number, fromColumnKey: string) => {
        const idsToDrag = selectedIds.includes(cardId) ? selectedIds : [cardId];
        const fromColumns: Record<number, string> = {};
        columns.forEach((col) => {
            col.items.forEach((item) => {
                if (idsToDrag.includes(item.id)) {
                    fromColumns[item.id] = col.key;
                }
            });
        });

        event.dataTransfer.setData(
            'application/json',
            JSON.stringify({ cardIds: idsToDrag, fromColumnKey, fromColumns }),
        );
        event.dataTransfer.effectAllowed = 'move';
        setIsDragging(true);
    };

    const handleDragOver = (event: React.DragEvent, columnKey: string) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setActiveDropColumn(columnKey);
    };

    const handleDragLeave = () => {
        setActiveDropColumn(null);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setActiveDropColumn(null);
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };

    const handleBulkMove = (targetKey: string) => {
        if (!targetKey || selectedIds.length === 0) return;
        if (targetKey === 'done') {
            const confirmFinish = window.confirm('Deseja marcar todos os selecionados como concluídos?');
            if (!confirmFinish) return;
        }

        setColumns((prev) => {
            const selectedSet = new Set(selectedIds);
            const movingItems: BoardItem[] = [];
            const stripped = prev.map((col) => {
                const remaining = col.items.filter((item) => {
                    if (selectedSet.has(item.id)) {
                        movingItems.push(item);
                        return false;
                    }
                    return true;
                });
                return { ...col, items: remaining };
            });

            const targetIdx = stripped.findIndex((col) => col.key === targetKey);
            if (targetIdx === -1) return prev;

            const targetCol = stripped[targetIdx];
            const updatedTarget = { ...targetCol, items: [...targetCol.items, ...movingItems] };
            const next = stripped.map((col, idx) => (idx === targetIdx ? updatedTarget : col));

            movingItems.forEach((item) => {
                pushHistory(item.id, `Moveu para ${updatedTarget.title}`);
                if (targetKey === 'done') {
                    pushHistory(item.id, 'Concluiu tarefa');
                }
            });
            return next;
        });

        setSelectedIds([]);
    };

    const handleBulkPriorityChange = (priority: string) => {
        if (!priority) return;
        const selectedSet = new Set(selectedIds);
        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                items: col.items.map((item) =>
                    selectedSet.has(item.id) ? { ...item, priority } : item
                ),
            }))
        );
        setSelectedCard((prev) =>
            prev && selectedSet.has(prev.card.id) ? { ...prev, card: { ...prev.card, priority } } : prev
        );
    };

    const handleBulkTagApply = () => {
        const tag = bulkTag.trim();
        if (!tag) return;
        const selectedSet = new Set(selectedIds);
        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                items: col.items.map((item) =>
                    selectedSet.has(item.id)
                        ? { ...item, tags: item.tags ? Array.from(new Set([...item.tags, tag])) : [tag] }
                        : item
                ),
            }))
        );
        setSelectedCard((prev) =>
            prev && selectedSet.has(prev.card.id)
                ? {
                    ...prev,
                    card: {
                        ...prev.card,
                        tags: prev.card.tags ? Array.from(new Set([...prev.card.tags, tag])) : [tag],
                    },
                }
                : prev
        );
        setBulkTag('');
    };

    const handleBulkMarkDone = () => handleBulkMove('done');

    // Scroll automático ao aproximar da borda
    React.useEffect(() => {
        if (!isDragging || !scrollContainerRef.current) {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
                scrollIntervalRef.current = null;
            }
            return;
        }

        const container = scrollContainerRef.current;
        const scrollThreshold = 100; // pixels da borda para iniciar scroll
        const scrollSpeed = 10; // pixels por intervalo

        const handleMouseMove = (e: MouseEvent) => {
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Verificar proximidade das bordas
            const nearLeft = mouseX - rect.left < scrollThreshold;
            const nearRight = rect.right - mouseX < scrollThreshold;
            const nearTop = mouseY - rect.top < scrollThreshold;
            const nearBottom = rect.bottom - mouseY < scrollThreshold;

            // Limpar intervalo anterior
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
                scrollIntervalRef.current = null;
            }

            // Iniciar scroll se próximo da borda
            if (nearLeft || nearRight || nearTop || nearBottom) {
                scrollIntervalRef.current = setInterval(() => {
                    if (!container) return;

                    const currentRect = container.getBoundingClientRect();
                    const currentMouseX = e.clientX;
                    const currentMouseY = e.clientY;

                    if (currentMouseX - currentRect.left < scrollThreshold) {
                        container.scrollLeft -= scrollSpeed;
                    } else if (currentRect.right - currentMouseX < scrollThreshold) {
                        container.scrollLeft += scrollSpeed;
                    }

                    if (currentMouseY - currentRect.top < scrollThreshold) {
                        container.scrollTop -= scrollSpeed;
                    } else if (currentRect.bottom - currentMouseY < scrollThreshold) {
                        container.scrollTop += scrollSpeed;
                    }
                }, 16); // ~60fps
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
                scrollIntervalRef.current = null;
            }
        };
    }, [isDragging]);

    const handleDrop = (event: React.DragEvent, toColumnKey: string) => {
        event.preventDefault();
        const payload = event.dataTransfer.getData('application/json');
        setActiveDropColumn(null);
        setIsDragging(false);
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }

        if (!payload) return;

        try {
            const parsed = JSON.parse(payload) as { cardId?: number; fromColumnKey?: string; cardIds?: number[]; fromColumns?: Record<number, string> };
            const cardIds = parsed.cardIds ?? (parsed.cardId ? [parsed.cardId] : []);
            const fromColumns = parsed.fromColumns ?? {};
            if (cardIds.length === 0) return;

            if (toColumnKey === 'done') {
                const confirmFinish = window.confirm('Deseja realmente marcar as tarefas como concluídas?');
                if (!confirmFinish) return;
            }

            setColumns((prev) => {
                const movingSet = new Set(cardIds);
                const movingItems: { item: BoardItem; fromKey: string }[] = [];

                const stripped = prev.map((col) => {
                    const remaining = col.items.filter((item) => {
                        if (movingSet.has(item.id)) {
                            movingItems.push({ item, fromKey: fromColumns[item.id] ?? col.key });
                            return false;
                        }
                        return true;
                    });
                    return { ...col, items: remaining };
                });

                const targetIndex = stripped.findIndex((col) => col.key === toColumnKey);
                if (targetIndex === -1) return prev;

                const targetCol = stripped[targetIndex];
                const updatedTarget = { ...targetCol, items: [...targetCol.items, ...movingItems.map((m) => m.item)] };
                const next = stripped.map((col, idx) => (idx === targetIndex ? updatedTarget : col));

                movingItems.forEach((m) => {
                    pushHistory(m.item.id, `Moveu para ${updatedTarget.title}`);
                    if (toColumnKey === 'done') {
                        pushHistory(m.item.id, 'Concluiu tarefa');
                    }
                });

                return next;
            });
        } catch (_err) {
            // ignora payload inválido
            return;
        }
    };

    const handleCardClick = (
        card: BoardItem,
        columnKey: string,
        status: string,
        event: React.MouseEvent,
        index: number,
        visibleItems: BoardItem[],
    ) => {
        const isToggle = event.ctrlKey || event.metaKey;
        const isRange = event.shiftKey;

        if (isRange && lastSelectedRef.current && lastSelectedRef.current.columnKey === columnKey) {
            const start = Math.min(lastSelectedRef.current.index, index);
            const end = Math.max(lastSelectedRef.current.index, index);
            const rangeIds = visibleItems.slice(start, end + 1).map((i) => i.id);
            setSelectedIds((prev) => Array.from(new Set([...prev, ...rangeIds])));
            lastSelectedRef.current = { columnKey, index };
            return;
        }

        if (isToggle) {
            setSelectedIds((prev) =>
                prev.includes(card.id) ? prev.filter((id) => id !== card.id) : [...prev, card.id],
            );
            lastSelectedRef.current = { columnKey, index };
            return;
        }

        setSelectedIds([]);
        lastSelectedRef.current = { columnKey, index };
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

    const handleSortChange = (columnKey: string, field: string) => {
        setColumnSorts((prev) => {
            const current = prev[columnKey];
            if (current?.field === field) {
                return {
                    ...prev,
                    [columnKey]: { field, direction: current.direction === 'asc' ? 'desc' : 'asc' },
                };
            }
            return {
                ...prev,
                [columnKey]: { field, direction: 'asc' },
            };
        });
    };

    const sortItems = (items: BoardItem[], columnKey: string, timers: Record<string, number>): BoardItem[] => {
        const sort = columnSorts[columnKey];
        if (!sort) return items;

        const sorted = [...items].sort((a, b) => {
            let aVal: any;
            let bVal: any;

            switch (sort.field) {
                case 'priority': {
                    const priorityOrder: Record<string, number> = { urgente: 4, alta: 3, media: 2, baixa: 1 };
                    aVal = priorityOrder[a.priority ?? ''] ?? 0;
                    bVal = priorityOrder[b.priority ?? ''] ?? 0;
                    break;
                }
                case 'deadline':
                    aVal = a.deadline ? new Date(a.deadline).getTime() : Infinity;
                    bVal = b.deadline ? new Date(b.deadline).getTime() : Infinity;
                    break;
                case 'time':
                    aVal = timers[String(a.id)] ?? 0;
                    bVal = timers[String(b.id)] ?? 0;
                    break;
                case 'title':
                    aVal = a.title.toLowerCase();
                    bVal = b.title.toLowerCase();
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
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

    const cardIndexById = React.useMemo(() => {
        const map = new Map<number, BoardItem>();
        columns.forEach((col) => {
            col.items.forEach((item) => {
                map.set(item.id, item);
            });
        });
        return map;
    }, [columns]);

    const todayMetrics = React.useMemo(() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const todayMs = start.getTime();

        let createdToday = 0;
        let doneToday = 0;
        const productivity: Record<string, number> = {};

        Object.entries(history).forEach(([cardId, list]) => {
            list.forEach((entry) => {
                const ts = new Date(entry.timestamp).getTime();
                if (ts >= todayMs) {
                    if (entry.action.toLowerCase().includes('concluiu tarefa')) {
                        doneToday += 1;
                        const card = cardIndexById.get(Number(cardId));
                        const assignee = card?.assignee ?? 'Sem responsável';
                        productivity[assignee] = (productivity[assignee] ?? 0) + 1;
                    }
                    if (entry.action.toLowerCase().includes('criou')) {
                        createdToday += 1;
                    }
                }
            });
        });

        const totalSeconds = Object.values(timersByCard).reduce((acc, val) => acc + (val ?? 0), 0);
        const topUsers = Object.entries(productivity)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([user, score]) => ({ user, score }));

        return { createdToday, doneToday, totalSeconds, overdueCount, topUsers };
    }, [cardIndexById, history, overdueCount, timersByCard]);

    const formatShortTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m`;
    };

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

                        <div className="flex flex-wrap items-end gap-3">
                            <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
                                Agrupar por
                                <select
                                    value={groupBy}
                                    onChange={(e) => setGroupBy(e.target.value as 'column' | 'assignee')}
                                    className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="column">Agrupar por coluna (padrão)</option>
                                    <option value="assignee">Agrupar por responsável</option>
                                </select>
                            </label>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur p-4">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Tarefas criadas hoje</p>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{todayMetrics.createdToday}</p>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Somente visual</p>
                        </div>
                        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur p-4">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Tarefas concluídas hoje</p>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{todayMetrics.doneToday}</p>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Baseado em histórico local</p>
                        </div>
                        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur p-4">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Tempo trabalhado hoje</p>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{formatShortTime(todayMetrics.totalSeconds)}</p>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Somente local</p>
                        </div>
                        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur p-4">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Tarefas atrasadas</p>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{todayMetrics.overdueCount}</p>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Com base no prazo</p>
                        </div>
                        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur p-4">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Top 3 usuários (fake)</p>
                            <div className="mt-2 space-y-1 text-sm text-neutral-800 dark:text-neutral-100">
                                {todayMetrics.topUsers.length === 0 && (
                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Sem dados hoje</p>
                                )}
                                {todayMetrics.topUsers.map((u, idx) => (
                                    <div key={u.user} className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-2">
                                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-100">
                                                {u.user.charAt(0).toUpperCase()}
                                            </span>
                                            <span>{u.user}</span>
                                        </span>
                                        <span className="text-[12px] text-indigo-600 dark:text-indigo-300 font-semibold">+{u.score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-5 min-w-full overflow-x-auto" ref={scrollContainerRef}>
                        {columns.map((column) => {
                            const filteredItems = column.items.filter((item) => {
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
                            });
                            const sortedItems = sortItems(filteredItems, column.key, timersByCard);
                            return (
                                <BoardColumn
                                    key={column.key}
                                    title={column.title}
                                    items={sortedItems}
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
                                    onDragEnd={handleDragEnd}
                                    onDrop={handleDrop}
                                    onDragOver={(event) => handleDragOver(event, column.key)}
                                    onDragLeave={handleDragLeave}
                                    onCardClick={handleCardClick}
                                    onPlayToggle={handlePlayToggle}
                                    stats={columnStats[column.key]}
                                    sortConfig={columnSorts[column.key]}
                                    onSortChange={handleSortChange}
                                    groupBy={groupBy}
                                    isDragging={isDragging}
                                    selectedIds={selectedIds}
                                />
                            );
                        })}
                    </div>
                </div>
                {selectedIds.length > 0 && (
                    <div className="fixed bottom-4 right-4 z-40 w-[340px] rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/90 backdrop-blur shadow-lg shadow-black/10 dark:shadow-black/30 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                                {selectedIds.length} selecionado(s)
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedIds([])}
                                className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white"
                            >
                                Limpar
                            </button>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex gap-2">
                                <select
                                    value={bulkMoveTarget}
                                    onChange={(e) => setBulkMoveTarget(e.target.value)}
                                    className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100"
                                >
                                    {columns.map((col) => (
                                        <option key={col.key} value={col.key}>
                                            Mover para {col.title}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => handleBulkMove(bulkMoveTarget)}
                                    className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-xs font-semibold hover:bg-indigo-700 transition"
                                >
                                    Mover
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={bulkPriority}
                                    onChange={(e) => setBulkPriority(e.target.value)}
                                    className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100"
                                >
                                    <option value="alta">Prioridade: Alta</option>
                                    <option value="media">Prioridade: Média</option>
                                    <option value="baixa">Prioridade: Baixa</option>
                                    <option value="urgente">Prioridade: Urgente</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => handleBulkPriorityChange(bulkPriority)}
                                    className="rounded-lg bg-neutral-900 text-white px-3 py-2 text-xs font-semibold hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition"
                                >
                                    Aplicar
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={bulkTag}
                                    onChange={(e) => setBulkTag(e.target.value)}
                                    placeholder="Tag para aplicar"
                                    className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100"
                                />
                                <button
                                    type="button"
                                    onClick={handleBulkTagApply}
                                    className="rounded-lg bg-neutral-200 text-neutral-800 px-3 py-2 text-xs font-semibold hover:bg-neutral-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 transition"
                                >
                                    Tag
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={handleBulkMarkDone}
                                className="w-full rounded-lg bg-green-600 text-white px-3 py-2 text-sm font-semibold hover:bg-green-700 transition"
                            >
                                Marcar como concluído
                            </button>
                        </div>
                    </div>
                )}
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

