import { ArrowLeftIcon, EyeIcon, PencilLineIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import LiveNotePreview from "../components/LiveNotePreview";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("editor");

  const navigate = useNavigate();
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {
        title,
        content,
      });

      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/4 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 translate-x-1/3 rounded-full bg-secondary/20 blur-3xl" />

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Link to={"/"} className="btn btn-ghost">
              <ArrowLeftIcon className="size-5" />
              Back to Notes
            </Link>
            <div className="text-sm text-base-content/65">{wordCount} words</div>
          </div>

          <div className="mb-5 flex gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setViewMode("editor")}
              className={`btn btn-sm ${viewMode === "editor" ? "btn-primary" : "btn-ghost"}`}
            >
              <PencilLineIcon className="size-4" />
              Editor
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`btn btn-sm ${viewMode === "preview" ? "btn-primary" : "btn-ghost"}`}
            >
              <EyeIcon className="size-4" />
              Preview
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className={`${viewMode === "preview" ? "hidden lg:block" : "block"}`}>
              <div className="rounded-3xl border border-primary/20 bg-base-100/80 p-6 shadow-[0_20px_60px_-35px_rgba(0,255,157,0.55)] backdrop-blur-md">
                <h2 className="text-2xl font-bold">Create New Note</h2>
                <p className="mt-2 text-sm text-base-content/70">Write first, preview instantly, publish when it feels right.</p>

                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Give this note a memorable title"
                      className="input input-bordered focus:input-primary"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-control mb-6">
                    <label className="label">
                      <span className="label-text font-semibold">Content</span>
                    </label>
                    <textarea
                      placeholder="Capture your ideas, plans, and thoughts..."
                      className="textarea textarea-bordered h-60 focus:textarea-primary"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>

                  <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Creating..." : "Create Note"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className={`${viewMode === "editor" ? "hidden lg:block" : "block"}`}>
              <LiveNotePreview title={title} content={content} badgeText="Live Preview" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
