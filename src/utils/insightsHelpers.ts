/**
 * Filtro para identificar clientes em alto risco
 *
 * Critérios:
 * - Health classificação = "Vermelho" OU
 * - SLA muito crítico (tempo médio > 40 min OU >= 3 atrasos)
 */

export type HealthClassificacao = "Verde" | "Amarelo" | "Vermelho";

export interface InsightsClienteRisco {
  clienteId: number;
  nomeCliente: string;
  prioridade: "Baixa" | "Média" | "Alta" | "Estratégico";
  healthClassificacao: HealthClassificacao;
  healthScore: number;
  motivoPrincipal?: string;
  tempoMedioRespostaMin: number;
  qtdAtrasosPeriodo: number;
  qtdSemRespostaPeriodo: number;
  principaisPessoasEnvolvidas: string[];
  canalPredominante: "email" | "teams" | "outro";
}

/**
 * Filtra clientes que estão em alto risco
 * @param clientes Array de clientes com informações de risco
 * @returns Array filtrado com apenas os clientes em alto risco
 */
export function filtrarClientesEmAltoRisco(
  clientes: InsightsClienteRisco[]
): InsightsClienteRisco[] {
  return clientes.filter((cliente) => {
    // Critério 1: Health muito crítico (Vermelho)
    if (cliente.healthClassificacao === "Vermelho") {
      return true;
    }

    // Critério 2: SLA muito crítico (tempo > 40 min OU >= 3 atrasos)
    const slaCritico =
      cliente.tempoMedioRespostaMin > 40 || cliente.qtdAtrasosPeriodo >= 3;

    if (slaCritico) {
      return true;
    }

    // Critério 3: Múltiplas comunicações sem resposta (>= 2)
    if (cliente.qtdSemRespostaPeriodo >= 2) {
      return true;
    }

    return false;
  });
}

/**
 * Obtém a data atual em formato YYYY-MM-DD
 */
export function obterDataAtual(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

/**
 * Checa se o modal de risco foi já descartado hoje
 */
export function foiModalRiscoDesmissedHoje(): boolean {
  const chave = `clientesRiscoModalDismissed_${obterDataAtual()}`;
  return localStorage.getItem(chave) === "true";
}

/**
 * Marca o modal de risco como descartado para hoje
 */
export function marcarModalRiscoComoDesmissed(): void {
  const chave = `clientesRiscoModalDismissed_${obterDataAtual()}`;
  localStorage.setItem(chave, "true");
}

/**
 * Checa se há um popup de risco minimizado ativo
 * Retorna o timestamp de quando foi criado, ou null se não existe
 */
export function obterPopupRiscoMinimizado(): number | null {
  const chave = `clientesRiscoPopupMinimizado_${obterDataAtual()}`;
  const timestamp = localStorage.getItem(chave);
  return timestamp ? parseInt(timestamp, 10) : null;
}

/**
 * Marca o popup de risco como minimizado com timestamp
 * @param tempoEmMinutos Quanto tempo o popup deve ficar visível (padrão: 30 min)
 */
export function marcarPopupRiscoMinimizado(tempoEmMinutos: number = 30): void {
  const chave = `clientesRiscoPopupMinimizado_${obterDataAtual()}`;
  const agora = Date.now();
  localStorage.setItem(chave, String(agora));

  // Agendar limpeza automática após o tempo
  setTimeout(() => {
    limparPopupRiscoMinimizado();
  }, tempoEmMinutos * 60 * 1000);
}

/**
 * Remove o popup de risco minimizado
 */
export function limparPopupRiscoMinimizado(): void {
  const chave = `clientesRiscoPopupMinimizado_${obterDataAtual()}`;
  localStorage.removeItem(chave);
}

/**
 * Checa se o popup já está expirado baseado no tempo determinado
 * @param tempoEmMinutos Tempo máximo que o popup pode estar visível
 */
export function estaPopupRiscoExpirado(tempoEmMinutos: number = 30): boolean {
  const timestamp = obterPopupRiscoMinimizado();
  if (!timestamp) return false;

  const agora = Date.now();
  const tempoDecorrido = (agora - timestamp) / (1000 * 60); // em minutos

  return tempoDecorrido >= tempoEmMinutos;
}
