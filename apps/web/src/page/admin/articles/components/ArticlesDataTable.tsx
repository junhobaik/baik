'use client';

// apps/web/src/page/admin/Articles/ArticlesDataTable.tsx
import React from 'react';

import { useRouter } from 'next/navigation';

import type { Article } from '@baik/types';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { IconCopy, IconLink } from '@tabler/icons-react';
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
  const router = useRouter();

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
              disabledKeys={item.type === 'clip' ? ['draft'] : []}
              items={[
                { label: '🟢 공개', value: 'published' },
                { label: '🔴 비공개', value: 'private' },
                { label: '🟠 작성중', value: 'draft' },
              ]}
              size="sm"
              className="w-28"
              defaultSelectedKeys={[value as string]}
              onChange={updateStatus}
            >
              {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
            </Select>
          );
        },
      },
      { key: 'type', title: 'Type' },
      {
        key: 'pathname',
        title: 'Path | URL',
        headerStyle: 'text-center',
        cellStyle: 'text-center',
        render: ({ item }) => {
          return (
            <div>
              {!!item.pathname && <p>{item.pathname}</p>}
              {!!item.url && (
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => {
                    window.open(item.url, '_blank');
                  }}
                >
                  <IconLink size={16} />
                </Button>
              )}
            </div>
          );
        },
      },
      { key: 'title', title: 'Title', cellStyle: 'font-bold' },
      {
        key: 'intl',
        title: 'intl',
        render: ({ item }) => {
          if (item.intl?.en) {
            return <p>🇺🇸</p>;
          }
          return null;
        },
      },
      {
        key: 'published_date',
        title: 'Published',
        valueParser: (value) => dayjs(value as number).format('YYYY-MM-DD\nHH:mm:ss'),
      },
      {
        key: 'updated_date',
        title: 'Updated',
        valueParser: (value) => dayjs(value as number).format('YYYY-MM-DD\nHH:mm:ss'),
      },
      {
        key: '',
        title: '',
        render: ({ item }) => {
          return (
            <Button
              size="sm"
              color="primary"
              isDisabled={!item.pathname}
              onClick={() => {
                router.push('/archive/write?pathname=' + item.pathname);
              }}
            >
              Edit
            </Button>
          );
        },
      },
    ],
    index: true,
    checkbox: true,
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
    deleteItems: async (selections: { pk: string; created_at: number }[]) => {
      const res = await api.client.archive.deleteArticles(selections);
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
