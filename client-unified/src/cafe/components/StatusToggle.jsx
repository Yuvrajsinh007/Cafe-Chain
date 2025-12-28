import { useAppContext } from '../store/AppContext';
import { Power } from 'lucide-react';

/**
 * StatusToggle component for toggling cafe open/closed status
 */
function StatusToggle() {
  const { state, dispatch } = useAppContext();
  const { isOpen } = state;

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_STATUS' });
  };

  return (
    <div className="flex items-center bg-white p-1.5 rounded-full border border-gray-200 shadow-sm">
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
            isOpen 
            ? "bg-green-100 text-green-700 pr-5" 
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
      >
        <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
        {isOpen ? 'Open for Business' : 'Closed'}
      </button>
      
      {!isOpen && (
          <button 
            onClick={handleToggle}
            className="ml-2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-md"
            title="Go Online"
          >
              <Power className="w-4 h-4" />
          </button>
      )}
    </div>
  );
}

export default StatusToggle;