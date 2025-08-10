"use client";
import { memo, useCallback, useState } from "react";
import Image from "next/image";
import { useTeamContext } from "@/contexts/TeamContext";
import { Team, TeamPokemon } from "@/types/team";

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

interface TeamSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const TypeBadge = memo(({ type }: { type: string }) => (
  <span
    className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
      TYPE_COLORS[type] || "bg-gray-400"
    }`}
  >
    {type}
  </span>
));
TypeBadge.displayName = "TypeBadge";

const PokemonTeamCard = memo(({ pokemon, onRemove }: { 
  pokemon: TeamPokemon; 
  onRemove: () => void; 
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
    <div className="flex items-center gap-3">
      <Image
        src={pokemon.sprite}
        alt={pokemon.name}
        width={40}
        height={40}
        className="object-contain"
      />
      <div className="flex-grow">
        <h4 className="font-medium text-sm capitalize">{pokemon.name}</h4>
        <div className="flex gap-1 mt-1">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Base Exp: {pokemon.base_experience}
        </p>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 text-sm font-medium"
        title="Remove from team"
      >
        ×
      </button>
    </div>
  </div>
));
PokemonTeamCard.displayName = "PokemonTeamCard";

const TeamStats = memo(({ team }: { team: Team }) => {
  const { getTeamStats } = useTeamContext();
  const stats = getTeamStats(team);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-blue-800 mb-2">Team Stats</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-blue-700">Pokemon Count:</span>
          <span className="font-medium">{team.pokemon.length}/6</span>
        </div>
        <div className="flex justify-between">
          <span className="text-blue-700">Types Covered:</span>
          <span className="font-medium">{stats.totalTypes}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-blue-700">Avg Base Experience:</span>
          <span className="font-medium">{stats.averageBaseExperience}</span>
        </div>
        {stats.typesCovered.length > 0 && (
          <div>
            <span className="text-blue-700 block mb-1">Type Coverage:</span>
            <div className="flex flex-wrap gap-1">
              {stats.typesCovered.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
TeamStats.displayName = "TeamStats";

const TeamSidebar = memo(function TeamSidebar({ isOpen, onClose }: TeamSidebarProps) {
  const { 
    teams, 
    currentTeam, 
    setCurrentTeam, 
    createTeam, 
    deleteTeam, 
    removePokemonFromTeam,
    MAX_TEAM_SIZE 
  } = useTeamContext();
  
  const [newTeamName, setNewTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTeam = useCallback(() => {
    if (newTeamName.trim()) {
      createTeam(newTeamName.trim());
      setNewTeamName("");
      setIsCreating(false);
    }
  }, [newTeamName, createTeam]);

  const handleDeleteTeam = useCallback((teamId: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      deleteTeam(teamId);
    }
  }, [deleteTeam]);

  const handleRemovePokemon = useCallback((pokemonId: number) => {
    if (currentTeam) {
      removePokemonFromTeam(currentTeam.id, pokemonId);
    }
  }, [currentTeam, removePokemonFromTeam]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative ml-auto w-96 bg-white h-full shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Teams</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Create Team Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Create New Team</h3>
            {!isCreating ? (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium"
              >
                + New Team
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Team name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateTeam}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewTeamName("");
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-1 px-3 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Team Selection */}
          <div>
            <h3 className="font-semibold mb-2">Select Team</h3>
            <div className="space-y-2">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    currentTeam?.id === team.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setCurrentTeam(team)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{team.name}</h4>
                      <p className="text-sm text-gray-500">
                        {team.pokemon.length}/{MAX_TEAM_SIZE} Pokemon
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTeam(team.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {teams.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No teams created yet
                </p>
              )}
            </div>
          </div>

          {/* Current Team Details */}
          {currentTeam && (
            <div>
              <h3 className="font-semibold mb-2">Current Team: {currentTeam.name}</h3>
              <TeamStats team={currentTeam} />
              
              <div className="space-y-2">
                {currentTeam.pokemon.map((pokemon) => (
                  <PokemonTeamCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onRemove={() => handleRemovePokemon(pokemon.id)}
                  />
                ))}
                {currentTeam.pokemon.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No Pokemon in this team yet
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

TeamSidebar.displayName = "TeamSidebar";

export default TeamSidebar;