import React from 'react';

import Sidebar from './components/Sidebar';

const AdminLayout = async (props: { children: React.ReactNode; params: { account_name: string } }) => {
  const { children, params } = props;

  return (
    <main className="fixed top-0 left-0 flex flex-1 h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">{children}</div>
    </main>
  );
};

export default AdminLayout;
