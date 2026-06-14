import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div 
      style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        gap: "1.5rem",
        marginTop: "2rem",
        borderTop: "1px double var(--bronze-dark)",
        paddingTop: "1.5rem"
      }}
    >
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-fantasy"
        style={{ 
          padding: "0.4rem 0.8rem",
          fontSize: "0.85rem"
        }}
      >
        <ChevronLeft size={14} />
        <span>Previous Page</span>
      </button>

      {/* Pages indicator */}
      <div 
        style={{ 
          fontFamily: "Cinzel", 
          fontSize: "1rem", 
          color: "var(--gold)",
          textShadow: "1px 1px 2px black" 
        }}
      >
        Scroll <span style={{ fontWeight: "bold" }}>{currentPage}</span> of <span style={{ fontWeight: "bold" }}>{totalPages}</span>
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-fantasy"
        style={{ 
          padding: "0.4rem 0.8rem",
          fontSize: "0.85rem"
        }}
      >
        <span>Next Page</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
};
export default Pagination;
