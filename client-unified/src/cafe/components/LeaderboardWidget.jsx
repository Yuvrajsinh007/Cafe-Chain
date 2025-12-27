import { useAppContext } from '../store/AppContext';

/**
 * LeaderboardWidget component to display top 5 cafes
 */
function LeaderboardWidget() {
  const { state } = useAppContext();
  const { leaderboard } = state;

  // Get top 5 cafes
  const topCafes = leaderboard.slice(0, 5);

  // Helper function to get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        );
      case 'down':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cafes</h3>
      <div className="space-y-4">
        {topCafes.map((cafe) => (
          <div key={cafe.id} className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                src={cafe.logo} 
                alt={`${cafe.name} logo`} 
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="ml-3 flex-grow">
              <p className="text-sm font-medium text-gray-900">{cafe.name}</p>
              <p className="text-xs text-gray-500">{cafe.points} points</p>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">#{cafe.rank}</span>
              <span className="ml-2">{getTrendIcon(cafe.trend)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardWidget;