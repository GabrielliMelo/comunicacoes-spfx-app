import * as React from 'react';
import { ArrowUpIcon, ArrowDownIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';


type DashboardMetricId = "clientesAtivos" | "clientesSemResposta" | "clientesAtrasados" | "mensagensPendentesHoje";
type StatusAtendimento = "RESPONDIDO" | "PENDENTE" | "ATRASADO";
type Prioridade = "Baixa" | "Média" | "Alta" | "Estratégico";

interface DashboardMetric {
    id: DashboardMetricId;
    titulo: string;
    valor: number;
    variacaoPercentual: number;
    descricaoCurta: string;
}

interface DashboardClienteAtencao {
    id: number;
    nomeCliente: string;
    prioridade: Prioridade;
    ultimoContato: string;
    status: StatusAtendimento;
    responsavel: string;
}

interface DashboardResumoAnalista {
    id: number;
    nome: string;
    totalRespostas: number;
    tempoMedioRespostaMinutos: number;
    clientesAtivos: number;
    clientesSemResposta: number;
}


const dashboardMetrics: DashboardMetric[] = [
    {
        id: "clientesAtivos",
        titulo: "Clientes ativos",
        valor: 18,
        variacaoPercentual: 5,
        descricaoCurta: "Clientes com alguma interação nos últimos 30 dias.",
    },
    {
        id: "clientesSemResposta",
        titulo: "Clientes sem resposta",
        valor: 3,
        variacaoPercentual: -25,
        descricaoCurta: "Clientes que aguardam retorno há mais de 3 dias.",
    },
    {
        id: "clientesAtrasados",
        titulo: "Clientes atrasados",
        valor: 2,
        variacaoPercentual: 0,
        descricaoCurta: "Clientes fora do SLA definido.",
    },
    {
        id: "mensagensPendentesHoje",
        titulo: "Mensagens pendentes hoje",
        valor: 9,
        variacaoPercentual: 12,
        descricaoCurta: "Mensagens recebidas hoje ainda sem resposta.",
    },
];

const clientesAtencao: DashboardClienteAtencao[] = [
    {
        id: 1,
        nomeCliente: "Cliente Alpha",
        prioridade: "Estratégico",
        ultimoContato: "2025-11-15T10:30:00Z",
        status: "ATRASADO",
        responsavel: "Gabrielli Melo",
    },
    {
        id: 2,
        nomeCliente: "Cliente Beta",
        prioridade: "Alta",
        ultimoContato: "2025-11-16T09:10:00Z",
        status: "PENDENTE",
        responsavel: "Ana Silva",
    },
    {
        id: 3,
        nomeCliente: "Cliente Gama",
        prioridade: "Média",
        ultimoContato: "2025-11-14T16:45:00Z",
        status: "ATRASADO",
        responsavel: "Carlos Santos",
    },
    {
        id: 4,
        nomeCliente: "Cliente Delta",
        prioridade: "Alta",
        ultimoContato: "2025-11-16T11:20:00Z",
        status: "RESPONDIDO",
        responsavel: "Gabrielli Melo",
    },
];

const resumoAnalistas: DashboardResumoAnalista[] = [
    {
        id: 1,
        nome: "Gabrielli Melo",
        totalRespostas: 42,
        tempoMedioRespostaMinutos: 11,
        clientesAtivos: 6,
        clientesSemResposta: 0,
    },
    {
        id: 2,
        nome: "Ana Silva",
        totalRespostas: 31,
        tempoMedioRespostaMinutos: 24,
        clientesAtivos: 5,
        clientesSemResposta: 1,
    },
    {
        id: 3,
        nome: "Carlos Santos",
        totalRespostas: 19,
        tempoMedioRespostaMinutos: 37,
        clientesAtivos: 4,
        clientesSemResposta: 2,
    },
];


function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
        return `Ontem às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
}

function getStatusColor(status: StatusAtendimento): string {
    switch (status) {
        case 'RESPONDIDO':
            return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
        case 'PENDENTE':
            return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
        case 'ATRASADO':
            return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
        default:
            return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
}

function getPriorityColor(prioridade: Prioridade): string {
    switch (prioridade) {
        case 'Estratégico':
            return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
        case 'Alta':
            return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
        case 'Média':
            return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
        case 'Baixa':
            return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
        default:
            return '';
    }
}

function sortClientesByStatus(clientes: DashboardClienteAtencao[]): DashboardClienteAtencao[] {
    const statusOrder: Record<StatusAtendimento, number> = {
        'ATRASADO': 0,
        'PENDENTE': 1,
        'RESPONDIDO': 2,
    };
    return [...clientes].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
}

function getAvatarInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}


interface MetricCardProps {
    metric: DashboardMetric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
    const isPositive = metric.variacaoPercentual >= 0;

    return (
        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {metric.titulo}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {metric.valor}
                    </p>
                    <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                        {metric.descricaoCurta}
                    </p>
                </div>
                <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${isPositive
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                    {isPositive ? (
                        <ArrowUpIcon className="size-3" />
                    ) : (
                        <ArrowDownIcon className="size-3" />
                    )}
                    <span>{Math.abs(metric.variacaoPercentual)}%</span>
                </div>
            </div>
        </div>
    );
};


export const Dashboard: React.FC = () => {
    const currentUser = "Gabrielli Melo";
    const userInitials = getAvatarInitials(currentUser);
    const sortedClientes = sortClientesByStatus(clientesAtencao);
    const minTempoAnalista = Math.min(...resumoAnalistas.map(a => a.tempoMedioRespostaMinutos));

    return (
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
            <header className="border-b border-gray-200 dark:border-white/5 bg-white dark:bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Visão geral das comunicações com clientes
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {currentUser}
                            </p>
                        </div>
                        <div className={`flex size-10 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold`}>
                            {userInitials}
                        </div>
                    </div>
                </div>
            </header>

            <div className="px-4 py-6 sm:px-6 lg:px-8 space-y-8">
                <section>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {dashboardMetrics.map((metric) => (
                            <MetricCard key={metric.id} metric={metric} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 overflow-hidden">
                        <header className="border-b border-gray-200 dark:border-white/5 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Clientes que precisam de atenção
                            </h2>
                        </header>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Prioridade
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Último contato
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Responsável
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                    {sortedClientes.map((cliente) => (
                                        <tr key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                {cliente.nomeCliente}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(cliente.prioridade)}`}>
                                                    {cliente.prioridade}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(cliente.ultimoContato)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(cliente.status)}`}>
                                                    {cliente.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {cliente.responsavel}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 overflow-hidden">
                        <header className="border-b border-gray-200 dark:border-white/5 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Resumo por analista
                            </h2>
                        </header>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Analista
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Total de respostas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Tempo médio
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Clientes ativos
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Sem resposta
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                    {resumoAnalistas.map((analista) => (
                                        <tr key={analista.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                {analista.nome}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircleIcon className="size-4 text-green-600 dark:text-green-400" />
                                                    <span className="text-gray-900 dark:text-white font-semibold">{analista.totalRespostas}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${analista.tempoMedioRespostaMinutos === minTempoAnalista
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    <ClockIcon className="size-3" />
                                                    <span>{analista.tempoMedioRespostaMinutos} min</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                                                {analista.clientesAtivos}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {analista.clientesSemResposta > 0 ? (
                                                    <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                                                        {analista.clientesSemResposta}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 dark:text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
