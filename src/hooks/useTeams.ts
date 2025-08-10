"use client";
import { useState, useEffect, useCallback } from "react";
import { PokemonDetails } from "@/components/ui/pokemon-card/pokemon-card";

export interface TeamPokemon {
  id: number;
  name: string;
  types: string[];
  base_experience: number;
  sprite: string;
}

export interface Team {
  id: string;
  name: string;
  pokemon: TeamPokemon[];
  createdAt: string;
}

const STORAGE_KEY = "pokemon-teams";
const MAX_TEAM_SIZE = 6;

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  // Load teams from localStorage on mount
  useEffect(() => {
    const savedTeams = localStorage.getItem(STORAGE_KEY);
    if (savedTeams) {
      const parsedTeams = JSON.parse(savedTeams);
      setTeams(parsedTeams);
      // Set the first team as current team if no current team is set
      if (parsedTeams.length > 0 && !currentTeam) {
        setCurrentTeam(parsedTeams[0]);
      }
    }
  }, [currentTeam]);

  // Save teams to localStorage whenever teams change
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

    setTeams(prev => [...prev, newTeam]);
    setCurrentTeam(newTeam);
    return newTeam;
  }, []);

  const deleteTeam = useCallback((teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
    setCurrentTeam(prev => prev?.id === teamId ? null : prev);
  }, []);

  const addPokemonToTeam = useCallback((teamId: string, pokemonDetails: PokemonDetails) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        // Check if Pokemon already exists in team
        const exists = team.pokemon.some(p => p.id === pokemonDetails.id);
        if (exists || team.pokemon.length >= MAX_TEAM_SIZE) {
          return team;
        }

        const teamPokemon: TeamPokemon = {
          id: pokemonDetails.id,
          name: pokemonDetails.name,
          types: pokemonDetails.types.map(t => t.type.name),
          base_experience: pokemonDetails.base_experience,
          sprite: pokemonDetails.sprites.other?.["official-artwork"]?.front_default || 
                  pokemonDetails.sprites.front_default ||
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetails.id}.png`,
        };

        return {
          ...team,
          pokemon: [...team.pokemon, teamPokemon],
        };
      }
      return team;
    }));
  }, []);

  const removePokemonFromTeam = useCallback((teamId: string, pokemonId: number) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          pokemon: team.pokemon.filter(p => p.id !== pokemonId),
        };
      }
      return team;
    }));
  }, []);

  const canAddPokemon = useCallback((teamId: string, pokemonId: number) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return false;
    
    const exists = team.pokemon.some(p => p.id === pokemonId);
    const isFull = team.pokemon.length >= MAX_TEAM_SIZE;
    
    return !exists && !isFull;
  }, [teams]);

  const getTeamStats = useCallback((team: Team) => {
    if (team.pokemon.length === 0) {
      return {
        totalTypes: 0,
        averageBaseExperience: 0,
        typesCovered: [],
      };
    }

    // Get unique types
    const allTypes = team.pokemon.flatMap(p => p.types);
    const uniqueTypes = Array.from(new Set(allTypes));
    
    // Calculate average base experience
    const totalExperience = team.pokemon.reduce((sum, p) => sum + p.base_experience, 0);
    const averageBaseExperience = Math.round(totalExperience / team.pokemon.length);

    return {
      totalTypes: uniqueTypes.length,
      averageBaseExperience,
      typesCovered: uniqueTypes,
    };
  }, []);

  return {
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
}