'use client';

// apps/web/src/components/DataTable/index.tsx
import React, { useEffect, useMemo } from 'react';

import type { DefaultDBAttributes } from '@baik/types';
import { Button, ButtonProps } from '@nextui-org/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import styled from 'styled-components';

type HeaderOption<T extends DefaultDBAttributes> = {
  key: keyof T | '' | '_';
  title?: string;
} & (
  | { render?: never; valueParser?: never }
  | { render: (args: { value: T[keyof T]; items: T[]; item: T }) => React.ReactNode; valueParser?: never }
  | { valueParser: (value: T[keyof T]) => T[keyof T]; render?: never }
);

export interface DataTableOptions<T extends DefaultDBAttributes> {
  headers: HeaderOption<T>[];
  index?: boolean;
  checkbox?: boolean;
}

type DataTableProps<T extends DefaultDBAttributes> = {
  items: T[];
  options: DataTableOptions<T>;
} & (
  | { hasNextItems?: never; fetchMoreItems?: never; isLoading?: never }
  | { hasNextItems: boolean; fetchMoreItems: () => Promise<unknown>; isLoading: boolean }
);

const DataTable = <T extends DefaultDBAttributes>(props: DataTableProps<T>) => {
  const { items, options, hasNextItems = false, fetchMoreItems, isLoading = false } = props;

  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    console.log('rowSelection', rowSelection);
  }, [rowSelection]);

  const headers = useMemo(() => {
    return options.headers.map((header) => {
      if (!header.key) header.key = '_';
      return { ...header };
    });
  }, [options.headers]);

  const columns = useMemo<ColumnDef<T>[]>(() => {
    const baseColumns: ColumnDef<T>[] = headers.map((header) => ({
      accessorKey: header.key as string,
      header: header.title ?? (header.key as string),
      cell: (info) => {
        const value = info.getValue() as T[keyof T];

        if (header.render) {
          const item = info.row.original;
          return header.render({ value, items, item });
        }

        if (header.valueParser) {
          return header.valueParser(value)?.toString() ?? '';
        }

        return value?.toString() ?? '';
      },
    }));

    if (options.index) {
      baseColumns.unshift({
        accessorKey: '__index',
        header: '',
        cell: (info) => info.row.index + 1,
      });
    }

    if (options.checkbox) {
      baseColumns.unshift({
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
        ),
      });
    }

    return baseColumns;
  }, [options.headers, options.index, options.checkbox, items]);

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  const paginationButtonProps = useMemo(() => {
    let variant = 'flat';
    let color = 'default';

    if (hasNextItems) {
      variant = 'flat';
      color = 'primary';
    }
    if (!hasNextItems) {
      variant = 'ghost';
    }
    if (isLoading) {
      variant = 'solid';
      color = 'warning';
    }
    return {
      variant: variant,
      color: color,
      loading: isLoading,
      isLoading: isLoading,
      isDisabled: !hasNextItems,
    } as Partial<ButtonProps>;
  }, [isLoading, hasNextItems]);

  return (
    <TableContainer>
      <TableWrapper>
        <TableStyled>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </TableStyled>
      </TableWrapper>
      <PaginationContainer>
        <Button
          fullWidth
          onClick={() => {
            fetchMoreItems?.();
          }}
          {...paginationButtonProps}
        >
          {isLoading && 'Loading...'}
          {!isLoading && hasNextItems && 'Load more'}
          {!isLoading && !hasNextItems && 'No more items'}
        </Button>
      </PaginationContainer>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const TableWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: auto;
  border-radius: 8px;
  background-color: #fff;
`;

const TableStyled = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;

  thead {
    position: sticky;
    top: 0;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    z-index: 1;

    th,
    td {
      padding: 16px 12px;
      text-align: left;
    }
  }

  th,
  td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #eeeeee;
  }

  th {
    font-weight: bold;
    white-space: nowrap;
  }

  /* tbody tr:nth-child(even) {
    background-color: #f8f8f8;
  } */

  tbody tr:hover {
    background-color: rgb(239, 246, 255);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

export default DataTable;
