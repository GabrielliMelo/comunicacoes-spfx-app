import * as React from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon, UsersIcon } from '@heroicons/react/24/outline';


export type InsightsPeriodo = '7d' | '30d' | '90d';
export type CanalComunicacao = 'email' | 'teams' | 'outro';
export type PapelPessoa = 'Analista' | 'Dev' | 'Hibrido';
export type HealthClassificacao = 'Verde' | 'Amarelo' | 'Vermelho';

export interface InsightsOverview {
    periodo: InsightsPeriodo;
    totalComunicacoes: number;
    totalClientesAtendidos: number;
    tempoMedioRespostaMin: number;
    slaCumpridoPercent: number;
    pctIniciadasPeloTime: number;
    pctIniciadasPeloCliente: number;
}

export interface InsightsChannelStats {
    canal: CanalComunicacao;
    totalMensagens: number;
    percentualDoTotal: number;
    tempoMedioRespostaMin: number;
    slaCumpridoPercent: number;
}

export interface InsightsPessoaRelacionada {
    userId: string;
    nome: string;
    papelPrincipal: PapelPessoa;
    time?: string;
    totalComunicacoes: number;
    comunicacoesIniciadas: number;
    tempoMedioRespostaMin: number;
    clientesSobResponsabilidade: number;
    clientesComAtraso: number;
    clientesSemResposta: number;
    canaisMaisUsados: CanalComunicacao[];
}

export interface InsightsClienteRisco {
    clienteId: number;
    nomeCliente: string;
    prioridade: 'Baixa' | 'Média' | 'Alta' | 'Estratégico';
    healthClassificacao: HealthClassificacao;
    healthScore: number;
    motivoPrincipal?: string;
    tempoMedioRespostaMin: number;
    qtdAtrasosPeriodo: number;
    qtdSemRespostaPeriodo: number;
    principaisPessoasEnvolvidas: string[];
    canalPredominante: CanalComunicacao;
}

export interface InsightsCasoAtraso {
    idComunicacao: number;
    clienteNome: string;
    responsavelPrincipal: string;
    canal: CanalComunicacao;
    atrasoHoras: number;
    dataUltimaMensagem: string;
}


export const insightsOverviewMock: InsightsOverview = {
    periodo: '30d',
    totalComunicacoes: 420,
    totalClientesAtendidos: 18,
    tempoMedioRespostaMin: 23,
    slaCumpridoPercent: 91,
    pctIniciadasPeloTime: 55,
    pctIniciadasPeloCliente: 45,
};

export const insightsChannelsMock: InsightsChannelStats[] = [
    {
        canal: 'email',
        totalMensagens: 260,
        percentualDoTotal: 62,
        tempoMedioRespostaMin: 28,
        slaCumpridoPercent: 88,
    },
    {
        canal: 'teams',
        totalMensagens: 130,
        percentualDoTotal: 31,
        tempoMedioRespostaMin: 17,
        slaCumpridoPercent: 95,
    },
    {
        canal: 'outro',
        totalMensagens: 30,
        percentualDoTotal: 7,
        tempoMedioRespostaMin: 40,
        slaCumpridoPercent: 80,
    },
];

export const insightsPessoasMock: InsightsPessoaRelacionada[] = [
    {
        userId: 'gabrielli.melo@simbiox.com',
        nome: 'Gabrielli Melo',
        papelPrincipal: 'Analista',
        time: 'Sucesso do Cliente',
        totalComunicacoes: 150,
        comunicacoesIniciadas: 60,
        tempoMedioRespostaMin: 12,
        clientesSobResponsabilidade: 6,
        clientesComAtraso: 0,
        clientesSemResposta: 0,
        canaisMaisUsados: ['email', 'teams'],
    },
    {
        userId: 'ana.silva@simbiox.com',
        nome: 'Ana Silva',
        papelPrincipal: 'Analista',
        time: 'Suporte',
        totalComunicacoes: 120,
        comunicacoesIniciadas: 40,
        tempoMedioRespostaMin: 27,
        clientesSobResponsabilidade: 5,
        clientesComAtraso: 2,
        clientesSemResposta: 1,
        canaisMaisUsados: ['teams'],
    },
    {
        userId: 'carlos.santos@simbiox.com',
        nome: 'Carlos Santos',
        papelPrincipal: 'Dev',
        time: 'Squad Integrações',
        totalComunicacoes: 60,
        comunicacoesIniciadas: 30,
        tempoMedioRespostaMin: 35,
        clientesSobResponsabilidade: 3,
        clientesComAtraso: 1,
        clientesSemResposta: 0,
        canaisMaisUsados: ['email'],
    },
];

