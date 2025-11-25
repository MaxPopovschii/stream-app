import { Link } from 'react-router-dom';
import { FiPlay, FiMonitor, FiSmartphone, FiFilm } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section - Stile Apple minimalista */}
      <div className="relative min-h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920)',
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/95 to-primary/20" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>

        <div className="relative w-full py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
                Stream.
                <span className="block gradient-text">Anywhere.</span>
              </h1>
              <p className="text-xl md:text-2xl mb-12 text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
                Discover unlimited entertainment with our curated collection of movies and shows.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/register" className="btn-primary text-lg group">
                  <FiPlay className="inline mr-2 group-hover:scale-110 transition-transform" />
                  Start Watching
                </Link>
                <Link to="/browse" className="btn-secondary text-lg">
                  Browse Library
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Features Section - Stile Airbnb con cards eleganti */}
      <div className="py-32 bg-gradient-to-b from-dark via-dark-light to-dark relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">Everything you need</h2>
            <p className="text-xl text-gray-400 font-light">A seamless streaming experience across all your devices</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-3xl p-10 hover:bg-white/10 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-glow">
                <FiMonitor size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Big Screen Ready</h3>
              <p className="text-gray-400 leading-relaxed">
                Optimized for Smart TVs, gaming consoles, and streaming devices with stunning 4K quality.
              </p>
            </div>
            
            <div className="glass rounded-3xl p-10 hover:bg-white/10 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-glow-purple">
                <FiSmartphone size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Take It Anywhere</h3>
              <p className="text-gray-400 leading-relaxed">
                Seamlessly switch between your phone, tablet, laptop, and TV without missing a moment.
              </p>
            </div>
            
            <div className="glass rounded-3xl p-10 hover:bg-white/10 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-glow">
                <FiFilm size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Endless Entertainment</h3>
              <p className="text-gray-400 leading-relaxed">
                Thousands of handpicked movies and series, updated regularly with fresh content.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section - Stile Apple minimal */}
      <div className="py-32 bg-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">Ready to dive in?</h2>
          <p className="text-xl text-gray-400 mb-12 font-light">Start your journey today. No commitments.</p>
          <Link to="/register" className="btn-primary text-lg inline-block">
            Get Started for Free
          </Link>
        </div>
      </div>
    </div>
  );
}
