'use client';

// apps/web/src/page/admin/Articles/ArticlesDataTable.tsx
import React from 'react';

import type { Article } from '@baik/types';
import { Select, SelectItem } from '@nextui-org/react';
import { IconCopy } from '@tabler/icons-react';
import dayjs from 'dayjs';

import api from '@/api';
import DataTable, { DataTableOptions } from '@/components/DataTable';
import useArticles from '@/hooks/useArticles';
import { copyClipboard, removeDefaultKey } from '@/utils';

interface ArticlesDataTableProps {
  items: Article[];
  hasNextItems: boolean;
  fetchMoreItems: () => Promise<unknown>;
  isLoading: boolean;
}

const ArticlesDataTable = (props: ArticlesDataTableProps) => {
  const { items, hasNextItems, fetchMoreItems, isLoading } = props;

  const { query } = useArticles();

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
      {
        key: 'status',
        title: 'Status',
        render: ({ value, item }) => {
          const updateStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
            const res = await api.client.archive.updateArticle({
              id: item.id,
              status: e.target.value as Article['status'],
            });
            console.log(res);
          };

          return (
            <Select
              aria-label="Status"
              items={[
                { label: '공개', value: 'published' },
                { label: '비공개', value: 'private' },
                { label: '작성중', value: 'draft' },
              ]}
              size="sm"
              className="w-24"
              defaultSelectedKeys={[value as string]}
              onChange={updateStatus}
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
          );
        },
      },
      { key: 'type', title: 'Type' },
      { key: 'pathname', title: 'Pathname' },
      { key: 'url', title: 'URL' },
      { key: 'title', title: 'Title' },
      {
        key: 'content',
        title: 'Content',
        render: ({ value }) => <p className="line-clamp-1 max-w-40">{value as string}</p>,
      },
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
    ],
    index: true,
    checkbox: false,
    detail: true,
    keysToDisabled: ['GSI1PK', 'GSI1SK', 'GSI2PK', 'GSI2SK', 'GSI3PK', 'GSI3SK', 'GSI4PK', 'GSI4SK'],
    updateItem: async (item: Article) => {
      const filtered = removeDefaultKey(item);
      const res = await api.client.archive.updateArticle({ id: item.id, ...filtered });
      if (res.data?.success) {
        await query.refetch();
      }
    },
    deleteItem: async (id: string) => {
      const res = await api.client.archive.deleteArticle({ id });
      if (res.data?.success) {
        await query.refetch();
      }
    },
  };

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
