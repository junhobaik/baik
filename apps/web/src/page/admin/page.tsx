import React from 'react';

import { auth } from '@/auth';

import AdminScreen from './Screen';

const AdminPage = async () => {
  const session = await auth();

  return <AdminScreen session={session} />;
};

export default AdminPage;
