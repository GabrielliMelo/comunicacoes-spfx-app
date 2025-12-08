import * as React from 'react';
import { XMarkIcon, LinkIcon } from '@heroicons/react/24/outline';


export interface ClienteListItem {
    id: number;
    nome: string;
    codigoInterno?: string;
    segmento?: string;
    porte?: 'Small' | 'Mid' | 'Enterprise';
    analistaResponsavel: string;
    devPrincipal?: string;
    statusRelacionamento: 'Onboarding' | 'Ativo' | 'Risco' | 'Churn Risk';
    prioridade: 'Baixa' | 'Média' | 'Alta' | 'Estratégico';
    ultimoContato?: string;
    diasSemContato?: number;
    tags: string[];
}

export interface Stakeholder {
    id: number;
    nome: string;
    email?: string;
    telefone?: string;
    cargo?: string;
    nivelInfluencia?: 'Alto' | 'Médio' | 'Baixo';
    tipo?: 'Sponsor' | 'Decisor' | 'UsuarioChave' | 'ContatoOperacional';
}

export interface ClienteSLAInfo {
    tipoSLA: 'Padrão' | 'Customizado';
    tempoRespostaHoras?: number;
    tempoSolucaoHoras?: number;
    observacoes?: string;
}

export interface ClienteHealth {
    healthScore: number;
    classificacao: 'Verde' | 'Amarelo' | 'Vermelho';
    motivoPrincipal?: string;
    riscoChurn?: 'Baixo' | 'Médio' | 'Alto';
}

export interface ClienteUsoResumo {
    qtdUsuariosAtivos?: number;
    qtdProjetosAtivos?: number;
    ultimasEntregas: string[];
}

export interface ClienteDetalhado {
    id: number;
    nome: string;
    codigoInterno?: string;
    cnpj?: string;
    site?: string;
    segmento?: string;
    porte?: 'Small' | 'Mid' | 'Enterprise';
    localizacao?: string;
    analistaResponsavel: string;
    devPrincipal?: string;
    timeComercial?: string;
    squadInterno?: string;
    prioridade: 'Baixa' | 'Média' | 'Alta' | 'Estratégico';
    statusRelacionamento: 'Onboarding' | 'Ativo' | 'Risco' | 'Churn Risk';
    tipoContrato: 'Projeto' | 'Banco de horas' | 'Sustentação';
    horasMesContratadas?: number;
    sla: ClienteSLAInfo;
    health: ClienteHealth;
    uso: ClienteUsoResumo;
    stakeholders: Stakeholder[];
    pastaDocumentosUrl?: string;
    pastaTeamsUrl?: string;
    pastaOutlookUrl?: string;
    ultimoContato?: string;
    diasSemContato?: number;
    totalComunicacoes30d?: number;
    principaisTemasUltimos30d: string[];
    observacoesGerais?: string;
    tags: string[];
}


