const PokemonCard = ({ name }: { name: string }) => {
    return (
      <div className="card w-40 bg-base-100 shadow-md">
        <div className="card-body items-center">
          <h3 className="text-lg font-bold capitalize">{name}</h3>
        </div>
      </div>
    );
  };
  
  export default PokemonCard;
  