/** Menu principal: cinco itens, todos com página real. */
export const MAIN_NAV = [
  { href: '/inicio', label: 'Início' },
  { href: '/explorar', label: 'Explorar' },
  { href: '/listas', label: 'Listas' },
  { href: '/diario', label: 'Diário' },
  { href: '/comunidade', label: 'Comunidade' },
] as const;

/** Menu pessoal, aberto pelo avatar. */
export const USER_NAV = [
  { href: '/perfil', label: 'Perfil' },
  { href: '/configuracoes', label: 'Configurações' },
  { href: '/sobre', label: 'Sobre o CineVault' },
] as const;

/** Um item fica ativo na própria rota e nas rotas filhas (/listas/favoritos → Listas). */
export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
