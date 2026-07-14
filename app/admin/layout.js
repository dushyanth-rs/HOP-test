import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import AdminSidebar from './AdminSidebar';

export const metadata = {
  title: {
    default: 'Admin — House of Politics',
    template: '%s | HOP Admin',
  },
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  return (
    <div className="min-h-screen bg-obsidian-900 flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 ml-0 lg:ml-64 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
