import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-primary">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mt-2">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link 
            to="/cafe" 
            className="btn btn-primary"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

