import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { usePageMeta } from '@/hooks/use-page-meta';
import { useEvents, getEventStatus, FALLBACK_EVENT } from '@/hooks/use-events';
import contactBanner from '../assets/Contact banner.jpg';

const WHATSAPP_NUMBER = '31620336237'; // +31 6 20336237, in wa.me format (no + or spaces)

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={className}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39c1.45.79 3.08 1.21 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.85 14.11c-.25.7-1.25 1.29-2.03 1.45-.54.12-1.25.21-3.63-.78-3.05-1.26-5.01-4.36-5.16-4.56-.15-.2-1.23-1.64-1.23-3.13s.77-2.22 1.05-2.52c.25-.28.55-.35.73-.35h.53c.17 0 .4-.03.62.48.25.6.85 2.08.92 2.23.07.15.12.33.02.53-.09.2-.14.33-.28.5-.14.17-.29.39-.42.52-.14.14-.28.29-.13.57.15.28.68 1.13 1.47 1.84 1.01.91 1.87 1.19 2.15 1.32.28.14.44.12.6-.07.17-.19.72-.83.91-1.11.19-.28.38-.24.63-.14.26.09 1.64.78 1.92.92.28.14.46.21.53.33.07.12.07.68-.18 1.38z" />
  </svg>
);

const staticContactInfo = [
  {
    icon: Mail,
    title: 'Email',
    details: 'pnyanyo@gmail.com',
    link: 'mailto:pnyanyo@gmail.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    details: '+31 6 20336237',
    link: 'tel:+31620336237',
  },
  {
    icon: Clock,
    title: 'Meeting Days',
    details: 'Community events held monthly',
  },
];

const Contact = () => {
  usePageMeta({
    title: 'Contact Us',
    description: "Have questions about the GaDangme Union or want to get involved? We'd love to hear from you.",
  });

  const { events } = useEvents();
  const upcomingEvent = events.find((e) => getEventStatus(e.start_date, e.end_date) === 'upcoming');
  const locationText = upcomingEvent?.location || FALLBACK_EVENT.location || 'The Netherlands';

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Location',
      details: locationText,
      link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`,
      external: true,
    },
    ...staticContactInfo,
  ];

  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'A few details are missing',
        description: 'Please fill in your name, email, and message before sending.',
        variant: 'destructive',
      });
      return;
    }

    const subject = formData.subject || `Message from ${formData.name}`;
    const text =
      `New message from ${formData.name} (${formData.email})\n` +
      `Subject: ${subject}\n\n${formData.message}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    toast({
      title: 'Opening WhatsApp…',
      description: 'Your message is pre-filled — just hit send in WhatsApp.',
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Layout>
      {/* Hero: full-bleed photo banner */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={contactBanner}
            alt="GaDangme Union members with the 2018 union calendar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark/95 via-heritage-dark/50 to-primary/30" />
        </div>

        <div className="relative heritage-container pb-16 md:pb-20 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 mb-4 bg-secondary/20 text-secondary rounded-full font-body text-sm border border-secondary/30">
              Get In Touch
            </span>
            <h1 className="heritage-heading text-primary-foreground mb-6 text-4xl md:text-6xl">
              Contact Us
            </h1>
            <p className="heritage-text text-primary-foreground/85 text-lg max-w-2xl">
              Have questions about the GaDangme Union or want to get involved?
              We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="heritage-section bg-background">
        <div className="heritage-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info - 2 cols */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <h2 className="heritage-subheading text-foreground mb-8">Reach Out</h2>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4 group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-subheading text-base font-semibold text-foreground mb-0.5">
                        {item.title}
                      </h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.details}
                        </a>
                      ) : (
                        <p className="font-body text-sm text-muted-foreground">{item.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* About Box */}
              <div className="mt-10 p-6 bg-heritage-warm rounded-2xl border border-border">
                <h3 className="font-subheading text-lg font-semibold text-foreground mb-3">
                  About GaDangme Union
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  Founded on January 19, 2012, the GaDangme Union in The Netherlands
                  unites and supports the GaDangme community in the diaspora through
                  cultural events, community engagement, and heritage preservation.
                </p>
                <p className="font-subheading text-sm italic text-primary leading-relaxed">
                  "Kwɛ Bɔ Ni Ehi, Kwɛ Bɔ Ni Eyɔɔ Fɛo!<br />
                  Ashiii Gɔŋti Aŋmɔɔɔ Kpɔ"
                </p>
              </div>
            </motion.div>

            {/* Contact Form - 3 cols */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-card p-8 md:p-10 rounded-2xl shadow-elevated border border-border">
                <h2 className="heritage-subheading text-foreground mb-2">
                  Send Us a Message
                </h2>
                <p className="font-body text-sm text-muted-foreground mb-8">
                  Fill in the form below and we'll get back to you as soon as possible.
                </p>
                <form onSubmit={handleWhatsApp} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block font-body text-sm font-medium text-foreground mb-2">
                        Your Name
                      </label>
                      <input
                        type="text" id="name" name="name"
                        value={formData.name} onChange={handleChange} required
                        className="input-heritage" placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block font-body text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        type="email" id="email" name="email"
                        value={formData.email} onChange={handleChange} required
                        className="input-heritage" placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block font-body text-sm font-medium text-foreground mb-2">
                      Subject
                    </label>
                    <input
                      type="text" id="subject" name="subject"
                      value={formData.subject} onChange={handleChange} required
                      className="input-heritage" placeholder="What is this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-body text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      id="message" name="message"
                      value={formData.message} onChange={handleChange} required
                      rows={5} className="input-heritage resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-base inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-[#25D366] text-white font-body font-semibold tracking-wide transition-all duration-300 ease-out hover:bg-[#1fbd5a] hover:shadow-elevated hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <WhatsAppIcon />
                      Send via WhatsApp
                    </span>
                  </button>

                  <p className="text-center font-body text-sm text-muted-foreground">
                    Or email us at{' '}
                    <a href="mailto:pnyanyo@gmail.com" className="text-primary font-semibold hover:underline">
                      pnyanyo@gmail.com
                    </a>
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
