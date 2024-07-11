import React from 'react';

import type { BookmarkGroup, BookmarkItem } from '@baik/types';
import { IconCopy } from '@tabler/icons-react';
import dayjs from 'dayjs';

import api from '@/api';
import DataTable, { DataTableOptions } from '@/components/DataTable';
import useBookmarkGroups from '@/hooks/useBookmarkGroups';
import { copyClipboard, removeDefaultKey } from '@/utils';

interface BookmarkDataTableProps {
  items: BookmarkGroup[];
  hasNextItems: boolean;
  fetchMoreItems: () => Promise<unknown>;
  isLoading: boolean;
}

const BookmarkDataTable = (props: BookmarkDataTableProps) => {
  const { items, hasNextItems, fetchMoreItems, isLoading } = props;
  const { query } = useBookmarkGroups();

  const tableOptions: DataTableOptions<BookmarkGroup> = {
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
      { key: 'title', title: 'Title' },
      { key: 'description', title: 'Description', valueParser: (value) => (value as string)?.slice(0, 20) },
      { key: 'collapsed', title: 'Collapsed' },
      { key: 'order', title: 'Order' },
      { key: 'items', title: 'items', valueParser: (value) => (value as BookmarkItem[]).length },
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
    detail: true,
    updateItem: async (item: BookmarkGroup) => {
      const filtered = removeDefaultKey(item);

      if (item.data_type === 'bookmarkGroup') {
        const res = await api.client.dashboard.updateBookmarkGroup({ id: item.id, ...filtered });
        if (res.data?.success) {
          await query.refetch();
        }
      }

      // TODO: Feeds
    },
    deleteItem: async (id: string) => {
      const res = await api.client.dashboard.deleteBookmarkGroup({ id });
      if (res.data?.success) {
        await query.refetch();
      }
    },
    deleteItems: async (selections: { pk: string; sk: string }[]) => {
      const res = await api.client.dashboard.deleteBookmarkGroups(selections);
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

export default BookmarkDataTable;
