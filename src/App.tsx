import './App.css'
import PokemonGrid from './components/PokemonGrid'
import PokemonFilter from "./components/PokemonFilter";
import { useState } from "react";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <PokemonFilter onSearch={setSearchTerm} />
      <PokemonGrid searchTerm={searchTerm} />
    </div>
  )}

export default App
