import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import contactBanner from '../assets/Contact banner.jpg';

const CONTACT_EMAIL = 'pnyanyo@gmail.com';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Location',
    details: 'The Netherlands',
  },
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
  },
  {
    icon: Clock,
    title: 'Meeting Days',
    details: 'Community events held monthly',
  },
];

const Contact = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = formData.subject || `Message from ${formData.name}`;
    const body = `${formData.message}\n\n— ${formData.name} (${formData.email})`;
    const gmailComposeUrl =
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}` +
      `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');

    toast({
      title: 'Opening Gmail…',
      description: 'A prefilled message has opened in a new tab — just hit send.',
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
                      <h3 className="font-heading text-base font-semibold text-foreground mb-0.5">
                        {item.title}
                      </h3>
                      {item.link ? (
                        <a href={item.link} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
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
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                  About GaDangme Union
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  Founded on January 19, 2012, the GaDangme Union in The Netherlands
                  unites and supports the GaDangme community in the diaspora through
                  cultural events, community engagement, and heritage preservation.
                </p>
                <p className="font-heading text-sm italic text-primary">
                  "Ashiii Gɔnti sɛɛ aŋmɔɔ kpɔ"
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
                <form onSubmit={handleSubmit} className="space-y-5">
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

                  <button type="submit" className="w-full btn-heritage text-base">
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </span>
                  </button>
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
