"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { services, doctors, galleryPhotos, testimonials, navLinks } from "@/lib/data";

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
    const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
        { role: "assistant", content: "Hello! How can I help you today?" }
    ]);
    const [chatInput, setChatInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const chatInputRef = useRef<HTMLInputElement>(null);

    // Auto-open chatbot after 2.5s with a beep — only once per session
    useEffect(() => {
        if (sessionStorage.getItem("chatAutoOpened")) return;
        const timer = setTimeout(() => {
            // Play a pleasant two-tone beep via Web Audio API
            try {
                const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
                const playTone = (freq: number, start: number, duration: number, vol: number) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
                    gain.gain.setValueAtTime(0, ctx.currentTime + start);
                    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
                    osc.start(ctx.currentTime + start);
                    osc.stop(ctx.currentTime + start + duration);
                };
                playTone(880, 0, 0.18, 0.3);   // high A
                playTone(1100, 0.2, 0.22, 0.25); // higher C#
            } catch { /* silently ignore if audio is blocked */ }

            setIsChatOpen(true);
            sessionStorage.setItem("chatAutoOpened", "1");
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormStatus(null);
        
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        
        setFormStatus({ type: 'success', message: "Appointment request sent! We'll call you shortly." });
        setFormData({ name: "", email: "", phone: "", message: "" });
        setIsSubmitting(false);
        
        setTimeout(() => setFormStatus(null), 5000);
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
                content: "Sorry, having trouble. Please call +91 90390 67378."
            }]);
        } finally {
            setIsLoading(false);
            setTimeout(() => chatInputRef.current?.focus(), 100);
        }
    };

    const [selectedPhoto, setSelectedPhoto] = useState<{ src: string, label: string } | null>(null);
    const [activeSection, setActiveSection] = useState("home");
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Scroll Progress
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            setScrollProgress(windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0);

            // Active Section Tracking
            const sections = navLinks.map(link => link.href.substring(1));
            const currentSection = sections.find(section => {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    return rect.top <= 150 && rect.bottom >= 150;
                }
                return false;
            });
            if (currentSection) setActiveSection(currentSection);
            
            // Scroll Top Button visibility
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const clearChat = () => {
        setChatMessages([{ role: "assistant", content: "Hello! How can I help you today?" }]);
        setChatInput("");
        chatInputRef.current?.focus();
    };

    return (
        <div className="overflow-x-hidden w-full min-h-screen bg-white">
            {/* Top Scroll Progress Bar */}
            <div 
                className="fixed top-0 left-0 h-1 bg-gradient-to-r from-sky-400 to-teal-400 z-[100] transition-all duration-300" 
                style={{ width: `${scrollProgress}%` }}
            />
            
            <header>
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
                {/* Full-width row — logos touch the edges, menu fills the middle */}
                <div className="flex items-center h-20 md:h-24 w-full px-3 md:px-4">
                    {/* Logo Left — flush to left edge */}
                    <a href="#home" className="flex items-center gap-2 lg:gap-3 group shrink-0">
                        <Image src="/images/logo-1.png" alt="Hospital Logo Left" width={60} height={60} className="h-12 md:h-16 w-auto object-contain group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col justify-center text-left">
                            <span className="text-gray-500 font-bold text-[11px] md:text-sm uppercase tracking-widest leading-none mb-0.5">Dr. K.C. Memorial</span>
                            <span className="text-sky-600 font-black text-2xl md:text-3xl tracking-tighter leading-none whitespace-nowrap">Gupta Hospital</span>
                        </div>
                    </a>

                    {/* Desktop Menu — fills middle space */}
                    <div className="hidden lg:flex items-center justify-end flex-1 gap-4 xl:gap-5 text-base lg:text-[15px] xl:text-base font-semibold px-6 overflow-hidden">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`transition-all duration-300 whitespace-nowrap relative py-1 hover:text-sky-500 ${activeSection === link.href.substring(1) ? 'text-sky-600 font-bold' : 'text-slate-600 font-semibold'}`}
                            >
                                {link.label}
                                {activeSection === link.href.substring(1) && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500 rounded-full animate-fadeIn" />
                                )}
                            </a>
                        ))}
                        <a href="#contact" className="btn btn-primary text-sm py-2 px-5 whitespace-nowrap shrink-0 shadow-md hover:shadow-lg transition-all ml-1 group">
                            Book Appointment
                            <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>



                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 ml-auto"
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
                    <div className="lg:hidden py-4 border-t border-gray-100 flex flex-col gap-2 px-4 bg-white/95 backdrop-blur-md animate-fadeIn">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="block py-2 text-gray-600 hover:text-sky-500 font-medium transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="pt-2 mt-2 border-t border-gray-50">
                            <a
                                href="#contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className="btn btn-primary w-full justify-center text-sm py-2.5"
                            >
                                Book Appointment
                            </a>
                        </div>
                    </div>
                )}
            </nav>
            </header>

            <main id="main-content">

            {/* Hero Section */}
            <section
                id="home"
                className="min-h-fit lg:min-h-screen flex items-start lg:items-center pt-28 md:pt-32 pb-8 lg:pb-20 relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-teal-50"
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

                            <h1 className="mb-4 md:mb-6 leading-tight flex flex-col gap-1 md:gap-2">
                                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-700">Dr. K.C. Memorial</span>
                                <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-sky-500 via-sky-600 to-teal-500 bg-clip-text text-transparent">
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
                                <Image
                                    src="/images/hero.jpg"
                                    alt="Dr. K.C. Memorial Gupta Hospital"
                                    width={600}
                                    height={400}
                                    priority
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
                                            <div className="text-sm text-slate-500">Since 2012</div>
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
                    <h2 className="section-title">About <span className="gradient-text">Hospital</span></h2>
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
                                <Image
                                    src="/images/About.PNG"
                                    alt="Dr. K.C. Memorial Gupta Hospital Facility"
                                    width={600}
                                    height={400}
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
                            <div key={service.title} className="card group hover:border-sky-200 overflow-hidden !p-0 flex flex-col">
                                {service.image ? (
                                    <div className="relative w-full h-48 overflow-hidden">
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    </div>
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center text-6xl border-b border-gray-100">
                                        🏥
                                    </div>
                                )}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                    <p className="text-gray-600 text-sm flex-1">{service.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rooms Section */}
            <section id="rooms" className="section bg-white relative overflow-hidden">
                <div className="blob top-0 right-0 opacity-20" />
                <div className="container relative z-10">
                    <h2 className="section-title">Our <span className="gradient-text">Rooms & Wards</span></h2>
                    <p className="section-subtitle">
                        Comfortable and well-equipped accommodation options for our patients
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "General Ward", desc: "Spacious and well-ventilated wards with continuous monitoring and dedicated nursing staff.", icon: "🏥", image: "/images/general-ward.jpg", features: ["24/7 Nursing", "Ventilated", "Affordable Care"] },
                            { name: "Private Ward", desc: "Comfortable private rooms available with AC and Non-AC options for patient privacy.", icon: "🛏️", image: "/images/private-room.jpg", features: ["AC / Non-AC", "Attendant Bed", "Attached Bath"] },
                            { name: "Deluxe Room", desc: "Premium rooms equipped with modern amenities, TV, and a relaxing environment.", icon: "🌟", image: "/images/deluxe-room.jpg", features: ["Fully AC", "TV & WiFi", "Premium Care"] },
                            { name: "ICU", desc: "State-of-the-art Intensive Care Unit with advanced life support systems.", icon: "❤️‍🩹", image: "/images/icu.jpg", features: ["Advanced Monitors", "1:1 Nursing Care", "Life Support"] },
                        ].map((room) => (
                            <div key={room.name} className="card group hover:-translate-y-2 transition-transform duration-300 border border-gray-100 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100 flex flex-col bg-white !p-0 overflow-hidden">
                                <div className="relative w-full h-48 overflow-hidden">
                                    <Image
                                        src={room.image}
                                        alt={room.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100 text-xl">
                                        {room.icon}
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-3">{room.name}</h3>
                                    <p className="text-gray-600 text-sm mb-5 flex-1">{room.desc}</p>
                                    <ul className="space-y-2 mt-auto pt-4 border-t border-gray-50">
                                        {room.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                                <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center text-xs">✓</span> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Doctors Section */}
            <section id="doctors" className="section bg-slate-50 relative">
                <div className="blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
                <div className="container relative z-10">
                    <h2 className="section-title">Meet Our <span className="gradient-text">Experts</span></h2>
                    <p className="section-subtitle">
                        Experienced and compassionate medical professionals
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                        {doctors.map((doc) => (
                            <div key={doc.name} className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                                {/* Card Header */}
                                <div className="bg-gradient-to-br from-sky-50 via-white to-teal-50 px-6 pt-6 pb-4 flex flex-col items-center border-b border-gray-100">
                                    <div className="w-20 h-20 bg-gradient-to-br from-sky-100 to-teal-100 rounded-full flex items-center justify-center text-3xl border-4 border-white shadow-lg mb-3">
                                        👨‍⚕️
                                    </div>
                                    {doc.tag ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[11px] font-bold rounded-full shadow-sm mb-2">
                                            👑 {doc.tag}
                                        </span>
                                    ) : (
                                        <div className="mb-2 h-5" />
                                    )}
                                    <h3 className="font-bold text-base text-slate-800 text-center leading-snug">{doc.name}</h3>
                                    {doc.credentials ? (
                                        <p className="text-slate-500 text-[11px] mt-1 text-center leading-relaxed">{doc.credentials.join(" • ")}</p>
                                    ) : (
                                        <div className="mt-1 h-4" />
                                    )}
                                </div>
                                {/* Card Body */}
                                <div className="px-5 py-4 flex flex-col flex-1 gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0"></span>
                                        <p className="text-sky-600 text-sm font-semibold">{doc.role}</p>
                                    </div>
                                    {doc.specialty && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-red-400 text-xs mt-0.5 flex-shrink-0">★</span>
                                            <p className="text-slate-700 text-xs leading-snug">{doc.specialty}</p>
                                        </div>
                                    )}
                                    {doc.memberOf && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-teal-500 text-xs mt-0.5 flex-shrink-0">🌐</span>
                                            <p className="text-slate-600 text-xs italic leading-snug">{doc.memberOf}</p>
                                        </div>
                                    )}
                                    {doc.formerlyAt && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-slate-400 text-xs mt-0.5 flex-shrink-0">🏥</span>
                                            <p className="text-slate-500 text-[11px] italic leading-snug">{doc.formerlyAt}</p>
                                        </div>
                                    )}
                                    {/* Spacer to push exp badge to bottom */}
                                    <div className="flex-1" />
                                    {doc.exp ? (
                                        <div className="pt-3 border-t border-gray-100">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-semibold border border-sky-100">
                                                ⏱️ {doc.exp} Experience
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="pt-3 border-t border-gray-100">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-xs font-medium border border-slate-100">
                                                Founder
                                            </span>
                                        </div>
                                    )}
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

            {/* Gallery Section */}
            <section id="gallery" className="section bg-slate-50 relative overflow-hidden">
                <div className="blob -top-24 -right-24 opacity-20" />
                <div className="container relative z-10">
                    <h2 className="section-title">Hospital <span className="gradient-text">Gallery</span></h2>
                    <p className="section-subtitle">
                        A glimpse into our facilities, wards, and care environment
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {galleryPhotos.map((photo, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedPhoto(photo)}
                                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-gray-100 cursor-zoom-in"
                                style={{ aspectRatio: "4/3" }}
                            >
                                <Image
                                    src={photo.src}
                                    alt={photo.label}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                />
                                {/* Label overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white text-base font-bold drop-shadow-md">{photo.label}</span>
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gallery Lightbox Modal */}
                {selectedPhoto && (
                    <div 
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-fadeIn"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <button 
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 p-3 rounded-full"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <div 
                            className="relative max-w-5xl w-full h-[80vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedPhoto.src}
                                alt={selectedPhoto.label}
                                fill
                                className="object-contain"
                                priority
                            />
                            <div className="absolute -bottom-12 left-0 right-0 text-center">
                                <h3 className="text-white text-xl font-bold">{selectedPhoto.label}</h3>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* TPA Helpdesk Section */}
            <section id="tpa" className="section bg-gradient-to-br from-sky-600 to-teal-600 py-14 md:py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff80_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
                <div className="blob absolute -top-20 -left-20 opacity-20" />
                <div className="container relative z-10 space-y-10">

                    {/* Header */}
                    <div className="text-center text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-5">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Insurance &amp; TPA Services
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">Cashless Treatment Available</h2>
                        <p className="text-sky-100 text-base md:text-xl max-w-2xl mx-auto">
                            We are empaneled with major health insurance companies and TPAs. Our dedicated helpdesk ensures a smooth, hassle-free cashless hospitalization experience.
                        </p>
                    </div>

                    {/* Ayushman Bharat Card - Government Scheme */}
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-300/50 flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0 w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-5xl shadow-inner">
                            🏛️
                        </div>
                        <div className="text-white text-center md:text-left flex-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/25 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                                🇮🇳 Government Scheme
                            </div>
                            <h3 className="text-2xl md:text-3xl font-extrabold mb-1">Ayushman Bharat – PMJAY</h3>
                            <p className="text-amber-100 text-sm md:text-base max-w-lg">
                                We are an <strong>empaneled hospital</strong> under the Pradhan Mantri Jan Arogya Yojana (PM-JAY). Eligible families can avail up to <strong>₹5 Lakh</strong> per year in free healthcare coverage for secondary and tertiary treatments.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full text-xs font-semibold">✅ Up to ₹5 Lakh/year</span>
                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full text-xs font-semibold">✅ 100% Cashless</span>
                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full text-xs font-semibold">✅ No Premium to Pay</span>
                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full text-xs font-semibold">✅ 1500+ Treatments Covered</span>
                            </div>
                        </div>
                    </div>

                    {/* Insurance Partners */}
                    <div>
                        <h3 className="text-white text-xl md:text-2xl font-bold text-center mb-6">Our Empaneled Insurance Partners</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { 
                                    name: "Star Health", 
                                    logo: (
                                        <svg viewBox="0 0 100 30" className="h-full w-auto">
                                            <path d="M15 5l1.5 4h4l-3 2.5 1.2 4.5-3.7-3-3.7 3 1.2-4.5-3-2.5h4z" fill="#004A95"/>
                                            <text x="35" y="20" fontFamily="Arial" fontWeight="900" fontSize="12" fill="#004A95">STAR</text>
                                            <text x="35" y="27" fontFamily="Arial" fontSize="5" fill="#004A95">HEALTH INSURANCE</text>
                                        </svg>
                                    ),
                                    color: "from-blue-50 to-blue-100", 
                                    border: "border-blue-200" 
                                },
                                { 
                                    name: "HDFC Ergo", 
                                    logo: (
                                        <svg viewBox="0 0 100 30" className="h-full w-auto">
                                            <rect width="100" height="30" rx="4" fill="#ED1C24"/>
                                            <text x="50" y="19" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="11" fill="white">HDFC ERGO</text>
                                        </svg>
                                    ),
                                    color: "from-red-50 to-red-100", 
                                    border: "border-red-200" 
                                },
                                { 
                                    name: "New India Assurance", 
                                    logo: (
                                        <svg viewBox="0 0 100 30" className="h-full w-auto">
                                            <circle cx="15" cy="15" r="12" fill="#003580"/>
                                            <text x="15" y="18" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="8" fill="white">NIA</text>
                                            <text x="32" y="15" fontFamily="Arial" fontWeight="bold" fontSize="7" fill="#003580">NEW INDIA</text>
                                            <text x="32" y="22" fontFamily="Arial" fontSize="5" fill="#003580">ASSURANCE</text>
                                        </svg>
                                    ),
                                    color: "from-blue-50 to-indigo-100", 
                                    border: "border-blue-200" 
                                },
                                { 
                                    name: "United India", 
                                    logo: (
                                        <svg viewBox="0 0 100 30" className="h-full w-auto">
                                            <path d="M10 5l10 10-10 10" stroke="#F58220" strokeWidth="4" fill="none"/>
                                            <path d="M20 5l10 10-10 10" stroke="#0054A6" strokeWidth="4" fill="none"/>
                                            <text x="35" y="19" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="#0054A6">UNITED INDIA</text>
                                        </svg>
                                    ),
                                    color: "from-orange-50 to-blue-50", 
                                    border: "border-orange-200" 
                                },
                                { 
                                    name: "National Insurance", 
                                    logo: (
                                        <svg viewBox="0 0 100 30" className="h-full w-auto">
                                            <circle cx="15" cy="15" r="10" stroke="#0054A6" strokeWidth="2" fill="none"/>
                                            <rect x="12" y="10" width="6" height="10" fill="#ED1C24"/>
                                            <text x="30" y="19" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="#0054A6">NATIONAL INSURANCE</text>
                                        </svg>
                                    ),
                                    color: "from-gray-50 to-blue-50", 
                                    border: "border-gray-200" 
                                },
                                { 
                                    name: "Oriental Insurance", 
                                    logo: (
                                        <svg viewBox="0 0 100 30" className="h-full w-auto">
                                            <path d="M5 15h20M15 5v20" stroke="#003580" strokeWidth="2"/>
                                            <circle cx="15" cy="15" r="12" stroke="#003580" strokeWidth="1" fill="none"/>
                                            <text x="32" y="19" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="#003580">ORIENTAL INSURANCE</text>
                                        </svg>
                                    ),
                                    color: "from-teal-50 to-blue-100", 
                                    border: "border-blue-200" 
                                },
                            ].map((partner) => (
                                <div key={partner.name} className={`bg-gradient-to-br ${partner.color} border ${partner.border} rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-200 h-24`}>
                                    <div className="h-10 w-full flex items-center justify-center">
                                        {partner.logo}
                                    </div>
                                    <div className="text-slate-700 font-bold text-[10px] uppercase tracking-tighter text-center leading-none">
                                        {partner.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TPA Partners + Helpdesk CTA */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* TPA Description */}
                        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">🤝 What is a TPA?</h3>
                            <p className="text-sky-100 text-sm leading-relaxed mb-4">
                                A <strong className="text-white">Third Party Administrator (TPA)</strong> is an IRDAI-licensed entity that acts as an intermediary between you, the hospital, and your insurance company. Our expert TPA helpdesk manages pre-authorization, claim processing, and discharge formalities on your behalf — making cashless treatment seamless.
                            </p>
                            <div className="space-y-2">
                                {["Pre-Authorization within 2 hours", "Seamless claim documentation", "No hidden charges", "Dedicated relationship manager"].map(pt => (
                                    <div key={pt} className="flex items-center gap-2 text-sky-100 text-sm">
                                        <span className="w-5 h-5 rounded-full bg-green-400/20 text-green-300 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                                        {pt}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cashless Process Steps */}
                        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">⚡ Cashless Process</h3>
                            <div className="space-y-3">
                                {[
                                    { step: "1", text: "Present your insurance card at TPA helpdesk" },
                                    { step: "2", text: "Pre-authorization sent to insurer" },
                                    { step: "3", text: "Treatment begins on approval" },
                                    { step: "4", text: "Discharge with minimal paperwork" },
                                ].map(item => (
                                    <div key={item.step} className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-white/20 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">{item.step}</div>
                                        <p className="text-sky-100 text-sm">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact CTA */}
                        <div className="flex-shrink-0 flex flex-col gap-4 justify-center">
                            <a href="tel:+918954155336" className="group flex items-center gap-4 bg-white text-slate-800 p-4 md:p-5 rounded-2xl hover:bg-slate-50 transition-all shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-sky-200">
                                <div className="w-11 h-11 bg-sky-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-xl">📞</span>
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-slate-500 font-medium mb-0.5 uppercase tracking-wider">TPA Helpdesk</div>
                                    <div className="text-lg font-black text-sky-600">+91 8954155336</div>
                                </div>
                            </a>
                            <a
                                href="#contact"
                                className="group flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3.5 rounded-2xl border border-white/30 transition-all hover:-translate-y-1 shadow-lg text-sm"
                            >
                                Know More About
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
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
                                        <p className="text-gray-600 text-sm">+91 90390 67378</p>
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
                             <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="btn btn-primary w-full disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : "Send Message"}
                            </button>
                            {formStatus && (
                                <div className={`p-3 rounded-lg text-sm text-center animate-fadeIn ${formStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {formStatus.message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-white py-12 md:py-16 relative overflow-hidden border-t border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
                <div className="container relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center sm:text-left">
                        <div className="sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-2 lg:gap-3 mb-4 justify-center sm:justify-start">
                                <Image src="/images/logo-1.png" alt="Hospital Logo" width={50} height={50} className="h-12 w-auto object-contain" />
                                <div className="flex flex-col justify-center text-left">
                                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest leading-none mb-0.5">Dr. K.C. Memorial</span>
                                    <span className="text-sky-400 font-black text-lg tracking-tighter leading-none whitespace-nowrap">Gupta Hospital</span>
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
                                                        setChatMessages(prev => [...prev, { role: "assistant", content: "Please call +91 90390 67378." }]);
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
                        href="https://wa.me/918954185965"
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

                {/* Mobile Call Icon */}
                <a
                    href="tel:+919039067378"
                    className="lg:hidden bg-sky-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 rotate-12 transition-all"
                    aria-label="Call Hospital"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </a>

                {/* Scroll To Top Button */}
                <button
                    onClick={scrollToTop}
                    className={`fixed bottom-20 left-4 sm:left-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-2xl border border-sky-100 flex items-center justify-center transition-all duration-300 hover:bg-white group z-[9990] ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                    aria-label="Scroll to top"
                >
                    <svg className="w-6 h-6 text-sky-500 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
