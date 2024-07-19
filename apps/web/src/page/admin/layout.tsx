import { redirect } from 'next/navigation';

import { auth } from '@/auth';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) redirect('/api/auth/signin');

  return children;
};

export default AdminLayout;
