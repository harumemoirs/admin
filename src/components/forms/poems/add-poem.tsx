"use client";
import { useState, useEffect } from "react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import { Edit3, Link, Image, Trash2, FileText, Send, RefreshCw } from "lucide-react";
 
import { addPoem } from "@/src/functions/services/poem/post-service";

export default function PoemAddForm() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
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

      toast.success("Image Selected", {
        description: "Image selected successfully",
        duration: 3000,
      });
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");

    const fileInput = document.getElementById("poemImage") as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    toast.info("Image Removed", {
      description: "Image removed from selection",
      duration: 2000,
    });
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Poem title is required");
      return false;
    }
    if (!content.trim()) {
      toast.error("Poem content is required");
      return false;
    }
    if (!synopsis.trim()) {
      toast.error("Poem synopsis is required");
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

    if (!image) {
      toast.error("Image is required");
      return false;
    }

    if (content.length < 10) {
      toast.warning("Content must be at least 10 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !image) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Creating poem...");

    try {
      const result = await addPoem(
        {
          title,
          content,
          synopsis,
          slug,
        },
        image
      );

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success("Poem Created Successfully!", {
          description: result.message,
          duration: 4000,
        });

        resetForm();
      } else {
        toast.error("Failed to Create Poem", {
          description: result.message || "Something went wrong",
          duration: 4000,
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error instanceof Error ? error.message : "Unexpected error";
      toast.error("Error Creating Poem", {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSynopsis("");
    setSlug("");
    setImage(null);
    setImagePreview("");

    const fileInput = document.getElementById("poemImage") as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    toast.info("Form Reset");
  };

  return (
    <div className="w-full sm:px-60 py-4 sm:py-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Poem</h1>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetForm}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <RefreshCw className="text-blue-500 text-lg" />
            Reset Form
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Poem Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Poem Details</h3>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="poemTitle" className="flex items-center gap-2">
                    <Edit3 className="text-gray-500 w-4 h-4" />
                    Title <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="poemTitle"
                    placeholder="Enter title"
                    className="mt-1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Slug - Read-only */}
                <div>
                  <Label htmlFor="poemSlug" className="flex items-center gap-2">
                    <Link className="text-gray-500 w-4 h-4" />
                    URL Slug (Auto-generated)
                  </Label>

                  <Input
                    id="poemSlug"
                    placeholder="url-slug"
                    className="mt-1 bg-gray-50"
                    value={slug}
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically generated from title
                  </p>
                </div>

                {/* Synopsis */}
                <div>
                  <Label htmlFor="poemSynopsis" className="flex items-center gap-2">
                    <FileText className="text-gray-500 w-4 h-4" />
                    Synopsis <span className="text-red-500">*</span>
                  </Label>

                  <Textarea
                    id="poemSynopsis"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>

              <Label htmlFor="poemImage" className="flex items-center gap-2">
                <Image className="text-gray-500 w-4 h-4" />
                Upload Image <span className="text-red-500">*</span>
              </Label>

              <Input
                id="poemImage"
                type="file"
                accept="image/*"
                className="mt-1"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />

              {image && imagePreview ? (
                <div className="mt-4">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
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
              ) : (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">Image required</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b">
                <Label
                  htmlFor="poemContent"
                  className="text-lg font-semibold flex items-center gap-2"
                >
                  <FileText className="text-gray-600 w-5 h-5" />
                  Poem Content <span className="text-red-500">*</span>
                </Label>
              </div>

              {/* Content Input */}
              <div className="flex-1 p-6">
                <Textarea
                  id="poemContent"
                  className="h-[600px] resize-none text-sm border-0 focus:ring-0 shadow-none font-serif"
                  placeholder="Write your poem here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {content.length} chars (~{Math.ceil(content.length / 5)} words)
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
                    "Creating..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Create Poem
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