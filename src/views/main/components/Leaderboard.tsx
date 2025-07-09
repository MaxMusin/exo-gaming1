import { Button } from "../../../components/ui";
import { useAppSelector, useAppDispatch } from "../../../hooks/useAppDispatch";
import { Player } from "../../../store/types";
import { dataService } from "../../../services";
import { useEffect, useRef, useCallback } from "react";
import {
  setLoading,
  setPlayers,
  setError,
} from "../../../store/leaderboardSlice";

const Leaderboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const hasMounted = useRef(false);
  const { players, loading, error } = useAppSelector(
    (state) => state.leaderboard
  );
  const { playerName } = useAppSelector((state) => state.game);

  const loadLeaderboard = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const leaderboardData = await dataService.getLeaderboard();
      dispatch(setPlayers(leaderboardData));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setError("Failed to load leaderboard"));
      dispatch(setLoading(false));
      console.error("Error loading leaderboard:", err);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      loadLeaderboard();
    }
  }, [loadLeaderboard]);

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRankIcon = (rank: number): string => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `${rank}.`;
    }
  };

  const getRankStyle = (rank: number): string => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default:
        return "bg-white/10 text-white";
    }
  };

  const isCurrentPlayer = (player: Player): boolean => {
    return player.name === playerName;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">🏆 Leaderboard</h2>
        <Button
          onClick={loadLeaderboard}
          variant="outline"
          size="icon"
          className="text-white/70 bg-white/10 border-white/20 hover:text-white transition-colors duration-200 hover:bg-white/30"
          title="Refresh leaderboard"
        >
          🔄
        </Button>
      </div>
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white">Loading...</span>
        </div>
      )}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
      {!loading && (
        <div className="space-y-3 max-h-96">
          {players.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70 text-lg">No scores yet!</p>
              <p className="text-white/50 text-sm mt-2">
                Be the first to play and set a record!
              </p>
            </div>
          ) : (
            players.map((player, index) => (
              <div
                key={player.id}
                className="rounded-lg border border-white/20"
              >
                <div
                  className={`rounded-lg flex p-4 items-center justify-between ${getRankStyle(
                    index + 1
                  )}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold min-w-[3rem] text-center">
                      {getRankIcon(index + 1)}
                    </span>
                    <div>
                      <p
                        className={`font-bold text-lg ${
                          index < 3 ? "text-current" : "text-white"
                        }`}
                      >
                        {player.name}
                        {isCurrentPlayer(player) && (
                          <span className="ml-2 text-green-700 text-sm">
                            ✨ You!
                          </span>
                        )}
                      </p>
                      <p
                        className={`text-sm ${
                          index < 3
                            ? "text-current opacity-80"
                            : "text-white/70"
                        }`}
                      >
                        {formatDate(player.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-xl font-bold ${
                        index < 3 ? "text-current" : "text-white"
                      }`}
                    >
                      {player.score.toLocaleString()}
                    </p>
                    {player.maxCombo !== undefined && player.maxCombo > 0 ? (
                      <p
                        className={`text-sm ${
                          index < 3
                            ? "text-current opacity-80"
                            : "text-white/70"
                        }`}
                      >
                        Max Combo: {player.maxCombo}x
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <p className="text-white/80 text-sm text-center">
        🎯 Top 10 players • Updates automatically
      </p>
    </div>
  );
};

export default Leaderboard;
