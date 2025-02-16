import { useState } from "react";

interface Props {
    onSearch: (term: string) => void;
  }

const PokemonFilter = ({ onSearch }: Props) => {
    const [searchTerm, setSearchTerm] = useState("");
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      onSearch(value);
    };
  
    return (
      <div className="w-full mb-4">
        <input
          type="text"
          placeholder="Search Pokemon..."
          className="px-10 w-full text-xl p-4 border-dotted outline-white rounded-full shadow-md focus:outline-white bg-gray-600 text-white"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
    );
  };

  export default PokemonFilter;