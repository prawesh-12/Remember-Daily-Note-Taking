import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import ArrowLeftIcon from "lucide-react/dist/esm/icons/arrow-left.js";
import EyeIcon from "lucide-react/dist/esm/icons/eye.js";
import LoaderIcon from "lucide-react/dist/esm/icons/loader.js";
import PencilLineIcon from "lucide-react/dist/esm/icons/pencil-line.js";
import Trash2Icon from "lucide-react/dist/esm/icons/trash-2.js";
import LiveNotePreview from "../components/LiveNotePreview";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState("editor");

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="text-center text-base-content/70">Note unavailable.</div>
      </div>
    );
  }

  const wordCount = note.content?.trim() ? note.content.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-base-200 relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/4 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 translate-x-1/3 rounded-full bg-secondary/20 blur-3xl" />

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-sm text-base-content/65">{wordCount} words</div>
              <button onClick={handleDelete} className="btn btn-error btn-outline">
                <Trash2Icon className="h-5 w-5" />
                Delete Note
              </button>
            </div>
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
                <h2 className="text-2xl font-bold">Edit Note</h2>
                <p className="mt-2 text-sm text-base-content/70">Refine your writing with instant preview feedback.</p>

                <div className="mt-6">
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Note title"
                      className="input input-bordered focus:input-primary"
                      value={note.title}
                      onChange={(e) => setNote({ ...note, title: e.target.value })}
                    />
                  </div>

                  <div className="form-control mb-6">
                    <label className="label">
                      <span className="label-text font-semibold">Content</span>
                    </label>
                    <textarea
                      placeholder="Write your note here..."
                      className="textarea textarea-bordered h-60 focus:textarea-primary"
                      value={note.content}
                      onChange={(e) => setNote({ ...note, content: e.target.value })}
                    />
                  </div>

                  <div className="card-actions justify-end">
                    <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${viewMode === "editor" ? "hidden lg:block" : "block"}`}>
              <LiveNotePreview title={note.title || ""} content={note.content || ""} badgeText="Note Preview" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NoteDetailPage;
