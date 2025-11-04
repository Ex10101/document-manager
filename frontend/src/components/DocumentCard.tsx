import React from 'react';
import { FileText, Download, Edit, Trash2 } from 'lucide-react';
import type { Document } from '../services/documentService';

interface DocumentCardProps {
  document: Document;
  onDownload: (id: number, filename: string) => void;
  onEdit: (document: Document) => void;
  onDelete: (id: number) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDownload,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" strokeWidth={2} />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {document.title}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">
            {document.originalFilename}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500">
            {document.tag && (
              <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                {document.tag}
              </span>
            )}
            <span className="text-xs">{formatDate(document.createdAt)}</span>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto sm:ml-4">
          <button
            onClick={() => onDownload(document.id, document.originalFilename)}
            className="flex-1 sm:flex-none p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
            title="Download"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" strokeWidth={2} />
          </button>

          <button
            onClick={() => onEdit(document)}
            className="flex-1 sm:flex-none p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Edit"
          >
            <Edit className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" strokeWidth={2} />
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this document?')) {
                onDelete(document.id);
              }
            }}
            className="flex-1 sm:flex-none p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};
