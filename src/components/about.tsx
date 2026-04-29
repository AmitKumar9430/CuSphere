import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function About() {

  const [about, setAbout] = useState<any>(null);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchAbout();
    fetchDevelopers();
    fetchStats();
    fetchFaqs();
  }, []);

  const fetchAbout = async () => {
    const { data } = await supabase
      .from("about_content")
      .select("*")
      .single();
    setAbout(data);
  };

  const fetchDevelopers = async () => {
    const { data } = await supabase
      .from("developers")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: true });
    setDevelopers(data || []);
  };

  const fetchStats = async () => {
    const { data } = await supabase
      .from("platform_stats")
      .select("*")
      .order("priority", { ascending: true });
    setStats(data || []);
  };

  const fetchFaqs = async () => {
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: true });
    setFaqs(data || []);
  };

  if (!about) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-900 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold">{about.title}</h1>
        <p className="opacity-80 mt-2">{about.subtitle}</p>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mt-4 text-blue-200 text-sm">
          <span>Home</span>
          <span>/</span>
          <span className="text-white font-medium">About</span>
        </div>
      </div>

      {/* PLATFORM STATS */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white p-5 rounded-xl shadow text-center border-b-4 border-blue-600"
            >
              <p className="text-3xl font-bold text-blue-700">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ABOUT */}
      <div className="bg-white mt-6 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">About CuSphere</h2>
        <p className="text-gray-600">{about.description}</p>
      </div>

      {/* MISSION VISION */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-blue-50 p-6 rounded-xl">
          <h3 className="font-semibold text-lg text-blue-700">Our Mission</h3>
          <p className="text-gray-600 mt-2">{about.mission}</p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-xl">
          <h3 className="font-semibold text-lg text-indigo-700">Our Vision</h3>
          <p className="text-gray-600 mt-2">{about.vision}</p>
        </div>
      </div>

      {/* CORE VALUES */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-900 mt-6 p-6 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-4">Our Core Values</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {(about.core_values || []).map((value: any, i: number) => (
            <div key={i} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">{value.icon}</div>
              <p className="font-semibold">{value.title}</p>
              <p className="text-blue-100 text-sm mt-1">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div className="bg-white mt-6 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Platform Features</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {about.features?.map((feature: string, i: number) => (
            <div key={i} className="bg-blue-50 p-3 rounded-lg flex items-center gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {(about.how_it_works || []).map((step: any, i: number) => (
            <div key={i} className="relative">
              <div className="bg-white p-5 rounded-xl shadow text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-900 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  {i + 1}
                </div>
                <p className="font-semibold text-gray-800">{step.title}</p>
                <p className="text-gray-500 text-sm mt-1">{step.description}</p>
              </div>
              {/* Connector line (not on last) */}
              {i < (about.how_it_works?.length ?? 0) - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-blue-300 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* TECH STACK */}
      {about.tech_stack && about.tech_stack.length > 0 && (
        <div className="bg-white mt-8 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Built With</h3>
          <div className="flex flex-wrap gap-3">
            {about.tech_stack.map((tech: string, i: number) => (
              <span
                key={i}
                className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

 {/* DEVELOPERS */}
<div className="mt-8">
  <h2 className="text-2xl font-bold mb-4">Meet The Developers</h2>
  <div className="grid md:grid-cols-3 gap-6">
    {developers.map((dev) => (
      <div
        key={dev.id}
        className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
      >
        <div className="flex flex-col items-center">
          <img
            src={dev.image_url}
            className="w-24 h-24 rounded-full object-cover mb-3 ring-4 ring-blue-100"
          />
          <h3 className="font-semibold text-lg">{dev.name}</h3>
          <p className="text-blue-600 text-sm text-center">{dev.role}</p>
          {dev.bio && (
            <p className="text-gray-500 text-xs text-center mt-2 px-2 leading-relaxed">
              {dev.bio}
            </p>
          )}

          <div className="flex gap-3 mt-4">
            {dev.linkedin && dev.linkedin !== '#' && (
              <a
                href={dev.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition"
                title="LinkedIn"
              >
                🔗
              </a>
            )}
            {dev.github && dev.github !== '#' && (
              <a
                href={dev.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition"
                title="GitHub"
              >
                💻
              </a>
            )}
            {dev.email && dev.email !== '#' && (
              <a
                href={`mailto:${dev.email}`}
                className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition"
                title="Email"
              >
                ✉️
              </a>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      {/* TESTIMONIALS */}
      {about.testimonials && about.testimonials.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">What Users Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {about.testimonials.map((t: any, i: number) => (
              <div key={i} className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600">
                <p className="text-gray-600 italic">"{t.quote}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-900 flex items-center justify-center text-white text-sm font-bold">
                    {t.name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-blue-600 text-xs">{t.designation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

       {/* FAQ */}
{faqs.length > 0 && (
  <div className="bg-white mt-8 p-6 rounded-xl shadow">
    <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
    <p className="text-gray-400 text-sm mb-6">
      Everything you need to know about CuSphere.
    </p>
    <div className="divide-y divide-gray-100">
      {faqs.map((faq, i) => (
        <div key={faq.id} className="py-1">
          <button
            className="w-full flex justify-between items-center text-left py-4 group"
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              <span
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-300 flex-shrink-0
                  ${openFaq === i
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"}
                `}
              >
                {i + 1}
              </span>
              <span
                className={`font-medium transition-colors duration-200 ${
                  openFaq === i ? "text-blue-700" : "text-gray-800"
                }`}
              >
                {faq.question}
              </span>
            </div>
            <span
              className={`
                ml-4 flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center
                font-bold text-base transition-all duration-300
                ${openFaq === i
                  ? "border-blue-600 text-blue-600 rotate-45"
                  : "border-gray-300 text-gray-400 group-hover:border-blue-400 group-hover:text-blue-400"}
              `}
              style={{
                transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            >
              +
            </span>
          </button>

          {/* Animated answer */}
          <div
            style={{
              maxHeight: openFaq === i ? "300px" : "0px",
              opacity: openFaq === i ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 0.4s ease, opacity 0.3s ease",
            }}
          >
            <div className="pb-5 pl-10 pr-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Bottom CTA inside FAQ */}
    <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-900 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <p className="text-white font-semibold">Still have questions?</p>
        <p className="text-blue-200 text-sm">
          Can't find the answer you're looking for? Reach out to our team.
        </p>
      </div>
      {about.contact_email && (
        <a
          href={`mailto:${about.contact_email}`}
          className="bg-white text-blue-800 px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-50 transition whitespace-nowrap"
        >
          ✉️ Contact Us
        </a>
      )}
    </div>
  </div>
)}
      {/* SPECIAL THANKS */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-900 text-white mt-6 p-6 rounded-xl">
        <h3 className="font-semibold text-lg">Special Thanks</h3>
        <p className="opacity-90 mt-2">{about.special_thanks}</p>
      </div>

    </div>
  );
}