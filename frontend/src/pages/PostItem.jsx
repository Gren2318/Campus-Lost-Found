import { useState } from 'react';
import { Camera, MapPin, Loader, Sparkles, Upload } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import AnimatedDoodle from '../components/AnimatedDoodle';

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const PostItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Lost',
    location: '',
    date_lost: new Date().toISOString().split('T')[0]
  });

  const handleAnalyze = async (selectedFile) => {
    setAnalyzing(true);
    try {
      const data = new FormData();
      data.append('file', selectedFile);

      const response = await api.post('/analyze', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.description) {
        let rawDescription = response.data.description;
        let cleanTitle = rawDescription;

        cleanTitle = cleanTitle.replace(/^(found|lost):\s*/i, "");

        cleanTitle = cleanTitle.split(' ').slice(0, 4).join(' ');

        cleanTitle = toTitleCase(cleanTitle);

        setFormData(prev => ({
          ...prev,
          description:
            rawDescription.charAt(0).toUpperCase() +
            rawDescription.slice(1),
          title: cleanTitle,
          category: prev.category
        }));
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      handleAnalyze(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('location', formData.location);
      submitData.append('date_lost', formData.date_lost);

      if (user && user.email) {
        submitData.append('owner_id', user.email);
      } else {
        submitData.append('owner_id', 'anonymous');
      }

      if (image) {
        submitData.append('file', image);
      }

      await api.post('/items/', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showToast("Item Posted Successfully!", "success");
      navigate('/');

    } catch (error) {
      console.error("Post Error:", error);
      showToast("Failed to post item. Check console for details.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28 min-h-screen transition-colors duration-300">
      
      {/* Background Blobs for playful feel */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-200 dark:bg-primary-900/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-60 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-60 animate-blob animation-delay-2000 pointer-events-none"></div>

      {/* Interactive Floating Toys */}
      <motion.div 
        drag 
        dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
        whileDrag={{ scale: 1.1, cursor: "grabbing" }}
        className="absolute top-32 right-10 w-16 h-16 bg-gradient-to-br from-primary-400 to-purple-400 rounded-2xl shadow-lg cursor-grab z-0 animate-float hidden lg:flex items-center justify-center opacity-80"
      >
        <Sparkles className="text-white" size={24} />
      </motion.div>
      <motion.div 
        drag 
        dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
        whileDrag={{ scale: 1.1, rotate: 15, cursor: "grabbing" }}
        className="absolute top-64 left-0 w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-lg cursor-grab z-0 animate-float animation-delay-1000 hidden lg:block opacity-80"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10"
      >
        <div className="text-center mb-12 relative flex flex-col items-center">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="bg-primary-100 dark:bg-primary-900/40 p-4 rounded-3xl text-primary-600 dark:text-primary-400 shadow-sm mb-6 inline-block"
          >
            <Camera size={40} />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight relative">
            Report an Item
            <AnimatedDoodle type="arrow" className="absolute -top-4 -right-16 w-20 h-20 text-primary-400 hidden md:block" strokeWidth={4} />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm font-medium max-w-xl">Snap a photo and describe where you lost or found it. AI will handle the rest.</p>
        </div>

        <div className="glass-heavy dark:glass-dark rounded-[2.5rem] p-6 md:p-12 shadow-hard relative overflow-hidden border border-white/60 dark:border-gray-700/50">
          
          <AnimatedDoodle type="circle" className="absolute -bottom-16 -right-16 w-48 h-48 text-primary-200 dark:text-primary-900/20 opacity-50 z-0 pointer-events-none" strokeWidth={2} />

          <div className="mb-10 relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-8 text-center bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-primary-400 dark:hover:border-primary-500 transition-all group overflow-hidden shadow-inner cursor-pointer z-10">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              onChange={handleImageChange}
              accept="image/*"
            />

            {preview ? (
              <div className="relative inline-block z-10 w-full">
                <img src={preview} alt="Preview" className="max-h-96 w-full object-contain rounded-2xl shadow-md mx-auto" />

                {analyzing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-2xl backdrop-blur-md">
                    <Sparkles className="text-yellow-400 animate-spin mb-4" size={56} />
                    <p className="font-black text-white text-sm tracking-wide animate-pulse">AI is mapping details...</p>
                  </div>
                )}

                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm font-bold px-4 py-2 rounded-full backdrop-blur-md">
                  Click anywhere to replace
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-16 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                <div className="bg-gray-100 dark:bg-gray-700/50 p-6 rounded-full mb-6 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
                  <Upload size={40} className="text-gray-500 dark:text-gray-400 group-hover:text-primary-500" />
                </div>
                <p className="text-lg font-black text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-300">Upload a Photo</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">JPEG, PNG, SVG • AI Auto-fill active ✨</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">What is it?</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full glass-soft dark:glass-dark border border-white/60 dark:border-gray-700 rounded-2xl p-3.5 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm text-sm"
                placeholder={analyzing ? "AI is generating..." : "e.g. Hydroflask Water Bottle"}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">Category</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full glass-soft dark:glass-dark border border-white/60 dark:border-gray-700 rounded-2xl p-3.5 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none appearance-none transition-all font-medium shadow-sm text-sm cursor-pointer"
                  >
                    <option>Lost</option>
                    <option>Found</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full glass-soft dark:glass-dark border border-white/60 dark:border-gray-700 rounded-2xl p-3.5 pl-12 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm text-sm"
                    placeholder="e.g. Student Union Floor 2"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">Description / Details</label>
              <textarea
                rows="5"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full glass-soft dark:glass-dark border border-white/60 dark:border-gray-700 rounded-2xl p-3.5 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all font-medium resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm text-sm leading-relaxed"
                placeholder={analyzing ? "AI is describing..." : "Describe distinguishing features, contents, or how to claim it..."}
                required
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.95, y: 2 }}
              whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(14, 165, 233, 0.4)' }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              type="submit"
              disabled={loading || analyzing}
              className={`w-full py-4 rounded-[2rem] font-black text-base flex items-center justify-center gap-3 transition-colors shadow-glow mt-4 ${loading ? 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed shadow-none' : 'bg-primary-600 hover:bg-primary-500 text-white border border-primary-500'
                }`}
            >
              {loading ? <Loader className="animate-spin" /> : 'Publish Report'}
            </motion.button>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PostItem;
