const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center space-x-4 mt-6">
    {/* Previous Button */}
    <button
      onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded-md text-sm font-medium ${
        currentPage === 1
          ? "bg-light-gray text-body-text cursor-not-allowed"
          : "bg-[#40c4a7] text-white hover:bg-[#35a48b] transition"
      }`}
    >
      Previous
    </button>

    {/* Page Info */}
    <span className="text-sm font-medium text-body-text">
      Page <span className="font-semibold">{currentPage}</span> of{" "}
      <span className="font-semibold">{totalPages}</span>
    </span>

    {/* Next Button */}
    <button
      onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded-md text-sm font-medium ${
        currentPage === totalPages
          ? "bg-light-gray text-body-text cursor-not-allowed"
          : "bg-[#40c4a7] text-white hover:bg-[#35a48b] transition"
      }`}
    >
      Next
    </button>
  </div>
);

export default Pagination;
