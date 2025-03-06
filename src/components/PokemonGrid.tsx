import { useEffect, useState } from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard";
import InfiniteScroll from "react-infinite-scroll-component";
import PokeballLoader from './PokeballLoader';


type PokemonData = {
  id: number;
  name: string;
  image: string;
  experience: number;
  height: number;
  weight: number;
  types: string[];
  moves: string[];
  abilities: string[];
};

interface Props {
  searchTerm: string;
  onEvolutionsClick: (id: number) => void;
}

interface PokemonAPIItem {
  name: string;
  url: string;
}

interface PokemonAPIResponse {
  results: PokemonAPIItem[];
}



const PokemonGrid: React.FC<Props> = ({ searchTerm, onEvolutionsClick }) => {

  const [allPokemonList, setAllPokemonList] = useState<{ id: number; name: string }[]>([]);
  const [displayedPokemons, setDisplayedPokemons] = useState<PokemonData[]>([]);
  const [pokemonCache, setPokemonCache] = useState<{ [id: number]: PokemonData }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(12); 

  // sets the neumber of items (depends on width)
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(8);
      } else {
        setItemsPerPage(12);
      }
    };
  
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
  
    return window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // all pokemons (id, name)
  useEffect(() => {
    axios
      .get<PokemonAPIResponse>("https://pokeapi.co/api/v2/pokemon?limit=1500")
      .then((response) => {
        const updatedList = response.data.results.map((pokemon: PokemonAPIItem) => {
          const id = Number(pokemon.url.split("/").slice(-2, -1)[0]);
          return { id, name: pokemon.name };
        });
        setAllPokemonList(updatedList);
      })
      .catch((error) => console.error("Error fetching all Pokémon list:", error));
  }, []);

  // when "searchTerm" or "allPokemonList" is changed,
  // reset the displayed Pokemon and load the first batch

  useEffect(() => {
    setDisplayedPokemons([]);
 
    setHasMore(true);

    const filteredList = searchTerm.length >= 3 ? allPokemonList.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())) : allPokemonList;

    setCurrentPage(1);

    loadMoreData(filteredList, 1).then(() => {setCurrentPage(2);});

  }, [searchTerm, allPokemonList]);

  // retrieves detailed data for a given "batch"
  async function loadMoreData(filteredList: { id: number; name: string }[], page: number) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBatch = filteredList.slice(startIndex, endIndex);


    if (currentBatch.length === 0) {
      setHasMore(false);
      return;
    }

    const details = await Promise.all(
      currentBatch.map((poke) => getPokemonDetail(poke.id, poke.name))
    );

    setDisplayedPokemons((prev) => [...prev, ...details]);

    if (currentBatch.length < itemsPerPage) {
      setHasMore(false);
    }
  }
  
  // returns a detail from the cache or calls the API and stores it in the cache
  async function getPokemonDetail(id: number, name: string): Promise<PokemonData> {

    if (pokemonCache[id]) {
      return pokemonCache[id];
    }

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const details = response.data;

    const newData: PokemonData = {
      id,
      name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      experience: details.base_experience,
      height: details.height,
      weight: details.weight,
      types: details.types.map((t: any) => t.type.name),
      moves: details.moves.slice(0, 3).map((m: any) => m.move.name),
      abilities: details.abilities.map((a: any) => a.ability.name),
    };

    setPokemonCache((prev) => ({ ...prev, [id]: newData }));

    return newData;
  }

  // function that is called when scroll goes down
  const fetchMoreData = () => {
    const filteredList =  searchTerm.length >= 3 ? allPokemonList.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())) : allPokemonList;
    loadMoreData(filteredList, currentPage);
    setCurrentPage((prev) => prev + 1);
  };

  // infinitescroll -> react library
  return (
    <>
      <InfiniteScroll
        dataLength={displayedPokemons.length}
        next={fetchMoreData}
        hasMore={hasMore}
        scrollableTarget="window"
        style={{ overflow: 'visible'}}
        loader={<PokeballLoader />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5">
          {displayedPokemons.map((poke) => (
            <PokemonCard
              key={poke.id}
              id={poke.id}
              name={poke.name}
              image={poke.image}
              experience={poke.experience}
              height={poke.height}
              weight={poke.weight}
              types={poke.types}
              moves={poke.moves}
              abilities={poke.abilities}
              smallVersion={false}
              onEvolutionsClick={(id) => onEvolutionsClick(id)}
              showEvolutionButton={true}
            />
          ))}
        </div>
      </InfiniteScroll>
      
    </>
  );
};

export default PokemonGrid;