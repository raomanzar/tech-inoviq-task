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

export interface TeamStats {
  totalTypes: number;
  averageBaseExperience: number;
  typesCovered: string[];
}

export interface TeamContextType {
  teams: Team[];
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  createTeam: (name: string) => Team;
  deleteTeam: (teamId: string) => void;
  addPokemonToTeam: (teamId: string, pokemonDetails: PokemonDetails) => void;
  removePokemonFromTeam: (teamId: string, pokemonId: number) => void;
  canAddPokemon: (teamId: string, pokemonId: number) => boolean;
  getTeamStats: (team: Team) => TeamStats;
  MAX_TEAM_SIZE: number;
}