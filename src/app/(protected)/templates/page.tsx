/**
 * Templates Page
 * Template management with document templates
 * Professional medical application design - UI only
 * Following Single Responsibility Principle
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import {
  PlusIcon,
  SearchIcon,
  DownloadIcon,
  DocumentIcon,
  FileTextIcon,
  ClipboardListIcon,
  StethoscopeIcon,
  PillIcon,
  PackageIcon,
  ChevronRightIcon,
} from '@/components/ui/icons';

export default function Templates() {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleAddTemplate = () => {
    // TODO: Implement add template functionality
    console.log('Add template clicked');
  };

  const handleImportTemplate = () => {
    // TODO: Implement import template functionality
    console.log('Import template clicked');
  };

  const handleTemplateTypeClick = (type: string) => {
    router.push(`/templates/${type}`);
  };

  const TEMPLATE_TYPES = [
    {
      label: 'Advice',
      value: 'advice',
      icon: <DocumentIcon className="h-8 w-8" />,
      description: 'Medical advice and recommendations',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      label: 'Complaint',
      value: 'complaint',
      icon: <FileTextIcon className="h-8 w-8" />,
      description: 'Patient complaint documentation',
      color: 'bg-red-50 text-red-600 border-red-200',
    },
    {
      label: 'Examination',
      value: 'examination',
      icon: <StethoscopeIcon className="h-8 w-8" />,
      description: 'Medical examination reports',
      color: 'bg-green-50 text-green-600 border-green-200',
    },
    {
      label: 'Procedure',
      value: 'procedure',
      icon: <ClipboardListIcon className="h-8 w-8" />,
      description: 'Medical procedure documentation',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      label: 'Medicine',
      value: 'medicine',
      icon: <PillIcon className="h-8 w-8" />,
      description: 'Medication and prescription forms',
      color: 'bg-orange-50 text-orange-600 border-orange-200',
    },
    {
      label: 'Medicine Package',
      value: 'medicine-package',
      icon: <PackageIcon className="h-8 w-8" />,
      description: 'Medicine package documentation',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
  ];

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Templates</h1>
            <p className="text-sm text-gray-700 mt-1">Manage document templates and forms</p>
          </div>

          {/* Search and Actions */}
        </div>
      </div>

      {/* Template Type Cards */}
      <div className="flex-1 min-h-0 bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATE_TYPES.map((template) => (
              <div
                key={template.value}
                onClick={() => handleTemplateTypeClick(template.value)}
                className={`bg-white rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer group ${template.color}`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${template.color}`}>{template.icon}</div>
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      <ChevronRightIcon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {template.label}
                  </h3>

                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                    {template.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
