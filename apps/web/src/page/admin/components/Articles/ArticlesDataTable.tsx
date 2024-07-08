import React from 'react';

import type { Article, BookmarkItem } from '@baik/types';
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
