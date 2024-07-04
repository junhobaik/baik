'use client';

import React from 'react';

import { BookmarkGroup } from '@baik/types';
import { Button } from '@nextui-org/react';
import { getSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';

import api from '@/api';

const ApiTest = () => {
  return (
    <div className="p-4">
      <p className="ml-2 text-lg text-bold">API Test</p>

      <div className="m-2 p-2 border">
        <p>Auth</p>
        <Button
          className="m-2"
          onClick={async () => {
            const session = await getSession();

            if (session?.sessionToken) {
              const res = await api.client.auth.verifySession({ sessionToken: session.sessionToken });
              console.log(res);
            }
          }}
        >
          verifyCurrentSession
        </Button>
      </div>

      <div className="m-2 p-2 border">
        <p>Dashboard &gt; BookmarkGroup</p>
        <Button
          className="m-2"
          onClick={async () => {
            const res = await api.client.dashboard.getAllBookmarkGroups();
            console.log(res);
          }}
        >
          getAllBookmarkGroups
        </Button>

        <Button
          className="m-2"
          onClick={async () => {
            const listRes = await api.client.dashboard.getAllBookmarkGroups();
            const list = listRes.data?.items ?? [];
            const list2 = list.length ? list : [{ order: 0 }];
            const newOrder = Math.max(...list2.map((v: any) => v.order));
            console.log(newOrder);

            const res = await api.client.dashboard.createBookmarkGroup({
              title: `Bookmark Group ${newOrder + 1}`,
              order: newOrder + 1,
              collapsed: false,
              items: [],
            });
            console.log(res);
          }}
        >
          createBookmarkGroup
        </Button>

        <Button
          className="m-2"
          onClick={async () => {
            const listRes = await api.client.dashboard.getAllBookmarkGroups();
            const list: BookmarkGroup[] = listRes.data?.items ?? [];

            if (!list.length) return;

            const res = await api.client.dashboard.deleteBookmarkGroup({ id: list[0].id });
            console.log(res);
          }}
        >
          deleteBookmarkGroup
        </Button>

        <Button
          className="m-2"
          onClick={async () => {
            const listRes = await api.client.dashboard.getAllBookmarkGroups();
            const list: BookmarkGroup[] = listRes.data?.items ?? [];

            if (!list.length) return;

            const res = await api.client.dashboard.updateBookmarkGroup({
              id: list[0].id,
              title: 'Updated Title',
              items: [{ id: uuidv4(), title: 'bookmark item', url: 'https://example.com' }],
            });
            console.log(res);
          }}
        >
          updateBookmarkGroup
        </Button>
      </div>
    </div>
  );
};

export default ApiTest;
