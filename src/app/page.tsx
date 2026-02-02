"use client";

import { useState, useRef } from "react";

const services = [
    { icon: "/images/services/general-medicine.svg", title: "General Medicine", desc: "Comprehensive healthcare for adults with expert diagnosis and treatment" },
    { icon: "/images/services/pediatrics.svg", title: "Pediatrics", desc: "Specialized care for infants, children, and adolescents" },
    { icon: "/images/services/emergency.svg", title: "Emergency Care", desc: "24/7 emergency services with rapid response team" },
    { icon: "/images/services/laboratory.svg", title: "Laboratory", desc: "State-of-the-art diagnostic testing and pathology services" },
    { icon: "/images/services/vaccination.svg", title: "Vaccination", desc: "Complete immunization programs for all age groups" },
    { icon: "/images/services/health-checkup.svg", title: "Health Checkup", desc: "Preventive health screenings and wellness programs" },
];

const doctors = [
    { name: "Dr. K.C. Gupta", role: "Founder & Chief Medical Officer", specialty: "Internal Medicine", exp: "30+ years" },
    { name: "Dr. Priya Sharma", role: "Senior Consultant", specialty: "Pediatrics", exp: "18+ years" },
    { name: "Dr. Amit Verma", role: "Consultant", specialty: "General Surgery", exp: "15+ years" },
    { name: "Dr. Sunita Patel", role: "Consultant", specialty: "Gynecology", exp: "12+ years" },
];

const testimonials = [
    { name: "Ravi Kumar", text: "Excellent care and compassionate staff. The doctors truly listen to your concerns.", rating: 5 },
    { name: "Meena Agarwal", text: "Best hospital experience in Gajraula. Clean facilities and professional treatment throughout.", rating: 5 },
    { name: "Suresh Yadav", text: "Emergency team saved my mother's life. Forever grateful to Dr. K.C. Memorial Gupta Hospital.", rating: 5 },
];

