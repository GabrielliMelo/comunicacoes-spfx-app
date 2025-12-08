export interface SLAConfig {
  diasSemResposta: number;
  diasAtraso: number;
  usarPorPrioridade: boolean;
  diasAtrasoPorPrioridade: {
    baixa: number;
    media: number;
    alta: number;
    estrategico: number;
  };
  usarPorCanal: boolean;
  diasAtrasoPorCanal: {
    email: number;
    teams: number;
    outro: number;
  };
}

export interface HealthConfig {
  faixaVerdeMin: number;
  faixaAmareloMin: number;
  pesoTempoResposta: number;
  pesoAtrasos: number;
  pesoSemResposta: number;
  diasSemContatoAltoRisco: number;
  atrasosAltoRisco: number;
  healthScoreAltoRiscoMax: number;
}

export interface GamificacaoConfig {
  habilitarGamificacao: boolean;
  pesoContatosIniciados: number;
  pesoRespostasDentroSLA: number;
  pesoResgates: number;
  mostrarRankingPorPessoa: boolean;
  mostrarRankingPorSquad: boolean;
  limiteTopUsuarios: number;
  habilitarBadgeRelampago: boolean;
  habilitarBadgeSalvaCliente: boolean;
  habilitarBadgeGuardiaoSLA: boolean;
  habilitarBadgeMulticanal: boolean;
}

export interface ExibicaoConfig {
  paginaInicialPadrao:
    | "dashboard"
    | "inbox"
    | "clientes"
    | "gamificacao"
    | "insights";
  ordenarClientesPor: "prioridade" | "health" | "atraso";
  ordenarInboxPor: "maisRecente" | "maisAtrasado";
  periodoPadrao: "7d" | "30d" | "90d";
  mostrarDevPrincipalNaListaClientes: boolean;
  mostrarHealthNaListaClientes: boolean;
}

export interface IntegracoesConfig {
  habilitarLeituraOutlook: boolean;
  habilitarLogsTeams: boolean;
  siteClientesUrl: string;
  bibliotecaClientesNome: string;
  sincronizarUltimosDias: number;
}

export interface AlertasConfig {
  habilitarPopupClientesAltoRisco: boolean;
  diasSemContatoParaAlertaPrioritario: number;
  habilitarAlertasInternos: boolean;
}

export interface ConfigSettings {
  sla: SLAConfig;
  health: HealthConfig;
  gamificacao: GamificacaoConfig;
  exibicao: ExibicaoConfig;
  integracoes: IntegracoesConfig;
  alertas: AlertasConfig;
}

export const defaultConfigSettings: ConfigSettings = {
  sla: {
    diasSemResposta: 3,
    diasAtraso: 7,
    usarPorPrioridade: true,
    diasAtrasoPorPrioridade: {
      baixa: 7,
      media: 5,
      alta: 3,
      estrategico: 2,
    },
    usarPorCanal: true,
    diasAtrasoPorCanal: {
      email: 7,
      teams: 3,
      outro: 10,
    },
  },
  health: {
    faixaVerdeMin: 80,
    faixaAmareloMin: 60,
    pesoTempoResposta: 0.4,
    pesoAtrasos: 0.35,
    pesoSemResposta: 0.25,
    diasSemContatoAltoRisco: 10,
    atrasosAltoRisco: 3,
    healthScoreAltoRiscoMax: 60,
  },
  gamificacao: {
    habilitarGamificacao: true,
    pesoContatosIniciados: 1.0,
    pesoRespostasDentroSLA: 1.5,
    pesoResgates: 2.0,
    mostrarRankingPorPessoa: true,
    mostrarRankingPorSquad: true,
    limiteTopUsuarios: 5,
    habilitarBadgeRelampago: true,
    habilitarBadgeSalvaCliente: true,
    habilitarBadgeGuardiaoSLA: true,
    habilitarBadgeMulticanal: true,
  },
  exibicao: {
    paginaInicialPadrao: "dashboard",
    ordenarClientesPor: "prioridade",
    ordenarInboxPor: "maisAtrasado",
    periodoPadrao: "30d",
    mostrarDevPrincipalNaListaClientes: true,
    mostrarHealthNaListaClientes: true,
  },
  integracoes: {
    habilitarLeituraOutlook: false,
    habilitarLogsTeams: false,
    siteClientesUrl: "/sites/clientes",
    bibliotecaClientesNome: "Clientes",
    sincronizarUltimosDias: 30,
  },
  alertas: {
    habilitarPopupClientesAltoRisco: true,
    diasSemContatoParaAlertaPrioritario: 5,
    habilitarAlertasInternos: true,
  },
};
