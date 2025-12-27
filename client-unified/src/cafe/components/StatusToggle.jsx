import { useAppContext } from '../store/AppContext';

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
    <div className="flex items-center">
      <span className="mr-2 text-sm font-medium text-gray-700">
        Status: 
      </span>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isOpen ? 'bg-secondary' : 'bg-gray-300'}`}
      >
        <span className="sr-only">{isOpen ? 'Online' : 'Offline'}</span>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOpen ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
      <span className={`ml-2 text-sm font-medium ${isOpen ? 'text-secondary' : 'text-gray-500'}`}>
        {isOpen ? 'Open' : 'Closed'}
      </span>
    </div>
  );
}

export default StatusToggle;