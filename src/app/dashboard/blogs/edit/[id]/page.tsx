"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import {
  Edit3,
  Link,
  Image,
  Trash2,
  FileText,
  Save,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
 
import { editBlog , getBlogForEdit} from "@/src/functions/services/blog/post-service";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const result = await getBlogForEdit(blogId);

        if (result.success && result.blog) {
          setTitle(result.blog.title ?? "");
          setContent(result.blog.content ?? "");
          setSynopsis(result.blog.synopsis ?? "");
          setSlug(result.blog.slug ?? "");

          const img =
            result.blog.imageUrls?.[0] || result.blog.image_urls?.[0] || "";
          setExistingImageUrl(img);
        } else {
          toast.error("Failed to load blog");
          router.push("/dashboard");
        }
      } catch (err) {
        toast.error("Error loading blog");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, router]);

  useEffect(() => {
    setSlug(
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  }, [title]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Invalid File Type", {
          description: "Please select a valid image file",
          duration: 4000,
        });
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File Too Large", {
          description: "Image size should be less than 5MB",
          duration: 4000,
        });
        return;
      }

      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));

      toast.success("New Image Selected", {
        description: "Image will replace existing one when saved",
        duration: 3000,
      });
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");

    const fileInput = document.getElementById("blogImage") as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    toast.info("New Image Removed", {
      description: "Existing image will be kept",
      duration: 2000,
    });
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Blog title is required");
      return false;
    }
    if (!content.trim()) {
      toast.error("Blog content is required");
      return false;
    }
    if (!synopsis.trim()) {
      toast.error("Blog synopsis is required");
      return false;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return false;
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      toast.error("Invalid slug format");
      return false;
    }

    if (!existingImageUrl && !image) {
      toast.error("Image is required");
      return false;
    }

    if (content.length < 50) {
      toast.warning("Content must be at least 50 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Updating blog...");

    try {
      const result = await editBlog(
        blogId,
        {
          title,
          content,
          synopsis,
          slug,
        },
        image || undefined
      );

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success("Blog Updated Successfully!", {
          description: result.message,
          duration: 4000,
        });

        setTimeout(() => {
          router.push(`/dashboard/blogs/blog/${blogId}`);
        }, 500);
      } else {
        toast.error("Failed to Update Blog", {
          description: result.message || "Something went wrong",
          duration: 4000,
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error";
      toast.error("Error Updating Blog", {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetToOriginal = () => {
    toast.info("Reloading original data...");
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:px-60 py-4 sm:py-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/blogs")}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetToOriginal}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <RefreshCw className="text-blue-500 text-lg" />
            Reset Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Blog Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Blog Details
              </h3>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="blogTitle"
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="text-gray-500 w-4 h-4" />
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="blogTitle"
                    placeholder="Enter title"
                    className="mt-1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="blogSlug" className="flex items-center gap-2">
                    <Link className="text-gray-500 w-4 h-4" />
                    URL Slug (Auto-generated)
                  </Label>
                  <Input
                    id="blogSlug"
                    placeholder="url-slug"
                    className="mt-1 bg-gray-50"
                    value={slug}
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically generated from title
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="blogSynopsis"
                    className="flex items-center gap-2"
                  >
                    <FileText className="text-gray-500 w-4 h-4" />
                    Synopsis <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="blogSynopsis"
                    placeholder="Short summary"
                    className="mt-1 h-24"
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Featured Image
              </h3>

              <Label htmlFor="blogImage" className="flex items-center gap-2">
                <Image className="text-gray-500 w-4 h-4" />
                Upload New Image (Optional)
              </Label>

              <Input
                id="blogImage"
                type="file"
                accept="image/*"
                className="mt-1"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />

              {image && imagePreview ? (
                <div className="mt-4">
                  <p className="text-sm text-green-600 mb-2 font-medium">
                    New Image Selected:
                  </p>
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="New Preview"
                      className="w-full h-48 object-cover rounded-lg border border-green-300"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 bg-white text-red-500 hover:bg-red-50 shadow-md flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : existingImageUrl ? (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <div className="relative">
                    <img
                      src={existingImageUrl}
                      alt="Current"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">No image set</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              <div className="p-6 border-b">
                <Label
                  htmlFor="blogContent"
                  className="text-lg font-semibold flex items-center gap-2"
                >
                  <FileText className="text-gray-600 w-5 h-5" />
                  Blog Content <span className="text-red-500">*</span>
                </Label>
              </div>

              <div className="flex-1 p-6">
                <Textarea
                  id="blogContent"
                  className="h-[600px] resize-none text-sm border-0 focus:ring-0 shadow-none"
                  placeholder="Start writing here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {content.length} chars (~{Math.ceil(content.length / 5)}{" "}
                  words)
                </p>

                <Button
                  type="button"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-black"
                >
                  {isSubmitting ? (
                    "Updating..."
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Blog
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}