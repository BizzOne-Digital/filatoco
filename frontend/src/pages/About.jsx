import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import api from '../services/api';
import Reveal from '../components/Reveal';

const About = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.get('/settings/homepage').then(({ data }) => setContent(data.content));
  }, []);

  return (
    <>
      <Helmet><title>About Us | FilatoCo</title></Helmet>
      <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
        <Reveal className="text-center">
          <span className="label-eyebrow">About FilatoCo</span>
          <h1 className="section-heading mt-2">Meet Mirella</h1>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 grid items-center gap-10 md:grid-cols-2">
          <div className="aspect-[4/5] overflow-hidden rounded-xl2 bg-beige">
            <img src="/about.jpg" alt="Mirella, Founder of FilatoCo" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-4 text-brown/70">
            <h2 className="font-serif text-2xl text-brown">Where FilatoCo Began</h2>
            <p>FilatoCo was born out of a need to find peace within.</p>
            <p>I was raised in a family where tailoring was key, and I learned to crochet and sew at a young age.</p>
            <p>When I retired from my teaching career, I naturally gravitated towards the comfort of handmade creativity.</p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 grid items-center gap-10 md:grid-cols-2">
          <div className="order-2 space-y-4 text-brown/70 md:order-1">
            <h2 className="font-serif text-2xl text-brown">From Teaching to Handmade Creativity</h2>
            <p>Whether I crochet or sew, I enjoy pouring passion into every stitch. Today I dedicate myself to crafting one-of-a-kind purses that resonate with the diverse and vibrant individuals who carry them.</p>
            <h2 className="pt-2 font-serif text-2xl text-brown">Creating Peace Through Craft</h2>
            <p>Every FilatoCo piece is created with care, intention and the belief that handmade fashion should tell a story.</p>
          </div>
          <div className="order-1 aspect-[4/5] overflow-hidden rounded-xl2 bg-beige md:order-2">
            <img src="/about2.jpg" alt="Mirella in her studio" className="h-full w-full object-cover" />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 grid items-center gap-10 md:grid-cols-2">
          <div className="aspect-[4/5] overflow-hidden rounded-xl2 bg-beige">
            <img src="/about3.jpg" alt="Mirella crafting a FilatoCo bag" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-4 text-brown/70">
            <h2 className="font-serif text-2xl text-brown">One-of-a-Kind Designs</h2>
            <p>Made for Individual Expression — every FilatoCo bag is designed for women who want something different, a piece that carries meaning, not just style.</p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 rounded-xl2 bg-beige p-10 text-center">
          <h2 className="font-serif text-2xl text-brown">Handmade Is More Than a Bag — It's a Story</h2>
          <p className="mx-auto mt-3 max-w-2xl text-brown/70">
            Every FilatoCo piece is created with care, intention and belief — designed for the women who carry it, not
            the crowd that follows trends.
          </p>
          <p className="mt-6 font-hand text-3xl text-terracotta">Mirella, Founder</p>
        </Reveal>
      </div>
    </>
  );
};

export default About;
