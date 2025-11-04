import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { AddDocumentModal } from '../components/AddDocumentModal';
import { EditDocumentModal } from '../components/EditDocumentModal';
import { DocumentCard } from '../components/DocumentCard';
import { documentService, type Document } from '../services/documentService';

export const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('documents_currentPage');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState(() => {
    return localStorage.getItem('documents_selectedTag') || '';
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await documentService.getDocuments(
        currentPage,
        10,
        selectedTag || undefined
      );
      setDocuments(response.documents);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await documentService.getTags();
      setAvailableTags(response.tags);
    } catch (err) {
      console.error('Failed to load tags:', err);
    }
  };

  // Persist currentPage to localStorage
  useEffect(() => {
    localStorage.setItem('documents_currentPage', currentPage.toString());
  }, [currentPage]);

  // Persist selectedTag to localStorage
  useEffect(() => {
    localStorage.setItem('documents_selectedTag', selectedTag);
  }, [selectedTag]);

  useEffect(() => {
    fetchDocuments();
    fetchTags();
  }, [currentPage, selectedTag]);

  const handleAddDocument = async (data: { title: string; tag: string; file: File }) => {
    await documentService.createDocument(data);
    setCurrentPage(1);
    localStorage.setItem('documents_currentPage', '1');
    await fetchDocuments();
    await fetchTags();
  };

  const handleEditDocument = async (id: number, data: { title: string; tag: string }) => {
    await documentService.updateDocument(id, data);
    await fetchDocuments();
    await fetchTags();
  };

  const handleDeleteDocument = async (id: number) => {
    try {
      await documentService.deleteDocument(id);

      // If we're deleting the last document on a page that's not the first page,
      // navigate to the previous page
      if (documents.length === 1 && currentPage > 1) {
        const newPage = currentPage - 1;
        setCurrentPage(newPage);
        localStorage.setItem('documents_currentPage', newPage.toString());
      } else {
        await fetchDocuments();
      }

      await fetchTags();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete document');
    }
  };

  const handleDownloadDocument = async (id: number, filename: string) => {
    try {
      await documentService.downloadDocument(id, filename);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to download document');
    }
  };

  const handleEditClick = (document: Document) => {
    setEditingDocument(document);
    setIsEditModalOpen(true);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
    localStorage.setItem('documents_selectedTag', tag);
    localStorage.setItem('documents_currentPage', '1');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Documents</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add Document
            </button>
          </div>

          {/* Tag Filter */}
          {availableTags.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by tag:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTagFilter('')}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition font-medium text-sm sm:text-base ${
                    selectedTag === ''
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`px-3 sm:px-4 py-2 rounded-lg transition font-medium text-sm sm:text-base ${
                      selectedTag === tag
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading documents...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && documents.length === 0 && (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {selectedTag ? `No documents with tag "${selectedTag}"` : 'No documents yet'}
              </h3>
              <p className="text-gray-500">
                {selectedTag
                  ? 'Try selecting a different tag or add new documents.'
                  : 'Start by adding your first document using the button above.'}
              </p>
            </div>
          )}

          {/* Documents Grid */}
          {!loading && documents.length > 0 && (
            <>
              <div className="grid gap-4 mb-6">
                {documents.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onDownload={handleDownloadDocument}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteDocument}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 text-sm sm:text-base">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDocument}
      />

      <EditDocumentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditDocument}
        document={editingDocument}
      />
    </Layout>
  );
};
