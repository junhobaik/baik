'use server';

import React from 'react';

import { Session } from 'next-auth';

import api from '@/api';

import DashboardScreen from './Screen';

const fetchBookmarkGroupList = async () => {
  const bookmarksRes = await api.server.dashboard.getAllBookmarkGroups();
  const bookmarkGroups = bookmarksRes.data?.items ?? [];
  return bookmarkGroups;
};

const Dashboard = async (props: { session: Session }) => {
  const { session } = props;

  const bookmarkGroupList = await fetchBookmarkGroupList();

  return <DashboardScreen session={session} bookmarkGroupList={bookmarkGroupList} />;
};

export default Dashboard;
