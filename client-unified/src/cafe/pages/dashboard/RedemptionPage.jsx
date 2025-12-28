import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, Award, ArrowLeft, Search, ShieldCheck, User, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { initiateRedemption, verifyRedemption, getCustomerPoints } from "../../api/api";

function RedemptionPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("inputPhone");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pointsToRedeem, setPointsToRedeem] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingPoints, setIsFetchingPoints] = useState(false);
  const [customerPoints, setCustomerPoints] = useState(0);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => { setTimeout(() => setIsLoading(false), 500); }, []);

  const handleFetchCustomerPoints = async () => {
    if (!customerPhone || customerPhone.length < 10) return toast.error("Valid 10-digit number required.");
    setIsFetchingPoints(true);
    try {
        const res = await getCustomerPoints(customerPhone);
        setCustomerName(res.data.customerName);
        setCustomerPoints(res.data.points);
        toast.success("Customer found!");
        setStep("redeem");
    } catch (err) { toast.error(err.response?.data?.error || "Customer not found."); } 
    finally { setIsFetchingPoints(false); }
  };

  const handleGenerateOtp = async () => {
    if (!pointsToRedeem || pointsToRedeem <= 0 || pointsToRedeem > customerPoints) return toast.error("Invalid points amount.");
    setIsVerifying(true);
    try {
        const res = await initiateRedemption(customerPhone, pointsToRedeem);
        toast.success("OTP Sent!");
        setCustomerEmail(res.data.customerEmail);
        setStep("verifyOtp");
    } catch (err) { console.error(err); toast.error("Failed to send OTP."); } 
    finally { setIsVerifying(false); }
  };

  const handleVerifyOtp = async () => {
    if (otpInput.length !== 6) return toast.error("Enter valid 6-digit OTP.");
    setIsVerifying(true);
    try {
        const res = await verifyRedemption(otpInput, customerEmail);
        toast.success("Redemption Successful!");
        // Reset Flow
        setCustomerPhone(""); setPointsToRedeem(""); setOtpInput(""); setCustomerEmail(""); setStep("inputPhone");
    } catch (err) { toast.error("Verification failed."); } 
    finally { setIsVerifying(false); }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col lg:flex-row relative overflow-hidden font-sans">
        
        {/* Left Side: Visuals */}
        <div className="hidden lg:flex flex-1 bg-[#4A3A2F] relative items-center justify-center p-12 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
            
            <div className="relative z-10 max-w-lg">
                <h1 className="text-5xl font-black mb-6 tracking-tight">Rewards Vault</h1>
                <p className="text-amber-100/80 text-lg mb-12 leading-relaxed">Instantly verify and redeem customer loyalty points securely.</p>
                
                <div className="space-y-6">
                    {[
                        { icon: Gift, title: "Instant Redemption", desc: "Seamless point deduction." },
                        { icon: ShieldCheck, title: "Secure Verification", desc: "OTP-based approval process." },
                        { icon: Award, title: "Customer Delight", desc: "Make every visit rewarding." }
                    ].map((item, i) => (
                        <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 + (i * 0.1) }} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="p-3 bg-amber-500 rounded-xl text-white shadow-lg shadow-amber-900/20"><item.icon className="w-6 h-6"/></div>
                            <div><h3 className="font-bold text-lg">{item.title}</h3><p className="text-sm text-white/60">{item.desc}</p></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Side: Process Flow */}
        <div className="flex-1 flex flex-col justify-center p-6 lg:p-16 relative">
            <button onClick={() => navigate(-1)} className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-[#4A3A2F] transition-colors font-bold"><ArrowLeft className="w-5 h-5"/> Back to Dashboard</button>

            <div className="max-w-md w-full mx-auto">
                <AnimatePresence mode="wait">
                    
                    {/* STEP 1: Find Customer */}
                    {step === "inputPhone" && (
                        <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-black text-[#4A3A2F] mb-2">Identify Customer</h2>
                                <p className="text-gray-500">Enter mobile number to check balance.</p>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mobile Number</label>
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 transition-colors"/>
                                        <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="98765 43210" className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-lg text-gray-800 shadow-sm" maxLength={10} />
                                    </div>
                                </div>
                                <button onClick={handleFetchCustomerPoints} disabled={isFetchingPoints} className="w-full py-4 bg-[#4A3A2F] text-white font-bold rounded-xl hover:bg-[#3b2d24] transition-all shadow-lg shadow-amber-900/10 disabled:opacity-70 flex justify-center items-center gap-2">
                                    {isFetchingPoints ? "Searching..." : "Check Balance"}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Enter Points */}
                    {step === "redeem" && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-center gap-4">
                                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-amber-600 shadow-sm"><User className="w-6 h-6"/></div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{customerName}</h3>
                                    <p className="text-amber-700 font-medium">Balance: <span className="font-black text-xl">{customerPoints} XP</span></p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Points to Redeem</label>
                                    <input type="number" value={pointsToRedeem} onChange={e => setPointsToRedeem(e.target.value)} placeholder="e.g. 150" className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-2xl text-gray-800 shadow-sm" />
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep("inputPhone")} className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                                    <button onClick={handleGenerateOtp} disabled={isVerifying} className="flex-[2] py-4 bg-[#4A3A2F] text-white font-bold rounded-xl hover:bg-[#3b2d24] transition-all shadow-lg shadow-amber-900/10 disabled:opacity-70">
                                        {isVerifying ? "Sending..." : "Generate OTP"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Verify OTP */}
                    {step === "verifyOtp" && (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center">
                            <div className="inline-flex p-4 bg-green-50 text-green-600 rounded-full mb-2"><ShieldCheck className="w-8 h-8"/></div>
                            <div>
                                <h2 className="text-3xl font-black text-[#4A3A2F]">Verify Redemption</h2>
                                <p className="text-gray-500 mt-2">Enter the 6-digit code sent to customer.</p>
                            </div>
                            <input type="text" value={otpInput} onChange={e => setOtpInput(e.target.value)} maxLength={6} placeholder="• • • • • •" className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 border-b-2 border-gray-200 focus:border-[#4A3A2F] outline-none transition-colors bg-transparent text-gray-800 placeholder-gray-300" />
                            
                            <button onClick={handleVerifyOtp} disabled={isVerifying || otpInput.length !== 6} className="w-full py-4 bg-[#4A3A2F] text-white font-bold rounded-xl hover:bg-[#3b2d24] transition-all shadow-lg shadow-amber-900/10 disabled:opacity-70 disabled:cursor-not-allowed">
                                {isVerifying ? "Processing..." : "Confirm & Redeem"}
                            </button>
                            <button onClick={() => setStep("redeem")} className="text-sm font-bold text-gray-400 hover:text-gray-600">Change Amount</button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    </div>
  );
}

export default RedemptionPage;