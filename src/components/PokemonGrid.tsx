import { useEffect, useState } from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard";

type PokemonData = {
  id: number;
  name: string;
  image: string;
  experience: number;
  height: number;
  weight: number;
  types: string[];
  moves: string[];
  abilities: string[]
};

interface Props {
  searchTerm: string;
}

const PokemonGrid: React.FC<Props> = ({ searchTerm }) => {
  const [pokemons, setPokemons] = useState<PokemonData[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=50")
      .then(async (response) => {

        const pokemonList = response.data.results;

        const pokemonDetails = await Promise.all(
          pokemonList.map(async (pokemon: { name: string; url: string }) => {
            const id = pokemon.url.split("/").slice(-2, -1)[0]; 
            const details = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);

            return {
              id: Number(id),
              name: pokemon.name,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
              experience: details.data.base_experience,
              height: details.data.height,
              weight: details.data.weight,
              types: details.data.types.map((t: { type: { name: string } }) => t.type.name),
              moves: details.data.moves.slice(0, 3).map((m: { move: { name: string } }) => m.move.name),
              abilities: details.data.abilities.map((a: { ability: { name: string } }) => a.ability.name),              
            };
          })
        );

        setPokemons(pokemonDetails);
      })
      .catch((error) => console.error("Error fetching Pokémon:", error));
  }, []);

  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {filteredPokemons.map((poke) => ( // 🔥 Použití filtrování
        <PokemonCard
          key={poke.id}
          name={poke.name}
          image={poke.image}
          experience={poke.experience}
          height={poke.height}
          weight={poke.weight}
          types={poke.types}
          moves={poke.moves}
          abilities={poke.abilities}
        />
      ))}
    </div>
  );
};

export default PokemonGrid;
