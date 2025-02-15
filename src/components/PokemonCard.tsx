import { useState } from "react";

const getTypeColors = (type: string) => {
  const colors: { [key: string]: { main: string; light: string } } = {
    water: { main: "bg-blue-500", light: "bg-blue-200" },
    fire: { main: "bg-red-500", light: "bg-red-200" },
    grass: { main: "bg-green-500", light: "bg-green-200" },
    electric: { main: "bg-yellow-500", light: "bg-yellow-200" },
    psychic: { main: "bg-pink-500", light: "bg-pink-200" },
    ice: { main: "bg-cyan-500", light: "bg-cyan-200" },
    fighting: { main: "bg-orange-500", light: "bg-orange-200" },
    normal: { main: "bg-gray-500", light: "bg-gray-200" },
    ghost: { main: "bg-purple-500", light: "bg-purple-200" },
    dragon: { main: "bg-indigo-500", light: "bg-indigo-200" },
    flying: { main: "bg-indigo-400", light: "bg-indigo-100" },
    poison: { main: "bg-purple-700", light: "bg-purple-300" },
    ground: { main: "bg-yellow-700", light: "bg-yellow-300" },
    rock: { main: "bg-yellow-800", light: "bg-yellow-400" },
    bug: { main: "bg-lime-600", light: "bg-lime-300" },
    steel: { main: "bg-gray-600", light: "bg-gray-300" },
    dark: { main: "bg-gray-900", light: "bg-gray-500" },
    fairy: { main: "bg-pink-400", light: "bg-pink-200" },
  };
  return colors[type.toLowerCase()] || { main: "bg-gray-500", light: "bg-gray-200" };
};

const PokemonCard = ({ 
  name, 
  image, 
  experience, 
  height, 
  weight, 
  types,
  moves,
  abilities
}: { 
  name: string; 
  image: string; 
  experience: number; 
  height: number; 
  weight: number; 
  types: string[];
  moves: string[];
  abilities: string[];
}) => {
  const [displayMode, setDisplayMode] = useState<"default" | "moves" | "abilities">("default");
  const { main, light } = getTypeColors(types[0]);

  return (
    <div className="card-normal card-bordered w-72 h-96 bg-white shadow-xl rounded-2xl overflow-hidden relative transition-transform hover:scale-105">
      
      <div className={`p-5 card-title flex justify-between items-center text-white text-center ${main}`}>
        <h3 className="ml-2 text-xl text-left uppercase">{name}</h3>
        <div className="flex justify-center gap-2">
        {types.map((type) => (
          <img key={type} src={`/type-icons/${type}.png`} alt={`${type} Type`} className="w-6 h-6" />
        ))}
        </div>
      </div>


      <div className="flex justify-center items-center p-4">
        <img src={image} alt={name} className="w-32 h-32 object-contain" />
      </div>

      {/* Basic stats */}
      <div className={`h-full card-body relative group flex flex-col items-center w-full px-15 pt-5 pb-6 ${light}`}>
        
        {/*Bookmarks */}
        <div 
          className={`pt-10 absolute left-0 h-3/5 w-6 bg-opacity-80 rounded-r-lg transition-all duration-200 ease-in-out ${main} ${displayMode === "moves" ? "w-57" : ""}`}
          onMouseEnter={() => setDisplayMode("moves")}
          onMouseLeave={() => setDisplayMode("default")}
        >
          <span className="uppercase absolute -translate-y-1/2 left-2 origin-left  text-white text-sm font-semibold rotate-90">
            Moves
          </span>


          {displayMode === "moves" && (
            <div className="absolute  left-2/7 -translate-y-1 text-white text-sm font-semibold transition-opacity duration-300">
              <ul className="list-disc list-inside flex flex-col gap-1 text-left min-w-max">
              {moves.map((move, i) => {

                const formatted = move
                  .split("-")
                  .map(
                    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ");

                return <span key={i}>{formatted}</span>;
              })}
              </ul>
            </div>
          )}
        </div>
        <div 
          className={`pt-10 absolute right-0 h-3/5 w-6 bg-opacity-80 rounded-l-lg transition-all duration-200 ease-in-out ${main} ${displayMode === "abilities" ? "w-57" : ""}`}
          onMouseEnter={() => setDisplayMode("abilities")}
          onMouseLeave={() => setDisplayMode("default")}
        >
          <span className="uppercase absolute right-2 origin-right -translate-y-1/2 text-white text-sm font-semibold rotate-270">
            Abilities
          </span>

          {displayMode === "abilities" && (
            <div className="absolute  left-2/7 -translate-y-1 text-white text-sm font-semibold transition-opacity duration-300">
              <ul className="list-disc list-inside flex flex-col gap-1 text-left min-w-max">
              {abilities.map((ability, i) => {

                const formatted = ability
                  .split("-")
                  .map(
                    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ");

                return <span key={i}>{formatted}</span>;
              })}
              </ul>
            </div>
          )}
        </div>

        <div className="pt-6 text-center text-sm text-gray-700 w-full">
            <div className="grid grid-cols-2 gap-2 w-full text-left">
              <span>EXP:</span> <span className="text-right">{experience}</span>
              <span>Height:</span> <span className="text-right">{height}</span>
              <span>Weight:</span> <span className="text-right">{weight}</span>
            </div>
        </div>
      </div>

    </div>
  );
};

export default PokemonCard;