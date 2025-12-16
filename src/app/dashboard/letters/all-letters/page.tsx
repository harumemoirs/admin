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
import { getAllLetters } from "@/src/functions/services/letter/get-service";
import { removeLetter } from "@/src/functions/services/letter/post-service";
interface Letter {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  imageUrls?: string[];
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  status?: string;
  views?: number;
}

interface LettersResponse {
  success: boolean;
  data: Letter[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function AllLettersPage() {
  const router = useRouter();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalLetters, setTotalLetters] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<Letter | null>(null);
  const [deleting, setDeleting] = useState(false);

  const LETTERS_PER_PAGE = 9;
  
  // Default fallback image
  const DEFAULT_IMAGE = "https://res.cloudinary.com/dwtbvdlzg/image/upload/v1765380884/hero-1st-left_bc863k.jpg";

  useEffect(() => {
    fetchLetters(currentPage);
  }, [currentPage]);

  const fetchLetters = async (page: number) => {
    setIsLoading(true);
    try {
      const response: LettersResponse = await getAllLetters(page, LETTERS_PER_PAGE);
      
      console.log("Fetched letters:", response.data);
      
      setLetters(response.data || []);
      setTotalPages(response.pagination.totalPages || 1);
      setTotalLetters(response.pagination.total || 0);
      setCurrentPage(response.pagination.page || page);
    } catch (error) {
      console.error("Fetch letters error:", error);
      setLetters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (letter: Letter) => {
    setLetterToDelete(letter);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteLetter = async () => {
    if (!letterToDelete) return;

    const letterId = letterToDelete._id || letterToDelete.id;
    if (!letterId) return;

    try {
      setDeleting(true);
      await removeLetter({ letterId });
      
      setLetters(letters.filter((letter) => (letter._id || letter.id) !== letterId));
      setDeleteDialogOpen(false);
      setLetterToDelete(null);
      
      // Refresh the letters list
      fetchLetters(currentPage);
    } catch (error) {
      console.error("Error deleting letter:", error);
      alert("Failed to delete letter");
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/letters/letter/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/letters/edit-letter/${id}`);
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
  const getImageUrl = (letter: Letter): string => {
    return letter.imageUrls?.[0] || letter.image || DEFAULT_IMAGE;
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen px-4 sm:px-6 py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-gray-600">Loading letters...</span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Letters</h1>
            <p className="text-gray-600">
              Showing {letters.length} of {totalLetters} {totalLetters === 1 ? "letter" : "letters"}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-12 sm:px-20 py-6">
          {letters.length === 0 ? (
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No letters found</h3>
              <p className="text-gray-600 mb-4">Get started by creating a new letter.</p>
              <Button onClick={() => router.push("/dashboard/letters/add-letter")}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Letter
              </Button>
            </div>
          ) : (
            <>
              {/* Letters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {letters.map((letter) => {
                  const letterId = letter._id || letter.id || "";
                  const imageUrl = getImageUrl(letter);
                  
                  return (
                    <Card
                      key={letterId}
                      className="hover:shadow-md transition-shadow duration-200 overflow-hidden"
                    >
                      {/* Letter Image */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={imageUrl}
                          alt={letter.title || "Letter"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(`Failed to load image for letter: ${letter.title}`, imageUrl);
                            e.currentTarget.src = DEFAULT_IMAGE;
                          }}
                          loading="lazy"
                        />
                        {letter.status && (
                          <div className="absolute top-2 left-2">
                            <Badge
                              variant={letter.status === "published" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {letter.status}
                            </Badge>
                          </div>
                        )}
                        {letter.views !== undefined && (
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center text-xs text-gray-700">
                            <Eye className="h-3 w-3 mr-1" />
                            {letter.views}
                          </div>
                        )}
                      </div>

                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg leading-tight line-clamp-2">
                          {letter.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {/* Author and Date */}
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            {letter.author && (
                              <div className="flex items-center">
                                <span className="text-xs">{letter.author}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {letter.date}
                            </div>
                          </div>

                          {/* Content Preview */}
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {truncateText(letter.content, 120)}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(letterId)}
                              className="flex-1"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleEdit(letterId)}
                              className="flex-1"
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(letter)}
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
            <AlertDialogTitle>Delete Letter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{letterToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLetter}
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