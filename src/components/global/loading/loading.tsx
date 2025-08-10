import { memo } from "react";

const LoadingSpinner = memo(({ isSearching }: { isSearching: boolean }) => (
  <div className="w-full p-4 flex justify-center items-center h-screen">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">
        {isSearching ? "Searching..." : "Loading..."}
      </p>
    </div>
  </div>
));
LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
