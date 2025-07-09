const GameFeatures: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="text-4xl mb-3">🏆</div>
        <h3 className="text-xl font-bold text-white mb-2">Leaderboard</h3>
        <p className="text-white/70 text-sm">
          Compete with others and claim your spot in the top 10!
        </p>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="text-4xl mb-3">⚡</div>
        <h3 className="text-xl font-bold text-white mb-2">Combo System</h3>
        <p className="text-white/70 text-sm">
          Build up to 5x score multipliers by hitting moles consecutively!
        </p>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="text-4xl mb-3">🔊</div>
        <h3 className="text-xl font-bold text-white mb-2">Sound Effects</h3>
        <p className="text-white/70 text-sm">
          Dynamic audio feedback with combo sounds and game music!
        </p>
      </div>
    </div>
  );
};

export default GameFeatures;
