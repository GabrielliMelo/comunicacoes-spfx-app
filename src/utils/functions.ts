export const getComparisonOptions = (field: string) => {
  if (field === "FileLeafRef") {
    return ["Igual a"];
  } else if (field === "DataNascimento") {
    return ["Igual a", "Diferente de"];
  } else {
    return ["Contém", "Não contém", "Igual a", "Diferente de"];
  }
};

export const sortArrayByOrder = (columns: any[], order: string[]) => {
  return [...columns].sort((a, b) => {
    const indexA = order.indexOf(a.InternalName);
    const indexB = order.indexOf(b.InternalName);
    return indexA - indexB;
  });
};
