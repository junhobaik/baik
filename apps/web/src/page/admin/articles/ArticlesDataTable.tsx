'use client';

// apps/web/src/page/admin/Articles/ArticlesDataTable.tsx
import React from 'react';

import type { Article, BookmarkItem } from '@baik/types';
import { Button } from '@nextui-org/react';
import { IconCopy } from '@tabler/icons-react';
import dayjs from 'dayjs';

import DataTable, { DataTableOptions } from '@/components/DataTable';
import { copyClipboard } from '@/utils';

interface ArticlesDataTableProps {
  items: Article[];
  hasNextItems: boolean;
  fetchMoreItems: () => Promise<unknown>;
  isLoading: boolean;
}

const tableOptions: DataTableOptions<Article> = {
  headers: [
    {
      key: 'id',
      render: (args) => {
        const { value } = args;
        return (
          <div className="flex items-center">
            <IconCopy
              size={16}
              className="text-gray-500 hover:text-gray-700"
              onClick={() => copyClipboard(value as string)}
            />
            <p className="ml-[2px]">{(value as string).slice(0, 3)}</p>
          </div>
        );
      },
    },
    { key: 'status', title: 'Status' },
    { key: 'type', title: 'Type' },
    { key: 'pathname', title: 'Pathname' },
    { key: 'url', title: 'URL' },
    { key: 'title', title: 'Title' },
    { key: 'content', title: 'Content' },
    {
      key: 'created_at',
      title: 'Created At',
      valueParser: (value) => dayjs(value as number).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      key: 'updated_at',
      title: 'Updated At',
      valueParser: (value) => dayjs(value as number).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      key: '',
      title: '',
      render: ({ item }) => {
        return (
          <div>
            {(item.pathname || item.url) && (
              <Button size="sm" href={`/archive/${item.pathname ?? item.url}`} target="_blank" as="a">
                Open
              </Button>
            )}
          </div>
        );
      },
    },
  ],
  index: true,
  checkbox: true,
};

const ArticlesDataTable = (props: ArticlesDataTableProps) => {
  const { items, hasNextItems, fetchMoreItems, isLoading } = props;
  return (
    <DataTable
      items={items}
      options={tableOptions}
      hasNextItems={hasNextItems}
      fetchMoreItems={fetchMoreItems}
      isLoading={isLoading}
    />
  );
};

export default ArticlesDataTable;
