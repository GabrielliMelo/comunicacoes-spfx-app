# Sistema de Alerta de Risco de Clientes

## Visão Geral

Sistema automático que exibe um modal de alerta quando o usuário entra na aplicação, informando sobre clientes em situação de risco (SLA crítico, saúde vermelha, atrasos recorrentes).

## Componentes

### 1. **ClientesRiscoModal** (`src/components/ClientesRiscoModal.tsx`)

Componente modal que exibe lista de clientes em risco.

**Props:**

```typescript
interface ClientesRiscoModalProps {
  aberto: boolean; // Controla visibilidade
  onClose: () => void; // Callback ao fechar
  clientesRisco: InsightsClienteRisco[]; // Array de clientes em risco
  onIrParaInsights?: () => void; // Callback para ir para Insights
}
```

**Características:**

- Modal centralizado com overlay escuro
- Lista scrollável de clientes em risco
- Exibe para cada cliente:
  - Nome e motivo principal
  - Health score e classificação (Verde/Amarelo/Vermelho)
  - Prioridade (Baixa/Média/Alta/Estratégico)
  - Tempo médio de resposta
  - Quantidade de atrasos e sem resposta
  - Pessoas envolvidas
  - Canal predominante
- Botões de ação:
  - "Ok, entendi" → Fecha o modal
  - "Ver detalhes em Insights" → Navega para página de Insights

### 2. **filtrarClientesEmAltoRisco()** (`src/utils/insightsHelpers.ts`)

Função que filtra clientes em alto risco com base em critérios.

**Critérios de Alto Risco:**

- Health classificação = "Vermelho" **OU**
- SLA muito crítico:
  - Tempo médio de resposta > 40 minutos **OU**
  - Quantidade de atrasos >= 3 **OU**
  - Comunicações sem resposta >= 2

**Uso:**

```typescript
const clientesRisco = filtrarClientesEmAltoRisco(clientesArray);
```

### 3. **localStorage e Persistência**

Funções auxiliares para evitar mostrar o modal repetidamente:

```typescript
// Verifica se foi dismissido hoje
foiModalRiscoDesmissedHoje(): boolean

// Marca como dismissido hoje
marcarModalRiscoComoDesmissed(): void
```

**Comportamento:**

- Usa chave `clientesRiscoModalDismissed_YYYY-MM-DD`
- Se o usuário clicar "Ok, entendi", a chave é gravada com a data do dia
- Próxima entrada no mesmo dia → modal não aparece
- Próximo dia → modal aparece novamente se houver clientes em risco

## Integração no AppShell

### Estados:

```typescript
const [mostrarClientesRiscoModal, setMostrarClientesRiscoModal] =
  React.useState(false);
const [clientesEmAltoRisco, setClientesEmAltoRisco] = React.useState<
  typeof insightsClientesRiscoMock
>([]);
```

### useEffect (na montagem):

```typescript
React.useEffect(() => {
  // 1. Verifica localStorage se foi dismissido hoje
  if (foiModalRiscoDesmissedHoje()) return;

  // 2. Filtra clientes em alto risco
  const clientesRisco = filtrarClientesEmAltoRisco(insightsClientesRiscoMock);

  // 3. Se há risco, abre o modal
  if (clientesRisco.length > 0) {
    setClientesEmAltoRisco(clientesRisco);
    setMostrarClientesRiscoModal(true);
  }
}, []);
```

### Handlers:

```typescript
const handleFecharModalRisco = () => {
  setMostrarClientesRiscoModal(false);
  marcarModalRiscoComoDesmissed(); // Grava em localStorage
};

const handleIrParaInsights = () => {
  setCurrentPage("insights"); // Navega para Insights
};
```

### Render:

```typescript
<ClientesRiscoModal
  aberto={mostrarClientesRiscoModal}
  onClose={handleFecharModalRisco}
  clientesRisco={clientesEmAltoRisco}
  onIrParaInsights={handleIrParaInsights}
/>
```

## Fluxo de Funcionamento

1. **Usuário entra na aplicação**
   ↓
2. **AppShell monta e executa useEffect**
   ↓
3. **Verifica localStorage: foi dismissido hoje?**
   - SIM → Encerra (não mostra modal)
   - NÃO → Continua
     ↓
4. **Filtra clientes em alto risco**
   ↓
5. **Há clientes em risco?**
   - SIM → Abre modal com lista
   - NÃO → Nada acontece
     ↓
6. **Usuário interage com modal**
   - Clica "Ok, entendi" → Fecha, grava localStorage
   - Clica "Ver detalhes em Insights" → Navega para Insights, fecha modal

## Dados Mock

Os dados estão em `src/pages/Insights.tsx`:

```typescript
export const insightsClientesRiscoMock: InsightsClienteRisco[] = [
  {
    clienteId: 2,
    nomeCliente: "Cliente Beta",
    prioridade: "Alta",
    healthClassificacao: "Vermelho", // ← Vai aparecer no alerta
    healthScore: 55,
    motivoPrincipal: "Múltiplos atrasos e tempo de resposta alto.",
    tempoMedioRespostaMin: 48,
    qtdAtrasosPeriodo: 5, // ← >= 3 ativa alerta
    qtdSemRespostaPeriodo: 2, // ← >= 2 ativa alerta
    principaisPessoasEnvolvidas: ["Ana Silva", "Carlos Santos"],
    canalPredominante: "email",
  },
  // ... mais clientes
];
```

## Customização

### Alterar critérios de risco:

Edite `src/utils/insightsHelpers.ts`, função `filtrarClientesEmAltoRisco()`:

```typescript
export function filtrarClientesEmAltoRisco(
  clientes: InsightsClienteRisco[]
): InsightsClienteRisco[] {
  return clientes.filter((cliente) => {
    // Adicione ou remova critérios aqui
  });
}
```

### Alterar período de dismissão:

Em `src/utils/insightsHelpers.ts`, função `obterDataAtual()`:

```typescript
export function obterDataAtual(): string {
  // Altere para semanal, mensal, etc.
  const hoje = new Date();
  // ... lógica diferente
}
```

### Customizar aparência do modal:

Edite `src/components/ClientesRiscoModal.tsx`:

- Cores dos cards
- Layout dos clientes
- Textos e mensagens
- Ícones

## Testing

Para testar manualmente:

1. **Abra DevTools (F12)**
2. **Vá para Application → LocalStorage**
3. **Procure por chave `clientesRiscoModalDismissed_*`**
4. **Para forçar exibição: delete a chave**
5. **Recarregue a página (F5)**
6. **Modal deve aparecer com clientes em risco**

Ou altere `insightsClientesRiscoMock` adicionando mais clientes com `healthClassificacao: "Vermelho"`.

## Notas de Produção

- O sistema usa dados mock (`insightsClientesRiscoMock`)
- Em produção, integre com API real que retorna clientes em risco
- Considere adicionar notificação visual na navbar quando há clientes críticos
- Pode-se expandir para múltiplos alertas (por tipo de risco)
