import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Experience.css";

export default function ExperienceViewer({ currentLabel, setCurrentLabel, setStoryData }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const isOpen = Boolean(currentLabel && currentLabel.label && currentLabel.label !== "none");
  const stories = Array.isArray(currentLabel?.stories) ? currentLabel.stories : [];

  useEffect(() => {
    setSelectedIndex(0);
    setDraft("");
  }, [currentLabel?.label]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setCurrentLabel(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, setCurrentLabel]);

  if (!isOpen) return null;

  const activeIndex = Math.min(selectedIndex, Math.max(stories.length - 1, 0));
  const preview = (text) => text.length > 110 ? `${text.slice(0, 107).trimEnd()}...` : text;

  function addStory(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || stories.includes(text)) return;
    const updatedStories = [...stories, text];
    const updatedLabel = { ...currentLabel, stories: updatedStories };
    setCurrentLabel(updatedLabel);
    setStoryData?.((previous) => previous.map((phase) => ({
      ...phase,
      nodes: phase.nodes.map((node) =>
        node.label === currentLabel.label
          ? { ...node, stories: updatedStories }
          : node
      ),
    })));
    setSelectedIndex(updatedStories.length - 1);
    setDraft("");
  }

  return createPortal(
    <div className="experience-modal-backdrop" onMouseDown={(e) => {
      if (e.target === e.currentTarget) setCurrentLabel(null);
    }}>
      <section id="exp-viewer" className="experience-viewer" role="dialog" aria-modal="true" aria-labelledby="experience-viewer-heading">
        <button type="button" className="experience-viewer-close" aria-label="Close stories" onClick={() => setCurrentLabel(null)}>×</button>
        <h2 id="experience-viewer-heading" className="experience-viewer-title">{currentLabel.label}</h2>
        <div id="story-container" className="experience-story-list" aria-label="Choose a story">
          {stories.map((story, index) => (
            <button type="button" key={`${currentLabel.label}-${index}`}
              className={`experience-story-card${activeIndex === index ? " selected" : ""}`}
              aria-pressed={activeIndex === index}
              onClick={() => setSelectedIndex(index)}>
              <span className="experience-story-number">Story {index + 1}</span>
              <span className="experience-story-preview">{preview(story)}</span>
            </button>
          ))}
          {stories.length === 0 && <p>No stories available yet. Be the first to share.</p>}
        </div>
        <div className="experience-viewer-content">
          <div id="story-focus" className="experience-story-focus" aria-live="polite">
            {stories[activeIndex] || "No stories available yet."}
          </div>
          <form className="experience-story-form" onSubmit={addStory}>
            <textarea id="input-story" placeholder="Write your story" aria-label="Write your story"
              value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button id="story-submit" type="submit" disabled={!draft.trim()}>Submit</button>
          </form>
        </div>
      </section>
    </div>,
    document.body
  );
}
