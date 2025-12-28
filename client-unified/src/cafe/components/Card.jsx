import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
  const colorStyles = {
    primary: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    secondary: 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white',
    accent: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    danger: 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white',
  };

  return (
    <Link 
      to={to} 
      className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
      aria-label={`${title} - ${description}`}
    >
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Icon */}
        <div className={`p-4 rounded-xl transition-colors duration-300 ${colorStyles[color]}`}>
          {icon}
        </div>
        
        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
        
        {/* Metric */}
        {metric && (
          <div className="mt-2 sm:mt-0">
            <span className="text-2xl font-black text-gray-800">{metric}</span>
          </div>
        )}
      </div>
      
      {/* Hover Arrow */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
          <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
}

export default Card;