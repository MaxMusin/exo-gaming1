import { CardGameFeaturesProps } from "../MainView.types";

const CardGameFeatures: React.FC<CardGameFeaturesProps> = ({
  title,
  icon,
  description,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  );
};

const GameFeatures: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CardGameFeatures
        title="Leaderboard"
        icon="🏆"
        description="Compete with others and claim your spot in the top 10!"
      />
      <CardGameFeatures
        title="Combo System"
        icon="⚡"
        description="Build up to 5x score multipliers by hitting moles consecutively!"
      />
      <CardGameFeatures
        title="Sound Effects"
        icon="🔊"
        description="Dynamic audio feedback with combo sounds and game music!"
      />
    </div>
  );
};

export default GameFeatures;
