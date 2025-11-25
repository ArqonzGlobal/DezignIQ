import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Mail, ArrowLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { PhoneInput } from 'react-international-phone';
import "../styles/auth.css";
import 'react-international-phone/style.css';
import LoginBackground from "../assets/login/Login-background.png";
import Msme from "../assets/login/msme-img.png";
import Iitmic from "../assets/login/iitm-ic-img.png";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"mobile" | "email">("mobile");
  const [loading, setLoading] = useState(false);
  
  // Login states
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Signup states
  const [signupData, setSignupData] = useState({
    email: "",
    mobile: "",
    username: "",
    password: "",
    confirmPassword: "",
    agentId: "",
    newsletter: false,
    optimize: false
  });
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const updateSignupData = (field: string, value: string | boolean) => {
    setSignupData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const handleSendOTP = async () => {
    if (!mobileNumber) {
      toast({
        title: "Error",
        description: "Please enter your mobile number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `${mobileNumber}`,
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: "Success",
        description: "OTP sent to your mobile number",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+91${mobileNumber}`,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signupData.email || !signupData.password || !signupData.username) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            username:signupData.username,
            mobile: signupData.mobile,
            agent_id: signupData.agentId,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      // Create profile entry with email and phone
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            full_name: signupData.username,
            email: signupData.email,
            phone: signupData.mobile,
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to verify.",
      });
      setIsSignUp(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-center bg-cover bg-no-repeat bg-fixed min-h-screen flex items-center justify-end md:pr-16 relative"
      style={{
        backgroundImage: `url(${LoginBackground})`,
        backgroundColor: "#f8fafc",
      }}
    >
      <div className="w-full max-w-md mx-4 relative z-10 flex items-center justify-center">
        <div className="bg-white bg-opacity-90  rounded-3xl shadow-2xl px-8 py-4 w-full">
          {!isSignUp ? (
            // Login Form
            <>
              <h1 className="text-3xl font-bold text-center mb-4 text-foreground">Sign in</h1>

              {/* Login method toggle */}
              <div className="relative w-full my-2 max-w-sm">
                {/* Outer pill container */}
                <div className="relative flex overflow-hidden rounded-3xl bg-[#fdeee9] shadow-inner">
                  {/* Sliding active pill */}
                  <div
                    className={`absolute top-0 left-0 h-full w-1/2 rounded-3xl transition-transform duration-300 ease-in-out
                      ${loginMethod === "mobile" ? "translate-x-0" : "translate-x-full"}
                      gradient-button shadow-md`}
                  />

                  {/* Buttons row */}
                  <button
                    onClick={() => setLoginMethod("mobile")}
                    className={`relative z-10 flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-colors
                      ${loginMethod === "mobile" ? "text-white" : "text-black"}`}
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile
                  </button>

                  <button
                    onClick={() => setLoginMethod("email")}
                    className={`relative z-10 flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-colors
                      ${loginMethod === "email" ? "text-white" : "text-black"}`}
                  >
                    <Mail className="h-4 w-4" />
                    Mail
                  </button>
                </div>
              </div>

              {loginMethod === "mobile" ? (
                // Mobile OTP Login
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div
                        className={`
                          flex items-center rounded-md border border-input bg-background
                          focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
                          h-10 px-3 w-full transition-all
                        `}
                      >
                        <PhoneInput
                          defaultCountry="in"
                          value={mobileNumber}
                          onChange={(value) => setMobileNumber(value)}
                          inputClassName="!border-none !bg-transparent !shadow-none !outline-none !w-full text-sm"
                          countrySelectorStyleProps={{
                            buttonClassName: "!border-none !bg-transparent !shadow-none !outline-none !p-0",
                          }}
                          className="!w-full"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleSendOTP}
                      disabled={loading || otpSent}
                      className="whitespace-nowrap gradient-button shadow-md"
                    >
                      Send OTP
                    </Button>
                  </div>

                  {otpSent && (
                    <>
                      <div className="space-y-2">
                        <Label>Enter 6-digit code</Label>
                        <InputOTP
                          maxLength={6}
                          value={otp}
                          onChange={(value) => setOtp(value)}
                        >
                          <InputOTPGroup className="w-full justify-between">
                            <InputOTPSlot index={0} className="border border-gray-500" />
                            <InputOTPSlot index={1} className="border border-gray-500" />
                            <InputOTPSlot index={2} className="border border-gray-500" />
                            <InputOTPSlot index={3} className="border border-gray-500" />
                            <InputOTPSlot index={4} className="border border-gray-500" />
                            <InputOTPSlot index={5} className="border border-gray-500" />
                          </InputOTPGroup>
                        </InputOTP>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Didn't Receive Code?</span>
                          <Button variant="ghost" size="sm" onClick={handleSendOTP}>
                            Resend
                          </Button>
                        </div>
                      </div>

                      <Button
                        onClick={handleVerifyOTP}
                        disabled={loading}
                        className="w-full gradient-button"
                      >
                        Verify & Login
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                // Email/Password Login
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handleEmailLogin}
                    disabled={loading}
                    className="w-full gradient-button  shadow-md"
                  >
                    Login
                  </Button>
                </div>
              )}  

              {/* Social Login */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <div>
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.805 10.227c0-.709-.064-1.39-.182-2.045H10.1v3.868h5.438a4.644 4.644 0 01-2.013 3.047v2.513h3.26c1.908-1.756 3.01-4.343 3.01-7.383z" fill="#4285F4"/>
                      <path d="M10.1 19.931c2.723 0 5.006-.903 6.675-2.446l-3.26-2.513c-.903.605-2.058.963-3.415.963-2.627 0-4.852-1.773-5.647-4.156H1.077v2.594A9.927 9.927 0 0010.1 19.93z" fill="#34A853"/>
                      <path d="M4.453 11.779a5.963 5.963 0 01-.31-1.889c0-.656.112-1.293.31-1.89V5.407H1.077A9.927 9.927 0 000 9.89c0 1.605.382 3.122 1.077 4.483l3.376-2.594z" fill="#FBBC04"/>
                      <path d="M10.1 3.844c1.481 0 2.81.509 3.856 1.507l2.893-2.893C15.1.965 12.818 0 10.1 0A9.927 9.927 0 001.077 5.407l3.376 2.594c.795-2.383 3.02-4.156 5.647-4.156z" fill="#EA4335"/>
                    </svg>
                    <span className="text-gray-700 font-medium">
                      <span className="block sm:hidden">Sign in</span>
                      <span className="hidden sm:block">Continue with Google</span>
                    </span>
                  </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Don't have an account?
                </button>
              </div>
            </>
          ) : (
            // Signup Form
            <>
                <div className="flex justify-around items-center">
                  <img src={Msme} alt="MSME" />
                  <img src={Iitmic} alt="IITM" />
                </div>
                <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Create an Account</h1>

                <div className="space-y-4 w-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={(e) => updateSignupData('email', e.target.value)}
                      />
                    </div>
                    <div
                        className={`
                          flex items-center rounded-md border border-input bg-background
                          focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
                          h-10 px-3 w-full transition-all
                        `}
                      >
                        <PhoneInput
                          defaultCountry="in"
                          value={signupData.mobile}
                          onChange={(value) => updateSignupData('mobile', value)}
                          inputClassName="!border-none !bg-transparent !shadow-none !outline-none !w-full text-sm"
                          countrySelectorStyleProps={{
                            buttonClassName: "!border-none !bg-transparent !shadow-none !outline-none !p-0",
                          }}
                          className="!w-full"
                        />
                      </div>
                  </div>

                  <Input
                    type="text"
                    placeholder="User Name"
                    value={signupData.username}
                    onChange={(e) => updateSignupData('username', e.target.value)}
                  />

                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => updateSignupData('password', e.target.value)}
                  />

                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={signupData.confirmPassword}
                    onChange={(e) => updateSignupData('confirmPassword', e.target.value)}
                  />

                  <Input
                    type="text"
                    placeholder="Agent ID (Optional)"
                    value={signupData.agentId}
                    onChange={(e) => updateSignupData('agentId', e.target.value)}
                  />

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="newsletter"
                        checked={signupData.newsletter}
                        onCheckedChange={(checked) => updateSignupData('newsletter', checked as boolean)}
                      />
                      <label
                        htmlFor="newsletter"
                        className="text-sm text-muted-foreground leading-tight cursor-pointer"
                      >
                        Please send me newsletters. I can revoke this permission anytime.
                      </label>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="optimize"
                        checked={signupData.optimize}
                        onCheckedChange={(checked) => updateSignupData('optimize', checked as boolean)}
                      />
                      <label
                        htmlFor="optimize"
                        className="text-sm text-muted-foreground leading-tight cursor-pointer"
                      >
                        Please optimize offers based on my interests and needs.
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={handleSignUp}
                    disabled={loading}
                    className="w-full gradient-button  shadow-md"
                  >
                    Create your Account
                  </Button>

                  <button
                    onClick={() => setIsSignUp(false)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mx-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Go back to Sign in
                  </button>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
