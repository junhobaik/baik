'use server';

import React from 'react';

import { type Session } from 'next-auth';

import api from '@/api';
import { auth } from '@/auth';

import DashboardScreen from './components/Screen';

const fetchBookmarkGroupList = async () => {
  const bookmarksRes = await api.server.dashboard.getAllBookmarkGroups();
  const bookmarkGroups = bookmarksRes.data?.items ?? [];
  return bookmarkGroups;
};

interface DashboardProps {}

const Dashboard = async (props: DashboardProps) => {
  const session = await auth();

  const bookmarkGroupList = await fetchBookmarkGroupList();

  return <DashboardScreen session={session} bookmarkGroupList={bookmarkGroupList} />;
};

export default Dashboard;
