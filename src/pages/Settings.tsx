import * as React from 'react';
import { ConfigSettings, defaultConfigSettings } from '../types/configSettings';

export const Settings: React.FC = () => {
    const [config, setConfig] = React.useState<ConfigSettings>(defaultConfigSettings);
    const [saved, setSaved] = React.useState(false);

    const handleConfigChange = (path: string[], value: any) => {
        const newConfig = JSON.parse(JSON.stringify(config));
        let current = newConfig;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        setConfig(newConfig);
    };

    const handleSaveConfig = () => {
        console.log('Configurações salvas:', config);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-white/5 px-4 py-6 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-900">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Ajuste regras de SLA, health, gamificação e exibição do sistema
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-5xl">
                {/* Notification */}
                {saved && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-300">
                        ✓ Configurações salvas com sucesso!
                    </div>
                )}

                {/* SLA & Regras de Status */}
                <ConfigSection title="SLA & Regras de Status" description="Defina os limites globais de SLA e regras por prioridade ou canal">
                    <div className="space-y-6">
                        {/* Global Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Dias sem resposta para alerta
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={config.sla.diasSemResposta}
                                    onChange={(e) => handleConfigChange(['sla', 'diasSemResposta'], parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Dias de atraso padrão
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={config.sla.diasAtraso}
                                    onChange={(e) => handleConfigChange(['sla', 'diasAtraso'], parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Por Prioridade */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <input
                                    type="checkbox"
                                    checked={config.sla.usarPorPrioridade}
                                    onChange={(e) => handleConfigChange(['sla', 'usarPorPrioridade'], e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                    Usar SLA por prioridade do cliente
                                </label>
                            </div>

                            {config.sla.usarPorPrioridade && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ml-7">
                                    {(['baixa', 'media', 'alta', 'estrategico'] as const).map((prioridade) => (
                                        <div key={prioridade}>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                                                {prioridade === 'media' ? 'Média' : prioridade.charAt(0).toUpperCase() + prioridade.slice(1)}
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={config.sla.diasAtrasoPorPrioridade[prioridade]}
                                                onChange={(e) =>
                                                    handleConfigChange(['sla', 'diasAtrasoPorPrioridade', prioridade], parseInt(e.target.value))
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Por Canal */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <input
                                    type="checkbox"
                                    checked={config.sla.usarPorCanal}
                                    onChange={(e) => handleConfigChange(['sla', 'usarPorCanal'], e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                    Usar SLA por canal de comunicação
                                </label>
                            </div>

                            {config.sla.usarPorCanal && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-7">
                                    {(['email', 'teams', 'outro'] as const).map((canal) => (
                                        <div key={canal}>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                                                {canal}
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={config.sla.diasAtrasoPorCanal[canal]}
                                                onChange={(e) =>
                                                    handleConfigChange(['sla', 'diasAtrasoPorCanal', canal], parseInt(e.target.value))
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </ConfigSection>

                {/* Health & Risco de Churn */}
                <ConfigSection title="Health & Risco de Churn" description="Configure as faixas de health score e critérios de risco">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Faixa Verde (mín.)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={config.health.faixaVerdeMin}
                                    onChange={(e) => handleConfigChange(['health', 'faixaVerdeMin'], parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Faixa Amarelo (mín.)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={config.health.faixaAmareloMin}
                                    onChange={(e) => handleConfigChange(['health', 'faixaAmareloMin'], parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-end pb-2">
                                Vermelho: &lt; {config.health.faixaAmareloMin}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                                Pesos para cálculo do Health (total deve ≈ 1.0)
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Peso Tempo Resposta
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={config.health.pesoTempoResposta}
                                        onChange={(e) => handleConfigChange(['health', 'pesoTempoResposta'], parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Peso Atrasos
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={config.health.pesoAtrasos}
                                        onChange={(e) => handleConfigChange(['health', 'pesoAtrasos'], parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Peso Sem Resposta
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={config.health.pesoSemResposta}
                                        onChange={(e) => handleConfigChange(['health', 'pesoSemResposta'], parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Total: {(config.health.pesoTempoResposta + config.health.pesoAtrasos + config.health.pesoSemResposta).toFixed(2)}
                            </p>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                                Critérios de Risco de Churn
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Dias sem contato (alerta)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={config.health.diasSemContatoAltoRisco}
                                        onChange={(e) =>
                                            handleConfigChange(['health', 'diasSemContatoAltoRisco'], parseInt(e.target.value))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Atrasos máx. (alerta)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={config.health.atrasosAltoRisco}
                                        onChange={(e) => handleConfigChange(['health', 'atrasosAltoRisco'], parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Health score máx. para risco
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={config.health.healthScoreAltoRiscoMax}
                                        onChange={(e) =>
                                            handleConfigChange(['health', 'healthScoreAltoRiscoMax'], parseInt(e.target.value))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </ConfigSection>

                {/* Gamificação */}
                <ConfigSection title="Gamificação" description="Habilite e configure regras de gamificação e badges">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <input
                                type="checkbox"
                                checked={config.gamificacao.habilitarGamificacao}
                                onChange={(e) => handleConfigChange(['gamificacao', 'habilitarGamificacao'], e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                Habilitar gamificação
                            </label>
                        </div>

                        {config.gamificacao.habilitarGamificacao && (
                            <div className="space-y-6 ml-7">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">Pesos do Score</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Contatos iniciados
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={config.gamificacao.pesoContatosIniciados}
                                                onChange={(e) =>
                                                    handleConfigChange(['gamificacao', 'pesoContatosIniciados'], parseFloat(e.target.value))
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Respostas dentro SLA
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={config.gamificacao.pesoRespostasDentroSLA}
                                                onChange={(e) =>
                                                    handleConfigChange(['gamificacao', 'pesoRespostasDentroSLA'], parseFloat(e.target.value))
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Resgates
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={config.gamificacao.pesoResgates}
                                                onChange={(e) =>
                                                    handleConfigChange(['gamificacao', 'pesoResgates'], parseFloat(e.target.value))
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">Exibição de Rankings</p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={config.gamificacao.mostrarRankingPorPessoa}
                                                onChange={(e) =>
                                                    handleConfigChange(['gamificacao', 'mostrarRankingPorPessoa'], e.target.checked)
                                                }
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                            <label className="text-sm text-gray-900 dark:text-white cursor-pointer">
                                                Mostrar ranking por pessoa
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={config.gamificacao.mostrarRankingPorSquad}
                                                onChange={(e) =>
                                                    handleConfigChange(['gamificacao', 'mostrarRankingPorSquad'], e.target.checked)
                                                }
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                            <label className="text-sm text-gray-900 dark:text-white cursor-pointer">
                                                Mostrar ranking por squad
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Limite de usuários no top
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={config.gamificacao.limiteTopUsuarios}
                                            onChange={(e) =>
                                                handleConfigChange(['gamificacao', 'limiteTopUsuarios'], parseInt(e.target.value))
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 md:w-32"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">Badges</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { key: 'habilitarBadgeRelampago', label: '⚡ Relâmpago' },
                                            { key: 'habilitarBadgeSalvaCliente', label: '🛡️ Salva-Cliente' },
                                            { key: 'habilitarBadgeGuardiaoSLA', label: '🛡️ Guardião SLA' },
                                            { key: 'habilitarBadgeMulticanal', label: '🔀 Multicanal' },
                                        ].map((badge) => (
                                            <div key={badge.key} className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={config.gamificacao[badge.key as keyof typeof config.gamificacao] as boolean}
                                                    onChange={(e) =>
                                                        handleConfigChange(['gamificacao', badge.key], e.target.checked)
                                                    }
                                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                />
                                                <label className="text-sm text-gray-900 dark:text-white cursor-pointer">
                                                    {badge.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ConfigSection>

                {/* Exibição & Padrões */}
                <ConfigSection title="Exibição & Padrões" description="Configure as preferências padrão de exibição">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Página inicial padrão
                                </label>
                                <select
                                    value={config.exibicao.paginaInicialPadrao}
                                    onChange={(e) =>
                                        handleConfigChange(['exibicao', 'paginaInicialPadrao'], e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="dashboard">Dashboard</option>
                                    <option value="inbox">Inbox</option>
                                    <option value="clientes">Clientes</option>
                                    <option value="gamificacao">Gamificação</option>
                                    <option value="insights">Insights</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Ordenar clientes por
                                </label>
                                <select
                                    value={config.exibicao.ordenarClientesPor}
                                    onChange={(e) =>
                                        handleConfigChange(['exibicao', 'ordenarClientesPor'], e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="prioridade">Prioridade</option>
                                    <option value="health">Health Score</option>
                                    <option value="atraso">Atraso</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Ordenar inbox por
                                </label>
                                <select
                                    value={config.exibicao.ordenarInboxPor}
                                    onChange={(e) =>
                                        handleConfigChange(['exibicao', 'ordenarInboxPor'], e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="maisRecente">Mais recente</option>
                                    <option value="maisAtrasado">Mais atrasado</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Período padrão de relatórios
                                </label>
                                <select
                                    value={config.exibicao.periodoPadrao}
                                    onChange={(e) =>
                                        handleConfigChange(['exibicao', 'periodoPadrao'], e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="7d">Últimos 7 dias</option>
                                    <option value="30d">Últimos 30 dias</option>
                                    <option value="90d">Últimos 90 dias</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">Visibilidade na lista de clientes</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={config.exibicao.mostrarDevPrincipalNaListaClientes}
                                        onChange={(e) =>
                                            handleConfigChange(
                                                ['exibicao', 'mostrarDevPrincipalNaListaClientes'],
                                                e.target.checked
                                            )
                                        }
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                    <label className="text-sm text-gray-900 dark:text-white cursor-pointer">
                                        Mostrar desenvolvedor principal na lista
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={config.exibicao.mostrarHealthNaListaClientes}
                                        onChange={(e) =>
                                            handleConfigChange(['exibicao', 'mostrarHealthNaListaClientes'], e.target.checked)
                                        }
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                    <label className="text-sm text-gray-900 dark:text-white cursor-pointer">
                                        Mostrar health score na lista
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </ConfigSection>

                {/* Integrações */}
                <ConfigSection title="Integrações" description="Configure conexões com Outlook, Teams e SharePoint">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={config.integracoes.habilitarLeituraOutlook}
                                    onChange={(e) =>
                                        handleConfigChange(['integracoes', 'habilitarLeituraOutlook'], e.target.checked)
                                    }
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                    Habilitar leitura de Outlook
                                </label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={config.integracoes.habilitarLogsTeams}
                                    onChange={(e) =>
                                        handleConfigChange(['integracoes', 'habilitarLogsTeams'], e.target.checked)
                                    }
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                    Habilitar logs do Teams
                                </label>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">SharePoint</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        URL do site de clientes
                                    </label>
                                    <input
                                        type="text"
                                        value={config.integracoes.siteClientesUrl}
                                        onChange={(e) =>
                                            handleConfigChange(['integracoes', 'siteClientesUrl'], e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nome da biblioteca de clientes
                                    </label>
                                    <input
                                        type="text"
                                        value={config.integracoes.bibliotecaClientesNome}
                                        onChange={(e) =>
                                            handleConfigChange(['integracoes', 'bibliotecaClientesNome'], e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Sincronizar últimos (dias)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={config.integracoes.sincronizarUltimosDias}
                                        onChange={(e) =>
                                            handleConfigChange(['integracoes', 'sincronizarUltimosDias'], parseInt(e.target.value))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 md:w-32"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </ConfigSection>

                {/* Alertas & Notificações */}
                <ConfigSection title="Alertas & Notificações" description="Configure regras de alertas internos">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={config.alertas.habilitarPopupClientesAltoRisco}
                                onChange={(e) =>
                                    handleConfigChange(['alertas', 'habilitarPopupClientesAltoRisco'], e.target.checked)
                                }
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                Habilitar popup de clientes em alto risco
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Dias sem contato para alerta prioritário
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={config.alertas.diasSemContatoParaAlertaPrioritario}
                                onChange={(e) =>
                                    handleConfigChange(['alertas', 'diasSemContatoParaAlertaPrioritario'], parseInt(e.target.value))
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 md:w-32"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={config.alertas.habilitarAlertasInternos}
                                onChange={(e) =>
                                    handleConfigChange(['alertas', 'habilitarAlertasInternos'], e.target.checked)
                                }
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                Habilitar alertas internos
                            </label>
                        </div>
                    </div>
                </ConfigSection>

                {/* Botão Salvar */}
                <div className="flex gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleSaveConfig}
                        className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Salvar alterações
                    </button>
                    <button
                        onClick={() => setConfig(defaultConfigSettings)}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Restaurar padrões
                    </button>
                </div>

                <div className="pb-8" />
            </div>
        </div>
    );
};

interface ConfigSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const ConfigSection: React.FC<ConfigSectionProps> = ({ title, description, children }) => {
    return (
        <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/30">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-6">{description}</p>
            {children}
        </div>
    );
};

export default Settings;
