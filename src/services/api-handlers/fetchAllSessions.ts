import { allSessionsApi } from "@/api/allSessions.api";

interface GetAllPokemonsParams {
  offset?: number;
  limit?: number;
  searchTerm?: string;
}

export async function getAllPokemons({
  offset = 0,
  limit = 20,
  searchTerm = "",
}: GetAllPokemonsParams = {}) {
  const url = new URL(allSessionsApi);
  if (!searchTerm) {
    url.searchParams.append("offset", offset.toString());
    url.searchParams.append("limit", limit.toString());
  }
  try {
    const res = await fetch(`${url.toString()}/${searchTerm}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    } else {
      return res.json();
    }
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
    throw error;
  }
}
