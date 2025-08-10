"use client";
import React from "react";
import { useTeamContext } from "@/contexts/TeamContext";
import { Team } from "@/types/team";
import Image from "next/image";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";

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

const TypeBadge = ({ type }: { type: string }) => (
  <span
    className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
      TYPE_COLORS[type] || "bg-gray-400"
    }`}
  >
    {type}
  </span>
);

const TeamCard = ({ team }: { team: Team }) => {
  const { getTeamStats } = useTeamContext();
  const stats = getTeamStats(team);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">{team.name}</h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Created: {new Date(team.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Team Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
        <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Team Stats</h4>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-blue-600">{team.pokemon.length}/6</div>
            <div className="text-blue-700 text-xs sm:text-sm">Pokemon</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-blue-600">{stats.totalTypes}</div>
            <div className="text-blue-700 text-xs sm:text-sm">Types</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-blue-600">{stats.averageBaseExperience}</div>
            <div className="text-blue-700 text-xs sm:text-sm">Avg Base Exp</div>
          </div>
        </div>
        {stats.typesCovered.length > 0 && (
          <div className="mt-2 sm:mt-3">
            <div className="text-xs sm:text-sm text-blue-700 mb-1">Type Coverage:</div>
            <div className="flex flex-wrap gap-1">
              {stats.typesCovered.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pokemon List */}
      {team.pokemon.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {team.pokemon.map((pokemon) => (
            <div key={pokemon.id} className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
              <Image
                src={pokemon.sprite}
                alt={pokemon.name}
                width={50}
                height={50}
                className="mx-auto object-contain sm:w-[60px] sm:h-[60px]"
              />
              <div className="mt-1 sm:mt-2">
                <h5 className="font-medium text-xs sm:text-sm capitalize text-gray-800 truncate">
                  {pokemon.name}
                </h5>
                <div className="flex justify-center gap-1 mt-1">
                  {pokemon.types.slice(0, 2).map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Base Exp: {pokemon.base_experience}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 text-gray-500">
          <p className="text-sm sm:text-base">No Pokemon in this team yet</p>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  const { teams } = useTeamContext();

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen gap-2 p-2 sm:p-4 lg:p-8">
      <div className="w-full max-w-7xl px-2 sm:px-4 lg:px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between relative mb-6 sm:mb-8 gap-4 sm:gap-0">
          <Link
            href="/pokemons"
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md text-sm sm:text-base order-2 sm:order-1"
          >
            <ArrowBack fontSize="small" className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center order-1 sm:order-2">All Teams</h1>
          <div className="w-full sm:w-auto order-3 sm:hidden"></div>
        </div>
        
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 sm:h-16 w-12 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No teams created yet</h3>
            <p className="text-gray-500 mb-4 sm:mb-6 px-4 text-sm sm:text-base">
              Go to the Pokemon page to create your first team and start adding Pokemon!
            </p>
            <a
              href="/pokemons"
              className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
            >
              Browse Pokemon
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
