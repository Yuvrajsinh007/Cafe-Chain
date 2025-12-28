import { useAppContext } from '../store/AppContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * LeaderboardWidget component to display top 5 cafes
 */
function LeaderboardWidget() {
  const { state } = useAppContext();
  const { leaderboard } = state;

  const topCafes = leaderboard.slice(0, 5);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Top Performing Cafes</h3>
          <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Live Ranking</span>
      </div>
      
      <div className="space-y-4">
        {topCafes.map((cafe, index) => (
          <div key={cafe.id} className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors group">
            <div className="flex-shrink-0 relative">
              <img 
                src={cafe.logo} 
                alt={`${cafe.name} logo`} 
                className="h-12 w-12 rounded-xl object-cover border border-gray-100"
              />
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm text-xs font-bold border border-gray-100">
                  #{index + 1}
              </div>
            </div>
            
            <div className="ml-4 flex-grow min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{cafe.name}</p>
              <p className="text-xs text-gray-500 font-medium">{cafe.points.toLocaleString()} XP</p>
            </div>
            
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
              {getTrendIcon(cafe.trend)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardWidget;