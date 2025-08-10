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
      className="flex flex-col gap-3 justify-between items-center h-max"
      style={inlineStyles}
    >
      <div className="font-normal text-base text-[#434343] m-0 h-full flex justify-between items-center">
        Showing &nbsp;
        <span className="text-[#38b6ff]">{(page - 1) * rowsPerPage + 1}</span>
        &nbsp; to &nbsp;
        <span className="text-[#38b6ff]">
          {Math.min(page * rowsPerPage, totalEntries)}
        </span>
        &nbsp; of &nbsp;
        <span className="text-[#38b6ff]">{totalEntries}</span>
        &nbsp; entries.
      </div>

      <Pagination
        count={
          (totalPages && totalPages) || Math.ceil(totalEntries / rowsPerPage)
        }
        page={page}
        onChange={onPageChange}
        shape="rounded"
        sx={{
          margin: 0,
          display: "flex",
          justifyContent: "center",
          width: "max-content",
          height: "max-content",
          overflow: "hidden",
          "& .MuiPaginationItem-root": {
            color: "var(--text-color)",
            border: "1.12px solid #d4d4d4",
            width: "max-content",
            height: "max-content",
            minWidth: "40px",
            fontSize: "var(--normal-text-size)",
            fontFamily: "var(--leagueSpartan-regular-400)",
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
            color: "#38b6ff",
          },
          "& .MuiPaginationItem-previousNext": {
            color: "#38b6ff",
            border: "none",
          },
          "& .MuiPaginationItem-previousNext:hover": {
            background: "none",
          },
        }}
      />

      <div className="flex justify-center items-center gap-2.5 h-full">
        Show{" "}
        <select
          value={rowsPerPage}
          onChange={rowsPerPageChange}
          className="cursor-pointer w-12 h-8 min-w-10 border border-[#38b6ff] rounded bg-transparent text-black text-base font-normal"
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
