'use client';

import React from 'react';

import { Article, BookmarkGroup, ClipArticleBase, PostArticleBase, ShortsArticleBase } from '@baik/types';
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

      <div className="m-2 p-2 border">
        <p>Archive &gt; Article</p>

        <Button
          className="m-2"
          onClick={async () => {
            const now = +Date.now();
            const nowStr = now.toString();
            const post: PostArticleBase = {
              type: 'post',
              status: 'published',
              pathname: nowStr,
              content: nowStr,
              published_date: now,
              updated_date: now,
              title: `Article Title ${now}`,
            };

            const res = await api.client.archive.createArticle(post);
            console.log(res);
          }}
        >
          createArticle / post / published
        </Button>

        <Button
          className="m-2"
          onClick={async () => {
            const now = +Date.now();
            const nowStr = now.toString();
            const shorts: ShortsArticleBase = {
              type: 'shorts',
              status: 'published',
              pathname: nowStr,
              content: nowStr,
              published_date: now,
              updated_date: now,
              title: `Article Title ${now}`,
            };

            const res = await api.client.archive.createArticle(shorts);
            console.log(res);
          }}
        >
          createArticle / shorts / published
        </Button>

        <Button
          className="m-2"
          onClick={async () => {
            const now = +Date.now();
            const nowStr = now.toString();
            const clip: ClipArticleBase = {
              type: 'clip',
              status: 'published',
              url: 'https://devarchive.me/junhobaik/develop-devarchive',
              content: nowStr,
              published_date: now,
              updated_date: now,
              title: `Article Title ${now}`,
              origin_title: `Origin Title ${now}`,
              site: {
                title: 'Site Title',
                link: 'https://devarchive.me',
                description: 'Site Description',
                favicon_url: 'https://devarchive.me/icon-32.png',
              },
            };

            const res = await api.client.archive.createArticle(clip);
            console.log(res);
          }}
        >
          createArticle / clip / published
        </Button>

        <Button
          className="m-2"
          onClick={async () => {
            const now = +Date.now();
            const nowStr = now.toString();
            const post: PostArticleBase = {
              type: 'post',
              status: 'draft',
              pathname: nowStr,
              content: nowStr,
              published_date: now,
              updated_date: now,
              title: `Article Title ${now}`,
            };

            const res = await api.client.archive.createArticle(post);
            console.log(res);
          }}
        >
          createArticle / post / draft
        </Button>

        <Button
          className="m-2"
          onClick={async () => {
            const now = +Date.now();
            const nowStr = now.toString();
            const post: PostArticleBase = {
              type: 'post',
              status: 'private',
              pathname: nowStr,
              content: nowStr,
              published_date: now,
              updated_date: now,
              title: `Article Title ${now}`,
            };

            const res = await api.client.archive.createArticle(post);
            console.log(res);
          }}
        >
          createArticle / post / private
        </Button>

        <Button
          className="m-2"
          onClick={async () => {
            const res1 = await api.client.archive.getAllArticles();
            console.log('default', res1);

            const res2 = await api.client.archive.getAllArticles({ orderBy: 'updated_date' });
            console.log('orderBy: updated_date', res2);
          }}
        >
          getAllArticles
        </Button>

        <Button
          className="m-2"
          onClick={async () => {
            const res1 = await api.client.archive.getAllArticlesPublic();
            console.log('default', res1);

            const res2 = await api.client.archive.getAllArticlesPublic({ orderBy: 'updated_date' });
            console.log('orderBy: updated_date', res2);
          }}
        >
          getAllArticlesPublic
        </Button>

        <Button
          className="m-2"
          onClick={async () => {
            const res1 = await api.client.archive.getAllArticles();
            if (!res1.data?.items?.length) return;

            const item = res1.data?.items[0];

            const res = await api.client.archive.updateArticle({ id: item.id, title: 'Updated Title' });
            console.log(res);
            console.log('  origin > ', item);
            console.log('  update > ', res.data?.item);
          }}
        >
          updateArticle
        </Button>

        <Button
          className="m-2"
          onClick={async () => {
            const res1 = await api.client.archive.getAllArticles();
            if (!res1.data?.items?.length) return;

            const item = res1.data?.items[0];
            const length = res1.data?.items.length;

            const res = await api.client.archive.deleteArticle({ id: item.id });
            console.log(res);

            const res2 = await api.client.archive.getAllArticles();

            const length2 = res2.data?.items.length;
            console.log(`  length > ${length} -> ${length2}`);
          }}
        >
          deleteArticle
        </Button>

        <Button
          className="m-2"
          onClick={async () => {
            const res1 = await api.client.archive.getAllArticles();
            if (!res1.data?.items?.length) return;

            const item = res1.data?.items.find((v: Article) => (v as any).pathname);

            const res = await api.client.archive.getArticlesByPathname({ pathname: item.pathname });
            console.log('default', res);

            const res2 = await api.client.archive.getArticlesByPathnamePublic({ pathname: item.pathname });
            console.log('public', res2);
          }}
        >
          getArticlesByPathname
        </Button>
      </div>
    </div>
  );
};

export default ApiTest;
