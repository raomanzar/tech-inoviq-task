"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getAllPokemons } from "@/services/api-handlers/fetchAllSessions";
import Pagination from "@/components/global/pagination/pagination";
import useDebounce from "@/hooks/useDebounce";
import PokemonCard, {
  type PokemonDetails,
} from "@/components/ui/pokemon-card/pokemon-card";
import PokemonTable, {
  type Pokemon,
} from "@/components/ui/pokemon-table/pokemon-table";
import SearchBar from "@/components/global/search/search";
import Loading from "@/components/global/loading/loading";
import TeamSidebar from "@/components/ui/team-sidebar/team-sidebar";
import Link from "next/link";

const DROPDOWN_VALUES = [10, 20, 50, 100];
const DEBOUNCE_DELAY = 1000;
const DEFAULT_ROWS_PER_PAGE = 20;
const DEFAULT_PAGE = 1;

export default function Pokemons() {
  // State Management
  const [results, setResults] = useState<Pokemon[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);
  const totalEntries = useMemo(() => totalCount, [totalCount]);
  const totalPages = useMemo(
    () => Math.ceil(totalCount / rowsPerPage),
    [totalCount, rowsPerPage]
  );

  const fetchPokemons = useCallback(
    async (searchQuery: string = "") => {
      try {
        setLoading(true);
        let data;

        if (searchQuery && searchQuery.trim() !== "") {
          // Search for specific Pokemon
          setIsSearching(true);
          data = await getAllPokemons({
            searchTerm: searchQuery.toLowerCase().trim(),
          });

          if (data && data.id) {
            // Single Pokemon detail response
            setPokemonDetails(data as PokemonDetails);
            setResults([]);
          } else if (data && data.results) {
            // Transformed response from the API handler
            setResults(data.results);
            setPokemonDetails(null);
          }
        } else {
          // Get paginated results
          setIsSearching(false);
          setPokemonDetails(null);
          const offset = (currentPage - 1) * rowsPerPage;
          data = await getAllPokemons({ offset, limit: rowsPerPage });

          if (data && data.results) {
            setResults(data.results);
            setTotalCount(data.count);
          }
        }
      } catch (error) {
        console.error("Error fetching pokemons:", error);
        setResults([]);
        setPokemonDetails(null);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, rowsPerPage]
  );

  // Memoized handlers with useCallback
  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newRowsPerPage = Number(event.target.value);
      setRowsPerPage(newRowsPerPage);
      setCurrentPage(DEFAULT_PAGE);
    },
    []
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);

      // If clearing search, reset immediately
      if (value === "") {
        setIsSearching(false);
        setPokemonDetails(null);
      }
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setIsSearching(false);
    setPokemonDetails(null);
    setCurrentPage(DEFAULT_PAGE);
  }, []);

  // Optimized useEffect for pagination
  useEffect(() => {
    if (!searchTerm && !isSearching) {
      fetchPokemons();
    } else if (debouncedSearchTerm) {
      fetchPokemons(debouncedSearchTerm);
    }
  }, [
    currentPage,
    rowsPerPage,
    searchTerm,
    isSearching,
    fetchPokemons,
    debouncedSearchTerm,
  ]);

  // Memoized props for child components
  const searchBarProps = useMemo(
    () => ({
      searchTerm,
      onSearchChange: handleSearchChange,
      onClearSearch: clearSearch,
    }),
    [searchTerm, handleSearchChange, clearSearch]
  );

  const pokemonTableProps = useMemo(
    () => ({
      results,
      loading,
      searchTerm,
      debouncedSearchTerm,
      isSearching,
    }),
    [results, loading, searchTerm, debouncedSearchTerm, isSearching]
  );

  const paginationProps = useMemo(
    () => ({
      totalPages,
      page: currentPage,
      rowsPerPage,
      totalEntries,
      dropDownValues: DROPDOWN_VALUES,
      onPageChange: handlePageChange,
      rowsPerPageChange: handleRowsPerPageChange,
    }),
    [
      totalPages,
      currentPage,
      rowsPerPage,
      totalEntries,
      handlePageChange,
      handleRowsPerPageChange,
    ]
  );

  // Early return for loading state
  if (loading) {
    return <Loading isSearching={isSearching} />;
  }

  return (
    <div
      className="flex flex-col items-center justify-items-center min-h-screen gap-2 p-2 sm:p-4 lg:p-8"
    >
      <div className="w-full max-w-7xl px-2 sm:px-4 lg:px-6 flex flex-col gap-3 sm:gap-4 lg:gap-6 items-center">
        {/* Action Buttons */}
        <div className="w-full flex justify-end">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="cursor-pointer inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Manage Teams</span>
              <span className="sm:hidden">Teams</span>
            </button>
            <Link
              href={"/teams"}
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
            >
              <span className="hidden sm:inline">All Teams</span>
              <span className="sm:hidden">View All</span>
            </Link>
          </div>
        </div>
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left order-2 sm:order-1">Pokemons</h1>
          <div className="w-full sm:w-auto order-1 sm:order-2">
            <SearchBar {...searchBarProps} />
          </div>
        </div>
        {isSearching && pokemonDetails ? (
          <PokemonCard pokemon={pokemonDetails} onBack={clearSearch} />
        ) : (
          /* Display Table for paginated results */
          <>
            <PokemonTable {...pokemonTableProps} />
            {/* Only show pagination if not searching */}
            {!isSearching && <Pagination {...paginationProps} />}
          </>
        )}
      </div>

      <TeamSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}
