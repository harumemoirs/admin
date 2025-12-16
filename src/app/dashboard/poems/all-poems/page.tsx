/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Eye, Edit3, Trash2, ChevronLeft, ChevronRight, Calendar, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllPoems } from "@/src/functions/services/poem/get-service";
import { removePoem, RemovePoemData } from "@/src/functions/services/poem/post-service";

interface Poem {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  synopsis?: string;
  image?: string;
  imageUrls?: string[];
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  status?: string;
  views?: number;
}

interface PoemsResponse {
  success: boolean;
  data: Poem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function AllPoemsPage() {
  const router = useRouter();
  const [poems, setPoems] = useState<Poem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPoems, setTotalPoems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [poemToDelete, setPoemToDelete] = useState<Poem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const POEMS_PER_PAGE = 9;
  
 
  const DEFAULT_IMAGE = "https://res.cloudinary.com/dwtbvdlzg/image/upload/v1765380884/hero-1st-left_bc863k.jpg";

  useEffect(() => {
    fetchPoems(currentPage);
  }, [currentPage]);

  const fetchPoems = async (page: number) => {
    setIsLoading(true);
    try {
      const response: PoemsResponse = await getAllPoems(page, POEMS_PER_PAGE);
      
      console.log("Fetched poems:", response.data);
      
      setPoems(response.data || []);
      setTotalPages(response.pagination.totalPages || 1);
      setTotalPoems(response.pagination.total || 0);
      setCurrentPage(response.pagination.page || page);
    } catch (error) {
      console.error("Fetch poems error:", error);
      setPoems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (poem: Poem) => {
    setPoemToDelete(poem);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePoem = async () => {
    if (!poemToDelete) return;
   
    const poemId = poemToDelete._id || poemToDelete.id;
    if (!poemId) return;
    console.log(poemId)
    try {
      setDeleting(true);
      // Replace with your actual delete API call
      await removePoem({poemId}) ;
      
      setPoems(poems.filter((poem) => (poem._id || poem.id) !== poemId));
      setDeleteDialogOpen(false);
      setPoemToDelete(null);
      
      // Refresh the poems list
      fetchPoems(currentPage);
    } catch (error) {
      console.error("Error deleting poem:", error);
      alert("Failed to delete poem");
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/poems/poem/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/poems/edit-poem/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get image URL with fallback
  const getImageUrl = (poem: Poem): string => {
    return poem.imageUrls?.[0] || poem.image || DEFAULT_IMAGE;
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen px-4 sm:px-6 py-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-gray-600">Loading poems...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b px-12 sm:px-20 py-6">
        <div className="max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Poems</h1>
            <p className="text-gray-600">
              Showing {poems.length} of {totalPoems} {totalPoems === 1 ? "poem" : "poems"}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-12 sm:px-20 py-6">
          {poems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No poems found</h3>
              <p className="text-gray-600 mb-4">Get started by creating a new poem.</p>
              <Button onClick={() => router.push("/dashboard/poems/add-poem")}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Poem
              </Button>
            </div>
          ) : (
            <>
              {/* Poems Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {poems.map((poem) => {
                  const poemId = poem._id || poem.id || "";
                  const imageUrl = getImageUrl(poem);
                  
                  return (
                    <Card
                      key={poemId}
                      className="hover:shadow-md transition-shadow duration-200 overflow-hidden"
                    >
                      {/* Poem Image */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={imageUrl}
                          alt={poem.title || "Poem"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(`Failed to load image for poem: ${poem.title}`, imageUrl);
                            e.currentTarget.src = DEFAULT_IMAGE;
                          }}
                          loading="lazy"
                        />
                        {poem.status && (
                          <div className="absolute top-2 left-2">
                            <Badge
                              variant={poem.status === "published" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {poem.status}
                            </Badge>
                          </div>
                        )}
                        {poem.views !== undefined && (
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center text-xs text-gray-700">
                            <Eye className="h-3 w-3 mr-1" />
                            {poem.views}
                          </div>
                        )}
                      </div>

                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg leading-tight line-clamp-2">
                          {poem.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {/* Author and Date */}
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            {poem.author && (
                              <div className="flex items-center">
                                <span className="text-xs">{poem.author}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(poem.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Synopsis/Content Preview */}
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {poem.synopsis || truncateText(poem.content, 120)}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(poemId)}
                              className="flex-1"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleEdit(poemId)}
                              className="flex-1"
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(poem)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={
                              currentPage === page
                                ? "bg-black text-white"
                                : "bg-white"
                            }
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Page Info */}
              <div className="text-center text-sm text-gray-600 pb-6">
                Page {currentPage} of {totalPages}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Poem</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{poemToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePoem}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}