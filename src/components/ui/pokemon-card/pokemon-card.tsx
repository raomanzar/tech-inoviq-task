import { memo, useMemo, useCallback } from "react";
import Image from "next/image";
import { useTeamContext } from "@/contexts/TeamContext";

const BASE_IMAGE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

// Define type for single Pokemon details
export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    other?: {
      "official-artwork"?: {
        front_default: string;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
}

interface PokemonCardProps {
  pokemon: PokemonDetails;
  onBack: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

const STAT_NAMES: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
};

// Memoized Type Badge Component
const TypeBadge = memo(({ type }: { type: string }) => (
  <span
    className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
      TYPE_COLORS[type] || "bg-gray-400"
    }`}
  >
    {type}
  </span>
));
TypeBadge.displayName = "TypeBadge";

// Memoized Stat Bar Component
const StatBar = memo(
  ({ stat }: { stat: { base_stat: number; stat: { name: string } } }) => {
    const percentage = useMemo(
      () => Math.min((stat.base_stat / 255) * 100, 100),
      [stat.base_stat]
    );

    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 w-20">
          {STAT_NAMES[stat.stat.name] || stat.stat.name}
        </span>
        <div className="flex-grow bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-semibold w-10">{stat.base_stat}</span>
      </div>
    );
  }
);
StatBar.displayName = "StatBar";

// Memoized Ability Item Component
const AbilityItem = memo(
  ({
    ability,
  }: {
    ability: {
      ability: { name: string };
      is_hidden: boolean;
      slot: number;
    };
  }) => (
    <p className="text-sm font-medium capitalize">
      {ability.ability.name.replace("-", " ")}
      {ability.is_hidden && (
        <span className="text-xs text-gray-500 ml-1">(Hidden)</span>
      )}
    </p>
  )
);
AbilityItem.displayName = "AbilityItem";

const PokemonCard = memo(function PokemonCard({
  pokemon,
  onBack,
}: PokemonCardProps) {
  const { currentTeam, canAddPokemon, addPokemonToTeam } = useTeamContext();
  // Memoize computed values
  const pokemonNumber = useMemo(
    () => String(pokemon.id).padStart(3, "0"),
    [pokemon.id]
  );

  const imageUrl = useMemo(
    () =>
      pokemon.sprites.other?.["official-artwork"]?.front_default ||
      pokemon.sprites.front_default ||
      `${BASE_IMAGE_URL}/${pokemon.id}.png`,
    [pokemon.sprites, pokemon.id]
  );

  const heightInMeters = useMemo(
    () => (pokemon.height / 10).toFixed(1),
    [pokemon.height]
  );

  const weightInKg = useMemo(
    () => (pokemon.weight / 10).toFixed(1),
    [pokemon.weight]
  );

  const handleAddToTeam = useCallback(() => {
    if (currentTeam) {
      addPokemonToTeam(currentTeam.id, pokemon);
    }
  }, [currentTeam, addPokemonToTeam, pokemon]);

  const canAdd = currentTeam ? canAddPokemon(currentTeam.id, pokemon.id) : false;

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="order-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white capitalize">
                {pokemon.name}
              </h2>
              <p className="text-white/80 mt-1">#{pokemonNumber}</p>
            </div>
            <div className="flex gap-2 order-2">
              {pokemon.types.map((type) => (
                <TypeBadge key={type.slot} type={type.type.name} />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Pokemon Image */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <Image
                src={imageUrl}
                alt={pokemon.name}
                width={160}
                height={160}
                className="object-contain sm:w-[200px] sm:h-[200px]"
                priority
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              />
            </div>

            {/* Pokemon Info */}
            <div className="flex-grow space-y-3 sm:space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Height</p>
                  <p className="font-semibold">{heightInMeters} m</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Weight</p>
                  <p className="font-semibold">{weightInKg} kg</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Base Experience</p>
                  <p className="font-semibold">{pokemon.base_experience}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Abilities</p>
                  <div className="space-y-1">
                    {pokemon.abilities.map((ability) => (
                      <AbilityItem key={ability.slot} ability={ability} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Base Stats</h3>
                <div className="space-y-2">
                  {pokemon.stats.map((stat) => (
                    <StatBar key={stat.stat.name} stat={stat} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button and Team Actions */}
      <div className="text-center mt-4 sm:mt-6 space-y-3 px-4 sm:px-0">
        {currentTeam && (
          <div className="mb-4 sm:mb-6">
            <p className="text-sm text-gray-600 mb-3">
              Current Team: <span className="font-medium">{currentTeam.name}</span>
            </p>
            <button
              onClick={handleAddToTeam}
              disabled={!canAdd}
              className={`w-full sm:w-auto px-6 py-3 rounded-md font-medium transition-colors text-sm sm:text-base ${
                canAdd
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {!canAdd && currentTeam.pokemon.some(p => p.id === pokemon.id)
                ? "Already in Team"
                : !canAdd && currentTeam.pokemon.length >= 6
                ? "Team Full (6/6)"
                : "Add to Team"}
            </button>
          </div>
        )}
        <button
          onClick={onBack}
          className="w-full sm:w-auto text-blue-600 hover:text-blue-800 underline cursor-pointer transition-colors text-sm sm:text-base py-2"
          type="button"
          aria-label="Back to Pokemon list"
        >
          Back to Pokemon list
        </button>
      </div>
    </>
  );
});

PokemonCard.displayName = "PokemonCard";

export default PokemonCard;
