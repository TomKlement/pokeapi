import React, { useEffect, useState } from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard";

const PokemonGrid = () => {
    const [pokemons, setPokemons] = useState<{ name: string; url: string }[]>([]);

    useEffect(() => {
        axios.get("https://pokeapi.co/api/v2/pokemon?limit=50")
          .then(response => setPokemons(response.data.results))
          .catch(error => console.error("Error fetching Pokémon:", error));
      }, []);
      


    return <div>
    {pokemons.map((poke) => (
        <PokemonCard key={poke.name} name={poke.name} />
    ))}
  </div>;
};

export default PokemonGrid;
