import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Are all bags handmade?', a: 'Yes — every FilatoCo bag is handcrafted by Mirella using crochet, tapestry or sewing techniques.' },
  { q: 'Can I order a custom bag?', a: 'Absolutely. Visit our Request a Custom Bag page to share your preferences and we\'ll bring your vision to life.' },
  { q: 'How long does shipping take?', a: 'Handmade items typically ship within 5–10 business days.' },
  { q: 'What is your return policy?', a: 'Ready-made items may be returned within 14 days. Custom-made items are non-returnable unless defective.' },
  { q: 'Can I book a personal appointment?', a: 'Yes, personal appointments are available. Contact us to schedule one.' },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <>
      <Helmet><title>FAQ | FilatoCo</title></Helmet>
      <div className="mx-auto max-w-2xl px-5 py-16 md:px-8">
        <h1 className="section-heading text-center">Frequently Asked Questions</h1>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-xl2 bg-offwhite shadow-soft">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between px-5 py-4 text-left text-brown">
                <span className="font-medium">{f.q}</span>
                <ChevronDown size={18} className={`transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <p className="px-5 pb-4 text-sm text-brown/70">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
