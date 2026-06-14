"use client";

export default function ProductHuntBadge() {
  return (
    <div
      className="fixed z-[9997]"
      style={{
        bottom: "max(70px, env(safe-area-inset-bottom, 70px))",
        left: "16px",
        transform: "translate3d(0, 0, 0)",
        WebkitTransform: "translate3d(0, 0, 0)",
      }}
    >
      <a
        href="https://www.producthunt.com/products/kineq?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-kineq"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Kineq on Product Hunt"
      >
        <img
          alt="Kineq - Your AI-Powered Watchlist Organizer cum Tracker | Product Hunt"
          width="210"
          height="45"
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1171559&theme=neutral&t=1781446256364"
        />
      </a>
    </div>
  );
}
