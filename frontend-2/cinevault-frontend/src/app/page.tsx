import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redireciona automaticamente para a rota /home
  redirect('/login');
}