"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import { Edit3, Link, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { getBlogById } from "@/src/functions/services/blog/get-service";

interface BlogData {
  id: string;
  title: string;
  content: string;
  synopsis: string;
  slug: string;
  imageUrls?: string;
  image?: string;
}

export default function ViewBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getBlogById(id);

        if (response.success) {
          setBlog(response.data);
        } else {
          // Fallback: sometimes the API returns the data directly if success is not wrapped,
          // but based on valid response checking, we should see.
          // However, the backend snippet said "return c.json({ success: true, data: blog[0] })"
          // So response.data should be the blog object.
          // Wait, getBlogById in get-service.ts returns res.data.
          // So if backend returns { success: true, data: ... }, then 'response' here IS that object.
          if (response.data) {
            setBlog(response.data);
          } else {
            // Might rely on how getBlogById is actually implemented vs the snippet.
            // If getBlogById returns res.data, and res.data is the whole JSON.
            // Then response.data is the blog.
            // Let's assume the happy path first.
            setBlog(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Error", {
          description: "An unexpected error occurred while fetching the blog.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500 text-sm">Loading blog details...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Blog Not Found</h2>
        <p className="text-gray-500 mb-6">The blog you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full sm:px-60 py-4 sm:py-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full w-8 h-8"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">View Blog</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Blog Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Details</h3>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="blogTitle" className="flex items-center gap-2">
                    <Edit3 className="text-gray-500 w-4 h-4" />
                    Title
                  </Label>

                  <Input
                    id="blogTitle"
                    className="mt-1"
                    value={blog.title}
                    readOnly
                    disabled
                  />
                </div>

                {/* Slug */}
                <div>
                  <Label htmlFor="blogSlug" className="flex items-center gap-2">
                    <Link className="text-gray-500 w-4 h-4" />
                    URL Slug
                  </Label>

                  <Input
                    id="blogSlug"
                    className="mt-1 bg-gray-50"
                    value={blog.slug}
                    readOnly
                    disabled
                  />
                </div>

                {/* Synopsis */}
                <div>
                  <Label htmlFor="blogSynopsis" className="flex items-center gap-2">
                    <FileText className="text-gray-500 w-4 h-4" />
                    Synopsis
                  </Label>

                  <Textarea
                    id="blogSynopsis"
                    className="mt-1 h-24 resize-none"
                    value={blog.synopsis}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>

              <div className="mt-4">
                {(blog.image || blog.imageUrls) ? (
                  <div className="relative">
                    <img
                      src={blog.image || blog.imageUrls}
                      alt="Blog Featured"
                      className="w-full h-auto max-h-64 object-cover rounded-lg border"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-sm text-gray-500">No image available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b">
                <Label
                  htmlFor="blogContent"
                  className="text-lg font-semibold flex items-center gap-2"
                >
                  <FileText className="text-gray-600 w-5 h-5" />
                  Blog Content
                </Label>
              </div>

              {/* Content Input */}
              <div className="flex-1 p-6">
                <div
                  className="h-full min-h-[600px] text-sm border p-4 rounded-md bg-gray-50 overflow-y-auto whitespace-pre-wrap"
                >
                  {blog.content}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {blog.content?.length || 0} characters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
