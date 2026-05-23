import React from "react";

interface LinkPreviewCardProps {
  title?: string;
  description?: string;
  image?: string;
  url: string;
  siteName?: string;
}

const LinkPreviewCard: React.FC<LinkPreviewCardProps> = ({
  title,
  description,
  image,
  url,
  siteName,
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-xs rounded-2xl border-2 border-black bg-card shadow-md hover:shadow-xl transition-all p-4 group font-sans"
      style={{ textDecoration: "none" }}
    >
      <div className="flex gap-3 items-center">
        {image && (
          <img
            src={image}
            alt={title || url}
            className="w-14 h-14 rounded-xl object-cover border-2 border-black bg-muted flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground truncate mb-1">
            {siteName || url.replace(/https?:\/\//, "").split("/")[0]}
          </div>
          <div className="font-semibold text-foreground text-base truncate mb-1 group-hover:underline">
            {title || url}
          </div>
          {description && (
            <div className="text-xs text-muted-foreground truncate">
              {description}
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default LinkPreviewCard;
