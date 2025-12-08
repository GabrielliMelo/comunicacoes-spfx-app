import * as React from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type HealthClassificacao = 'Verde' | 'Amarelo' | 'Vermelho';

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
    canalPredominante: 'email' | 'teams' | 'outro';
}

export interface ClientesRiscoModalProps {
    aberto: boolean;
    onClose: () => void;
    clientesRisco: InsightsClienteRisco[];
    onIrParaInsights?: () => void;
}


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

function getPriorityColor(prioridade: string): string {
    switch (prioridade) {
        case 'Estratégico':
            return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
        case 'Alta':
            return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
        case 'Média':
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
        case 'Baixa':
            return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
        default:
            return '';
    }
}

export const ClientesRiscoModal: React.FC<ClientesRiscoModalProps> = ({
    aberto,
    onClose,
    clientesRisco,
    onIrParaInsights,
}) => {
    if (!aberto || clientesRisco.length === 0) return null;

    const handleIrParaInsights = () => {
        if (onIrParaInsights) {
            onIrParaInsights();
        }
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 dark:bg-black/60"
                style={{ zIndex: 9999 }}
                onClick={onClose}
                aria-hidden="true"
            />            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 10000 }}>
                <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 px-6 py-6">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-lg bg-red-100 dark:bg-red-900/30">
                                <ExclamationTriangleIcon className="size-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Clientes em Risco e SLA Crítico
                                </h2>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    Atenção requerida
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                            aria-label="Fechar modal"
                        >
                            <XMarkIcon className="size-6" />
                        </button>
                    </div>

                    {/* Description */}
                    <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-white/5">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            Os clientes abaixo apresentam sinais de risco, incluindo:
                            <br />
                            <span className="text-xs mt-2 block">
                                • <strong>SLA crítico</strong> com atrasos recorrentes
                                <br />
                                • <strong>Tempo de resposta alto</strong> prejudicando a relação
                                <br />
                                • <strong>Risco de churn</strong> ou insatisfação elevada
                            </span>
                        </p>
                    </div>

                    {/* Content - Scrollable list */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="px-6 py-4 space-y-4">
                            {clientesRisco.map((cliente) => (
                                <div
                                    key={cliente.clienteId}
                                    className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800/50 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                >
                                    {/* Cliente Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {cliente.nomeCliente}
                                            </h3>
                                            {cliente.motivoPrincipal && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    {cliente.motivoPrincipal}
                                                </p>
                                            )}
                                        </div>
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getHealthColor(
                                                cliente.healthClassificacao
                                            )}`}
                                        >
                                            {cliente.healthScore}% - {cliente.healthClassificacao}
                                        </span>
                                    </div>

                                    {/* Badges - Prioridade */}
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityColor(
                                                cliente.prioridade
                                            )}`}
                                        >
                                            {cliente.prioridade}
                                        </span>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                                        <div className="rounded bg-white dark:bg-gray-900/50 p-2.5">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Tempo médio</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                {cliente.tempoMedioRespostaMin}m
                                            </p>
                                        </div>
                                        <div className="rounded bg-white dark:bg-gray-900/50 p-2.5">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Atrasos</p>
                                            <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                                {cliente.qtdAtrasosPeriodo}
                                            </p>
                                        </div>
                                        <div className="rounded bg-white dark:bg-gray-900/50 p-2.5">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Sem resposta</p>
                                            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                                                {cliente.qtdSemRespostaPeriodo}
                                            </p>
                                        </div>
                                        <div className="rounded bg-white dark:bg-gray-900/50 p-2.5">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Canal</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                                                {cliente.canalPredominante}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pessoas envolvidas */}
                                    <div className="pt-2 border-t border-gray-200 dark:border-white/5">
                                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                                            Pessoas envolvidas
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-200">
                                            {cliente.principaisPessoasEnvolvidas.join(', ')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer - Actions */}
                    <div className="border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex items-center justify-between gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            Ok, entendi
                        </button>
                        {onIrParaInsights && (
                            <button
                                onClick={handleIrParaInsights}
                                className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-indigo-700 hover:to-blue-700 transition"
                            >
                                Ver detalhes em Insights
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientesRiscoModal;
