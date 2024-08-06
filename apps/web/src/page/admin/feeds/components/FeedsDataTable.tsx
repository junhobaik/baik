import React from 'react';

import dynamic from 'next/dynamic';

import type { FeedItem } from '@baik/types';
import { IconCopy } from '@tabler/icons-react';
import dayjs from 'dayjs';

import { DataTableOptions, DataTableProps } from '@/components/DataTable';
import { copyClipboard } from '@/utils';

interface FeedsDataTableProps {
  items: FeedItem[];
  hasNextItems: boolean;
  fetchMoreItems: () => Promise<unknown>;
  isLoading: boolean;
}

const DataTable = dynamic<DataTableProps<FeedItem>>(() => import('@/components/DataTable').then((mod) => mod.default), {
  ssr: false,
});

const tableOptions: DataTableOptions<FeedItem> = {
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

const FeedDataTable = (props: FeedsDataTableProps) => {
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

export default FeedDataTable;
