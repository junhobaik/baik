'use client';

import React, { useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import { Session } from 'next-auth';

import AdminBookmarks from './components/Bookmarks';

interface AdminScreenProps {
  session: Session | null;
}

const AdminScreen = (props: AdminScreenProps) => {
  const { session } = props;
  const searchParams = useSearchParams();
  const path = useMemo(() => searchParams.get('path'), [searchParams]);

  if (!session) {
    return <div>로그인이 필요합니다.</div>;
  }

  if (path === 'bookmarks') return <AdminBookmarks />;

  return <div></div>;
};

export default AdminScreen;
