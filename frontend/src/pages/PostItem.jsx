import { useState } from 'react';
import { Camera, MapPin, Loader, Sparkles, Upload } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8 flex items-center gap-3">
          <div className="bg-primary-50 p-2 rounded-xl text-primary-600">
            <Camera size={28} />
          </div>
          Post Lost Item
        </h1>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-hard">

          <div className="mb-8 relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 hover:border-primary-400 transition-all group overflow-hidden">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              onChange={handleImageChange}
              accept="image/*"
            />

            {preview ? (
              <div className="relative inline-block z-10 w-full">
                <img src={preview} alt="Preview" className="max-h-80 w-full object-contain rounded-xl shadow-sm mx-auto" />

                {analyzing && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
                    <Sparkles className="text-yellow-400 animate-spin mb-3" size={48} />
                    <p className="font-bold text-white tracking-wide animate-pulse">AI is identifying item...</p>
                  </div>
                )}

                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                  Click to change
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-10 text-gray-400 group-hover:text-primary-600 transition-colors">
                <div className="bg-gray-50 p-4 rounded-full mb-4 group-hover:bg-primary-50 transition-colors">
                  <Upload size={32} />
                </div>
                <p className="text-lg font-bold text-gray-700 group-hover:text-primary-700">Click to upload photo</p>
                <p className="text-sm text-gray-500 mt-2">AI will analyze the image to auto-fill details ✨</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium"
                placeholder={analyzing ? "AI is writing title..." : "e.g. Blue Backpack"}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none appearance-none transition-all font-medium"
                  >
                    <option>Lost</option>
                    <option>Found</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-11 text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium"
                    placeholder="e.g. Library"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium resize-none"
                placeholder={analyzing ? "AI is describing the item..." : "Describe the item..."}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || analyzing}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30 text-white'
                }`}
            >
              {loading ? <Loader className="animate-spin" /> : 'Post Item'}
            </button>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PostItem;
