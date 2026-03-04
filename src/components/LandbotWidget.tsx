import { useState } from "react";
import { MessageCircle, X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const landbotUrl = "https://landbot.online/v3/H-3327385-C01HW6UL6GIHV2CT/index.html";

  return (
    <>
      {/* Chat iframe - visible when open, slides from left */}
      {isOpen && (
        <div
          className="fixed bottom-20 left-4 w-96 h-96 bg-white rounded-lg shadow-2xl z-40 border border-gray-200 overflow-hidden"
          style={{
            animation: isExpanded ? "slideInFromLeft 0.4s ease-out" : "slideOutToLeft 0.4s ease-in",
          }}
        >
          <div className="relative w-full h-full">
            {/* Expand/Collapse button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute top-3 right-3 z-50 p-1 hover:bg-gray-100 rounded"
              aria-label="Toggle expand"
            >
              {isExpanded ? (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            <iframe
              src={landbotUrl}
              title="Landbot Chat"
              className="w-full h-full border-none"
              allow="microphone; camera"
            />
          </div>
        </div>
      )}

      {/* Toggle button - fixed in bottom left */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 rounded-full w-14 h-14 p-0 shadow-lg z-50 bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* CSS animations */}
      <style>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutToLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-30px);
          }
        }
      `}</style>
    </>
  );
};

export default LandbotWidget;
