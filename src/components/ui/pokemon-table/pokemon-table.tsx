import { memo, useCallback } from "react";
import Image from "next/image";
import { useTeamContext } from "@/contexts/TeamContext";
import { getAllPokemons } from "@/services/api-handlers/fetchAllSessions";

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

// Memoized Table Row Component
const PokemonRow = memo(({ pokemon }: { pokemon: Pokemon }) => {
  const pokemonId = pokemon.url.split("/").slice(-2)[0];
  const { currentTeam, canAddPokemon, addPokemonToTeam } = useTeamContext();

  const handleAddToTeam = useCallback(async () => {
    if (!currentTeam) return;
    
    try {
      const pokemonDetails = await getAllPokemons({ searchTerm: pokemon.name });
      if (pokemonDetails && pokemonDetails.id) {
        addPokemonToTeam(currentTeam.id, pokemonDetails);
      }
    } catch (error) {
      console.error("Error adding Pokemon to team:", error);
    }
  }, [pokemon.name, currentTeam, addPokemonToTeam]);

  const canAdd = currentTeam ? canAddPokemon(currentTeam.id, parseInt(pokemonId)) : false;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="w-1/5 px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
        {pokemonId}
      </td>
      <td className="w-1/5 px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 ">
        <span className="text-sm font-medium text-gray-900 capitalize">
          {pokemon.name}
        </span>
      </td>
      <td className="w-1/5 px-6 py-4">
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
      <td className="w-1/5 px-6 py-4 text-center">
        <span className="text-sm text-gray-600">
          {currentTeam ? currentTeam.name : "No team selected"}
        </span>
      </td>
      <td className="w-1/5 px-6 py-4 text-center">
        {currentTeam && (
          <button
            onClick={handleAddToTeam}
            disabled={!canAdd}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              canAdd
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {!canAdd && currentTeam.pokemon.some(p => p.id === parseInt(pokemonId))
              ? "In Team"
              : !canAdd && currentTeam.pokemon.length >= 6
              ? "Team Full"
              : "Add to Team"}
          </button>
        )}
      </td>
    </tr>
  );
});

PokemonRow.displayName = "PokemonRow";

// Memoized Empty State Component
const EmptyState = memo(
  ({
    isSearching,
    debouncedSearchTerm,
  }: {
    isSearching: boolean;
    debouncedSearchTerm: string;
  }) => (
    <tr>
      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
        {isSearching && debouncedSearchTerm
          ? `No Pokemon found matching "${debouncedSearchTerm}". Try searching for exact names like "pikachu" or "charizard".`
          : "No Pokemon found."}
      </td>
    </tr>
  )
);

EmptyState.displayName = "EmptyState";

// Main Table Component
const PokemonTable = memo(function PokemonTable({
  results,
  debouncedSearchTerm,
  isSearching,
}: PokemonTableProps) {
  return (
    <div className="shadow-lg rounded-lg bg-white border border-gray-200 mb-2 w-full overflow-hidden">
      <table className="w-full table-fixed">
        {" "}
        <thead className="bg-gray-100 border-b-2 border-gray-200 sticky top-0 z-10">
          <tr>
            <th className="w-1/5 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="w-1/5 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="w-1/5 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sprite
            </th>
            <th className="w-1/5 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Team
            </th>
            <th className="w-1/5 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <PokemonRow key={pokemon.name} pokemon={pokemon} />
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
  );
});

PokemonTable.displayName = "PokemonTable";

export default PokemonTable;
