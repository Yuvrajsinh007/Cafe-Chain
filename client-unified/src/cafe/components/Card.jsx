import { Link } from 'react-router-dom';

/**
 * Card component for dashboard items
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {string} props.icon - Icon component or element
 * @param {string} props.to - Link destination
 * @param {string} props.color - Accent color (primary, secondary, accent, danger)
 * @param {string} props.metric - Optional metric to display
 */
function Card({ title, description, icon, to, color = 'primary', metric }) {
  const colorClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-white',
    danger: 'bg-danger text-white',
  };

  return (
    <Link 
      to={to} 
      className="block card hover:shadow-lg transition-shadow duration-300"
      aria-label={`${title} - ${description}`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        {/* Icon */}
        <div className={`p-3 rounded-lg ${colorClasses[color]} mb-3 sm:mb-0`}>
          {icon}
        </div>
        
        {/* Content */}
        <div className="sm:ml-4 flex-grow text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        
        {/* Metric (if provided) */}
        {metric && (
          <div className="mt-2 sm:mt-0 sm:text-right">
            <span className="text-xl font-bold text-gray-900">{metric}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default Card;