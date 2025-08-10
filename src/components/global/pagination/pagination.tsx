import React, { memo, CSSProperties } from "react";
import Pagination from "@mui/material/Pagination";

interface PaginationComponentProps {
  page: number;
  rowsPerPage: number;
  totalEntries: number;
  dropDownValues: string[] | number[];
  onPageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void;
  totalPages?: number;
  rowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  inlineStyles?: CSSProperties;
}

function PaginationComponent({
  totalPages,
  page,
  rowsPerPage,
  totalEntries,
  dropDownValues,
  onPageChange,
  rowsPerPageChange,
  inlineStyles,
}: PaginationComponentProps) {
  return (
    <div
      className="flex flex-col gap-3 sm:gap-4 justify-between items-center h-max w-full px-2 sm:px-0"
      style={inlineStyles}
    >
      {/* Entries Info */}
      <div className="font-normal text-sm sm:text-base text-[#434343] m-0 h-full flex justify-center items-center text-center">
        <span className="hidden sm:inline">
          Showing&nbsp;
          <span className="text-[#38b6ff]">{(page - 1) * rowsPerPage + 1}</span>
          &nbsp;to&nbsp;
          <span className="text-[#38b6ff]">
            {Math.min(page * rowsPerPage, totalEntries)}
          </span>
          &nbsp;of&nbsp;
          <span className="text-[#38b6ff] entries">{totalEntries}</span>
          &nbsp;entries.
        </span>
        <span className="sm:hidden">
          <span className="text-[#38b6ff]">{(page - 1) * rowsPerPage + 1}</span>-
          <span className="text-[#38b6ff]">
            {Math.min(page * rowsPerPage, totalEntries)}
          </span> of{" "}
          <span className="text-[#38b6ff]">{totalEntries}</span>
        </span>
      </div>

      {/* Pagination Controls */}
      <div className="w-full flex justify-center">
        <Pagination
          count={
            (totalPages && totalPages) || Math.ceil(totalEntries / rowsPerPage)
          }
          page={page}
          onChange={onPageChange}
          shape="rounded"
          size="small"
          siblingCount={0}
          boundaryCount={1}
          className="m-0 flex justify-center w-max h-max overflow-hidden"
          sx={{
            "& .MuiPagination-ul": {
              height: "max-content",
              flexWrap: "nowrap",
            },
            "& .MuiPaginationItem-root": {
              color: "var(--text-color, #434343)",
              border: "1.12px solid #d4d4d4",
              width: "max-content",
              height: "max-content",
              minWidth: { xs: "32px", sm: "40px" },
              fontSize: { xs: "14px", sm: "16px" },
              fontFamily: "var(--leagueSpartan-regular-400, sans-serif)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 1px",
            },
            "& .MuiPaginationItem-root:hover": {
              backgroundColor: "transparent",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              color: "#fff",
              backgroundColor: "#38b6ff",
              border: "1px solid #38b6ff",
            },
            "& .MuiPaginationItem-root.Mui-disabled": {
              opacity: 0.5,
            },
            "& .MuiPaginationItem-previousNext": {
              color: "#38b6ff",
              border: "none",
              "&:hover": {
                background: "none",
              },
            },
            "& .MuiPaginationItem-icon": {
              fontSize: { xs: "16px", sm: "20px" },
            },
          }}
        />
      </div>

      {/* Rows Per Page Selector */}
      <div className="flex justify-center items-center gap-2 sm:gap-2.5 h-full">
        <span className="text-sm sm:text-base text-[#434343]">Show</span>
        <select
          value={rowsPerPage}
          onChange={rowsPerPageChange}
          className="cursor-pointer w-10 sm:w-12 h-7 sm:h-8 min-w-[36px] sm:min-w-[40px] border border-[#38b6ff] rounded bg-transparent text-black text-sm sm:text-base font-normal px-1 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:ring-opacity-50"
        >
          {dropDownValues?.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default memo(PaginationComponent);
