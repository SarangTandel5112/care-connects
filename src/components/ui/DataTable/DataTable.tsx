import React from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  onSort?: (key: keyof T | string, direction: 'asc' | 'desc') => void;
  sortKey?: keyof T | string;
  sortDirection?: 'asc' | 'desc';
  rowClassName?: (row: T, index: number) => string;
  hoverable?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  onSort,
  sortKey,
  sortDirection = 'asc',
  rowClassName,
  hoverable = true,
}: DataTableProps<T>) {
  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;

    const newDirection = sortKey === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column.key, newDirection);
  };

  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const getValue = (row: T, key: keyof T | string): any => {
    if (typeof key === 'string' && key.includes('.')) {
      return key.split('.').reduce((obj, k) => obj?.[k], row);
    }
    return row[key as keyof T];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" label="Loading table data..." />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200" role="table">
        <thead className="bg-gray-50">
          <tr role="row">
            {columns.map((column, index) => (
              <th
                key={String(column.key)}
                scope="col"
                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${getAlignmentClass(column.align)} ${
                  column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                }`}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
                role="columnheader"
                aria-sort={
                  sortKey === column.key
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                <div className="flex items-center gap-2">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <span className="flex flex-col">
                      <svg
                        className={`w-3 h-3 ${
                          sortKey === column.key && sortDirection === 'asc'
                            ? 'text-primary-600'
                            : 'text-gray-400'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" />
                      </svg>
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              role="row"
              onClick={() => onRowClick?.(row, rowIndex)}
              className={`
                ${onRowClick ? 'cursor-pointer' : ''}
                ${hoverable ? 'hover:bg-gray-50 transition-colors' : ''}
                ${rowClassName ? rowClassName(row, rowIndex) : ''}
              `}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyPress={(e) => {
                if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRowClick(row, rowIndex);
                }
              }}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  role="cell"
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${getAlignmentClass(column.align)}`}
                >
                  {column.render
                    ? column.render(getValue(row, column.key), row, rowIndex)
                    : String(getValue(row, column.key) ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
