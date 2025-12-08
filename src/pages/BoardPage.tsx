import * as React from 'react';
import BoardColumn, { BoardItem } from './BoardColumn';
import BoardCardModal from './BoardCardModal';

interface ColumnConfig {
    key: string;
    title: string;
    items: BoardItem[];
}

const initialColumns: ColumnConfig[] = [
    {
        key: 'backlog',
        title: 'Backlog',
        items: [
            { id: 1, title: 'Mapear requisitos iniciais', description: 'Entrevistar stakeholders e alinhar escopo' },
            { id: 2, title: 'Desenhar visão de produto', description: 'Definir metas e indicadores-chave' },
        ],
    },
    {
        key: 'todo',
        title: 'A Fazer',
        items: [
            { id: 3, title: 'Briefing visual', description: 'Guidelines de cores e componentes base' },
            { id: 4, title: 'Checklist de integrações', description: 'Listar APIs e autenticação necessária' },
        ],
    },
    {
        key: 'doing',
        title: 'Fazendo',
        items: [
            { id: 5, title: 'Implementar onboarding', description: 'Fluxo inicial e tour guiado', assignee: 'Ana' },
            { id: 6, title: 'Montar layout responsivo', description: 'Grids e breakpoints principais', assignee: 'João' },
        ],
    },
    {
        key: 'waiting',
        title: 'Aguardando',
        items: [
            { id: 7, title: 'Aprovação jurídica', description: 'Revisar termos e políticas' },
            { id: 8, title: 'Validação de dados', description: 'Aguardando base de testes' },
        ],
    },
    {
        key: 'done',
        title: 'Concluído',
        items: [
            { id: 9, title: 'Setup do repositório', description: 'Branches, PR template e lint configurados' },
            { id: 10, title: 'CI inicial', description: 'Pipeline de build e testes unitários' },
        ],
    },
];

const BoardPage: React.FC = () => {
    const [columns, setColumns] = React.useState<ColumnConfig[]>(initialColumns);
    const [activeDropColumn, setActiveDropColumn] = React.useState<string | null>(null);
    const [activeTaskId, setActiveTaskId] = React.useState<string | null>(null);
    const [selectedCard, setSelectedCard] = React.useState<{ card: BoardItem; status: string } | null>(null);

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

    const handleDrop = (event: React.DragEvent, toColumnKey: string) => {
        event.preventDefault();
        const payload = event.dataTransfer.getData('application/json');
        setActiveDropColumn(null);

        if (!payload) return;

        try {
            const { cardId, fromColumnKey } = JSON.parse(payload) as { cardId: number; fromColumnKey: string };
            if (!cardId || !fromColumnKey) return;

            setColumns((prev) => {
                const sourceIndex = prev.findIndex((col) => col.key === fromColumnKey);
                const targetIndex = prev.findIndex((col) => col.key === toColumnKey);
                if (sourceIndex === -1 || targetIndex === -1) return prev;

                const card = prev[sourceIndex].items.find((item) => item.id === cardId);
                if (!card) return prev;

                // Caso arraste para a mesma coluna, apenas mantém a posição atual
                if (fromColumnKey === toColumnKey) return prev;

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

                return updatedColumns;
            });
        } catch (_err) {
            // ignora payload inválido
            return;
        }
    };

    const handleCardClick = (card: BoardItem, status: string) => {
        setSelectedCard({ card, status });
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };

    const handlePlayToggle = (cardId: number) => {
        const cardKey = String(cardId);

        if (!activeTaskId) {
            setActiveTaskId(cardKey);
            return;
        }

        if (activeTaskId === cardKey) {
            setActiveTaskId(null);
            return;
        }

        setActiveTaskId(cardKey);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
            <header className="sticky top-0 z-20 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Board</h1>
            </header>

            <main className="flex-1 overflow-hidden">
                <div className="h-full overflow-x-auto px-6 py-6">
                    <div className="flex gap-4 min-w-full">
                        {columns.map((column) => (
                            <BoardColumn
                                key={column.key}
                                title={column.title}
                                items={column.items}
                                columnKey={column.key}
                                isActiveDrop={activeDropColumn === column.key}
                                activeTaskId={activeTaskId}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragLeave}
                                onDrop={handleDrop}
                                onDragOver={(event) => handleDragOver(event, column.key)}
                                onDragLeave={handleDragLeave}
                                onCardClick={handleCardClick}
                                onPlayToggle={handlePlayToggle}
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
            />
        </div>
    );
};

export default BoardPage;