export const clientesMock: ClienteDetalhado[] = [
    {
        id: 1,
        nome: 'Cliente Alpha',
        codigoInterno: 'CLI-001',
        cnpj: '12.345.678/0001-90',
        site: 'https://clientealpha.com',
        segmento: 'SaaS',
        porte: 'Mid',
        localizacao: 'São Paulo - SP',
        analistaResponsavel: 'Gabrielli Melo',
        devPrincipal: 'Carlos Santos',
        timeComercial: 'Time Comercial 1',
        squadInterno: 'Squad Onboarding',
        prioridade: 'Estratégico',
        statusRelacionamento: 'Ativo',
        tipoContrato: 'Banco de horas',
        horasMesContratadas: 80,
        sla: {
            tipoSLA: 'Customizado',
            tempoRespostaHoras: 2,
            tempoSolucaoHoras: 12,
            observacoes: 'Cliente estratégico com SLAs reduzidos.',
        },
        health: {
            healthScore: 87,
            classificacao: 'Verde',
            motivoPrincipal: 'Bom engajamento e poucas pendências.',
            riscoChurn: 'Baixo',
        },
        uso: {
            qtdUsuariosAtivos: 45,
            qtdProjetosAtivos: 3,
            ultimasEntregas: [
                'Implantação módulo relatórios avançados',
                'Treinamento time operacional',
            ],
        },
        stakeholders: [
            {
                id: 1,
                nome: 'Ana Diretora',
                email: 'ana.diretora@clientealpha.com',
                telefone: '+55 (11) 99999-0001',
                cargo: 'Diretora de Operações',
                nivelInfluencia: 'Alto',
                tipo: 'Sponsor',
            },
            {
                id: 2,
                nome: 'Bruno Coordenador',
                email: 'bruno.coordenador@clientealpha.com',
                telefone: '+55 (11) 99999-0002',
                cargo: 'Coordenador de TI',
                nivelInfluencia: 'Médio',
                tipo: 'Decisor',
            },
        ],
        pastaDocumentosUrl: '/sites/clientes/Cliente Alpha',
        pastaTeamsUrl: '/sites/clientes/Cliente Alpha/Teams',
        pastaOutlookUrl: '/sites/clientes/Cliente Alpha/Outlook',
        ultimoContato: '2025-11-16T10:30:00Z',
        diasSemContato: 1,
        totalComunicacoes30d: 28,
        principaisTemasUltimos30d: ['Integrações', 'Relatórios'],
        observacoesGerais: 'Cliente muito engajado, costuma responder rápido.',
        tags: ['Estratégico', 'SaaS', 'Integrações'],
    },
    {
        id: 2,
        nome: 'Cliente Beta',
        codigoInterno: 'CLI-002',
        cnpj: '98.765.432/0001-10',
        site: 'https://betacorp.com',
        segmento: 'Indústria',
        porte: 'Enterprise',
        localizacao: 'Curitiba - PR',
        analistaResponsavel: 'Ana Silva',
        devPrincipal: 'João Lima',
        timeComercial: 'Time Comercial 2',
        squadInterno: 'Squad Sustentação',
        prioridade: 'Alta',
        statusRelacionamento: 'Risco',
        tipoContrato: 'Sustentação',
        horasMesContratadas: 120,
        sla: {
            tipoSLA: 'Padrão',
            tempoRespostaHoras: 4,
            tempoSolucaoHoras: 24,
            observacoes: 'SLA padrão, porém cliente sensível a atrasos.',
        },
        health: {
            healthScore: 62,
            classificacao: 'Amarelo',
            motivoPrincipal: 'Algumas pendências abertas há mais de 7 dias.',
            riscoChurn: 'Médio',
        },
        uso: {
            qtdUsuariosAtivos: 120,
            qtdProjetosAtivos: 5,
            ultimasEntregas: [
                'Go-live módulo faturamento',
                'Ajustes em integrações com ERP',
            ],
        },
        stakeholders: [
            {
                id: 3,
                nome: 'Carlos CFO',
                email: 'carlos.cfo@betacorp.com',
                telefone: '+55 (41) 98888-0003',
                cargo: 'CFO',
                nivelInfluencia: 'Alto',
                tipo: 'Decisor',
            },
            {
                id: 4,
                nome: 'Daniela Usuária Chave',
                email: 'daniela.operacao@betacorp.com',
                telefone: '+55 (41) 98888-0004',
                cargo: 'Coordenadora Operacional',
                nivelInfluencia: 'Médio',
                tipo: 'UsuarioChave',
            },
        ],
        pastaDocumentosUrl: '/sites/clientes/Cliente Beta',
        pastaTeamsUrl: '/sites/clientes/Cliente Beta/Teams',
        pastaOutlookUrl: '/sites/clientes/Cliente Beta/Outlook',
        ultimoContato: '2025-11-10T15:45:00Z',
        diasSemContato: 6,
        totalComunicacoes30d: 40,
        principaisTemasUltimos30d: ['Performance', 'Faturamento'],
        observacoesGerais: 'Cliente sensível a performance, precisa de atenção próxima.',
        tags: ['Indústria', 'Performance', 'SLA crítico'],
    },
    {
        id: 3,
        nome: 'Cliente Gama',
        codigoInterno: 'CLI-003',
        cnpj: '11.111.111/0001-11',
        site: 'https://gamatech.com',
        segmento: 'Banco',
        porte: 'Enterprise',
        localizacao: 'Rio de Janeiro - RJ',
        analistaResponsavel: 'Carlos Santos',
        devPrincipal: 'Marina Costa',
        timeComercial: 'Time Comercial 1',
        squadInterno: 'Squad Segurança',
        prioridade: 'Estratégico',
        statusRelacionamento: 'Ativo',
        tipoContrato: 'Projeto',
        horasMesContratadas: 200,
        sla: {
            tipoSLA: 'Customizado',
            tempoRespostaHoras: 1,
            tempoSolucaoHoras: 8,
            observacoes: 'SLA crítico - instituição financeira.',
        },
        health: {
            healthScore: 95,
            classificacao: 'Verde',
            motivoPrincipal: 'Excelente engajamento e compliance total.',
            riscoChurn: 'Baixo',
        },
        uso: {
            qtdUsuariosAtivos: 250,
            qtdProjetosAtivos: 7,
            ultimasEntregas: [
                'Certificação de segurança aprovada',
                'Integração com sistema de compliance',
            ],
        },
        stakeholders: [
            {
                id: 5,
                nome: 'Patricia Diretora Executiva',
                email: 'patricia.exec@gamatech.com',
                telefone: '+55 (21) 97777-0005',
                cargo: 'Diretora Executiva',
                nivelInfluencia: 'Alto',
                tipo: 'Sponsor',
            },
        ],
        pastaDocumentosUrl: '/sites/clientes/Cliente Gama',
        pastaTeamsUrl: '/sites/clientes/Cliente Gama/Teams',
        pastaOutlookUrl: '/sites/clientes/Cliente Gama/Outlook',
        ultimoContato: '2025-11-16T14:20:00Z',
        diasSemContato: 0,
        totalComunicacoes30d: 56,
        principaisTemasUltimos30d: ['Segurança', 'Compliance', 'Auditoria'],
        observacoesGerais: 'Cliente premium com requisitos rigorosos de segurança.',
        tags: ['Banco', 'Segurança', 'Compliance'],
    },
];


