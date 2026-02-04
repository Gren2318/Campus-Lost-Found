import { useState } from 'react';
import { Camera, MapPin, Loader, Sparkles, Upload } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const PostItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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

      alert("Item Posted Successfully!");
      navigate('/'); 

    } catch (error) {
      console.error("Post Error:", error);
      alert("Failed to post item. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <Camera className="text-purple-500" /> Post Lost Item
      </h1>

      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
        
        <div className="mb-8 relative border-2 border-dashed border-slate-600 rounded-xl p-4 text-center hover:bg-slate-700/50 transition-colors group">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
            onChange={handleImageChange} 
            accept="image/*" 
          />

          {preview ? (
            <div className="relative inline-block z-10">
              <img src={preview} alt="Preview" className="max-h-64 rounded-lg shadow-lg border border-slate-600 mx-auto" />
              
              {analyzing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm">
                  <Sparkles className="text-yellow-400 animate-spin mb-2" size={40} />
                  <p className="font-bold text-yellow-400 animate-pulse text-sm">AI is identifying item...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-slate-400 group-hover:text-white transition-colors">
              <Upload size={48} className="mb-4" />
              <p className="text-lg font-medium">Click to upload photo</p>
              <p className="text-sm text-slate-500">AI will auto-fill details for you ✨</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none transition-colors"
              placeholder={analyzing ? "AI is writing title..." : "e.g. Blue Backpack"}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
              >
                <option>Lost</option>
                <option>Found</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-purple-500 outline-none"
                  placeholder="e.g. Library"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Description</label>
            <textarea 
              rows="4"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
              placeholder={analyzing ? "AI is describing the item..." : "Describe the item..."}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || analyzing}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/20 text-white'
            }`}
          >
            {loading ? <Loader className="animate-spin" /> : 'Post Item'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default PostItem;
