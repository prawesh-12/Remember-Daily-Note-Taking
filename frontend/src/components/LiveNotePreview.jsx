import { EyeIcon, FileTextIcon } from "lucide-react";

const LiveNotePreview = ({ title, content, badgeText = "Live Preview" }) => {
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    const paragraphCount = cleanContent ? cleanContent.split(/\n+/).length : 0;

    return (
        <div className="rounded-3xl border border-primary/20 bg-base-100/80 p-6 shadow-[0_20px_60px_-35px_rgba(0,255,157,0.5)] backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    <EyeIcon className="size-3.5" />
                    {badgeText}
                </div>
                <div className="text-xs text-base-content/60">{paragraphCount} paragraph{paragraphCount === 1 ? "" : "s"}</div>
            </div>

            <div className="mt-6 rounded-2xl border border-base-content/10 bg-base-200/50 p-5">
                <h3 className="text-2xl font-bold leading-tight text-base-content break-words">
                    {cleanTitle || "Untitled note"}
                </h3>

                <div className="mt-5 border-t border-base-content/10 pt-5">
                    {cleanContent ? (
                        <p className="whitespace-pre-wrap break-words text-base leading-relaxed text-base-content/80">
                            {cleanContent}
                        </p>
                    ) : (
                        <div className="flex items-center gap-2 text-base-content/55">
                            <FileTextIcon className="size-4" />
                            <span>Start typing to see your note preview.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveNotePreview;
