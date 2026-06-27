import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          reply_to: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We will get back to you soon.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast({
        title: 'Failed to send message',
        description: 'Please try again or email us directly at pnyanyo@gmail.com',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full border border-primary-foreground" />
        </div>
        <div className="heritage-container relative">
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

                  <button
                    type="submit" disabled={isSubmitting}
                    className="w-full btn-heritage disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </span>
                    )}
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
