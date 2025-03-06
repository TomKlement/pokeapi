import { useState } from "react";

const getTypeColors = (type: string) => {
  if (!type) {
    return { main: "bg-gray-500", light: "bg-gray-200" };
  }
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
    ground: { main: "bg-yellow-700", light: "bg-yellow-500" },
    rock: { main: "bg-yellow-800", light: "bg-yellow-400" },
    bug: { main: "bg-lime-600", light: "bg-lime-300" },
    steel: { main: "bg-gray-600", light: "bg-gray-300" },
    dark: { main: "bg-gray-900", light: "bg-gray-500" },
    fairy: { main: "bg-pink-400", light: "bg-pink-200" },
  };
  return colors[type.toLowerCase()] || { main: "bg-gray-500", light: "bg-gray-200" };
};

interface PokemonCardProps {
  id: number;
  name: string;
  image: string;
  experience: number;
  height: number;
  weight: number;
  types: string[];
  moves: string[];
  abilities: string[];
  smallVersion: boolean;
  hoverScale?: string;
  onEvolutionsClick?: (id: number) => void;
  showEvolutionButton?: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  id,
  name,
  image,
  experience,
  height,
  weight,
  types,
  moves,
  abilities,
  smallVersion,
  hoverScale,
  onEvolutionsClick,
  showEvolutionButton
}) => {
  const [displayMode, setDisplayMode] = useState<"default" | "moves" | "abilities">("default");
  const { main, light } = getTypeColors(types[0]);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`${hoverScale ?? "hover:scale-105"} ${smallVersion ? "scale-100" : ""} cursor-default font-[VT323] card-normal w-72 h-96 bg-white shadow-xl rounded-2xl overflow-hidden relative transition-transform`}>
      <div className={`p-5 flex justify-between items-center text-white text-center ${main}`}>
        <h3 className="ml-2 text-3xl text-left uppercase truncate w-40">{name}</h3>

        <div className="flex justify-center gap-2 text-xl">
          {types.map((type) => (
            <div key={type} className="relative group">
              <img src={`/type-icons/${type}.png`} alt={`${type} Type`} className="w-6 h-6" />

              <span className="text-sm absolute bottom-full left-1/2 -translate-x-1/2 px-2 py-1 text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {type.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

      </div>


      <div className="flex justify-center items-center p-4">
        <img src={image} alt={name} className="w-32 h-32 object-contain" />
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
        { !smallVersion && showEvolutionButton && (
           <button 
              onClick={() => onEvolutionsClick?.(id)}
              className={`cursor-pointer uppercase absolute ${isHovered ? light : main}  text-white text-lg mt-14 py-0 px-1 rounded-tl-lg`}
              >
              Evolutions
              </button>
         )}
         </div>
      </div>

      {/* Basic stats */}
      <div className={` h-full relative group flex flex-col items-center w-full px-15 pt-5 pb-6 ${light}`}>
        
        {/*Bookmarks */}
        <div 
          className={`pt-10 absolute left-0 h-3/5 w-6 bg-opacity-80 rounded-r-lg transition-all duration-200 ease-in-out ${main} ${displayMode === "moves" ? "w-57" : ""}`}
          onMouseEnter={() => setDisplayMode("moves")}
          onMouseLeave={() => setDisplayMode("default")}
        >
          <span className="tracking-widest pl-0 uppercase absolute -translate-y-1/2 left-3 origin-left  text-white text-xl rotate-90">
            Moves
          </span>


          {displayMode === "moves" && (
            <div className="absolute  left-4/13 -translate-y-5 text-white text-sm transition-opacity duration-300">
              <ul className="text-center list-disc list-inside flex flex-col gap-1 min-w-max text-lg">
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
          className={`pt-10 absolute right-0 h-3/5 w-6 bg-opacity-80 rounded-l-lg transition-all duration-300 ease-in-out ${main} ${displayMode === "abilities" ? "w-57" : ""}`}
          onMouseEnter={() => setDisplayMode("abilities")}
          onMouseLeave={() => setDisplayMode("default")}
        >
          <span className="tracking-wider uppercase absolute right-3 origin-right -translate-y-1/2 text-white text-xl rotate-270">
            Ability
          </span>

          {displayMode === "abilities" && (
            <div className="absolute left-4/13 -translate-y-5 text-white transition-opacity duration-300">
              <ul className="list-disc list-inside flex flex-col gap-1 text-center min-w-max text-lg">
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

        <div className="pt-3 text-center text-xl text-gray-700 w-full">
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