const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#doctors", label: "Doctors" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
];

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
    const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
        { role: "assistant", content: "Hello! How can I help you today?" }
    ]);
    const [chatInput, setChatInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you for your message! We will contact you soon.");
        setFormData({ name: "", email: "", phone: "", message: "" });
    };

    const sendMessage = async () => {
        if (!chatInput.trim() || isLoading) return;

        const userMessage = chatInput.trim();
        setChatInput("");
        setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    history: chatMessages
                }),
            });
            const data = await response.json();
            setChatMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        } catch {
            setChatMessages(prev => [...prev, {
                role: "assistant",
                content: "Sorry, having trouble. Please call +91 98765 43210."
            }]);
        } finally {
            setIsLoading(false);
            setTimeout(() => chatInputRef.current?.focus(), 100);
        }
    };

    const clearChat = () => {
        setChatMessages([{ role: "assistant", content: "Hello! How can I help you today?" }]);
        setChatInput("");
        chatInputRef.current?.focus();
    };

    return (
        <div className="overflow-x-hidden w-full">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
                <div className="container">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <a href="#home" className="flex items-center gap-3 group">
                            <img src="/images/logo-new.svg" alt="Logo Icon" className="h-12 w-auto group-hover:scale-110 transition-transform" />
                            <div className="flex flex-col leading-tight">
                                <span className="text-gray-900 font-bold text-lg md:text-xl tracking-tight">Dr. K.C. Memorial</span>
                                <span className="text-sky-500 font-bold text-xs md:text-sm uppercase tracking-widest">Gupta Hospital</span>
                            </div>
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-600 hover:text-sky-500 font-medium transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a href="#contact" className="btn btn-primary text-sm py-2 px-4">
                                Book Appointment
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden py-4 border-t border-gray-100">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="block py-2 text-gray-600 hover:text-sky-500"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section
                id="home"
                className="min-h-fit lg:min-h-screen flex items-start lg:items-center pt-20 pb-8 lg:py-20 relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-teal-50"
            >
                {/* Decorative Elements */}
                <div className="hidden lg:block absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-sky-200/40 to-teal-200/40 rounded-full blur-3xl" />
                <div className="hidden lg:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-teal-200/30 to-sky-200/30 rounded-full blur-3xl" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e908_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px]" />

                <div className="container relative z-10">
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                        {/* Left Content */}
                        <div className="animate-fadeInUp text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500/10 to-teal-500/10 backdrop-blur-sm text-sky-600 rounded-full text-xs md:text-sm font-semibold mb-6 border border-sky-200 shadow-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                📍 Gajraula, Uttar Pradesh
                            </span>

                            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 leading-tight">
                                <span className="text-slate-800">Dr. K.C. Memorial</span>
                                <br />
                                <span className="bg-gradient-to-r from-sky-500 via-sky-600 to-teal-500 bg-clip-text text-transparent">
                                    Gupta Hospital
                                </span>
                            </h1>

                            <p className="text-sm md:text-lg text-slate-600 mb-6 md:mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
                                Your trusted healthcare partner providing <span className="text-sky-600 font-semibold">quality care</span> with compassionate service.
                            </p>

                            <div className="flex flex-wrap gap-3 md:gap-4 justify-center lg:justify-start">
                                <a href="#contact" className="btn btn-primary text-sm md:text-base py-2.5 md:py-3 px-5 md:px-6 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all">
                                    Book Appointment
                                </a>
                                <a href="#services" className="btn bg-white text-slate-700 border-2 border-slate-200 hover:border-sky-400 hover:text-sky-600 text-sm md:text-base py-2.5 md:py-3 px-5 md:px-6 shadow-sm hover:shadow-md transition-all">
                                    Our Services →
                                </a>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-6 md:gap-8 mt-8 md:mt-10 justify-center lg:justify-start">
                                {[
                                    { value: "30+", label: "Beds", color: "text-sky-600" },
                                    { value: "24/7", label: "Emergency", color: "text-teal-600" },
                                    { value: "10+", label: "Doctors", color: "text-sky-600" },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <div className={`text-2xl md:text-4xl font-extrabold ${stat.color}`}>{stat.value}</div>
                                        <div className="text-slate-500 text-[10px] md:text-sm font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Image - Visible on all screens */}
                        <div className="relative mt-6 lg:mt-0">
                            <div className="relative z-10">
                                <img
                                    src="/images/hero.jpg"
                                    alt="Dr. K.C. Memorial Gupta Hospital"
                                    className="w-full h-auto rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl shadow-sky-200/50"
                                />
                                {/* Floating Badge - Hidden on mobile */}
                                <div className="hidden lg:block absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-sky-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-slate-800">Trusted Care</div>
                                            <div className="text-sm text-slate-500">Since 1990</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Ring - Hidden on mobile */}
                            <div className="hidden lg:block absolute -top-8 -right-8 w-full h-full border-2 border-sky-200 rounded-3xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="section bg-mesh relative overflow-hidden">
                <div className="blob -top-24 -left-24" />
                <div className="blob -bottom-24 -right-24" />
                <div className="container relative z-10">
                    <h2 className="section-title">About <span className="gradient-text">Our Hospital</span></h2>
                    <p className="section-subtitle">
                        Delivering quality healthcare to the community of Gajraula
                    </p>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="card">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <span className="text-sky-500">🎯</span> Our Mission
                                </h3>
                                <p className="text-gray-600">
                                    To provide accessible, affordable, and quality healthcare to every patient
                                    in Gajraula and surrounding areas with compassion and respect.
                                </p>
                            </div>
                            <div className="card">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <span className="text-teal-500">⚡</span> Advanced Facilities
                                </h3>
                                <p className="text-gray-600">
                                    Equipped with 30 beds and state-of-the-art technology, we ensure
                                    a comfortable and efficient patient experience with streamlined processes.
                                </p>
                            </div>
                            <div className="card">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Efficient Care
                                </h3>
                                <p className="text-gray-600">
                                    Benefit from our efficient admissions process, swift discharges,
                                    and predictable hospital stays averaging 5 days for non-surgical procedures.
                                </p>
                            </div>
                        </div>

                        <div className="relative mt-8 md:mt-0">
                            <div className="rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="/images/About.PNG"
                                    alt="Dr. K.C. Memorial Gupta Hospital Facility"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-white p-3 md:p-4 rounded-xl shadow-xl border border-sky-100">
                                <div className="text-xl md:text-3xl font-bold text-sky-500">24/7</div>
                                <div className="text-xs md:text-sm text-gray-500">Emergency Care</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="section bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
                <div className="container relative z-10">
                    <h2 className="section-title">Our <span className="gradient-text">Services</span></h2>
                    <p className="section-subtitle">
                        Comprehensive healthcare solutions under one roof
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div key={service.title} className="card group hover:border-sky-200">
                                <div className="mb-4 bg-sky-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <img src={service.icon} alt={service.title} className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                <p className="text-gray-600">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Doctors Section */}
            <section id="doctors" className="section bg-white relative">
                <div className="blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
                <div className="container relative z-10">
                    <h2 className="section-title">Meet Our <span className="gradient-text">Experts</span></h2>
                    <p className="section-subtitle">
                        Experienced and compassionate medical professionals
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {doctors.map((doc) => (
                            <div key={doc.name} className="card text-center group">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-sky-100 to-teal-100 rounded-full flex items-center justify-center text-4xl group-hover:scale-105 transition-transform border-4 border-white shadow-lg">
                                    👨‍⚕️
                                </div>
                                <h3 className="font-bold text-lg">{doc.name}</h3>
                                <p className="text-sky-500 text-sm font-medium">{doc.role}</p>
                                <p className="text-gray-500 text-sm mt-1">{doc.specialty}</p>
                                <div className="mt-3 inline-block px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-medium">
                                    {doc.exp}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="section bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 to-teal-900/20" />
                <div className="container relative z-10">
                    <h2 className="section-title !text-white">Patient <span className="text-sky-400">Testimonials</span></h2>
                    <p className="section-subtitle !text-gray-400">
                        What our patients say about us
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className="text-yellow-400 mb-4 text-xl">
                                    {"★".repeat(t.rating)}
                                </div>
                                <p className="text-gray-300 italic mb-6 text-lg">&quot;{t.text}&quot;</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-sky-400/20 to-teal-400/20 rounded-full flex items-center justify-center border border-white/10 text-xl shadow-inner">😊</div>
                                    <div>
                                        <div className="font-bold text-white">{t.name}</div>
                                        <div className="text-sky-400 text-xs font-medium uppercase tracking-wider">Verified Patient</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="section bg-slate-50 relative overflow-hidden">
                <div className="blob -bottom-48 -left-48 opacity-30" />
                <div className="container relative z-10">
                    <h2 className="section-title">Get in <span className="gradient-text">Touch</span></h2>
                    <p className="section-subtitle">
                        Book an appointment or reach out to us
                    </p>

                    <div className="grid lg:grid-cols-2 gap-12 items-stretch">
                        <div className="flex flex-col gap-4">
                            {/* Compact Contact Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="card !p-4 flex items-center gap-3">
                                    <div className="text-xl">📍</div>
                                    <div>
                                        <h4 className="font-bold text-sm">Address</h4>
                                        <p className="text-gray-600 text-sm">Gajraula, UP, India</p>
                                    </div>
                                </div>
                                <div className="card !p-4 flex items-center gap-3">
                                    <div className="text-xl">📞</div>
                                    <div>
                                        <h4 className="font-bold text-sm">Phone</h4>
                                        <p className="text-gray-600 text-sm">+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="card !p-4 flex items-center gap-3">
                                    <div className="text-xl">🕐</div>
                                    <div>
                                        <h4 className="font-bold text-sm">Hours</h4>
                                        <p className="text-gray-600 text-sm">24/7 Emergency</p>
                                    </div>
                                </div>
                            </div>

                            {/* Google Maps */}
                            <div className="rounded-xl overflow-hidden shadow-lg">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3495.0514709444474!2d78.24542717496443!3d28.837327574752216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390b745f63322039%3A0xfbdbb91dd6592f86!2sDr%20K%20C%20Memorial%20Gupta%20Hospital!5e0!3m2!1sen!2sin!4v1770034905288!5m2!1sen!2sin"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Dr K.C. Memorial Gupta Hospital Location"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="card flex flex-col gap-4 h-full">
                            <h3 className="text-xl font-bold">Book Appointment</h3>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:border-sky-500 focus:outline-none transition-colors"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:border-sky-500 focus:outline-none transition-colors"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:border-sky-500 focus:outline-none transition-colors"
                                required
                            />
                            <textarea
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:border-sky-500 focus:outline-none transition-colors resize-none flex-1 min-h-[100px]"
                            />
                            <button type="submit" className="btn btn-primary w-full">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-white py-12 md:py-16 relative overflow-hidden border-t border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
                <div className="container relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center sm:text-left">
                        <div className="sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
                                <img src="/images/logo-new.svg" alt="Logo Icon" className="h-10 w-auto" />
                                <div className="flex flex-col leading-tight">
                                    <span className="text-white font-bold text-lg tracking-tight">Dr. K.C. Memorial</span>
                                    <span className="text-sky-400 font-bold text-xs uppercase tracking-widest">Gupta Hospital</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto sm:mx-0">
                                Your trusted healthcare partner in Gajraula, Uttar Pradesh. Quality care, compassionate service.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <div className="space-y-2 text-sm text-gray-400">
                                {navLinks.map((link) => (
                                    <a key={link.href} href={link.href} className="block hover:text-white transition-colors">
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Services</h4>
                            <div className="space-y-2 text-sm text-gray-400">
                                {services.slice(0, 4).map((s) => (
                                    <div key={s.title}>{s.title}</div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Follow Us</h4>
                            <div className="flex gap-4 justify-center sm:justify-start">
                                <a
                                    href="https://www.facebook.com/p/Gupta-Hospital-Multispeciality-Unit-100064067912047/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-6 md:pt-8 text-center text-xs md:text-sm text-gray-400">
                        © {new Date().getFullYear()} Dr. K.C. Memorial Gupta Hospital. All rights reserved.
                    </div>
                </div>
            </footer>

            {/* Chatbot Popup */}
            {isChatOpen && (
                <div className="fixed bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-80 md:w-96 bg-white rounded-2xl shadow-2xl z-[9998] overflow-hidden animate-fadeInUp max-h-[90vh] flex flex-col">
                    <div className="bg-sky-500 p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Health Assistant</h4>
                                <p className="text-[10px] opacity-80">Online | Dr. K.C. Memorial</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 rounded-full p-1 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 min-h-[350px] max-h-[70vh] p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
                        {chatMessages.map((msg, i) => (
                            <div key={i} className={`p-3 rounded-2xl shadow-sm max-w-[85%] text-sm ${msg.role === "user"
                                ? "bg-sky-100 text-sky-800 ml-auto rounded-tr-none"
                                : "bg-white text-gray-700 rounded-tl-none"
                                }`}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-sm text-gray-500">
                                <span className="animate-pulse">Typing...</span>
                            </div>
                        )}

                        {/* Quick Suggestions - show only when not loading and few messages */}
                        {!isLoading && chatMessages.length <= 3 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {[
                                    "OPD Timings",
                                    "Emergency",
                                    "Location",
                                    "Doctors",
                                    "Services",
                                    "Book Appointment"
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => {
                                            setChatInput(suggestion);
                                            setTimeout(() => {
                                                setChatMessages(prev => [...prev, { role: "user", content: suggestion }]);
                                                setChatInput("");
                                                setIsLoading(true);
                                                fetch("/api/chat", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ message: suggestion, history: chatMessages }),
                                                })
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        setChatMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
                                                    })
                                                    .catch(() => {
                                                        setChatMessages(prev => [...prev, { role: "assistant", content: "Please call +91 98765 43210." }]);
                                                    })
                                                    .finally(() => {
                                                        setIsLoading(false);
                                                        chatInputRef.current?.focus();
                                                    });
                                            }, 100);
                                        }}
                                        className="px-3 py-1.5 text-xs bg-white border border-sky-200 text-sky-600 rounded-full hover:bg-sky-50 hover:border-sky-400 transition-all shadow-sm"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-white border-t flex items-center gap-2">
                        {chatMessages.length > 1 && (
                            <button
                                type="button"
                                onClick={clearChat}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Clear chat"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                        <input
                            ref={chatInputRef}
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type your message..."
                            className="flex-1 text-sm border-none focus:ring-0 outline-none bg-transparent"
                            disabled={isLoading}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={sendMessage}
                            disabled={isLoading || !chatInput.trim()}
                            className="text-sky-500 hover:scale-110 transition-transform disabled:opacity-50 p-1"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Icons Container */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col gap-3">
                {/* Chatbot Toggle Icon */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsChatOpen(prev => !prev);
                    }}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${isChatOpen ? 'bg-gray-800 rotate-90' : 'bg-sky-500 hover:scale-110'}`}
                    aria-label="Chat with Assistant"
                    style={{ pointerEvents: 'auto' }}
                >
                    {isChatOpen ? (
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    )}
                </button>

                {/* WhatsApp Floating Icon */}
                {!isChatOpen && (
                    <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                        aria-label="Chat on WhatsApp"
                    >
                        <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                    </a>
                )}
            </div>
        </div>
    );
}
