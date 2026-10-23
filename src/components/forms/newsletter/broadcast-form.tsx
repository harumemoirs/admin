"use client";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import { Mail, Image, Trash2, FileText, Send, RefreshCw, MessageSquare } from "lucide-react";

import { broadcastNewsletter } from "@/src/functions/services/newsletterrs/broadcast-service";

export default function NewsletterFormPage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const fileInput = document.getElementById("newsletterImage") as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    toast.info("Image Removed", {
      description: "Image removed from selection",
      duration: 2000,
    });
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Newsletter title is required");
      return false;
    }
    if (!subject.trim()) {
      toast.error("Email subject is required");
      return false;
    }
    if (!body.trim()) {
      toast.error("Newsletter body is required");
      return false;
    }

    if (body.length < 50) {
      toast.warning("Body must be at least 50 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Broadcasting newsletter...");

    try {
      const result = await broadcastNewsletter(
        {
          title,
          subject,
          body,
        },
        image || undefined
      );

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success("Newsletter Queued Successfully!", {
          description: result.message + (result.queued ? ` (${result.queued} recipients)` : ""),
          duration: 4000,
        });

        resetForm();
      } else {
        toast.error("Failed to Broadcast Newsletter", {
          description: result.message || "Something went wrong",
          duration: 4000,
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error instanceof Error ? error.message : "Unexpected error";
      toast.error("Error Broadcasting Newsletter", {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setBody("");
    setImage(null);
    setImagePreview("");

    const fileInput = document.getElementById("newsletterImage") as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    toast.info("Form Reset");
  };

  return (
    <div className="w-full sm:px-60 py-4 sm:py-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Broadcast Newsletter</h1>

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
            {/* Newsletter Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Newsletter Details</h3>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="newsletterTitle" className="flex items-center gap-2">
                    <FileText className="text-gray-500 w-4 h-4" />
                    Title <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="newsletterTitle"
                    placeholder="Enter newsletter title"
                    className="mt-1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Internal reference name
                  </p>
                </div>

                {/* Subject */}
                <div>
                  <Label htmlFor="newsletterSubject" className="flex items-center gap-2">
                    <Mail className="text-gray-500 w-4 h-4" />
                    Email Subject <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="newsletterSubject"
                    placeholder="Enter email subject line"
                    className="mt-1"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    What subscribers will see in their inbox
                  </p>
                </div>
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>

              <Label htmlFor="newsletterImage" className="flex items-center gap-2">
                <Image className="text-gray-500 w-4 h-4" />
                Upload Image (Optional)
              </Label>

              <Input
                id="newsletterImage"
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
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">No image selected</p>
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
                  htmlFor="newsletterBody"
                  className="text-lg font-semibold flex items-center gap-2"
                >
                  <MessageSquare className="text-gray-600 w-5 h-5" />
                  Newsletter Body <span className="text-red-500">*</span>
                </Label>
              </div>

              {/* Content Input */}
              <div className="flex-1 p-6">
                <Textarea
                  id="newsletterBody"
                  className="h-[600px] resize-none text-sm border-0 focus:ring-0 shadow-none"
                  placeholder="Write your newsletter content here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {body.length} chars (~{Math.ceil(body.length / 5)} words)
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
                    "Broadcasting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Broadcast Newsletter
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