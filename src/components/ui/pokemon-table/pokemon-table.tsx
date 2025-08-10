import { memo, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { useTeamContext } from "@/contexts/TeamContext";
import { getAllPokemons } from "@/services/api-handlers/fetchAllSessions";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { Team } from "@/types/team";

const BASE_IMAGE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export interface Pokemon {
  name: string;
  url: string;
}

interface PokemonTableProps {
  results: Pokemon[];
  loading: boolean;
  searchTerm: string;
  debouncedSearchTerm: string;
  isSearching: boolean;
}

// Toast Component
const Toast = memo(
  ({
    message,
    isVisible,
    onClose,
    type = "error",
  }: {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    type?: "success" | "error";
  }) => {
    if (!isVisible) return null;

    const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
    const hoverColor =
      type === "success" ? "hover:bg-green-600" : "hover:bg-red-600";

    return (
      <div
        className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-start gap-2`}
      >
        <span className="flex-1 text-sm sm:text-base leading-tight">
          {message}
        </span>
        <button
          onClick={onClose}
          className={`${hoverColor} rounded p-1 flex-shrink-0 mt-0.5 sm:mt-0`}
          aria-label="Close notification"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>
    );
  }
);
Toast.displayName = "Toast";

// Team Selection Modal
const TeamModal = memo(
  ({
    isOpen,
    onClose,
    teams,
    pokemon,
    onTeamSelect,
  }: {
    isOpen: boolean;
    onClose: () => void;
    teams: Team[];
    pokemon: Pokemon;
    onTeamSelect: (team: Team) => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0  backdrop-blur-xl" onClick={onClose} />
        <div className="relative bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[80vh] sm:max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              <span className="hidden sm:inline">Select Team for </span>
              <span className="capitalize">{pokemon.name}</span>
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer p-1"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>

          {teams.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <p className="text-sm sm:text-base">No teams created yet</p>
              <p className="text-xs sm:text-sm mt-2">
                Create a team first to add Pokemon
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors active:bg-gray-100"
                  onClick={() => onTeamSelect(team)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-grow mr-3">
                      <h4 className="font-medium text-sm sm:text-base truncate">
                        {team.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {team.pokemon.length}/6 Pokemon
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {team.pokemon.length >= 6 ? (
                        <span className="text-red-500 text-xs sm:text-sm font-medium">
                          Full
                        </span>
                      ) : (
                        <span className="text-green-500 text-xs sm:text-sm font-medium">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
TeamModal.displayName = "TeamModal";

// Mobile Pokemon Card Component
const PokemonMobileCard = memo(
  ({
    pokemon,
    onAddClick,
  }: {
    pokemon: Pokemon;
    onAddClick: (pokemon: Pokemon) => void;
  }) => {
    const pokemonId = pokemon.url.split("/").slice(-2)[0];

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Image
              src={`${BASE_IMAGE_URL}/${pokemonId}.png`}
              alt={pokemon.name}
              width={60}
              height={60}
              className="object-contain"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 capitalize">
                  {pokemon.name}
                </h3>
                <p className="text-sm text-gray-500">ID: {pokemonId}</p>
              </div>
              <button
                onClick={() => onAddClick(pokemon)}
                className="cursor-pointer flex items-center justify-center w-10 h-10 bg-[#38b6ff] hover:bg-[#2da7f0] text-white rounded-full transition-colors"
                title="Add to team"
              >
                <AddIcon fontSize="small" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
PokemonMobileCard.displayName = "PokemonMobileCard";

// Desktop Table Row Component
const PokemonRow = memo(
  ({
    pokemon,
    onAddClick,
  }: {
    pokemon: Pokemon;
    onAddClick: (pokemon: Pokemon) => void;
  }) => {
    const pokemonId = pokemon.url.split("/").slice(-2)[0];

    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="w-1/4 px-3 sm:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
          {pokemonId}
        </td>
        <td className="w-1/4 px-3 sm:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 ">
          <span className="text-sm font-medium text-gray-900 capitalize">
            {pokemon.name}
          </span>
        </td>
        <td className="w-1/4 px-3 sm:px-6 py-4">
          <span className="flex items-center justify-center">
            <Image
              src={`${BASE_IMAGE_URL}/${pokemonId}.png`}
              alt={pokemon.name}
              width={50}
              height={50}
              className="object-contain"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            />
          </span>
        </td>
        <td className="w-1/4 px-3 sm:px-6 py-4">
          <div className="flex items-center justify-center">
            <button
              onClick={() => onAddClick(pokemon)}
              className="cursor-pointer flex items-center justify-center w-8 h-8 bg-[#38b6ff] hover:bg-[#2da7f0] text-white rounded-full transition-colors"
              title="Add to team"
            >
              <AddIcon fontSize="small" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

PokemonRow.displayName = "PokemonRow";

// Desktop Empty State Component
const EmptyState = memo(
  ({
    isSearching,
    debouncedSearchTerm,
  }: {
    isSearching: boolean;
    debouncedSearchTerm: string;
  }) => (
    <tr>
      <td colSpan={4} className="px-3 sm:px-6 py-8 text-center text-gray-500">
        {isSearching && debouncedSearchTerm
          ? `No Pokemon found matching "${debouncedSearchTerm}". Try searching for exact names like "pikachu" or "charizard".`
          : "No Pokemon found."}
      </td>
    </tr>
  )
);

// Mobile Empty State Component
const MobileEmptyState = memo(
  ({
    isSearching,
    debouncedSearchTerm,
  }: {
    isSearching: boolean;
    debouncedSearchTerm: string;
  }) => (
    <div className="text-center py-12 text-gray-500">
      <div className="text-gray-400 mb-4">
        <svg
          className="mx-auto h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291.94-5.709 2.291"
          />
        </svg>
      </div>
      <p className="text-lg font-medium">
        {isSearching && debouncedSearchTerm
          ? `No Pokemon found matching "${debouncedSearchTerm}"`
          : "No Pokemon found"}
      </p>
      {isSearching && debouncedSearchTerm && (
        <p className="text-sm mt-2">
          Try searching for exact names like &quot;pikachu or &quot;charizard
        </p>
      )}
    </div>
  )
);
MobileEmptyState.displayName = "MobileEmptyState";

EmptyState.displayName = "EmptyState";

// Main Table Component
const PokemonTable = memo(function PokemonTable({
  results,
  debouncedSearchTerm,
  isSearching,
}: PokemonTableProps) {
  const { teams, addPokemonToTeam, canAddPokemon } = useTeamContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("error");

  const handleAddClick = useCallback((pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  }, []);

  const handleTeamSelect = useCallback(
    async (team: Team) => {
      if (!selectedPokemon) return;

      const pokemonId = parseInt(selectedPokemon.url.split("/").slice(-2)[0]);

      // Check if team is full
      if (team.pokemon.length >= 6) {
        setToastMessage("Team can only contain 6 Pokemon at a time");
        setToastType("error");
        setShowToast(true);
        setIsModalOpen(false);
        return;
      }

      // Check if Pokemon already exists in team
      if (!canAddPokemon(team.id, pokemonId)) {
        setToastMessage("This Pokemon is already in the team");
        setToastType("error");
        setShowToast(true);
        setIsModalOpen(false);
        return;
      }

      try {
        const pokemonDetails = await getAllPokemons({
          searchTerm: selectedPokemon.name,
        });
        if (pokemonDetails && pokemonDetails.id) {
          addPokemonToTeam(team.id, pokemonDetails);
          setToastMessage(
            `${selectedPokemon.name} added to ${team.name} successfully!`
          );
          setToastType("success");
          setShowToast(true);
        }
      } catch (error) {
        console.error("Error adding Pokemon to team:", error);
        setToastMessage("Failed to add Pokemon to team");
        setToastType("error");
        setShowToast(true);
      }

      setIsModalOpen(false);
      setSelectedPokemon(null);
    },
    [selectedPokemon, addPokemonToTeam, canAddPokemon]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  }, []);

  const handleCloseToast = useCallback(() => {
    setShowToast(false);
    setToastMessage("");
  }, []);

  // Auto-close toast after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        handleCloseToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast, handleCloseToast]);

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block shadow-lg rounded-lg bg-white border border-gray-200 mb-2 w-full overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-gray-100 border-b-2 border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="w-1/4 px-3 sm:px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="w-1/4 px-3 sm:px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="w-1/4 px-3 sm:px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sprite
              </th>
              <th className="w-1/4 px-3 sm:px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
        </table>
        <div className="overflow-y-auto max-h-[500px]">
          <table className="w-full">
            <tbody className="bg-white divide-y divide-gray-200">
              {results.length > 0 ? (
                results.map((pokemon) => (
                  <PokemonRow
                    key={pokemon.name}
                    pokemon={pokemon}
                    onAddClick={handleAddClick}
                  />
                ))
              ) : (
                <EmptyState
                  isSearching={isSearching}
                  debouncedSearchTerm={debouncedSearchTerm}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden w-full">
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((pokemon) => (
              <PokemonMobileCard
                key={pokemon.name}
                pokemon={pokemon}
                onAddClick={handleAddClick}
              />
            ))}
          </div>
        ) : (
          <MobileEmptyState
            isSearching={isSearching}
            debouncedSearchTerm={debouncedSearchTerm}
          />
        )}
      </div>

      {/* Team Selection Modal */}
      {selectedPokemon && (
        <TeamModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          teams={teams}
          pokemon={selectedPokemon}
          onTeamSelect={handleTeamSelect}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={handleCloseToast}
        type={toastType}
      />
    </>
  );
});

PokemonTable.displayName = "PokemonTable";

export default PokemonTable;
