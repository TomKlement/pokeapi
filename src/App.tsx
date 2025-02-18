import './App.css'
import PokemonGrid from './components/PokemonGrid'
import PokemonFilter from "./components/PokemonFilter";
import EvolutionModal from './components/EvolutionModal';
import { useState, useEffect } from "react";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEvolutionOpen, setIsEvolutionOpen] = useState(false);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);

  function onEvolutionsClick(id: number) {
    setSelectedPokemonId(id);
    setIsEvolutionOpen(true);
  }

  useEffect(() => {
    if (isEvolutionOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isEvolutionOpen]);

  return (
    <>

      <div className={isEvolutionOpen ? "blur-background" : ""}>
        <PokemonFilter onSearch={setSearchTerm} />
        <PokemonGrid
          searchTerm={searchTerm}
          onEvolutionsClick={onEvolutionsClick}
        />
      </div>


      <EvolutionModal
        pokemonId={selectedPokemonId || 0}
        isOpen={isEvolutionOpen}
        onClose={() => setIsEvolutionOpen(false)}
      />

    </>
  );
}

export default App;