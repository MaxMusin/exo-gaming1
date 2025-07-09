const GameInstructions: React.FC = () => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex flex-col gap-4">
      <h3 className="text-xl font-bold text-white">How to Play:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
        <div className="text-left">
          <p>• Click on moles when they pop up from holes</p>
          <p>• You have 2 minutes to score as many points as possible</p>
        </div>
        <div className="text-left">
          <p>• Build combos by hitting moles consecutively</p>
          <p>• Higher combos give bigger score multipliers</p>
        </div>
      </div>
    </div>
  );
};

export default GameInstructions;

