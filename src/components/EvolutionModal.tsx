import React, { useEffect, useState } from "react";
import axios from "axios";
import PokeballLoader from "./PokeballLoader";
import PokemonCard from "./PokemonCard";

interface EvolutionModalProps {
  pokemonId?: number;
  isOpen: boolean;
  onClose: () => void;
}

interface PokeDetail {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  moves: any[];
}


const EvolutionModal: React.FC<EvolutionModalProps> = ({
  pokemonId,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [evolutionDetails, setEvolutionDetails] = useState<PokeDetail[]>([]);
  const [anyEvolutions, setAnyEvolutions] = useState("Evolutions")

  // useEffect runs whenever the modal is opened
  useEffect(() => {
    setEvolutionDetails([]);
    setAnyEvolutions("Evolutions")
    if (!pokemonId) {
      setAnyEvolutions("No Evolutions");
      return;
    }


    const fetchEvolutions = async () => {
      try {
        setLoading(true);
        const speciesResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
        );
        const chainURL = speciesResponse.data.evolution_chain.url;
        if (!chainURL) {
          setAnyEvolutions("No Evolutions");
          return;
        }
        const chainResponse = await axios.get(chainURL);

        // recursively collects all Pokemon names from the evolution chain.
        const getAllSpeciesNames = (chain: any): string[] => {
          const names = [chain.species.name];
          chain.evolves_to.forEach((evol: any) => {
            names.push(...getAllSpeciesNames(evol));
          });
          return names;
        };
        
        //["pichu", "pikachu", "raichu"]
        const speciesNames = getAllSpeciesNames(chainResponse.data.chain);
        if (speciesNames.length <= 1) {
          setAnyEvolutions("No Evolutions");
          return;
        }

        // fetch detailed data for each Pokemon name
        const detailPromises = speciesNames.map((name: string) =>
          axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        );
        const detailResults = await Promise.all(detailPromises);

        setEvolutionDetails(detailResults.map((r) => r.data));
      } catch (error) {
        console.error("Error fetching evolution chain:", error);
        setAnyEvolutions("No Evolutions");
      } finally {
        setLoading(false);
      }
    };

    fetchEvolutions();
  }, [isOpen, pokemonId]);

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="p-4 rounded-md relative opacity-95">
        <button onClick={onClose} className="cursor-pointer font-[VT323] fixed top-2 right-2 text-5xl">CLOSE</button>
        <h2 className="cursor-default font-[VT323] px-4 text-6xl md:text-8xl mb-4 bg-white rounded-full">{anyEvolutions}</h2>
        {loading && (
          <div className="flex justify-center items-center">
            <PokeballLoader />
          </div>
        )}
        {!loading && evolutionDetails.length > 0 && (
          <div className="flex flex-row whitespace-nowrap overflow-x-auto gap-4 p-4 items-center max-w-[500px] md:max-w-none">
            {evolutionDetails.map((poke) => (
              <div className="inline-block w-72">
                <PokemonCard
                  key={poke.id}
                  id={poke.id}
                  name={poke.name}
                  image={poke.sprites.other["official-artwork"].front_default}
                  experience={poke.base_experience}
                  height={poke.height}
                  weight={poke.weight}
                  types={poke.types.map((t: any) => t.type.name)}
                  moves={poke.moves.slice(0, 3).map((m: any) => m.move.name)} 
                  abilities={poke.abilities.map((a: any) => a.ability.name)}
                  smallVersion={true}
                  hoverScale="hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EvolutionModal;
