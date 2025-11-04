import { Layout } from '../components/Layout';

export const Documents: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Documents</h2>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
              Add Document
            </button>
          </div>

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
              No documents yet
            </h3>
            <p className="text-gray-500">
              Start by adding your first document using the button above.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
