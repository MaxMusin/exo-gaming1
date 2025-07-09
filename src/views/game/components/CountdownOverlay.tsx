type CountdownOverlayProps = {
  countdown: number;
};

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ countdown }) => {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="text-center">
        <div className="text-8xl font-bold text-white mb-4 animate-pulse">
          {countdown === 0 ? "GO!" : countdown}
        </div>
        <p className="text-2xl text-white/80">Get Ready!</p>
      </div>
    </div>
  );
};

export default CountdownOverlay;
