/**
 * Template Selector Component
 * Displays a searchable list of templates on the left side of a field
 */

import React, { useState, useMemo } from 'react';
import { Input, List, Spin, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { BaseTemplate } from '@/modules/templates/types/template.types';

const { Search } = Input;

interface TemplateSelectorProps<T extends BaseTemplate> {
  templates: T[];
  isLoading?: boolean;
  onSelect: (template: T) => void;
  getDisplayValue?: (template: T) => string;
  height?: string;
  placeholder?: string;
}

export function TemplateSelector<T extends BaseTemplate>({
  templates,
  isLoading,
  onSelect,
  getDisplayValue,
  height = '400px',
  placeholder = 'Search templates...',
}: TemplateSelectorProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter templates based on search term
  const filteredTemplates = useMemo(() => {
    if (!searchTerm) return templates;

    const lowerSearch = searchTerm.toLowerCase();
    return templates.filter((template) => {
      const displayValue = getDisplayValue ? getDisplayValue(template) : template.name;
      return (
        template.name.toLowerCase().includes(lowerSearch) ||
        displayValue.toLowerCase().includes(lowerSearch)
      );
    });
  }, [templates, searchTerm, getDisplayValue]);

  return (
    <div
      className="bg-gray-50 border border-gray-300 rounded-lg overflow-hidden flex flex-col"
      style={{ height }}
    >
      {/* Search Input */}
      <div className="p-3 border-b border-gray-300 bg-white">
        <Search
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          prefix={<SearchOutlined className="text-gray-400" />}
          size="small"
        />
      </div>

      {/* Template List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spin tip="Loading templates..." />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={searchTerm ? 'No templates found' : 'No templates available'}
            />
          </div>
        ) : (
          <List
            size="small"
            dataSource={filteredTemplates}
            renderItem={(template) => {
              return (
                <List.Item
                  className="cursor-pointer hover:bg-blue-50 transition-colors px-3 py-2 border-b border-gray-200"
                  onClick={() => onSelect(template)}
                  style={{ borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
                >
                  <div className="w-full">
                    <div className="text-sm font-medium text-gray-900">{template.name}</div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

TemplateSelector.displayName = 'TemplateSelector';
