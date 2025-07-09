import { useAppSelector } from "../../../hooks/useAppDispatch";

const CountdownBar = () => {
  const { timeLeft } = useAppSelector((state) => state.game);

  return (
    <div className="w-full">
      <div className="w-full bg-white/20 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            timeLeft <= 10
              ? "bg-red-500"
              : timeLeft <= 30
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{ width: `${(timeLeft / 120) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default CountdownBar;
