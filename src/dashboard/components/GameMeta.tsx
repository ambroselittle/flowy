import { Game } from "../../types";

type GameMetaProps = {
  game: Game;
};

export const GameMeta: React.FC<GameMetaProps> = ({ game }) => {
  return (
    <div className="bg-gray-200 p-4">
      <h2 className="text-2xl font-bold">{game.name}</h2>
      <p>Publisher: {game.publisher}</p>
      <p>Release Year: {game.releaseYear}</p>
    </div>
  );
};