export const insightsClientesRiscoMock: InsightsClienteRisco[] = [
    {
        clienteId: 2,
        nomeCliente: 'Cliente Beta',
        prioridade: 'Alta',
        healthClassificacao: 'Vermelho',
        healthScore: 55,
        motivoPrincipal: 'Múltiplos atrasos e tempo de resposta alto.',
        tempoMedioRespostaMin: 48,
        qtdAtrasosPeriodo: 5,
        qtdSemRespostaPeriodo: 2,
        principaisPessoasEnvolvidas: ['Ana Silva', 'Carlos Santos'],
        canalPredominante: 'email',
    },
    {
        clienteId: 3,
        nomeCliente: 'Cliente Gama',
        prioridade: 'Média',
        healthClassificacao: 'Amarelo',
        healthScore: 68,
        motivoPrincipal: 'Alguns atendimentos fora do SLA.',
        tempoMedioRespostaMin: 32,
        qtdAtrasosPeriodo: 2,
        qtdSemRespostaPeriodo: 0,
        principaisPessoasEnvolvidas: ['Gabrielli Melo'],
        canalPredominante: 'teams',
    },
];

export const insightsCasosAtrasoMock: InsightsCasoAtraso[] = [
    {
        idComunicacao: 101,
        clienteNome: 'Cliente Beta',
        responsavelPrincipal: 'Ana Silva',
        canal: 'email',
        atrasoHoras: 16,
        dataUltimaMensagem: '2025-11-10T15:40:00Z',
    },
    {
        idComunicacao: 102,
        clienteNome: 'Cliente Gama',
        responsavelPrincipal: 'Carlos Santos',
        canal: 'email',
        atrasoHoras: 9,
        dataUltimaMensagem: '2025-11-12T11:15:00Z',
    },
    {
        idComunicacao: 103,
        clienteNome: 'Cliente Beta',
        responsavelPrincipal: 'Ana Silva',
        canal: 'teams',
        atrasoHoras: 7,
        dataUltimaMensagem: '2025-11-14T09:20:00Z',
    },
    {
        idComunicacao: 104,
        clienteNome: 'Cliente Beta',
        responsavelPrincipal: 'Carlos Santos',
        canal: 'email',
        atrasoHoras: 5,
        dataUltimaMensagem: '2025-11-15T16:30:00Z',
    },
    {
        idComunicacao: 105,
        clienteNome: 'Cliente Gama',
        responsavelPrincipal: 'Gabrielli Melo',
        canal: 'email',
        atrasoHoras: 3,
        dataUltimaMensagem: '2025-11-16T10:15:00Z',
    },
];


function getHealthColor(classificacao: HealthClassificacao): string {
    switch (classificacao) {
        case 'Verde':
            return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
        case 'Amarelo':
            return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
        case 'Vermelho':
            return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
        default:
            return '';
    }
}

function getHealthBgColor(classificacao: HealthClassificacao): string {
    switch (classificacao) {
        case 'Verde':
            return 'bg-green-500';
        case 'Amarelo':
            return 'bg-yellow-500';
        case 'Vermelho':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
}

function getCanaisMaisUsadosLabel(canais: CanalComunicacao[]): string {
    return canais.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(', ');
}


interface OverviewCardsProps {
    data: InsightsOverview;
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ data }) => {
    const cards = [
        {
            label: 'Total de contatos',
            value: data.totalComunicacoes,
            unit: 'comunicações',
            icon: ArrowTrendingUpIcon,
        },
        {
            label: 'Tempo médio de resposta',
            value: data.tempoMedioRespostaMin,
            unit: 'minutos',
            icon: CheckCircleIcon,
        },
        {
            label: 'Comunicações dentro do SLA',
            value: data.slaCumpridoPercent,
            unit: '%',
            icon: CheckCircleIcon,
        },
        {
            label: 'Iniciadas pelo time',
            value: data.pctIniciadasPeloTime,
            unit: '%',
            icon: UsersIcon,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {card.label}
                            </p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {card.value}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {card.unit}
                                </p>
                            </div>
                        </div>
                        <card.icon className="size-5 text-gray-400 dark:text-gray-600" />
                    </div>
                </div>
            ))}
        </div>
    );
};


