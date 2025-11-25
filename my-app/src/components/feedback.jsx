import React, { useState, useEffect } from "react";
import { Sparkles, Globe, Mail, ArrowRight, CheckCircle2, Zap, TrendingUp, Eye, Search, AlertCircle, Award, Target, Clock, BarChart3, Shield, Rocket, Star, ChevronDown, ExternalLink } from "lucide-react";

const mockFeedbackData = {
  "example.com": {
    ui_feedback: {
      score: 87,
      summary: "Your website demonstrates strong visual hierarchy with a clean, modern aesthetic. The color scheme is cohesive and professional.",
      details: [
        { type: "success", text: "Excellent use of whitespace and typography" },
        { type: "success", text: "Consistent brand colors across all pages" },
        { type: "warning", text: "Navigation menu needs better mobile responsiveness" },
        { type: "warning", text: "CTA buttons could be more prominent" },
        { type: "info", text: "Consider adding micro-interactions for better engagement" }
      ],
      recommendations: ["Implement sticky navigation", "Add loading skeletons", "Improve contrast ratios for accessibility"]
    },
    seo_feedback: {
      score: 72,
      summary: "Meta descriptions are well-optimized and keywords are strategically placed. Several areas need immediate attention for better rankings.",
      details: [
        { type: "success", text: "Meta descriptions under 160 characters" },
        { type: "success", text: "Proper H1-H6 heading structure" },
        { type: "error", text: "Missing alt text on 12 images" },
        { type: "warning", text: "Page load speed averaging 3.2s (should be under 2s)" },
        { type: "info", text: "No structured data markup found" }
      ],
      recommendations: ["Add schema.org markup", "Optimize images with WebP format", "Create XML sitemap"]
    },
    performance_feedback: {
      score: 79,
      summary: "Overall performance is acceptable but has significant room for improvement. Load time of 2.8s is above industry standard.",
      details: [
        { type: "success", text: "Server response time: 180ms (excellent)" },
        { type: "warning", text: "Total page size: 4.2MB (should be under 2MB)" },
        { type: "error", text: "No browser caching enabled" },
        { type: "warning", text: "Render-blocking resources detected" },
        { type: "info", text: "18 HTTP requests (optimize to under 10)" }
      ],
      recommendations: ["Enable Gzip compression", "Implement lazy loading", "Minify CSS/JS files", "Use CDN for static assets"]
    }
  },
  "portfolio.com": {
    ui_feedback: {
      score: 92,
      summary: "Outstanding visual design with excellent attention to detail. Your portfolio showcases projects effectively with smooth animations.",
      details: [
        { type: "success", text: "Beautiful hero section with engaging animations" },
        { type: "success", text: "Excellent project showcase layout" },
        { type: "success", text: "Perfect color harmony and contrast" },
        { type: "info", text: "Consider adding testimonials section" },
        { type: "info", text: "Add a blog to showcase your expertise" }
      ],
      recommendations: ["Add case studies with metrics", "Include video demos", "Create downloadable resume"]
    },
    seo_feedback: {
      score: 85,
      summary: "Strong SEO foundation with good keyword targeting. A few optimizations will help you rank even higher.",
      details: [
        { type: "success", text: "All images have descriptive alt text" },
        { type: "success", text: "Mobile-friendly and responsive" },
        { type: "success", text: "Fast load times (1.8s average)" },
        { type: "warning", text: "Internal linking structure could be improved" },
        { type: "info", text: "Consider adding a blog for content marketing" }
      ],
      recommendations: ["Build quality backlinks", "Add Open Graph tags", "Optimize for local SEO"]
    },
    performance_feedback: {
      score: 94,
      summary: "Exceptional performance! Your site loads quickly and efficiently. Minor optimizations can push it to perfection.",
      details: [
        { type: "success", text: "First Contentful Paint: 0.9s (excellent)" },
        { type: "success", text: "Time to Interactive: 1.5s (excellent)" },
        { type: "success", text: "Optimized images with next-gen formats" },
        { type: "success", text: "Minimal JavaScript bundle size" },
        { type: "info", text: "Consider implementing service workers" }
      ],
      recommendations: ["Add progressive web app features", "Implement edge caching", "Preload critical fonts"]
    }
  }
};