function mapToClienteListItem(c: ClienteDetalhado): ClienteListItem {
    return {
        id: c.id,
        nome: c.nome,
        codigoInterno: c.codigoInterno,
        segmento: c.segmento,
        porte: c.porte,
        analistaResponsavel: c.analistaResponsavel,
        devPrincipal: c.devPrincipal,
        statusRelacionamento: c.statusRelacionamento,
        prioridade: c.prioridade,
        ultimoContato: c.ultimoContato,
        diasSemContato: c.diasSemContato,
        tags: c.tags,
    };
}

function formatDate(isoString?: string): string {
    if (!isoString) return '-';
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
        return `Ontem`;
    } else {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

function getStatusColor(status: string): string {
    switch (status) {
        case 'Ativo':
            return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
        case 'Onboarding':
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
        case 'Risco':
            return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
        case 'Churn Risk':
            return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
        default:
            return '';
    }
}

function getHealthColor(classificacao: string): string {
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


interface ClienteDetailDrawerProps {
    cliente: ClienteDetalhado | null;
    isOpen: boolean;
    onClose: () => void;
}

const ClienteDetailDrawer: React.FC<ClienteDetailDrawerProps> = ({ cliente, isOpen, onClose }) => {
    if (!isOpen || !cliente) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
                onClick={onClose}
            />

            <div className="fixed right-0 top-0 bottom-0 w-full md:w-[35%] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-white/5 z-50 overflow-y-auto">
                <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 dark:border-white/5 bg-white dark:bg-gray-900 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {cliente.nome}
                        </h2>
                        {cliente.codigoInterno && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {cliente.codigoInterno}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    >
                        <XMarkIcon className="size-5" />
                    </button>
                </div>

                <div className="px-6 py-6 space-y-6">
                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Informações Básicas
                        </h3>
                        <div className="space-y-3 text-sm">
                            {cliente.segmento && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Segmento:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.segmento}</span>
                                </div>
                            )}
                            {cliente.porte && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Porte:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.porte}</span>
                                </div>
                            )}
                            {cliente.localizacao && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Localização:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.localizacao}</span>
                                </div>
                            )}
                            {cliente.cnpj && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">CNPJ:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.cnpj}</span>
                                </div>
                            )}
                            {cliente.site && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Site:</span>
                                    <a
                                        href={cliente.site}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                        Visitar
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Status
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(cliente.prioridade)}`}>
                                Prioridade: {cliente.prioridade}
                            </span>
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(cliente.statusRelacionamento)}`}>
                                {cliente.statusRelacionamento}
                            </span>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Informações de Contrato
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tipo de contrato:</span>
                                <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                                    {cliente.tipoContrato}
                                </span>
                            </div>
                            {cliente.horasMesContratadas && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Horas/mês contratadas:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.horasMesContratadas}h</span>
                                </div>
                            )}
                        </div>
                    </section>
                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Saúde da Conta
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Health Score</span>
                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getHealthColor(cliente.health.classificacao)}`}>
                                        {cliente.health.healthScore} - {cliente.health.classificacao}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${cliente.health.classificacao === 'Verde'
                                            ? 'bg-green-500'
                                            : cliente.health.classificacao === 'Amarelo'
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                            }`}
                                        style={{ width: `${cliente.health.healthScore}%` }}
                                    />
                                </div>
                            </div>
                            {cliente.health.motivoPrincipal && (
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {cliente.health.motivoPrincipal}
                                </p>
                            )}
                            {cliente.health.riscoChurn && (
                                <div className="text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Risco de Churn: </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {cliente.health.riscoChurn}
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            SLA
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                                <span className="text-gray-900 dark:text-white font-medium">{cliente.sla.tipoSLA}</span>
                            </div>
                            {cliente.sla.tempoRespostaHoras && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tempo resposta:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.sla.tempoRespostaHoras}h</span>
                                </div>
                            )}
                            {cliente.sla.tempoSolucaoHoras && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tempo solução:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.sla.tempoSolucaoHoras}h</span>
                                </div>
                            )}
                            {cliente.sla.observacoes && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                    {cliente.sla.observacoes}
                                </p>
                            )}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Equipe Interna
                        </h3>
                        <div className="space-y-2 text-sm">
                            {cliente.analistaResponsavel && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Analista:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.analistaResponsavel}</span>
                                </div>
                            )}
                            {cliente.devPrincipal && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Dev Principal:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.devPrincipal}</span>
                                </div>
                            )}
                            {cliente.timeComercial && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Time Comercial:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.timeComercial}</span>
                                </div>
                            )}
                            {cliente.squadInterno && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Squad:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.squadInterno}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {cliente.stakeholders.length > 0 && (
                        <section>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                                Stakeholders
                            </h3>
                            <div className="space-y-4">
                                {cliente.stakeholders.map((stakeholder) => (
                                    <div
                                        key={stakeholder.id}
                                        className="rounded-lg border border-gray-200 dark:border-white/5 p-4"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {stakeholder.nome}
                                                </p>
                                                {stakeholder.cargo && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {stakeholder.cargo}
                                                    </p>
                                                )}
                                            </div>
                                            {stakeholder.nivelInfluencia && (
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${stakeholder.nivelInfluencia === 'Alto'
                                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                                    : stakeholder.nivelInfluencia === 'Médio'
                                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                                                    }`}>
                                                    {stakeholder.nivelInfluencia}
                                                </span>
                                            )}
                                        </div>
                                        {stakeholder.email && (
                                            <p className="text-xs text-blue-600 dark:text-blue-400 break-all">
                                                {stakeholder.email}
                                            </p>
                                        )}
                                        {stakeholder.telefone && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {stakeholder.telefone}
                                            </p>
                                        )}
                                        {stakeholder.tipo && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                Tipo: {stakeholder.tipo}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Resumo de Uso/Projetos
                        </h3>
                        <div className="space-y-3 text-sm">
                            {cliente.uso.qtdUsuariosAtivos !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Usuários ativos:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.uso.qtdUsuariosAtivos}</span>
                                </div>
                            )}
                            {cliente.uso.qtdProjetosAtivos !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Projetos ativos:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.uso.qtdProjetosAtivos}</span>
                                </div>
                            )}
                            {cliente.uso.ultimasEntregas.length > 0 && (
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Últimas entregas:</span>
                                    <ul className="mt-2 space-y-1">
                                        {cliente.uso.ultimasEntregas.map((entrega, idx) => (
                                            <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                                <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                                                {entrega}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Resumo de Comunicações
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Último contato:</span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {formatDate(cliente.ultimoContato)}
                                </span>
                            </div>
                            {cliente.diasSemContato !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Dias sem contato:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.diasSemContato}</span>
                                </div>
                            )}
                            {cliente.totalComunicacoes30d !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Comunicações (30d):</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{cliente.totalComunicacoes30d}</span>
                                </div>
                            )}
                            {cliente.principaisTemasUltimos30d.length > 0 && (
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Principais temas:</span>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {cliente.principaisTemasUltimos30d.map((tema, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2.5 py-1 text-xs font-semibold text-indigo-800 dark:text-indigo-300"
                                            >
                                                {tema}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {(cliente.pastaDocumentosUrl || cliente.pastaTeamsUrl || cliente.pastaOutlookUrl) && (
                        <section>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                                Links de Pasta
                            </h3>
                            <div className="space-y-2">
                                {cliente.pastaDocumentosUrl && (
                                    <a
                                        href={cliente.pastaDocumentosUrl}
                                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                                    >
                                        <LinkIcon className="size-4" />
                                        Documentos
                                    </a>
                                )}
                                {cliente.pastaTeamsUrl && (
                                    <a
                                        href={cliente.pastaTeamsUrl}
                                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                                    >
                                        <LinkIcon className="size-4" />
                                        Teams
                                    </a>
                                )}
                                {cliente.pastaOutlookUrl && (
                                    <a
                                        href={cliente.pastaOutlookUrl}
                                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                                    >
                                        <LinkIcon className="size-4" />
                                        Outlook
                                    </a>
                                )}
                            </div>
                        </section>
                    )}

                    {cliente.observacoesGerais && (
                        <section>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                                Observações Gerais
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {cliente.observacoesGerais}
                            </p>
                        </section>
                    )}

                    {cliente.tags.length > 0 && (
                        <section>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                                Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {cliente.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex rounded-full bg-gray-200 dark:bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-800 dark:text-gray-300"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
};


export const Clients: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [priorityFilter, setPriorityFilter] = React.useState<string>('Todas');
    const [statusFilter, setStatusFilter] = React.useState<string>('Todos');
    const [selectedCliente, setSelectedCliente] = React.useState<ClienteDetalhado | null>(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const clienteItems = clientesMock.map(mapToClienteListItem);

    const filteredClientes = clienteItems.filter((cliente) => {
        const matchSearch =
            cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.analistaResponsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchPriority = priorityFilter === 'Todas' || cliente.prioridade === priorityFilter;
        const matchStatus = statusFilter === 'Todos' || cliente.statusRelacionamento === statusFilter;

        return matchSearch && matchPriority && matchStatus;
    });

    const handleRowClick = (cliente: ClienteListItem) => {
        const detailed = clientesMock.find((c) => c.id === cliente.id);
        if (detailed) {
            setSelectedCliente(detailed);
            setDrawerOpen(true);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950 relative">
            <header className="border-b border-gray-200 dark:border-white/5 bg-white dark:bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Clientes
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Cadastro e visão geral dos clientes atendidos
                </p>
            </header>

            <div className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-gray-900/50 px-4 py-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Buscar por nome, analista ou tag..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-hidden focus:bg-white dark:focus:bg-gray-700 border border-gray-200 dark:border-white/10 transition"
                        />
                    </div>

                    <div>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="w-full rounded-lg bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-white outline-hidden border border-gray-200 dark:border-white/10 transition"
                        >
                            <option>Todas</option>
                            <option>Baixa</option>
                            <option>Média</option>
                            <option>Alta</option>
                            <option>Estratégico</option>
                        </select>
                    </div>

                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full rounded-lg bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-white outline-hidden border border-gray-200 dark:border-white/10 transition"
                        >
                            <option>Todos</option>
                            <option>Onboarding</option>
                            <option>Ativo</option>
                            <option>Risco</option>
                            <option>Churn Risk</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-end">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {filteredClientes.length} cliente(s)
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6 sm:px-6 lg:px-8">
                <div className="rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Analista
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Dev Principal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Segmento
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Prioridade
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Último Contato
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Dias
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Tags
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                {filteredClientes.map((cliente) => (
                                    <tr
                                        key={cliente.id}
                                        onClick={() => handleRowClick(cliente)}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {cliente.nome}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {cliente.analistaResponsavel}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {cliente.devPrincipal || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {cliente.segmento || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityColor(cliente.prioridade)}`}>
                                                {cliente.prioridade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(cliente.statusRelacionamento)}`}>
                                                {cliente.statusRelacionamento}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(cliente.ultimoContato)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {cliente.diasSemContato ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex flex-wrap gap-1">
                                                {cliente.tags.slice(0, 2).map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 text-xs font-semibold text-indigo-800 dark:text-indigo-300"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {cliente.tags.length > 2 && (
                                                    <span className="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-semibold text-gray-800 dark:text-gray-300">
                                                        +{cliente.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredClientes.length === 0 && (
                        <div className="px-6 py-12 text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                Nenhum cliente encontrado com os filtros selecionados.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <ClienteDetailDrawer
                cliente={selectedCliente}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </div>
    );
};

export default Clients;
