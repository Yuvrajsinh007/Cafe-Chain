import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, Phone, Eye, EyeOff, Coffee, Star, Users, Zap, Shield, User as UserIcon, Home as CafeIcon, FileText, Clock } from 'lucide-react';
import Loader from '../../components/Loader';
import { registerCafeRequest } from '../../api/api'; // Import API function

function Register() {
    const [formData, setFormData] = useState({
        ownerName: '',
        email: '',
        password: '',
        confirmPassword: '',
        ownerPhone: '',
        name: '',
        address: '',
        cafePhone: '',
        description: '',
        openingHours: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) {
            setError('');
        }
    };

    const validateForm = () => {
        const { ownerName, name, email, password, ownerPhone, address, cafePhone, confirmPassword } = formData;
        if (!ownerName || !name || !email || !password || !ownerPhone || !address || !cafePhone || !confirmPassword) {
            setError('Please fill in all required fields.');
            return false;
        }
        if (!/^\d{10}$/.test(ownerPhone) || !/^\d{10}$/.test(cafePhone)) {
            setError('Phone numbers must be exactly 10 digits.');
            return false;
        }
        if (ownerPhone === cafePhone) {
            setError("Owner's phone and Cafe's phone must be different.");
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const payload = {
                ownerName: formData.ownerName,
                ownerPhone: formData.ownerPhone,
                email: formData.email,
                password: formData.password,
                name: formData.name,
                address: formData.address,
                cafePhone: formData.cafePhone,
                description: formData.description,
                openingHours: formData.openingHours,
            };
            
            // Use API function
            const response = await registerCafeRequest(payload);
            
            toast.success(response.data.message);
            navigate('/cafe/auth/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: Star, text: "Unlock Exclusive Rewards" },
        { icon: Users, text: "Join Our Vibrant Community" },
        { icon: Zap, text: "Seamless & Quick Sign-up" },
        { icon: Shield, text: "Your Data is Secure" }
    ];

    const RunningIcons = () => (
        <div className="flex w-1/2 items-center justify-around flex-shrink-0">
            <Coffee className="w-10 h-10 text-white opacity-20" />
            <Star className="w-8 h-8 text-white opacity-10" />
            <Coffee className="w-14 h-14 text-white opacity-25" />
            <Users className="w-8 h-8 text-white opacity-10" />
            <Coffee className="w-10 h-10 text-white opacity-20" />
            <Zap className="w-8 h-8 text-white opacity-10" />
        </div>
    );

    if (isLoading) return <Loader />;

    return (
        <div className="min-h-screen bg-white">
            <style>{`
              @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
              .animate-marquee { animation: marquee 20s linear infinite; }
            `}</style>

            {/* ==================== Desktop Layout ==================== */}
            <div className="hidden lg:flex min-h-screen">
                <div className="flex-1 flex items-center justify-center p-8 bg-white">
                    <div className={`w-full max-w-md transform transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2 text-[#4a3a2f]">Create Your Cafe Account</h1>
                            <p className="text-gray-600">Complete one form to get started.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                            <InputField icon={UserIcon} label="Your Full Name" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Enter your full name" />
                            <InputField icon={Phone} label="Your Personal Phone (Private)" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} placeholder="Enter your mobile number" maxLength="10" />
                            <InputField icon={Mail} label="Login Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
                            <InputField icon={Lock} label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Create a password">
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff /> : <Eye />}</button>
                            </InputField>
                            <InputField icon={Lock} label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password">
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showConfirmPassword ? <EyeOff /> : <Eye />}</button>
                            </InputField>
                            <hr className="my-6" />
                            <InputField icon={CafeIcon} label="Cafe Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your cafe's name" />
                            <InputField icon={CafeIcon} label="Cafe Address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter the full cafe address" />
                            <InputField icon={Phone} label="Cafe Business Phone (Public)" name="cafePhone" value={formData.cafePhone} onChange={handleChange} placeholder="Enter cafe's contact number" maxLength="10" />
                            <InputField icon={Clock} label="Opening Hours" name="openingHours" value={formData.openingHours} onChange={handleChange} placeholder="e.g., Mon-Fri: 8am-6pm" />
                            <div className="relative">
                                <label className="block text-sm font-medium text-[#4a3a2f]">Description (Optional)</label>
                                <FileText className="absolute left-3 top-10 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Tell us about your cafe..." className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-400" rows="3"></textarea>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <button type="submit" disabled={isLoading} className="w-full text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] hover:bg-[#3a2d24] disabled:opacity-60 text-lg shadow-md" style={{ backgroundColor: '#4a3a2f' }}>
                                {isLoading ? 'Sending OTP...' : 'Submit For Approval'}
                            </button>
                            <button type="button" onClick={() => navigate('/user/signup')} className="w-full py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] text-[#4a3a2f] bg-white border-2 border-[#4a3a2f] hover:bg-[#4a3a2f] hover:text-white text-lg shadow-md">
                                Register as User
                            </button>
                        </form>
                        <div className="text-center mt-6">
                            <span className="text-gray-600">Already have an account? </span>
                            <Link to="/cafe/auth/login" className="font-semibold text-[#4a3a2f]">Sign in</Link>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: '#4a3a2f' }}>
                    <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-white text-center">
                        <div className={`transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <h1 className="text-3xl font-bold mb-3">Welcome to CafeChain</h1>
                            <p className="text-lg opacity-90 leading-relaxed">Join our community and discover a world of coffee delights.</p>
                        </div>
                        <div className="space-y-4 max-w-md mt-8">
                            {features.map((feature, index) => (
                                <div key={index} className={`flex items-center space-x-4 transform transition-all duration-700 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} style={{ transitionDelay: `${0.3 + index * 0.15}s` }}>
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-lg text-left">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 w-full overflow-hidden">
                        <div className="absolute top-0 left-0 flex w-[200%] h-full animate-marquee">
                            <RunningIcons /><RunningIcons />
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== Mobile Layout ==================== */}
            <div className="lg:hidden min-h-screen flex flex-col p-6 items-center justify-center bg-white">
                <div className={`w-full max-w-sm`}>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2 text-[#4a3a2f]">Create Your Cafe Account</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField icon={UserIcon} label="Your Full Name" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Enter your full name" />
                        <InputField icon={Phone} label="Your Personal Phone (Private)" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} placeholder="Enter your mobile number" maxLength="10" />
                        <InputField icon={Mail} label="Login Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
                        <InputField icon={Lock} label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Create a password">
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff /> : <Eye />}</button>
                        </InputField>
                        <InputField icon={Lock} label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password">
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showConfirmPassword ? <EyeOff /> : <Eye />}</button>
                        </InputField>
                        <hr />
                        <InputField icon={CafeIcon} label="Cafe Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your cafe's name" />
                        <InputField icon={CafeIcon} label="Cafe Address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter the full cafe address" />
                        <InputField icon={Phone} label="Cafe Business Phone (Public)" name="cafePhone" value={formData.cafePhone} onChange={handleChange} placeholder="Enter cafe's contact number" maxLength="10" />
                        <InputField icon={Clock} label="Opening Hours" name="openingHours" value={formData.openingHours} onChange={handleChange} placeholder="e.g., Mon-Fri: 8am-6pm" />
                        
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className="w-full text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] hover:bg-[#3a2d24] disabled:opacity-60 shadow-md" style={{ backgroundColor: '#4a3a2f' }}>
                            {isLoading ? 'Sending OTP...' : 'Submit For Approval'}
                        </button>
                        <button type="button" onClick={() => navigate('/user/signup')} className="w-full text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] hover:bg-[#3a2d24] shadow-md" style={{ backgroundColor: '#4a3a2f' }}>
                            Register as User
                        </button>
                    </form>
                    <div className="text-center mt-6">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/auth/login" className="font-semibold text-[#4a3a2f]">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Input Field Component
const InputField = ({ icon: Icon, label, name, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-[#4a3a2f]">{label}</label>
        <div className="relative mt-1">
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input name={name} {...props} className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-400" required />
            {children}
        </div>
    </div>
);

export default Register;