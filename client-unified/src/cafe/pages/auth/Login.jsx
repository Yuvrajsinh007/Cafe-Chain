import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Loader from '../../components/Loader';
import { useAppContext } from '../../store/AppContext';
import { loginCafe } from '../../api/api';

const LoginForm = ({
  email,
  password,
  showPassword,
  isLoading,
  error,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  isMobile = false
}) => {
  const PasswordIcon = showPassword ? EyeOff : Eye;

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-5">
        {!isMobile && (
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#4a3a2f' }}>Sign In</h2>
            <p className="text-gray-600">Enter your credentials</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="Enter your email address"
              className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-gray-400"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={onPasswordChange}
              placeholder="Enter your password"
              className="w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:border-gray-400"
              required
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <PasswordIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="text-right">
          <Link
            to="/cafe/auth/forgot-password"
            className="text-gray-600 hover:underline text-sm font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 hover:shadow-lg transform hover:scale-[1.02]"
          style={{
            backgroundColor: isLoading ? '#6b5b4d' : '#4a3a2f',
            boxShadow: '0 4px 20px rgba(74, 58, 47, 0.3)'
          }}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4">
        <Link
          to="/user/login"
          className="block w-full text-center py-3 rounded-xl font-semibold text-[#4a3a2f] border-2 border-[#4a3a2f] transition-all hover:bg-[#4a3a2f] hover:text-white"
        >
          Login as User
        </Link>
      </div>

      <div className="text-center mt-6 pt-4 border-t border-gray-100">
        <span className="text-gray-600">Don't have an account? </span>
        <Link to="/cafe/auth/register" className="font-semibold hover:underline" style={{ color: '#4a3a2f' }}>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const { dispatch } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      // Use API function
      const response = await loginCafe({ email, password });

      // Save token - apiClient interceptor will read this automatically next time
      localStorage.setItem('cafe_token', response.data.token);

      dispatch({
        type: 'LOGIN',
        payload: { ...response.data.cafe, token: response.data.token, status: response.data.cafe.status }
      });

      toast.success(response.data.message);

      if (response.data.cafe.status === 'active') {
        navigate('/cafe');
      } else if (response.data.cafe.status === 'pendingApproval') {
        setError('Your cafe is under approval.');
        navigate('/cafe/pending-approval');
      } else if (response.data.cafe.status === 'rejected') {
        setError('Your cafe is not verified.');
      } else {
        navigate('/cafe/setup');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      if (msg.toLowerCase().includes('not found')) {
        setError('Cafe not found.');
      } else if (msg.toLowerCase().includes('incorrect')) {
        setError('Incorrect password.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div className="hidden lg:flex min-h-screen">
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: '#4a3a2f' }}>
          <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-white">
            <div className={`text-center transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h1 className="text-3xl font-bold mb-3">CafeChain</h1>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                Where every cup tells a story and every connection matters
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div
            className={`w-full max-w-sm transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: '0.2s' }}
          >
            <LoginForm
              email={email}
              password={password}
              showPassword={showPassword}
              isLoading={isLoading}
              error={error}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <div className="p-6 bg-white rounded-b-3xl relative z-10">
          <div className={`text-center transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h1 className="text-3xl font-bold mb-3" style={{ color: '#4a3a2f' }}>Welcome Back!</h1>
            <p className="text-gray-600">Sign in to continue your coffee journey</p>
          </div>
        </div>

        <div className="flex-1 p-6 bg-gray-50">
          <div
            className={`transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: '0.3s' }}
          >
            <LoginForm
              isMobile={true}
              email={email}
              password={password}
              showPassword={showPassword}
              isLoading={isLoading}
              error={error}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {isLoading && <Loader />}
    </div>
  );
}

export default Login;