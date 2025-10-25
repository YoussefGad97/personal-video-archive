import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { VideoFormData, Playlist, Video } from "@/lib/types";
import { MOCK_PLAYLISTS, MOCK_VIDEOS } from "@/lib/mockData";
import { v4 as uuid } from "uuid";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Youtube, Link2 } from "lucide-react";

const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnailUrl: z.string().optional(),
  videoSource: z.enum(["local", "youtube", "url"]),
  videoUrl: z.string().url("Must be a valid URL").optional(),
  videoFile: z
    .custom<File>()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional, handled by videoUrl/source validation
      return file.type.startsWith("video/");
    }, "File must be a video"),
  duration: z.number().min(0, "Duration must be >= 0").optional(),
});

interface AddVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (video: Video) => void;
}

const AddVideoDialog: React.FC<AddVideoDialogProps> = ({
  isOpen,
  onClose,
  onAddVideo,
}) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [selectedVideoSource, setSelectedVideoSource] = useState<
    "local" | "youtube" | "url"
  >("youtube");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnailUrl: "",
      videoUrl: "",
      videoSource: "youtube",
      duration: 0,
      playlists: [],
    },
  });

  const videoUrlWatched = watch("videoUrl");
  const videoSourceWatched = watch("videoSource");

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setValue("videoSource", "local");
    setValue("videoFile", file);

    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setValue("videoUrl", url);

    // Try to extract metadata
    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.src = url;

    videoEl.onloadedmetadata = () => {
      setValue("duration", Math.round(videoEl.duration) || 0);

      // Capture thumbnail
      try {
        videoEl.currentTime = Math.min(
          1,
          Math.max(0, Math.floor(videoEl.duration / 2))
        );
        videoEl.onseeked = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = videoEl.videoWidth || 320;
            canvas.height = videoEl.videoHeight || 180;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
              const dataURL = canvas.toDataURL("image/jpeg", 0.8);
              setValue("thumbnailUrl", dataURL);
            }
          } catch (e) {
            console.error("Error capturing thumbnail:", e);
          }
          videoEl.remove();
        };
      } catch (e) {
        videoEl.remove();
      }
    };
  };

  useEffect(() => {
    if (videoSourceWatched === "local") return; // Local files handled by handleFileChange

    const url = videoUrlWatched;
    if (!url) return;

    let cancelled = false;
    setIsDetecting(true);

    if (videoSourceWatched === "youtube") {
      // YouTube thumbnail detection
      const ytMatch = url.match(
        /(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/
      );
      if (ytMatch) {
        const id = ytMatch[1];
        const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        setValue("thumbnailUrl", thumb);
        // duration for YouTube requires API
        setIsDetecting(false);
        return;
      }
    } else {
      // Try to load metadata for direct video URLs
      try {
        const videoEl = document.createElement("video");
        videoEl.preload = "metadata";
        videoEl.src = url;

        const onLoaded = () => {
          if (cancelled) return;
          const dur = Math.round(videoEl.duration) || 0;
          setValue("duration", dur);

          // Try to capture a frame for thumbnail
          try {
            videoEl.currentTime = Math.min(
              1,
              Math.max(0, Math.floor(videoEl.duration / 2))
            );
            const onSeeked = () => {
              try {
                const canvas = document.createElement("canvas");
                canvas.width = videoEl.videoWidth || 320;
                canvas.height = videoEl.videoHeight || 180;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
                  const dataURL = canvas.toDataURL("image/jpeg", 0.8);
                  setValue("thumbnailUrl", dataURL);
                }
              } catch (e) {
                console.error("Error capturing thumbnail:", e);
              } finally {
                videoEl.removeEventListener("seeked", onSeeked);
                setIsDetecting(false);
              }
            };
            videoEl.addEventListener("seeked", onSeeked);
          } catch (e) {
            setIsDetecting(false);
          }
        };

        const onError = () => {
          setIsDetecting(false);
          toast.error("Could not load video metadata");
        };

        videoEl.addEventListener("loadedmetadata", onLoaded);
        videoEl.addEventListener("error", onError);

        return () => {
          cancelled = true;
          videoEl.pause();
          videoEl.remove();
        };
      } catch (e) {
        setIsDetecting(false);
        toast.error("Error loading video");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrlWatched, videoSourceWatched]);

  const onSubmit = async (data: VideoFormData) => {
    try {
      let finalVideoUrl = data.videoUrl;
      const totalDuration = data.duration ?? 0;
      const thumbnail = data.thumbnailUrl ?? "";

      // Handle local file upload if needed
      if (data.videoSource === "local" && data.videoFile) {
        // In a real app, you'd upload the file to a server/CDN here
        // For now, we'll use the object URL (note: this is temporary and will be invalid after page refresh)
        finalVideoUrl = URL.createObjectURL(data.videoFile);
        toast.info(
          "Note: Local file URLs are temporary and will not persist after page refresh"
        );
      }

      // Validate YouTube URL format if YouTube source
      if (data.videoSource === "youtube") {
        const ytMatch = data.videoUrl?.match(
          /(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/
        );
        if (!ytMatch) {
          toast.error("Invalid YouTube URL");
          return;
        }
        // Convert to embed URL for player compatibility
        finalVideoUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
      }

      // Create the new video object
      const newVideo: Video = {
        id: uuid(),
        title: data.title,
        description: data.description,
        thumbnailUrl: thumbnail,
        videoUrl: finalVideoUrl,
        duration: totalDuration,
        playlists: selectedPlaylists,
        dateAdded: new Date().toISOString().split("T")[0],
        views: 0,
      };

      console.log("Adding new video:", newVideo);

      // Add to mock data
      MOCK_VIDEOS.unshift(newVideo);

      // Notify parent
      onAddVideo(newVideo);

      // Reset form
      reset();
      setSelectedPlaylists([]);
      setIsDetecting(false);

      // Cleanup any object URLs we created
      if (data.videoSource === "local" && data.videoFile) {
        URL.revokeObjectURL(data.videoUrl || "");
      }

      // Close dialog first for better UX
      onClose();

      // Show enhanced success notification
      toast.success("Video Added Successfully", {
        description: `"${data.title}" has been added to your library${
          selectedPlaylists.length > 0
            ? ` and ${selectedPlaylists.length} playlist${
                selectedPlaylists.length > 1 ? "s" : ""
              }`
            : ""
        }.`,
        action: {
          label: "View",
          onClick: () => {
            // You could add functionality here to view the added video
            console.log("View video:", newVideo.id);
          },
        },
        duration: 5000, // Show for 5 seconds
      });

      // Show small visual confirmation
      setSuccessVisible(true);
    } catch (error) {
      console.error("Error adding video:", error);
      toast.error("Failed to add video");
    }
  };

  const handlePlaylistToggle = (playlistId: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const [successVisible, setSuccessVisible] = useState(false);

  useEffect(() => {
    let t: number | undefined;
    if (successVisible) {
      t = window.setTimeout(() => setSuccessVisible(false), 2600);
    }
    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [successVisible]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[540px] animate-scale-in">
          <DialogHeader>
            <DialogTitle>Add New Video</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new video to your gallery.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                className="min-h-[80px]"
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Tabs
              value={selectedVideoSource}
              onValueChange={(v) => {
                setSelectedVideoSource(v as "local" | "youtube" | "url");
                setValue("videoSource", v as "local" | "youtube" | "url");
                setValue("videoUrl", "");
                setValue("videoFile", undefined);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="youtube"
                  className="flex items-center gap-2"
                >
                  <Youtube className="h-4 w-4" />
                  YouTube
                </TabsTrigger>
                <TabsTrigger value="local" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="youtube" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">YouTube URL</Label>
                  <Input
                    id="youtubeUrl"
                    {...register("videoUrl")}
                    placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                  />
                  {errors.videoUrl && (
                    <p className="text-sm text-destructive">
                      {errors.videoUrl.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Paste a YouTube video URL. The thumbnail will be fetched
                    automatically.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="local" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="videoFile">Video File</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id="videoFile"
                      accept="video/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Video File
                    </Button>
                  </div>
                  {getValues("videoFile") && (
                    <p className="text-sm">
                      Selected: {(getValues("videoFile") as File).name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload a video file from your computer. Supported formats:
                    MP4, WebM, etc.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="directUrl">Video URL</Label>
                  <Input
                    id="directUrl"
                    {...register("videoUrl")}
                    placeholder="https://example.com/video.mp4"
                  />
                  {errors.videoUrl && (
                    <p className="text-sm text-destructive">
                      {errors.videoUrl.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter a direct URL to a video file (MP4, WebM, etc.) or a
                    social media video.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="flex items-center gap-4">
                <div className="w-28 h-16 bg-muted rounded overflow-hidden">
                  {getValues("thumbnailUrl") ? (
                    <img
                      src={getValues("thumbnailUrl")}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                      No thumbnail
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm">
                    Duration:{" "}
                    {getValues("duration")
                      ? `${getValues("duration")}s`
                      : isDetecting
                      ? "Detecting..."
                      : "Unknown"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isDetecting
                      ? "Loading video details..."
                      : "Thumbnail and duration are fetched automatically when possible."}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Playlists</Label>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_PLAYLISTS.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`playlist-${playlist.id}`}
                      checked={selectedPlaylists.includes(playlist.id)}
                      onCheckedChange={() => handlePlaylistToggle(playlist.id)}
                    />
                    <Label
                      htmlFor={`playlist-${playlist.id}`}
                      className="cursor-pointer"
                    >
                      {playlist.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isDetecting}>
                {isDetecting ? "Loading..." : "Add Video"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Small floating confirmation */}
      {successVisible && (
        <div className="fixed right-6 bottom-6 z-50">
          <div className="max-w-xs w-full bg-emerald-600 text-white rounded-lg shadow-lg px-4 py-3 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium">Video Added Successfully</div>
                <div className="text-xs opacity-90">
                  Your video was added to the gallery.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddVideoDialog;
