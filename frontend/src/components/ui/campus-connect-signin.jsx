import React, { useRef, useEffect, useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { Input } from "./input";
import { Link } from "react-router-dom";

const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const DotMap = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const routes = [
    { start: { x: 100, y: 150, delay: 0 }, end: { x: 200, y: 80, delay: 2 }, color: "#0ea5e9" },
    { start: { x: 200, y: 80, delay: 2 }, end: { x: 260, y: 120, delay: 4 }, color: "#0ea5e9" },
    { start: { x: 50, y: 50, delay: 1 }, end: { x: 150, y: 180, delay: 3 }, color: "#0ea5e9" },
    { start: { x: 280, y: 60, delay: 0.5 }, end: { x: 180, y: 180, delay: 2.5 }, color: "#0ea5e9" },
  ];

  const generateDots = (width, height) => {
    const dots = [];
    const gap = 12;
    const dotRadius = 1.5;

    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const isInMapShape =
          ((x < width * 0.25 && x > width * 0.05) && (y < height * 0.4 && y > height * 0.1)) ||
          ((x < width * 0.25 && x > width * 0.15) && (y < height * 0.8 && y > height * 0.4)) ||
          ((x < width * 0.45 && x > width * 0.3) && (y < height * 0.35 && y > height * 0.15)) ||
          ((x < width * 0.5 && x > width * 0.35) && (y < height * 0.65 && y > height * 0.35)) ||
          ((x < width * 0.7 && x > width * 0.45) && (y < height * 0.5 && y > height * 0.1)) ||
          ((x < width * 0.8 && x > width * 0.65) && (y < height * 0.8 && y > height * 0.6));

        if (isInMapShape && Math.random() > 0.3) {
          dots.push({ x, y, radius: dotRadius, opacity: Math.random() * 0.5 + 0.3 });
        }
      }
    }
    return dots;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
      canvas.width = width;
      canvas.height = height;
    });

    resizeObserver.observe(canvas.parentElement);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots = generateDots(dimensions.width, dimensions.height);
    let animationFrameId;
    let startTime = Date.now();

    function drawDots() {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 165, 233, ${dot.opacity})`; 
        ctx.fill();
      });
    }

    function drawRoutes() {
      const currentTime = (Date.now() - startTime) / 1000;
      routes.forEach(route => {
        const elapsed = currentTime - route.start.delay;
        if (elapsed <= 0) return;
        
        const duration = 3;
        const progress = Math.min(elapsed / duration, 1);
        const x = route.start.x + (route.end.x - route.start.x) * progress;
        const y = route.start.y + (route.end.y - route.start.y) * progress;
        
        ctx.beginPath();
        ctx.moveTo(route.start.x, route.start.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = route.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = route.color;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
        ctx.fill();
        
        if (progress === 1) {
          ctx.beginPath();
          ctx.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = route.color;
          ctx.fill();
        }
      });
    }
    
    function animate() {
      drawDots();
      drawRoutes();
      const currentTime = (Date.now() - startTime) / 1000;
      if (currentTime > 15) startTime = Date.now();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};


export const SignInCard = ({ email, setEmail, password, setPassword, onSubmit, error, loading }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="flex w-full h-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl overflow-hidden rounded-3xl flex bg-gray-950 border border-gray-800 shadow-[0_0_40px_rgba(14,165,233,0.15)]"
      >
        <div className="hidden md:block w-1/2 h-[600px] relative overflow-hidden border-r border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
            <DotMap />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 bg-black/40">
              <motion.div 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
                className="mb-6"
              >
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary-500 to-cyan-600 flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.5)]">
                  <ArrowRight className="text-white h-7 w-7" />
                </div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}
                className="text-4xl font-black font-heading mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-200"
              >
                Campus Connect
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}
                className="text-base text-center text-gray-400 max-w-xs font-medium"
              >
                Sign in to access your campus dashboard and find lost belongings.
              </motion.p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-gray-900 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-black font-heading mb-2 text-white">Welcome back</h1>
            <p className="text-gray-400 font-medium mb-8">Sign in to your account</p>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm font-bold text-center">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">
                  Email <span className="text-primary-500">*</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary-500 w-full h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">
                  Password <span className="text-primary-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary-500 w-full h-12 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}
                className="pt-4"
              >
                <Button
                  type="submit" disabled={loading}
                  className={cn(
                    "w-full bg-primary-600 hover:bg-primary-500 text-white font-bold h-12 rounded-xl transition-all duration-300",
                    isHovered ? "shadow-[0_0_20px_rgba(14,165,233,0.4)]" : "shadow-md"
                  )}
                >
                  <span className="flex items-center justify-center text-base">
                    {loading ? "Signing in..." : "Sign in"}
                    {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                  </span>
                </Button>
              </motion.div>
            </form>

            <p className="mt-8 text-center text-gray-400 text-sm font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-bold hover:underline transition-colors">
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export const SignUpCard = ({ username, setUsername, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, onSubmit, error, loading }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="flex w-full h-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl overflow-hidden rounded-3xl flex flex-row-reverse bg-gray-950 border border-gray-800 shadow-[0_0_40px_rgba(14,165,233,0.15)]"
      >
        <div className="hidden md:block w-1/2 h-auto relative overflow-hidden border-l border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
            <DotMap />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 bg-black/40">
              <motion.div 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="mb-6"
              >
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary-500 to-cyan-600 flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.5)]">
                  <ArrowRight className="text-white h-7 w-7" />
                </div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}
                className="text-4xl font-black font-heading mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-200"
              >
                Join the Network
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}
                className="text-base text-center text-gray-400 max-w-xs font-medium"
              >
                Create an account to report missing items and stay connected.
              </motion.p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-gray-900 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-black font-heading mb-2 text-white">Create Account</h1>
            <p className="text-gray-400 font-medium mb-6">Get started in seconds.</p>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm font-bold text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5 flex justify-between">
                  <span>Username <span className="text-primary-500">*</span></span>
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe123"
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary-500 w-full h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">
                  Email <span className="text-primary-500">*</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary-500 w-full h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">
                  Password <span className="text-primary-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary-500 w-full h-12 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">
                  Confirm Password <span className="text-primary-500">*</span>
                </label>
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary-500 w-full h-12"
                />
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}
                className="pt-4"
              >
                <Button
                  type="submit" disabled={loading}
                  className={cn(
                    "w-full bg-primary-600 hover:bg-primary-500 text-white font-bold h-12 rounded-xl transition-all duration-300",
                    isHovered ? "shadow-[0_0_20px_rgba(14,165,233,0.4)]" : "shadow-md"
                  )}
                >
                  <span className="flex items-center justify-center text-base">
                    {loading ? "Creating Account..." : "Sign Up"}
                  </span>
                </Button>
              </motion.div>
            </form>

            <p className="mt-6 text-center text-gray-400 text-sm font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-bold hover:underline transition-colors">
                Login here
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
