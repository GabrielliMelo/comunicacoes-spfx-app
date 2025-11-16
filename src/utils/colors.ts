export const setBullet = (status: string): string => {
  switch (status) {
    case 'Novo':
      return 'bg-orange-500 text-orange-800';
    case 'Aberto':
      return 'bg-blue-500 text-blue-800';
    case 'Em Espera com Fornecedor':
    case 'Em Espera com Área':
    case 'Ajuste da Apólice':
    case 'Aguardando Apólice':
      return 'bg-gray-500 text-gray-800';
    case 'Resolvido':
    case 'Apólice Enviada':
      return 'bg-green-500 text-green-800';
    case 'Cancelado':    
      return 'bg-red-500 text-red-800';
    case 'Devolvido para Correção':
      return 'bg-yellow-500 text-yellow';
    case 'Corrigido':
      return 'bg-purple-500 text-purple-800';
    default:
      return 'bg-gray-500 text-gray-800';
  }
};

export const generateUserInitials = (name: string): string => {
  return name.charAt(0).toUpperCase();
}

export const getRandomColor = (): string => {
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];
  const randomIndex = Math.floor(Math.random() * colors?.length);
  return colors[randomIndex];
}