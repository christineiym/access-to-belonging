import { useState, useRef, useEffect } from "react";

export default function Story({
  name,
  location,
  summary,
  quote,
  takeaway,
  imageSource,
  shortDescription,
  longDescription
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const zoomedImageRef = useRef(null);

  useEffect(() => {
    if (!isModalOpen) return;

    // Move focus to the zoomed image first
    zoomedImageRef.current?.focus();

    const handleKeyDown = (e) => {
      // Esc closes
      if (e.key === "Escape") {
        setIsModalOpen(false);
        return;
      }

      // Focus trap
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="mt-12 space-y-1 max-w-4xl mx-auto pl-10 pr-10 gap-10">
        <h2 className="text-4xl font-bold text-darkPurple">{name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="order-2 md:order-1 flex flex-col justify-center h-full">
            <p className="text-2xl text-purple-700 font-normal mt-2">{location}</p>
            <p className="text-xl mt-2">{summary}</p>
          </div>
          <div className="order-1 md:order-2 flex items-center">
            <div className="text-2xl bg-purple-200 p-5 rounded font-semibold max-w-sm w-full h-fit">
              <p>{takeaway}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="pt-5 pl-3 pr-5 justify-center">
            <blockquote className="border-l-4 border-tcatTeal pl-4">
              <p>{quote}</p>
            </blockquote>
          </div>
          <div className="flex flex-col justify-center h-full">
            <button
              onClick={() => setIsModalOpen(true)}
              className="border-4 border-purple-700 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-400"
            >
              <img
                src={imageSource}
                alt={shortDescription}
                className="rounded-md"
                style={{"cursor": "zoom-in"}}
              />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          role="dialog"
          aria-modal="true"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="relative bg-purple-100 rounded-lg p-6 max-w-5xl w-full mx-4 shadow-lg"
          >

            <img
              ref={zoomedImageRef}
              src={imageSource}
              alt={longDescription}
              tabIndex={0}
              className="rounded-md max-h-[80vh] mx-auto outline-none"
            />

            <button
              ref={closeButtonRef}
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-2xl font-bold text-purple-700 hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
              aria-label="Close image preview"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}