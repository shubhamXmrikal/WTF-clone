import React from 'react';
import { Target, Users, Zap, Heart, Trophy, Globe, Ticket, MessageCircle, Star, TrendingUp } from 'lucide-react';

const About: React.FC = () => {
    const features = [
        {
            icon: Ticket,
            title: 'Event Booking',
            description: 'Book tickets for live football screenings at the best venues in your city. Never miss a match!'
        },
        {
            icon: Users,
            title: 'Fantasy Football',
            description: 'Create your dream team, compete with friends, and win exciting prizes in our fantasy leagues.'
        },
        {
            icon: MessageCircle,
            title: 'Fan Community',
            description: 'Connect with passionate football fans worldwide. Share your thoughts, celebrate victories together.'
        },
        {
            icon: Trophy,
            title: 'Exclusive Rewards',
            description: 'Earn points for every booking and interaction. Redeem for exclusive merchandise and experiences.'
        },
        {
            icon: Globe,
            title: 'Global Coverage',
            description: 'Follow matches from leagues around the world. From Premier League to La Liga, we\'ve got it all.'
        },
        {
            icon: Zap,
            title: 'Live Updates',
            description: 'Real-time scores, stats, and match commentary. Stay updated with every kick of the ball.'
        }
    ];

    const values = [
        {
            icon: Heart,
            title: 'Passion',
            description: 'We live and breathe football, just like you.'
        },
        {
            icon: Users,
            title: 'Community',
            description: 'Building connections that last beyond the final whistle.'
        },
        {
            icon: Star,
            title: 'Excellence',
            description: 'Delivering the best football experience, every single time.'
        },
        {
            icon: TrendingUp,
            title: 'Innovation',
            description: 'Constantly evolving to bring you cutting-edge features.'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 py-20 bg-gradient-to-b from-brand-red/10 to-black">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-7xl font-display font-bold mb-6 flex items-center justify-center">
                        ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">WHATHEFOOTBALL</span>
                    </h1>
                    <p className="text-base md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        More than just an app - we're a movement bringing football fans together, one match at a time.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-[#050505]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-center mb-8">
                        <Target className="text-brand-red mr-4" size={48} />
                        <h2 className="text-2xl md:text-5xl font-display font-bold">Our Mission</h2>
                    </div>
                    <p className="text-sm md:text-xl text-gray-300 text-center max-w-4xl mx-auto leading-relaxed mb-8">
                        WhaTheFOOTBALL was born from a simple idea: <span className="text-brand-red font-bold">every football fan deserves an unforgettable match-day experience</span>.
                        Whether you're watching from a packed stadium or a cozy venue with friends, we're here to amplify the roar, the passion, and the pure joy of the beautiful game.
                    </p>
                    <p className="text-sm md:text-xl text-gray-300 text-center max-w-4xl mx-auto leading-relaxed">
                        We empower football enthusiasts through innovative experiences, fostering a global community that celebrates the true spirit of football.
                        Our user-friendly, personalized platform seamlessly blends <span className="text-brand-red font-bold">event ticket booking, fan interactions, fantasy football, and more</span> -
                        redefining fan engagement by merging technology with passion.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl md:text-5xl font-display font-bold text-center mb-4">What We Offer</h2>
                    <p className="text-gray-400 text-center mb-16 text-sm md:text-lg">Everything you need for the ultimate football experience</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="bg-[#111] border border-gray-800 rounded-2xl p-6 hover:border-brand-red transition-all duration-300 group hover:shadow-[0_0_30px_rgba(255,0,51,0.2)]"
                            >
                                <div className="w-14 h-14 bg-brand-red/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-red transition-colors">
                                    <feature.icon size={28} className="text-brand-red group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-sm md:text-base text-gray-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gradient-to-b from-[#050505] to-black">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-5xl font-display font-bold text-center mb-4">Our Values</h2>
                    <p className="text-gray-400 text-center mb-16 text-sm md:text-lg">The principles that drive everything we do</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => (
                            <div
                                key={idx}
                                className="text-center p-6 bg-[#111] rounded-xl border border-gray-800 hover:border-brand-red transition-all group"
                            >
                                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-red transition-colors">
                                    <value.icon size={32} className="text-brand-red group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold mb-2">{value.title}</h3>
                                <p className="text-gray-400 text-xs md:text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Impact */}
            <section className="py-20 bg-black">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-5xl font-display font-bold text-center mb-16">The WTF Community</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center p-8 bg-gradient-to-b from-brand-red/10 to-transparent rounded-2xl border border-brand-red/20">
                            <div className="text-3xl md:text-6xl font-bold text-brand-red mb-2">50K+</div>
                            <div className="text-gray-300 text-sm md:text-lg">Active Users</div>
                        </div>
                        <div className="text-center p-8 bg-gradient-to-b from-brand-red/10 to-transparent rounded-2xl border border-brand-red/20">
                            <div className="text-3xl md:text-6xl font-bold text-brand-red mb-2">1000+</div>
                            <div className="text-gray-300 text-sm md:text-lg">Events Hosted</div>
                        </div>
                        <div className="text-center p-8 bg-gradient-to-b from-brand-red/10 to-transparent rounded-2xl border border-brand-red/20">
                            <div className="text-3xl md:text-6xl font-bold text-brand-red mb-2">100+</div>
                            <div className="text-gray-300 text-sm md:text-lg">Partner Venues</div>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-gray-800 rounded-2xl p-8 md:p-12">
                        <h3 className="text-xl md:text-3xl font-bold mb-6 text-center">Join the Movement</h3>
                        <p className="text-gray-300 text-sm md:text-lg text-center max-w-3xl mx-auto leading-relaxed mb-8">
                            From casual fans to die-hard supporters, WhaTheFOOTBALL brings together people who share one thing:
                            an undying love for football. Whether you're cheering for your local team or following international tournaments,
                            you'll find your tribe here. <span className="text-brand-red font-bold">This is where passion meets community.</span>
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg px-6 py-3">
                                <span className="text-brand-red font-bold">🎉 Pre-match meetups</span>
                            </div>
                            <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg px-6 py-3">
                                <span className="text-brand-red font-bold">🏆 Fantasy leagues</span>
                            </div>
                            <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg px-6 py-3">
                                <span className="text-brand-red font-bold">💬 Live discussions</span>
                            </div>
                            <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg px-6 py-3">
                                <span className="text-brand-red font-bold">🎁 Exclusive rewards</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-gradient-to-b from-[#050505] to-black">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-5xl font-display font-bold text-center mb-16">Why Choose WhaTheFOOTBALL?</h2>

                    <div className="space-y-6">
                        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-brand-red transition-all">
                            <h3 className="text-lg md:text-2xl font-bold mb-3 flex items-center">
                                <span className="text-brand-red mr-3">✓</span> Seamless Experience
                            </h3>
                            <p className="text-sm md:text-base text-gray-400 pl-8">
                                From browsing events to booking tickets, everything is designed to be smooth, fast, and hassle-free.
                            </p>
                        </div>

                        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-brand-red transition-all">
                            <h3 className="text-lg md:text-2xl font-bold mb-3 flex items-center">
                                <span className="text-brand-red mr-3">✓</span> Trusted by Thousands
                            </h3>
                            <p className="text-sm md:text-base text-gray-400 pl-8">
                                Join a community of verified football fans who trust us for their match-day experiences.
                            </p>
                        </div>

                        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-brand-red transition-all">
                            <h3 className="text-lg md:text-2xl font-bold mb-3 flex items-center">
                                <span className="text-brand-red mr-3">✓</span> Always Evolving
                            </h3>
                            <p className="text-sm md:text-base text-gray-400 pl-8">
                                We listen to our community and constantly add new features, venues, and experiences.
                            </p>
                        </div>

                        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-brand-red transition-all">
                            <h3 className="text-lg md:text-2xl font-bold mb-3 flex items-center">
                                <span className="text-brand-red mr-3">✓</span> More Than Just Tickets
                            </h3>
                            <p className="text-sm md:text-base text-gray-400 pl-8">
                                We're building a complete ecosystem for football fans - from fantasy leagues to exclusive merchandise.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-black pb-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-5xl font-display font-bold mb-6">
                        Ready to Experience Football Like Never Before?
                    </h2>
                    <p className="text-base md:text-xl text-gray-300 mb-10">
                        Download the app today and join thousands of fans who've already made WhaTheFOOTBALL their match-day companion.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => window.open('https://play.google.com/store/apps/details?id=com.whathefootball&hl=en_IN', '_blank')}
                            className="bg-brand-red hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,0,51,0.4)]"
                        >
                            Download Now
                        </button>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-white/20 hover:border-brand-red"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
