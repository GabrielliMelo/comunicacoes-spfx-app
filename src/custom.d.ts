declare module "*.gif" {
  const content: string;
  export default content;
}
declare module "*.jpg" {
  const content: string;
  export default content;
}
declare module "*.jpeg" {
  const content: string;
  export default content;
}
declare module "react-world-flags" {
  const Flag: React.FC<{ code: string; height: string }>;
  export default Flag;
}

declare module "*.png" {
  const content: string;
  export default content;
}
// Permite importação de módulos SCSS com tipagem genérica de classes.
// (Removido suporte a scss modules porque o layout usa Tailwind)
declare module "*.css";
