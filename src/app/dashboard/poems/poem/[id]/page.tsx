"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import { Edit3, Link, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { getPoemById } from "@/src/functions/services/poem/get-service";
interface PoemData {
  id: string;
  title: string;
  content: string;
  synopsis: string;
  slug: string;
  imageUrls?: string;
  image?: string;
}

export default function ViewPoemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [poem, setPoem] = useState<PoemData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoem = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const response = await getPoemById(id);
 
        if (response?.success && response?.data) {
          setPoem(response.data);
        } else if (response?.data) {
          setPoem(response.data);
        } else {
          setPoem(null);
        }
      } catch (error) {
        console.error("Error fetching poem:", error);
        toast.error("Error", {
          description: "Failed to fetch poem details.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPoem();
  }, [id]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500 text-sm">Loading poem details...</p>
      </div>
    );
  }

  /* ---------------- NOT FOUND ---------------- */

  if (!poem) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Poem Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The poem you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  /* ---------------- VIEW ---------------- */

  return (
    <div className="w-full sm:px-60 py-4 sm:py-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full w-8 h-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">View Poem</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Poem Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Poem Details
              </h3>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-gray-500" />
                    Title
                  </Label>
                  <Input value={poem.title} disabled />
                </div>

                {/* Slug */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Link className="w-4 h-4 text-gray-500" />
                    URL Slug
                  </Label>
                  <Input value={poem.slug} disabled />
                </div>

                {/* Synopsis */}
                <div>
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    Synopsis
                  </Label>
                  <Textarea
                    value={poem.synopsis}
                    disabled
                    className="resize-none h-24"
                  />
                </div>
              </div>
            </div>

            {/* Optional Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Featured Image
              </h3>

              {(poem.image || poem.imageUrls) ? (
                <img
                  src={poem.image || poem.imageUrls}
                  alt="Poem"
                  className="w-full max-h-64 object-cover rounded-lg border"
                />
              ) : (
                <div className="p-4 bg-gray-50 border rounded-lg text-center">
                  <p className="text-sm text-gray-500">No image available</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              <div className="p-6 border-b">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Poem Content
                </Label>
              </div>

              <div className="flex-1 p-6">
                <div className="min-h-[600px] border p-4 rounded-md bg-gray-50 whitespace-pre-wrap overflow-y-auto font-serif">
                  {poem.content}
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-between">
                <p className="text-xs text-gray-500">
                  {poem.content?.length || 0} characters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
