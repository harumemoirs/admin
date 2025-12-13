/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Trash2, ChevronLeft, ChevronRight, Loader2, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { removeSubscriber } from '@/src/functions/services/newsletterrs/removal-service';
import { getPaginatedSubscribers } from '@/src/functions/services/newsletterrs/get-service';

interface Subscriber {
  id: string;
  email: string;
  joinedAt: string;
  isSubscribed: boolean;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponse {
  success: boolean;
  data: Subscriber[];
  pagination: PaginationData;
  message?: string;
}

export default function SubscriberList() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; subscriber: Subscriber | null }>({
    isOpen: false,
    subscriber: null,
  });

  const fetchSubscribers = async (page: number = 1, limit: number = 20) => {
    try {
      setLoading(true);
      setError(null);
      
      const data: ApiResponse = await getPaginatedSubscribers(page, limit);
      
      if (data.success) {
        setSubscribers(data.data);
        setPagination(data.pagination);
      } else {
        const errorMsg = data.message || 'Failed to load subscribers';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const openDeleteModal = (subscriber: Subscriber) => {
    setDeleteModal({ isOpen: true, subscriber });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, subscriber: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.subscriber) return;

    const { id, email } = deleteModal.subscriber;

    try {
      setDeletingEmail(email);
      closeDeleteModal();
      
      await removeSubscriber(id);
      
      toast.success(`${email} has been removed successfully`);
      
      // Refresh the current page
      await fetchSubscribers(pagination.page, pagination.limit);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to delete subscriber';
      toast.error(errorMessage);
    } finally {
      setDeletingEmail(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchSubscribers(newPage, pagination.limit);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && subscribers.length === 0) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-white min-h-screen">
        <div className="w-full px-4 sm:px-60 py-6 sm:py-8 lg:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2">
                Subscribers
              </h1>
              <p className="text-base sm:text-lg text-gray-500">
                Manage your newsletter subscribers ({pagination.total} total)
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Table - Desktop */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Joined At
                      </th>
                      <th className="px-8 py-5 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subscribers.map((subscriber) => (
                      <tr
                        key={subscriber.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-base text-gray-900 font-medium">
                            {subscriber.email}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-base text-gray-600">
                            {formatDate(subscriber.joinedAt)}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-right">
                          <button
                            onClick={() => openDeleteModal(subscriber)}
                            disabled={deletingEmail === subscriber.email}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingEmail === subscriber.email ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination - Desktop */}
              <div className="px-8 py-5 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-base text-gray-600">
                    Showing{' '}
                    <span className="font-semibold">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-semibold">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{' '}
                    of <span className="font-semibold">{pagination.total}</span>{' '}
                    results
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrevPage || loading}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: pagination.totalPages }, (_, i) => {
                        const pageNum = i + 1;
                        const showPage =
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          Math.abs(pageNum - pagination.page) <= 1;

                        if (!showPage && pageNum === 2) {
                          return (
                            <span key={pageNum} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }

                        if (!showPage && pageNum === pagination.totalPages - 1) {
                          return (
                            <span key={pageNum} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            disabled={loading}
                            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                              pageNum === pagination.page
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNextPage || loading}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards - Mobile/Tablet */}
            <div className="md:hidden space-y-4">
              {subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 truncate">
                        {subscriber.email}
                      </p>
                      <p className="text-sm text-gray-500 mt-1.5">
                        {formatDate(subscriber.joinedAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openDeleteModal(subscriber)}
                    disabled={deletingEmail === subscriber.email}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingEmail === subscriber.email ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                </div>
              ))}

              {/* Pagination - Mobile */}
              <div className="flex flex-col gap-4 pt-4">
                <div className="text-sm text-gray-600 text-center">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage || loading}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="text-sm font-medium text-gray-700">
                    {pagination.page} / {pagination.totalPages}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage || loading}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.subscriber && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={closeDeleteModal}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-8">
              {/* Close button */}
              <button
                onClick={closeDeleteModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Subscriber
                </h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete{' '}
                  <span className="font-medium text-gray-900">
                    {deleteModal.subscriber.email}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}