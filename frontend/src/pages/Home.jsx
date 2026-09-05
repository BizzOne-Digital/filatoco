import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Gem, PenTool, Phone, Mail } from 'lucide-react';
import api from '../services/api';
import Reveal from '../components/Reveal';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    api.get('/products', { params: { featured: true, limit: 4 } }).then(({ data }) => setFeatured(data.products));
    api.get('/products', { params: { newArrival: true, limit: 8 } }).then(({ data }) => setNewArrivals(data.products));
    api.get('/testimonials').then(({ data }) => setTestimonials(data.testimonials));
    api.get('/gallery').then(({ data }) => setGallery(data.items));
    api.get('/categories').then(({ data }) => setCategories(data.categories));
    api.get('/settings/homepage').then(({ data }) => setContent(data.content));
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribing(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      toast.success('You are subscribed! Check your inbox.');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>FilatoCo | Handmade Purses That Tell a Story</title>
        <meta name="description" content="Thoughtfully handcrafted crochet, tapestry and sewn bags made with passion, individuality and true craftsmanship." />
      </Helmet>

      {/* HERO */}
      <section
        className="relative overflow-hidden bg-cover bg-center px-5 py-24 md:px-8 md:py-36"
        style={{ backgroundImage: "url('/hero1.png')" }}
      >
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl rounded-xl2 bg-cream p-6 shadow-soft md:p-8"
          >
            <span className="label-eyebrow">Handmade With Heart</span>
            <h1 className="mt-4 font-heading text-5xl leading-tight text-brown md:text-7xl">
              Handmade Purses <br /> That Tell a Story
            </h1>
            <p className="mt-6 max-w-md text-brown/70">
              {content?.heroSubtext ||
                'Thoughtfully handcrafted crochet, tapestry and sewn bags created with passion, individuality and timeless craftsmanship.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary">Shop Collection</Link>
              <Link to="/about" className="btn-secondary">Our Story</Link>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brown">Handmade &bull; One-of-a-Kind &bull; Crafted with Care</p>
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <Reveal className="text-center">
          <span className="label-eyebrow">Featured Collection</span>
          <h2 className="section-heading mt-2">Handmade with Heart</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p._id} delay={i * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
          {featured.length === 0 && <p className="col-span-full text-center text-brown/50">Featured products will appear here once added in Admin.</p>}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid items-center gap-10 rounded-xl2 bg-offwhite p-6 shadow-soft md:grid-cols-2 md:p-10">
          <Reveal>
            <div className="aspect-[4/5] overflow-hidden rounded-xl2 bg-beige">
              <img src="/about.jpg" alt="Mirella, Founder of FilatoCo" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="label-eyebrow">About FilatoCo</span>
            <h2 className="section-heading mt-2">{content?.aboutHeading || 'A Passion Woven from Peace & Purpose'}</h2>
            <p className="mt-4 text-brown/70">
              FilatoCo was born from a search for peace—one loop, one stitch, one quiet moment at a time. With a family
              background in tailoring and a deep love for handmade beauty, I create purses that are as unique as the
              women who carry them.
            </p>
            <p className="mt-4 text-brown/70">
              Every piece is crafted with care, intention, and the belief that handmade is more than a bag—it's a story.
            </p>
            <Link to="/about" className="btn-secondary mt-6 inline-flex">Read My Story</Link>
            <p className="mt-6 font-hand text-2xl text-terracotta">— Mirella, Founder</p>
          </Reveal>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <Reveal className="text-center">
          <span className="label-eyebrow">Explore</span>
          <h2 className="section-heading mt-2">Shop by Category</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {categories.map((c, i) => (
            <Reveal key={c._id} delay={i * 0.06}>
              <Link to={`/shop?category=${c._id}`} className="group relative block overflow-hidden rounded-xl2 bg-beige">
                <div className="aspect-[4/3] overflow-hidden">
                  {c.image?.url ? (
                    <img src={c.image.url} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-taupe/30 text-brown/50">{c.name}</div>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-serif text-lg text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">{c.name}</p>
                  <span className="text-xs text-white/90 opacity-0 transition-opacity [text-shadow:0_1px_4px_rgba(0,0,0,0.7)] group-hover:opacity-100">Explore Collection →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HANDMADE PROCESS */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid overflow-hidden rounded-xl2 shadow-soft md:grid-cols-2">
          <Reveal className="flex flex-col justify-center bg-brown p-10 text-cream">
            <h2 className="font-heading text-4xl md:text-5xl">Crafted by Hand. Made with Care.</h2>
            <p className="mt-4 text-cream/85">
              From the first stitch to the final detail, every FilatoCo purse is handmade with attention to quality,
              creativity and timeless craftsmanship.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
              <div><Heart className="mx-auto mb-2" size={22} /> Handmade with Love</div>
              <div><Gem className="mx-auto mb-2" size={22} /> Quality Materials</div>
              <div><Sparkles className="mx-auto mb-2" size={22} /> One-of-a-Kind Designs</div>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="aspect-square bg-beige md:aspect-auto">
            <img src="/byhand.jpg" alt="FilatoCo handmade process" className="h-full w-full object-cover" />
          </Reveal>
        </div>
      </section>

      {/* WHY FILATOCO */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {[
            { icon: Heart, title: 'Handmade', text: 'Each piece is personally crafted.', bg: 'bg-blush/50' },
            { icon: Sparkles, title: 'Unique Designs', text: 'No mass-produced fashion.', bg: 'bg-sage/35' },
            { icon: Gem, title: 'Thoughtful Materials', text: 'Carefully selected yarns, fabrics and accessories.', bg: 'bg-taupe/40' },
            { icon: PenTool, title: 'Personal Expression', text: 'Designed for women who want something different.', bg: 'bg-terracotta/20' },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className={`rounded-xl2 ${f.bg} p-6 text-center shadow-soft`}>
              <f.icon className="mx-auto mb-3 text-terracotta" size={26} />
              <p className="font-serif text-lg text-brown">{f.title}</p>
              <p className="mt-1 text-sm text-brown/70">{f.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <Reveal className="text-center">
            <span className="label-eyebrow">Just In</span>
            <h2 className="section-heading mt-2">New Arrivals</h2>
          </Reveal>
          <div className="mt-10 flex gap-5 overflow-x-auto pb-4">
            {newArrivals.map((p) => (
              <div key={p._id} className="w-56 flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CUSTOM MADE CTA */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <Reveal className="rounded-xl2 bg-brown px-8 py-16 text-center text-cream">
          <h2 className="font-heading text-4xl md:text-5xl">Made Especially for You</h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            Looking for something uniquely yours? Contact FilatoCo to discuss a custom handmade bag created around your
            preferred colors, materials and style.
          </p>
          <Link to="/contact?type=custom" className="btn-primary mt-8 inline-flex bg-terracotta hover:bg-cream hover:text-brown">
            Request a Custom Bag
          </Link>
        </Reveal>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <Reveal className="text-center">
            <span className="label-eyebrow">Customer Love</span>
            <h2 className="section-heading mt-2">What They're Saying</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <Reveal key={t._id} className={`rounded-xl2 p-6 shadow-soft ${['bg-blush/40', 'bg-taupe/35', 'bg-sage/30'][i % 3]}`}>
                <div className="mb-2 text-terracotta">{'★'.repeat(t.rating)}</div>
                <p className="text-sm text-brown/70">"{t.review}"</p>
                <p className="mt-4 text-sm font-medium text-brown">— {t.customerName}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* INSTAGRAM GALLERY */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <Reveal className="text-center">
            <h2 className="section-heading">Follow the FilatoCo Story</h2>
            <p className="mt-2 text-brown/60">@filatoco</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-3 gap-3 md:grid-cols-6">
            {gallery.map((g) => (
              <a key={g._id} href={g.link || '#'} target="_blank" rel="noreferrer" className="aspect-square overflow-hidden rounded-lg">
                <img src={g.image?.url} alt={g.caption || 'FilatoCo'} className="h-full w-full object-cover transition-transform hover:scale-105" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* APPOINTMENTS */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <Reveal className="flex flex-col items-center gap-6 rounded-xl2 bg-beige px-8 py-12 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-heading text-3xl text-brown md:text-4xl">Personal Appointments Available</h2>
            <p className="mt-2 text-brown/70">Let's create something beautiful together.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-brown/80 md:items-end">
            <a href="tel:9055165462" className="flex items-center gap-2"><Phone size={16} /> 905 5165462</a>
            <a href="mailto:mirellascarcelli@gmail.com" className="flex items-center gap-2"><Mail size={16} /> mirellascarcelli@gmail.com</a>
            <Link to="/contact?type=appointment" className="btn-primary mt-2">Book / Request Appointment</Link>
          </div>
        </Reveal>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="mx-auto max-w-3xl rounded-xl2 bg-gradient-to-br from-blush/60 via-taupe/30 to-sage/25 px-6 py-12 text-center shadow-soft">
          <h2 className="section-heading">A Little Handmade Inspiration</h2>
          <p className="mt-2 text-brown/70">Join the FilatoCo community for new designs, collections and stories from the studio.</p>
          <form onSubmit={handleSubscribe} className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full rounded-full border border-beige bg-offwhite px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brown sm:w-72"
            />
            <button type="submit" disabled={subscribing} className="btn-primary">
              {subscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Home;
