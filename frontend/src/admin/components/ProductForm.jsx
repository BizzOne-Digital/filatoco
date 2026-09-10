import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { X, Trash2, Video } from 'lucide-react';
import api from '../../services/api';
import { filterOversizedFiles, MAX_IMAGE_MB } from '../../utils/validateImage';

// Style options within a category (category itself = Crocheted or Tapestry, managed separately).
const productTypes = ['shoulder-bag', 'handbag', 'crossbody', 'tote', 'clutch'];

const MAX_VIDEO_MB = 100;

const emptyForm = {
  name: '', sku: '', description: '', shortDescription: '', price: '', comparePrice: '',
  category: '', subcategory: '', materials: '', colors: '', dimensions: '', stock: 1,
  productType: 'shoulder-bag', madeType: 'ready-made', isFeatured: false, isNewArrival: false,
  status: 'published', seoTitle: '', seoDescription: '',
};

// Uploads straight from the browser to Cloudinary using a short-lived signed
// request — video never passes through our own server, so it isn't capped by
// Vercel's ~4.5MB serverless body limit the way image uploads are.
const uploadVideoDirectToCloudinary = (file, { signature, timestamp, folder, apiKey, cloudName }, onProgress) =>
  new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', apiKey);
    fd.append('timestamp', timestamp);
    fd.append('signature', signature);
    fd.append('folder', folder);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({ url: data.secure_url, publicId: data.public_id });
      } else {
        reject(new Error('Cloudinary upload failed'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(fd);
  });

const ProductForm = ({ product, onClose, onSaved }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [deletingImage, setDeletingImage] = useState(null);
  const [existingVideo, setExistingVideo] = useState(product?.video || null);
  const [pendingVideo, setPendingVideo] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [deletingVideo, setDeletingVideo] = useState(false);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        ...emptyForm,
        ...product,
        category: product.category?._id || product.category || '',
        materials: (product.materials || []).join(', '),
        colors: (product.colors || []).join(', '),
      });
    } else {
      setForm(emptyForm);
    }
    setExistingImages(product?.images || []);
    setExistingVideo(product?.video || null);
    setPendingVideo(null);
  }, [product]);

  const handleDeleteImage = async (publicId) => {
    if (!product) return;
    if (!confirm('Delete this image?')) return;
    setDeletingImage(publicId);
    try {
      await api.delete(`/products/${product._id}/images/${encodeURIComponent(publicId)}`);
      setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
      toast.success('Image deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete image');
    } finally {
      setDeletingImage(null);
    }
  };

  const handleDeleteVideo = async () => {
    if (!product || !existingVideo) return;
    if (!confirm('Remove this video?')) return;
    setDeletingVideo(true);
    try {
      await api.delete(`/products/${product._id}/video`);
      setExistingVideo(null);
      toast.success('Video removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove video');
    } finally {
      setDeletingVideo(false);
    }
  };

  const handleVideoSelect = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast.error('Please choose a video file.');
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      toast.error(`Video is over ${MAX_VIDEO_MB}MB — please use a shorter or more compressed clip.`);
      return;
    }

    setVideoUploading(true);
    setVideoProgress(0);
    try {
      const { data: sig } = await api.get('/uploads/video-signature');
      const uploaded = await uploadVideoDirectToCloudinary(file, sig, setVideoProgress);
      setPendingVideo(uploaded);
      toast.success('Video uploaded — click "Save Product" to attach it.');
    } catch (err) {
      toast.error('Video upload failed. Please try again.');
    } finally {
      setVideoUploading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(emptyForm).forEach(([k]) => {
        const v = form[k];
        if (k === 'materials' || k === 'colors') {
          v.split(',').map((s) => s.trim()).filter(Boolean).forEach((item) => fd.append(k, item));
        } else if (v !== undefined && v !== null) {
          fd.append(k, v);
        }
      });
      files.forEach((f) => fd.append('images', f));
      if (pendingVideo) {
        fd.append('videoUrl', pendingVideo.url);
        fd.append('videoPublicId', pendingVideo.publicId);
      }

      if (product) {
        await api.put(`/products/${product._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl2 bg-offwhite p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-brown">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Product Name" value={form.name} onChange={set('name')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="SKU" value={form.sku} onChange={set('sku')} className="rounded-lg border border-beige px-4 py-2 text-sm" />
            <input type="number" min="0" required placeholder="Stock" value={form.stock} onChange={set('stock')} className="rounded-lg border border-beige px-4 py-2 text-sm" />
          </div>
          <textarea required placeholder="Description" value={form.description} onChange={set('description')} rows={3} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <input placeholder="Short Description" value={form.shortDescription} onChange={set('shortDescription')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" step="0.01" min="0" required placeholder="Price" value={form.price} onChange={set('price')} className="rounded-lg border border-beige px-4 py-2 text-sm" />
            <input type="number" step="0.01" min="0" placeholder="Compare Price" value={form.comparePrice} onChange={set('comparePrice')} className="rounded-lg border border-beige px-4 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select required value={form.category} onChange={set('category')} className="rounded-lg border border-beige px-4 py-2 text-sm">
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={form.productType} onChange={set('productType')} className="rounded-lg border border-beige px-4 py-2 text-sm">
              {productTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <input placeholder="Materials (comma separated)" value={form.materials} onChange={set('materials')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <input placeholder="Colors (comma separated)" value={form.colors} onChange={set('colors')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <input placeholder="Dimensions" value={form.dimensions} onChange={set('dimensions')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />

          <div className="grid grid-cols-2 gap-3">
            <select value={form.madeType} onChange={set('madeType')} className="rounded-lg border border-beige px-4 py-2 text-sm">
              <option value="ready-made">Ready Made</option>
              <option value="custom-made">Custom Made</option>
            </select>
            <select value={form.status} onChange={set('status')} className="rounded-lg border border-beige px-4 py-2 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex gap-6 text-sm text-brown">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isNewArrival} onChange={set('isNewArrival')} /> New Arrival</label>
          </div>

          <input placeholder="SEO Title" value={form.seoTitle} onChange={set('seoTitle')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <input placeholder="SEO Description" value={form.seoDescription} onChange={set('seoDescription')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />

          <div>
            {existingImages.length > 0 && (
              <>
                <label className="mb-1 block text-sm text-brown/85">Current Photos — hover and click the X to remove one</label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {existingImages.map((img) => (
                    <div key={img.publicId} className="group relative">
                      <img src={img.url} alt="" className="h-16 w-16 rounded object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.publicId)}
                        disabled={deletingImage === img.publicId}
                        aria-label="Delete image"
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 disabled:opacity-100"
                      >
                        {deletingImage === img.publicId ? '…' : <Trash2 size={11} />}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            <label className="mb-1 block text-sm text-brown/85">
              Add More Photos — max {MAX_IMAGE_MB}MB each. These are kept alongside the current photos above, not a
              replacement — to swap one out, remove it above and add a new one here.
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(filterOversizedFiles(Array.from(e.target.files), toast))}
              className="w-full text-sm"
            />
            {files.length > 0 && (
              <p className="mt-1 text-xs text-terracotta">
                {files.length} new photo{files.length > 1 ? 's' : ''} ready — click "Save Product" below to add {files.length > 1 ? 'them' : 'it'}.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-beige p-3">
            <label className="mb-1 flex items-center gap-1.5 text-sm text-brown/85"><Video size={14} /> Product Video (optional) — one video, max {MAX_VIDEO_MB}MB</label>

            {existingVideo && !pendingVideo && (
              <div className="mb-2 flex items-center gap-3">
                <video src={existingVideo.url} className="h-20 w-28 rounded bg-black object-cover" muted />
                <button
                  type="button"
                  onClick={handleDeleteVideo}
                  disabled={deletingVideo}
                  className="flex items-center gap-1 text-xs text-terracotta hover:underline"
                >
                  <Trash2 size={12} /> {deletingVideo ? 'Removing...' : 'Remove video'}
                </button>
              </div>
            )}

            {pendingVideo && (
              <div className="mb-2 flex items-center gap-3">
                <video src={pendingVideo.url} className="h-20 w-28 rounded bg-black object-cover" muted />
                <span className="text-xs text-terracotta">New video ready — click "Save Product" to attach it.</span>
              </div>
            )}

            {!existingVideo && !pendingVideo && (
              <input type="file" accept="video/*" onChange={handleVideoSelect} disabled={videoUploading} className="w-full text-sm" />
            )}

            {videoUploading && (
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-beige">
                  <div className="h-full bg-terracotta transition-all" style={{ width: `${videoProgress}%` }} />
                </div>
                <p className="mt-1 text-xs text-brown/70">Uploading video... {videoProgress}%</p>
              </div>
            )}
          </div>

          <button type="submit" disabled={saving || videoUploading} className="btn-primary w-full">{saving ? 'Saving...' : 'Save Product'}</button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
