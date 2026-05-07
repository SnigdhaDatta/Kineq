import React, { useState } from "react";
import { X, Copy, Twitter, Linkedin, Facebook } from "lucide-react";

interface ShareModalProps {
  url: string;
  open: boolean;
  onClose: () => void;
}

const socialLinks = [
  {
    name: "Twitter",
    icon: <Twitter className="w-5 h-5" />,
    getUrl: (url: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
  {
    name: "WhatsApp",
    icon: (
      <span className="flex items-center justify-center w-5 h-5">
        <div className="icons8-whatsapp"></div>
      </span>
    ),
    getUrl: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: <Facebook className="w-5 h-5" />,
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

const ShareModal: React.FC<ShareModalProps> = ({ url, open, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white border-2 border-black rounded-2xl shadow-2xl p-6 w-full max-w-xs relative flex flex-col gap-4 font-sans">
        <button
          className="absolute top-3 right-3 text-black hover:text-black transition-colors border-2 border-black bg-white rounded-full p-1"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col gap-2">
          <span className="font-sans text-xs text-black/60">Share Link</span>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border-2 border-black">
            <span className="truncate text-xs font-sans flex-1 text-black">
              {url}
            </span>
            <button
              className={`p-1 rounded border-2 border-black transition-colors ${copied ? "bg-black text-white" : "hover:bg-black/10 text-black"}`}
              onClick={handleCopy}
              aria-label="Copy URL"
            >
              <Copy className="w-4 h-4" />
            </button>
            {copied && <span className="text-black text-xs ml-1">Copied!</span>}
          </div>
        </div>
        <div className="flex gap-3 justify-center mt-2">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.getUrl(url)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border-2 border-black hover:bg-black/10 transition-colors text-black"
              aria-label={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