const analyseFeedback = async (formData) => {
  const res = await fetch("http://127.0.0.1:5000/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userEmail: formData.userEmail,
      webUrl: formData.webUrl
    })
  });

  return await res.json();
};



export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    userEmail: "",
    webUrl: "",
  });
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10
    }));
    setParticles(newParticles);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);
    setFeedback(null);
    setShowSuccess(false);
    setExpandedSections({});

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 8;
      });
    }, 280);

    try {
      const res = await analyseFeedback(formData);
      console.log("Received in frontend:", res);

      setProgress(100);
      setTimeout(() => {
        setFeedback(res.feedback);
        setShowSuccess(true);
      }, 500);
    } catch (err) {
      alert("Error generating feedback");
    } finally {
      setLoading(false);
      clearInterval(progressInterval);
    }
  };

  const categories = [
    { 
      icon: Eye, 
      title: "UI/UX Analysis", 
      key: "ui_feedback", 
      color: "from-violet-500 via-purple-500 to-fuchsia-500",
      bgGlow: "shadow-purple-500/30"
    },
    { 
      icon: Search, 
      title: "SEO Optimization", 
      key: "seo_feedback", 
      color: "from-cyan-500 via-blue-500 to-indigo-500",
      bgGlow: "shadow-blue-500/30"
    },
    { 
      icon: Zap, 
      title: "Performance Metrics", 
      key: "performance_feedback", 
      color: "from-amber-500 via-orange-500 to-red-500",
      bgGlow: "shadow-orange-500/30"
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 75) return "text-blue-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getDetailIcon = (type) => {
    switch(type) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "error": return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Target className="w-4 h-4 text-blue-400" />;
    }
  };

  const getDetailColor = (type) => {
    switch(type) {
      case "success": return "bg-emerald-500/10 border-emerald-500/30";
      case "warning": return "bg-yellow-500/10 border-yellow-500/30";
      case "error": return "bg-red-500/10 border-red-500/30";
      default: return "bg-blue-500/10 border-blue-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/5 blur-sm animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.id * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm px-5 py-2.5 rounded-full mb-6 border border-white/10 shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-sm text-white/90 font-semibold tracking-wide">AI-POWERED ANALYSIS ENGINE</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient">
              Website Intelligence
            </span>
          </h1>
          
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Unlock deep insights into your website's performance, SEO, and user experience with our advanced AI analysis
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { icon: Rocket, label: "10k+ Sites Analyzed", color: "text-purple-400" },
              { icon: Star, label: "4.9/5 Rating", color: "text-yellow-400" },
              { icon: Clock, label: "< 5 sec Analysis", color: "text-blue-400" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-white/80 text-sm font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/20 shadow-2xl mb-10 transform transition-all hover:shadow-purple-500/20 hover:border-white/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Start Your Analysis</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
  {/* Email Input */}
  <div className="relative group">
    <label className="block text-white/70 text-sm font-medium mb-2 ml-1">Email Address</label>
    <Mail className="absolute left-4 top-[46px] -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors z-10" />
    <input
      name="userEmail"
      type="email"
      required
      placeholder="you@company.com"
      value={formData.userEmail}
      onChange={handleChange}
      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all backdrop-blur-sm"
    />
  </div>

  {/* URL Input */}
  <div className="relative group">
    <label className="block text-white/70 text-sm font-medium mb-2 ml-1">Website URL</label>
    <Globe className="absolute left-4 top-[46px] -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors z-10" />
    <input
      name="webUrl"
      type="url"
      required
      placeholder="https://example.com or https://portfolio.com"
      value={formData.webUrl}
      onChange={handleChange}
      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all backdrop-blur-sm"
    />
    <p className="text-white/40 text-xs mt-2 ml-1">Try: example.com or portfolio.com for different results</p>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={loading}
    className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-2xl py-5 font-bold text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden mt-6"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
    <span className="relative z-10 flex items-center gap-3">
      {loading ? (
        <>
          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="animate-pulse">Analyzing Your Website...</span>
        </>
      ) : (
        <>
          <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Analyze My Website
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </>
      )}
    </span>
  </button>
</form>


          {/* Progress Bar */}
          {loading && (
            <div className="mt-8 space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-white/90">
                  {progress < 30 && "🔍 Crawling your website..."}
                  {progress >= 30 && progress < 60 && "🧠 AI analyzing content..."}
                  {progress >= 60 && progress < 90 && "📊 Generating insights..."}
                  {progress >= 90 && "✨ Finalizing report..."}
                </span>
                <span className="text-cyan-400 font-bold">{progress}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feedback Results */}
        {feedback && (
          <div className="space-y-6 animate-slide-up">
            {/* Success Badge */}
            {showSuccess && (
              <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-2 border-emerald-500/40 rounded-2xl p-5 flex items-center gap-4 animate-bounce-in backdrop-blur-xl">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Analysis Complete!</h3>
                  <p className="text-white/70 text-sm">Your comprehensive website report is ready</p>
                </div>
                <Award className="w-8 h-8 text-yellow-400 ml-auto animate-pulse" />
              </div>
            )}

            {/* Overall Score */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                Overall Website Score
              </h3>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                {categories.map((cat) => {
                  const score = feedback[cat.key].score;
                  return (
                    <div key={cat.key} className="text-center">
                      <div className="relative w-32 h-32 mb-3">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="url(#gradient-${cat.key})"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${score * 3.51} 351`}
                            className="transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id={`gradient-${cat.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={cat.key === 'ui_feedback' ? '#8b5cf6' : cat.key === 'seo_feedback' ? '#06b6d4' : '#f59e0b'} />
                              <stop offset="100%" stopColor={cat.key === 'ui_feedback' ? '#ec4899' : cat.key === 'seo_feedback' ? '#3b82f6' : '#ef4444'} />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-4xl font-black ${getScoreColor(score)}`}>{score}</span>
                        </div>
                      </div>
                      <p className="text-white/80 font-semibold">{cat.title.split(' ')[0]}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Feedback Cards */}
            {categories.map((category, idx) => {
              const data = feedback[category.key] || { details: [], recommendations: [], score: 0, summary: '' };

              const isExpanded = expandedSections[category.key];
              
              return (
                <div
                  key={category.key}
                  className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl transform transition-all hover:scale-[1.01] animate-slide-up ${category.bgGlow}`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} shadow-lg flex-shrink-0`}>
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                        <span className={`text-3xl font-black ${getScoreColor(data.score)} ml-auto flex-shrink-0`}>
                          {data.score}
                          <span className="text-lg text-white/50">/100</span>
                        </span>
                      </div>
                      <p className="text-white/70 leading-relaxed">{data.summary}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    {data.details.slice(0, isExpanded ? undefined : 3).map((detail, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-4 rounded-xl border ${getDetailColor(detail.type)} backdrop-blur-sm transition-all hover:scale-[1.02]`}
                      >
                        <div className="mt-0.5">{getDetailIcon(detail.type)}</div>
                        <span className="text-white/90 text-sm flex-1">{detail.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Toggle Button */}
                  {data.details.length > 3 && (
                    <button
                      onClick={() => toggleSection(category.key)}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 font-medium transition-all flex items-center justify-center gap-2 mb-6"
                    >
                      {isExpanded ? 'Show Less' : `Show ${data.details.length - 3} More Details`}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}

                  {/* Recommendations */}
                  <div className="bg-gradient-to-r from-white/5 to-transparent rounded-2xl p-5 border-l-4 border-cyan-400">
                    <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-cyan-400" />
                      Key Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {data.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                          <ArrowRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">Want Detailed Implementation Guide?</h3>
              <p className="text-white/70 mb-6">Get a comprehensive action plan with step-by-step instructions</p>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all inline-flex items-center gap-2">
                Download Full Report
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.08); }
          70% { transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }

        .animate-bounce-in {
          animation: bounce-in 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}