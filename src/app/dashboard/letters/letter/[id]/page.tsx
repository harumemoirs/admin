"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import { Edit3, Link, FileText, ArrowLeft, Loader2, Calendar } from "lucide-react";
import { getLetterById } from "@/src/functions/services/letter/get-service";

interface LetterData {
  id: string;
  title: string;
  content: string;
  date: string;
  slug: string;
  imageUrls?: string;
  image?: string;
}

export default function ViewLetterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [letter, setLetter] = useState<LetterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLetter = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getLetterById(id);

        if (response.success) {
          setLetter(response.data);
        } else {
          if (response.data) {
            setLetter(response.data);
          } else {
            setLetter(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching letter:", error);
        toast.error("Error", {
          description: "An unexpected error occurred while fetching the letter.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500 text-sm">Loading letter details...</p>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Letter Not Found</h2>
        <p className="text-gray-500 mb-6">The letter you are looking for does not exist or has been removed.</p>
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
            <h1 className="text-3xl font-bold text-gray-900">View Letter</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Letter Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Letter Details</h3>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="letterTitle" className="flex items-center gap-2">
                    <Edit3 className="text-gray-500 w-4 h-4" />
                    Title
                  </Label>

                  <Input
                    id="letterTitle"
                    className="mt-1"
                    value={letter.title}
                    readOnly
                    disabled
                  />
                </div>

                {/* Slug */}
                <div>
                  <Label htmlFor="letterSlug" className="flex items-center gap-2">
                    <Link className="text-gray-500 w-4 h-4" />
                    URL Slug
                  </Label>

                  <Input
                    id="letterSlug"
                    className="mt-1 bg-gray-50"
                    value={letter.slug}
                    readOnly
                    disabled
                  />
                </div>

                {/* Date */}
                <div>
                  <Label htmlFor="letterDate" className="flex items-center gap-2">
                    <Calendar className="text-gray-500 w-4 h-4" />
                    Date
                  </Label>

                  <Input
                    id="letterDate"
                    className="mt-1"
                    value={letter.date}
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
                {(letter.image || letter.imageUrls) ? (
                  <div className="relative">
                    <img
                      src={letter.image || letter.imageUrls}
                      alt="Letter Featured"
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
                  htmlFor="letterContent"
                  className="text-lg font-semibold flex items-center gap-2"
                >
                  <FileText className="text-gray-600 w-5 h-5" />
                  Letter Content
                </Label>
              </div>

              {/* Content Display */}
              <div className="flex-1 p-6">
                <div
                  className="h-full min-h-[600px] text-sm border p-4 rounded-md bg-gray-50 overflow-y-auto whitespace-pre-wrap"
                >
                  {letter.content}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {letter.content?.length || 0} characters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}