interface ChannelsProps {
    data: InsightsChannelStats[];
}

const ChannelsBlock: React.FC<ChannelsProps> = ({ data }) => {
    const maxMensagens = Math.max(...data.map((d) => d.totalMensagens));

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Table */}
            <div className="lg:col-span-2">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Canais de Comunicação
                </h3>
                <div className="rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Canal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        % do Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Tempo médio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        SLA %
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                {data.map((channel) => (
                                    <tr key={channel.canal} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                            {channel.canal.charAt(0).toUpperCase() + channel.canal.slice(1)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {channel.totalMensagens}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {channel.percentualDoTotal}%
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {channel.tempoMedioRespostaMin}m
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                    <div
                                                        className={`h-1.5 rounded-full ${channel.slaCumpridoPercent >= 90
                                                            ? 'bg-green-500'
                                                            : channel.slaCumpridoPercent >= 80
                                                                ? 'bg-yellow-500'
                                                                : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${channel.slaCumpridoPercent}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-8">
                                                    {channel.slaCumpridoPercent}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6">
                <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                    Volume por Canal
                </h3>
                <div className="space-y-4">
                    {data.map((channel) => (
                        <div key={channel.canal} className="flex items-center gap-4">
                            <div className="w-24">
                                <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase">
                                    {channel.canal}
                                </p>
                            </div>
                            <div className="flex-1">
                                <div
                                    className="h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 transition-all"
                                    style={{ width: `${(channel.totalMensagens / maxMensagens) * 100}%` }}
                                />
                            </div>
                            <div className="w-12 text-right">
                                <p className="text-xs font-bold text-gray-900 dark:text-white">
                                    {channel.percentualDoTotal}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


interface PessoasProps {
    data: InsightsPessoaRelacionada[];
}

const PessoasBlock: React.FC<PessoasProps> = ({ data }) => {
    return (
        <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Pessoas Relacionadas
            </h3>
            <div className="rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Papel
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Tempo médio
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Clientes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Atrasos
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Canais
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                            {data.map((pessoa) => (
                                <tr key={pessoa.userId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        {pessoa.nome}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${pessoa.papelPrincipal === 'Analista'
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                            : pessoa.papelPrincipal === 'Dev'
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                                                : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
                                            }`}>
                                            {pessoa.papelPrincipal}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {pessoa.time || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        {pessoa.totalComunicacoes}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {pessoa.tempoMedioRespostaMin}m
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        <span className="font-semibold">{pessoa.clientesSobResponsabilidade}</span>
                                        {pessoa.clientesComAtraso > 0 && (
                                            <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                                                ({pessoa.clientesComAtraso} atrasos)
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {pessoa.clientesComAtraso > 0 ? (
                                            <span className="inline-flex rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-semibold text-red-800 dark:text-red-300">
                                                {pessoa.clientesComAtraso}
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-semibold text-green-800 dark:text-green-300">
                                                0
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {getCanaisMaisUsadosLabel(pessoa.canaisMaisUsados)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


interface ClientesRiscoProps {
    data: InsightsClienteRisco[];
}

const ClientesRiscoBlock: React.FC<ClientesRiscoProps> = ({ data }) => {
    return (
        <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Clientes em Situação de Risco
            </h3>
            <div className="rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Health
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Tempo médio
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Atrasos
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Sem resposta
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Pessoas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Canal
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                            {data.map((cliente) => (
                                <tr key={cliente.clienteId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        {cliente.nomeCliente}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={`size-2 rounded-full ${getHealthBgColor(cliente.healthClassificacao)}`} />
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getHealthColor(cliente.healthClassificacao)}`}>
                                                {cliente.healthScore}% - {cliente.healthClassificacao}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {cliente.tempoMedioRespostaMin}m
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="inline-flex rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-semibold text-red-800 dark:text-red-300">
                                            {cliente.qtdAtrasosPeriodo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {cliente.qtdSemRespostaPeriodo}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {cliente.principaisPessoasEnvolvidas.join(', ')}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {cliente.canalPredominante.charAt(0).toUpperCase() + cliente.canalPredominante.slice(1)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


interface CasosAtrasoProps {
    data: InsightsCasoAtraso[];
}

const CasosAtrasoBlock: React.FC<CasosAtrasoProps> = ({ data }) => {
    const topCasos = data.sort((a, b) => b.atrasoHoras - a.atrasoHoras).slice(0, 5);

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Maior atraso */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Comunicações com Maior Atraso
                </h3>
                <div className="rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Responsável
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Atraso
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                {topCasos.map((caso) => (
                                    <tr key={caso.idComunicacao} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                        <td className="px-6 py-3 font-semibold text-gray-900 dark:text-white">
                                            {caso.clienteNome}
                                        </td>
                                        <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                                            {caso.responsavelPrincipal}
                                        </td>
                                        <td className="px-6 py-3 font-semibold text-red-600 dark:text-red-400">
                                            +{caso.atrasoHoras}h
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Resumo de riscos */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Resumo de Riscos
                </h3>
                <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6 space-y-4">
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 p-4">
                        <p className="text-sm font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
                            <ExclamationTriangleIcon className="size-4" />
                            Máximo atraso registrado
                        </p>
                        <p className="mt-1 text-lg font-bold text-red-900 dark:text-red-200">
                            +{topCasos[0]?.atrasoHoras || 0} horas
                        </p>
                        <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                            {topCasos[0]?.clienteNome} por {topCasos[0]?.responsavelPrincipal}
                        </p>
                    </div>

                    <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 p-4">
                        <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                            Total de casos fora do SLA
                        </p>
                        <p className="mt-1 text-lg font-bold text-yellow-900 dark:text-yellow-200">
                            {topCasos.length}
                        </p>
                        <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-400">
                            Últimas comunicações críticas
                        </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 p-4">
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                            Atraso médio (top 5)
                        </p>
                        <p className="mt-1 text-lg font-bold text-blue-900 dark:text-blue-200">
                            {(topCasos.reduce((a, b) => a + b.atrasoHoras, 0) / topCasos.length).toFixed(1)}h
                        </p>
                        <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                            Mediana das comunicações críticas
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const Insights: React.FC = () => {
    const [periodo, setPeriodo] = React.useState<InsightsPeriodo>('30d');
    const [time, setTime] = React.useState<string>('Todos');
    const [canal, setCanal] = React.useState<string>('Todos');

    const periodLabels: Record<InsightsPeriodo, string> = {
        '7d': 'Últimos 7 dias',
        '30d': 'Últimos 30 dias',
        '90d': 'Últimos 90 dias',
    };

    return (
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
            {/* Header */}
            <header className="border-b border-gray-200 dark:border-white/5 bg-white dark:bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Insights
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Relatório consolidado de comunicações com clientes
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Período */}
                    <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                            Período
                        </label>
                        <div className="mt-2 flex gap-2">
                            {(['7d', '30d', '90d'] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriodo(p)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${periodo === p
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {periodLabels[p]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time */}
                    <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                            Time
                        </label>
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-2 w-full rounded-lg bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 outline-hidden"
                        >
                            <option>Todos</option>
                            <option>Sucesso do Cliente</option>
                            <option>Suporte</option>
                            <option>Comercial</option>
                        </select>
                    </div>

                    {/* Canal */}
                    <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                            Canal
                        </label>
                        <select
                            value={canal}
                            onChange={(e) => setCanal(e.target.value)}
                            className="mt-2 w-full rounded-lg bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 outline-hidden"
                        >
                            <option>Todos</option>
                            <option>Email</option>
                            <option>Teams</option>
                            <option>Outro</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="px-4 py-6 sm:px-6 lg:px-8 space-y-8">
                {/* Block 1: Overview */}
                <section>
                    <OverviewCards data={insightsOverviewMock} />
                </section>

                {/* Block 2: Canais */}
                <section>
                    <ChannelsBlock data={insightsChannelsMock} />
                </section>

                {/* Block 3: Pessoas */}
                <section>
                    <PessoasBlock data={insightsPessoasMock} />
                </section>

                {/* Block 4: Clientes em Risco */}
                <section>
                    <ClientesRiscoBlock data={insightsClientesRiscoMock} />
                </section>

                {/* Block 5: Casos extremos */}
                <section>
                    <CasosAtrasoBlock data={insightsCasosAtrasoMock} />
                </section>
            </div>
        </div>
    );
};

export default Insights;
