import * as React from 'react';
import { TrophyIcon, BoltIcon, HandRaisedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';


export type GamificationPeriodo = '7d' | '30d' | '90d';

export interface GamificationUserStats {
    userId: string;
    nome: string;
    time?: string;
    avatarInicial?: string;
    totalContatos: number;
    contatosIniciados: number;
    tempoMedioRespostaMin: number;
    clientesSemResposta: number;
    resgates: number;
    slaCumpridoPercent: number;
}

export interface GamificationRankingItem extends GamificationUserStats {
    rank: number;
    badges: string[];
}

export interface GamificationActivityPoint {
    data: string;
    totalContatos: number;
    totalRespostas: number;
}

export interface GamificationBadgeDefinition {
    id: string;
    nome: string;
    descricao: string;
    criterioResumo: string;
    icon?: React.ReactNode;
}


export const gamificationBadges: GamificationBadgeDefinition[] = [
    {
        id: 'relampago',
        nome: 'Relâmpago',
        descricao: 'Responde clientes muito rápido.',
        criterioResumo: 'Tempo médio de resposta abaixo de 15 minutos.',
    },
    {
        id: 'salva-cliente',
        nome: 'Salva-cliente',
        descricao: 'Retoma clientes que estavam em atraso.',
        criterioResumo: 'Mais de 3 resgates no período.',
    },
    {
        id: 'guardiao-sla',
        nome: 'Guardião de SLA',
        descricao: 'Mantém praticamente todos os clientes dentro do SLA.',
        criterioResumo: 'SLA acima de 95%.',
    },
    {
        id: 'multicanal',
        nome: 'Multicanal',
        descricao: 'Usa múltiplos canais para atender.',
        criterioResumo: 'Usa pelo menos 3 canais distintos no período.',
    },
];

export const gamificationRankingMock: GamificationRankingItem[] = [
    {
        rank: 1,
        userId: 'gabrielli.melo@simbiox.com',
        nome: 'Gabrielli Melo',
        time: 'Sucesso do Cliente',
        avatarInicial: 'GM',
        totalContatos: 72,
        contatosIniciados: 25,
        tempoMedioRespostaMin: 11,
        clientesSemResposta: 0,
        resgates: 5,
        slaCumpridoPercent: 98,
        badges: ['relampago', 'guardiao-sla', 'salva-cliente'],
    },
    {
        rank: 2,
        userId: 'ana.silva@simbiox.com',
        nome: 'Ana Silva',
        time: 'Suporte',
        avatarInicial: 'AS',
        totalContatos: 54,
        contatosIniciados: 18,
        tempoMedioRespostaMin: 22,
        clientesSemResposta: 1,
        resgates: 2,
        slaCumpridoPercent: 92,
        badges: ['multicanal'],
    },
    {
        rank: 3,
        userId: 'carlos.santos@simbiox.com',
        nome: 'Carlos Santos',
        time: 'Comercial',
        avatarInicial: 'CS',
        totalContatos: 39,
        contatosIniciados: 30,
        tempoMedioRespostaMin: 35,
        clientesSemResposta: 3,
        resgates: 1,
        slaCumpridoPercent: 81,
        badges: [],
    },
];

export const gamificationActivityMock: GamificationActivityPoint[] = [
    { data: '2025-11-10', totalContatos: 18, totalRespostas: 12 },
    { data: '2025-11-11', totalContatos: 24, totalRespostas: 17 },
    { data: '2025-11-12', totalContatos: 30, totalRespostas: 21 },
    { data: '2025-11-13', totalContatos: 22, totalRespostas: 15 },
    { data: '2025-11-14', totalContatos: 27, totalRespostas: 19 },
    { data: '2025-11-15', totalContatos: 35, totalRespostas: 26 },
    { data: '2025-11-16', totalContatos: 29, totalRespostas: 20 },
];


function getAvatarColor(iniciais: string): string {
    const hash = iniciais.charCodeAt(0) + (iniciais.charCodeAt(1) || 0);
    const colors = [
        'bg-red-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-orange-500',
    ];
    return colors[hash % colors.length];
}

function getBadgeColor(badgeId: string): string {
    switch (badgeId) {
        case 'relampago':
            return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
        case 'salva-cliente':
            return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
        case 'guardiao-sla':
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
        case 'multicanal':
            return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
        default:
            return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
}

function getTempoColor(tempoMin: number): string {
    if (tempoMin <= 15) return 'text-green-600 dark:text-green-400';
    if (tempoMin <= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
}


interface HighlightCardsProps {
    ranking: GamificationRankingItem[];
}

const HighlightCards: React.FC<HighlightCardsProps> = ({ ranking }) => {
    const topVolume = ranking[0];
    const topRapido = [...ranking].sort((a, b) => a.tempoMedioRespostaMin - b.tempoMedioRespostaMin)[0];
    const topResgates = [...ranking].sort((a, b) => b.resgates - a.resgates)[0];
    const topZeroAtrasos = [...ranking].filter((r) => r.clientesSemResposta === 0).sort((a, b) => b.totalContatos - a.totalContatos)[0];

    const cards = [
        {
            title: 'Top Volume',
            user: topVolume.nome,
            value: topVolume.totalContatos,
            unit: 'contatos',
            icon: TrophyIcon,
            color: 'from-amber-500 to-orange-500',
        },
        {
            title: 'Relâmpago',
            user: topRapido.nome,
            value: topRapido.tempoMedioRespostaMin,
            unit: 'min',
            icon: BoltIcon,
            color: 'from-yellow-500 to-yellow-600',
        },
        {
            title: 'Salva-cliente',
            user: topResgates.nome,
            value: topResgates.resgates,
            unit: 'resgates',
            icon: HandRaisedIcon,
            color: 'from-red-500 to-pink-500',
        },
    ];

    if (topZeroAtrasos) {
        cards.push({
            title: 'Zero Atrasos',
            user: topZeroAtrasos.nome,
            value: topZeroAtrasos.totalContatos,
            unit: 'contatos',
            icon: CheckCircleIcon,
            color: 'from-green-500 to-emerald-500',
        });
    }

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => (
                <div key={idx} className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${card.color} p-6 text-white`}>
                    <div className="relative z-10">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold opacity-90">{card.title}</h3>
                            <card.icon className="size-5 opacity-70" />
                        </div>
                        <div className="mb-2">
                            <p className="text-3xl font-bold">{card.value}</p>
                            <p className="text-xs opacity-80">{card.unit}</p>
                        </div>
                        <p className="text-sm font-medium">{card.user}</p>
                    </div>
                    <div className="absolute right-0 top-0 size-20 rounded-full bg-white/10" />
                </div>
            ))}
        </div>
    );
};


interface RankingTableProps {
    ranking: GamificationRankingItem[];
}

const RankingTable: React.FC<RankingTableProps> = ({ ranking }) => {
    return (
        <div className="rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-12">
                                #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Usuário
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Iniciados
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Tempo médio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Sem resposta
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Resgates
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                SLA
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                        {ranking.map((user) => (
                            <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td className="px-6 py-4 text-sm font-bold text-center text-gray-900 dark:text-white">
                                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex size-9 items-center justify-center rounded-full text-white font-semibold text-xs ${getAvatarColor(user.avatarInicial || '')}`}>
                                            {user.avatarInicial}
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">{user.nome}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {user.time || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    {user.totalContatos}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {user.contatosIniciados}
                                </td>
                                <td className={`px-6 py-4 text-sm font-medium ${getTempoColor(user.tempoMedioRespostaMin)}`}>
                                    {user.tempoMedioRespostaMin}m
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {user.clientesSemResposta > 0 ? (
                                        <span className="inline-flex rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-semibold text-red-800 dark:text-red-300">
                                            {user.clientesSemResposta}
                                        </span>
                                    ) : (
                                        <span className="inline-flex rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-semibold text-green-800 dark:text-green-300">
                                            0
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold">
                                    {user.resgates}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${user.slaCumpridoPercent >= 95
                                                    ? 'bg-green-500'
                                                    : user.slaCumpridoPercent >= 85
                                                        ? 'bg-yellow-500'
                                                        : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${user.slaCumpridoPercent}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                            {user.slaCumpridoPercent}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


interface BarChartProps {
    ranking: GamificationRankingItem[];
}

const BarChart: React.FC<BarChartProps> = ({ ranking }) => {
    const top5 = ranking.slice(0, 5);
    const maxValue = Math.max(...top5.map((r) => r.totalContatos));

    return (
        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Top 5 por Volume de Contatos
            </h3>
            <div className="space-y-4">
                {top5.map((user) => (
                    <div key={user.userId} className="flex items-center gap-4">
                        <div className="w-32">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                {user.nome}
                            </p>
                        </div>
                        <div className="flex-1">
                            <div className="h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 transition-all" style={{ width: `${(user.totalContatos / maxValue) * 100}%` }} />
                        </div>
                        <div className="w-16 text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {user.totalContatos}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


interface LineChartProps {
    data: GamificationActivityPoint[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.map((p) => p.totalContatos));
    const minValue = Math.min(...data.map((p) => p.totalContatos));
    const range = maxValue - minValue || 1;

    const getHeight = (value: number) => {
        return ((value - minValue) / range) * 100;
    };

    return (
        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Atividade por Dia
            </h3>
            <div className="flex items-end justify-between gap-2 h-48">
                {data.map((point, idx) => {
                    const date = new Date(point.data);
                    const day = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' });

                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                            <div className="relative w-full flex items-end justify-center h-32">
                                <div
                                    className="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-indigo-500 to-indigo-400 transition-all hover:from-indigo-600 hover:to-indigo-500 cursor-pointer group-hover:shadow-lg"
                                    style={{ height: `${getHeight(point.totalContatos)}%` }}
                                    title={`${point.data}: ${point.totalContatos} contatos`}
                                />
                            </div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
                                {day.split(' ')[0]}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {point.totalContatos}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export const Gamification: React.FC = () => {
    const [periodo, setPeriodo] = React.useState<GamificationPeriodo>('7d');

    const periodLabels: Record<GamificationPeriodo, string> = {
        '7d': 'Últimos 7 dias',
        '30d': 'Últimos 30 dias',
        '90d': 'Últimos 90 dias',
    };

    const selectedUserData = gamificationRankingMock[0];

    return (
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
            {/* Header */}
            <header className="border-b border-gray-200 dark:border-white/5 bg-white dark:bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Gamificação
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Ranking e desempenho do time em comunicações com clientes
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {(['7d', '30d', '90d'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriodo(p)}
                                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${periodo === p
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {periodLabels[p]}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="px-4 py-6 sm:px-6 lg:px-8 space-y-8">
                {/* Highlight Cards */}
                <section>
                    <HighlightCards ranking={gamificationRankingMock} />
                </section>

                {/* Ranking + Chart */}
                <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Ranking de Usuários
                        </h2>
                        <RankingTable ranking={gamificationRankingMock} />
                    </div>
                    <div>
                        <BarChart ranking={gamificationRankingMock} />
                    </div>
                </section>

                {/* Activity + Badges */}
                <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <LineChart data={gamificationActivityMock} />
                    </div>

                    {/* Badges */}
                    <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Badges de {selectedUserData.nome}
                        </h3>
                        {selectedUserData.badges.length > 0 ? (
                            <div className="space-y-3">
                                {selectedUserData.badges.map((badgeId) => {
                                    const badge = gamificationBadges.find((b) => b.id === badgeId);
                                    if (!badge) return null;
                                    return (
                                        <div key={badgeId} className={`rounded-lg ${getBadgeColor(badgeId)} p-4`}>
                                            <p className="font-semibold text-sm mb-1">{badge.nome}</p>
                                            <p className="text-xs opacity-80">{badge.criterioResumo}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Nenhuma badge conquistada ainda.
                            </p>
                        )}

                        {/* All Badges Reference */}
                        <div className="mt-6 border-t border-gray-200 dark:border-white/5 pt-6">
                            <p className="mb-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                Todas as badges
                            </p>
                            <div className="space-y-2">
                                {gamificationBadges.map((badge) => (
                                    <div key={badge.id} className="text-xs text-gray-600 dark:text-gray-400">
                                        <p className="font-medium text-gray-900 dark:text-white">{badge.nome}</p>
                                        <p>{badge.criterioResumo}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Gamification;
