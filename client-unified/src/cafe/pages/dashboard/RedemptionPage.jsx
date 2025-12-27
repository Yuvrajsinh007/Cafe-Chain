import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, Award, Unlock, ChevronLeft, UserCheck  } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { initiateRedemption, verifyRedemption, getCustomerPoints } from "../../api/api";

// --- Color Palette ---
const PRIMARY = "#2563eb"; // blue
const ACCENT = "#f59e0b"; // amber/gold
const LIGHT_BG = "#fdfdfd";

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
  // const customerPoints = 150; // TODO: fetch from API

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleFetchCustomerPoints = async () => {
    if (!customerPhone || customerPhone.length < 10) {
        return toast.error("Please enter a valid 10-digit phone number.");
    }
    setIsFetchingPoints(true);
    setCustomerName("");
    setCustomerPoints(0);
    try {
        const response = await getCustomerPoints(customerPhone);
        setCustomerName(response.data.customerName);
        setCustomerPoints(response.data.points);
        toast.success(`Found customer: ${response.data.customerName}`);
        setStep("redeem"); // Move to the next step
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to find customer.");
    } finally {
        setIsFetchingPoints(false);
    }
  };

  const handleGenerateOtp = async () => {
    if (!customerPhone || !pointsToRedeem) {
      return toast.error("Please fill in all fields.");
    }
    if (
      parseInt(pointsToRedeem, 10) <= 0 ||
      parseInt(pointsToRedeem, 10) > customerPoints
    ) {
      return toast.error("Please enter a valid number of points.");
    }

    setIsVerifying(true);
    try {
      const response = await initiateRedemption(customerPhone, pointsToRedeem);
      toast.success(response.data.message);
      setCustomerEmail(response.data.customerEmail);
      setStep("verifyOtp");
    } catch (error) {
      console.error("Failed to initiate redemption:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput || otpInput.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP.");
    }
    setIsVerifying(true);
    try {
      const response = await verifyRedemption(otpInput, customerEmail);
      toast.success(response.data.message);
      setCustomerPhone("");
      setPointsToRedeem("");
      setOtpInput("");
      setCustomerEmail("");
      setStep("inputPhone");
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBack = () => navigate(-1);
  const handleFormBack = () => {
    if (step === "verifyOtp") {
      setStep("redeem"); // Go back to redeem step
      setOtpInput("");
      setCustomerEmail("");
    } else if (step === "redeem") {
      setStep("inputPhone"); // Go back to phone input
      setPointsToRedeem("");
      setCustomerPoints(0);
      setCustomerName("");
    }
  };

  const formVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const features = [
    { icon: Gift, text: "Exclusive Rewards", color: "from-pink-400 to-pink-600" },
    { icon: Award, text: "Premium Catalog", color: "from-indigo-400 to-indigo-600" },
    { icon: Sparkles, text: "Instant Redemption", color: "from-amber-400 to-amber-600" },
  ];

  const buttonHover = { scale: 1.05, boxShadow: `0 0 20px ${PRIMARY}40` };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans">
      {/* Left Panel: Features */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center p-12 bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.div
          className="relative z-10 text-center p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl font-serif font-extrabold text-gray-800 mb-4">
            Rewards Vault
          </h1>
          <p className="text-lg mb-10 leading-relaxed text-gray-600">
            Unlock premium rewards and elevate every customer experience.
          </p>
          <div className="space-y-6 max-w-sm mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`flex items-center space-x-4 bg-gradient-to-r ${feature.color} text-white rounded-xl px-4 py-3 shadow-md`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
              >
                <feature.icon className="w-6 h-6" />
                <span className="text-lg font-semibold">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white">
        <motion.div
          className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 lg:p-12 flex flex-col gap-8 border"
          style={{ borderColor: "#e5e7eb" }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            className="self-start text-lg font-semibold flex items-center gap-2 mb-4 text-blue-700 
                     border-none outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0 focus-visible:outline-none bg-transparent"
          >
            <ChevronLeft size={20} /> Back
          </motion.button>

          <AnimatePresence mode="wait">
            {/* --- STEP 1: INPUT PHONE NUMBER --- */}
            {step === "inputPhone" && (
              <motion.form
                key="phoneStep"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onSubmit={(e) => { e.preventDefault(); handleFetchCustomerPoints(); }}
                className="flex flex-col gap-6"
              >
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-center text-gray-800">
                  Find Customer
                </h2>
                <p className="text-center text-gray-500 mb-4">
                  Enter the customer's phone number to check their points.
                </p>
                <label className="block text-gray-700 font-medium text-lg">
                  Customer Mobile Number
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="mt-2 w-full rounded-xl border p-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </label>
                <motion.button
                  type="submit"
                  disabled={isFetchingPoints}
                  className="bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-md transition duration-300 disabled:bg-gray-400"
                  whileHover={!isFetchingPoints ? buttonHover : {}}
                  whileTap={{ scale: 0.98 }}
                >
                  {isFetchingPoints ? "Searching..." : "Check Points"}
                </motion.button>
              </motion.form>
            )}

            {/* --- STEP 2: REDEEM POINTS --- */}
            {step === "redeem" && (
              <motion.div
                key="redeemStep"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-6"
              >
                <button onClick={handleFormBack} className="self-start text-lg font-semibold flex items-center gap-2 text-blue-700">
                  <ChevronLeft size={20} /> Change Number
                </button>
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-xl">
                  <UserCheck className="mx-auto h-10 w-10 text-green-500 mb-2" />
                  <p className="text-xl font-bold text-gray-800">{customerName}</p>
                  <p className="text-3xl font-mono font-extrabold text-blue-600 mt-1">{customerPoints} Points Available</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleGenerateOtp(); }} className="flex flex-col gap-6">
                  <label className="block text-gray-700 font-medium text-lg">
                    Points to Redeem
                    <input
                      type="number"
                      min={1}
                      max={customerPoints}
                      value={pointsToRedeem}
                      onChange={(e) => setPointsToRedeem(e.target.value)}
                      placeholder="Enter points"
                      className="mt-2 w-full rounded-xl border p-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    />
                  </label>
                  <motion.button
                    type="submit"
                    disabled={isVerifying || customerPoints === 0}
                    className="bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-md transition duration-300 disabled:bg-gray-400"
                    whileHover={!isVerifying && customerPoints > 0 ? buttonHover : {}}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isVerifying ? "Sending OTP..." : "Generate OTP"}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* --- STEP 3: VERIFY OTP --- */}
            {step === "verifyOtp" && (
              <motion.div
                key="verifyStep"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-6"
              >
                <motion.button onClick={handleFormBack} whileHover={{ scale: 1.05 }} className="self-start text-lg font-semibold flex items-center gap-2 text-blue-700">
                  <Unlock size={20} /> Back
                </motion.button>

                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-center text-gray-800">
                  Verify OTP
                </h2>
                <p className="text-center text-gray-500 mb-4">
                  A verification code has been sent to the customer's email.
                </p>

                <motion.div
                  className="bg-blue-50 p-6 rounded-2xl border shadow-sm"
                  style={{ borderColor: "#93c5fd" }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <p className="text-lg font-semibold text-gray-700">
                    OTP sent to:{" "}
                    <span className="font-mono text-blue-700">{customerEmail}</span>
                  </p>
                  <p className="text-md mt-2 text-gray-600">
                    Points to redeem:{" "}
                    <span className="font-semibold text-amber-600">{pointsToRedeem}</span>
                  </p>
                </motion.div>

                <motion.form
                  onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}
                  className="flex flex-col gap-4"
                >
                  <label className="block text-gray-700 font-medium text-lg">
                    Enter OTP
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="• • • • • •"
                      className="mt-2 w-full rounded-2xl border p-5 text-3xl text-center font-mono tracking-widest shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                      inputMode="numeric"
                      pattern="\d{6}"
                    />
                  </label>
                  <motion.button
                    type="submit"
                    disabled={isVerifying || otpInput.length !== 6}
                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-md transition duration-300 ${isVerifying || otpInput.length !== 6 ? "bg-gray-400" : "bg-blue-600"}`}
                    whileHover={!(isVerifying || otpInput.length !== 6) ? buttonHover : {}}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isVerifying ? "Verifying..." : "Verify & Redeem"}
                  </motion.button>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default RedemptionPage;