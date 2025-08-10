"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Team, TeamPokemon, TeamStats, TeamContextType } from "@/types/team";
import { PokemonDetails } from "@/components/ui/pokemon-card/pokemon-card";

const TeamContext = createContext<TeamContextType | undefined>(undefined);

const STORAGE_KEY = "pokemon-teams";
const MAX_TEAM_SIZE = 6;

interface TeamProviderProps {
  children: ReactNode;
}

export function TeamProvider({ children }: TeamProviderProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  useEffect(() => {
    const savedTeams = localStorage.getItem(STORAGE_KEY);
    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams);
        setTeams(parsedTeams);
        if (parsedTeams.length > 0 && !currentTeam) {
          setCurrentTeam(parsedTeams[0]);
        }
      } catch (error) {
        console.error("Failed to parse teams from localStorage:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  }, [teams]);

  const createTeam = useCallback((name: string) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      pokemon: [],
      createdAt: new Date().toISOString(),
    };

    setTeams((prev) => [...prev, newTeam]);
    setCurrentTeam(newTeam);
    return newTeam;
  }, []);

  const deleteTeam = useCallback((teamId: string) => {
    setTeams((prev) => prev.filter((team) => team.id !== teamId));
    setCurrentTeam((prev) => (prev?.id === teamId ? null : prev));
  }, []);

  const addPokemonToTeam = useCallback(
    (teamId: string, pokemonDetails: PokemonDetails) => {
      setTeams((prev) =>
        prev.map((team) => {
          if (team.id === teamId) {
            const exists = team.pokemon.some((p) => p.id === pokemonDetails.id);
            if (exists || team.pokemon.length >= MAX_TEAM_SIZE) {
              return team;
            }

            const teamPokemon: TeamPokemon = {
              id: pokemonDetails.id,
              name: pokemonDetails.name,
              types: pokemonDetails.types.map((t) => t.type.name),
              base_experience: pokemonDetails.base_experience,
              sprite:
                pokemonDetails.sprites.other?.["official-artwork"]
                  ?.front_default ||
                pokemonDetails.sprites.front_default ||
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetails.id}.png`,
            };

            return {
              ...team,
              pokemon: [...team.pokemon, teamPokemon],
            };
          }
          return team;
        })
      );
    },
    []
  );

  const removePokemonFromTeam = useCallback(
    (teamId: string, pokemonId: number) => {
      setTeams((prev) =>
        prev.map((team) => {
          if (team.id === teamId) {
            return {
              ...team,
              pokemon: team.pokemon.filter((p) => p.id !== pokemonId),
            };
          }
          return team;
        })
      );
    },
    []
  );

  const canAddPokemon = useCallback(
    (teamId: string, pokemonId: number) => {
      const team = teams.find((t) => t.id === teamId);
      if (!team) return false;

      const exists = team.pokemon.some((p) => p.id === pokemonId);
      const isFull = team.pokemon.length >= MAX_TEAM_SIZE;

      return !exists && !isFull;
    },
    [teams]
  );

  const getTeamStats = useCallback((team: Team): TeamStats => {
    if (team.pokemon.length === 0) {
      return {
        totalTypes: 0,
        averageBaseExperience: 0,
        typesCovered: [],
      };
    }

    const allTypes = team.pokemon.flatMap((p) => p.types);
    const uniqueTypes = Array.from(new Set(allTypes));

    const totalExperience = team.pokemon.reduce(
      (sum, p) => sum + p.base_experience,
      0
    );
    const averageBaseExperience = Math.round(
      totalExperience / team.pokemon.length
    );

    return {
      totalTypes: uniqueTypes.length,
      averageBaseExperience,
      typesCovered: uniqueTypes,
    };
  }, []);

  const value: TeamContextType = {
    teams,
    currentTeam,
    setCurrentTeam,
    createTeam,
    deleteTeam,
    addPokemonToTeam,
    removePokemonFromTeam,
    canAddPokemon,
    getTeamStats,
    MAX_TEAM_SIZE,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeamContext() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeamContext must be used within a TeamProvider");
  }
  return context;
}
