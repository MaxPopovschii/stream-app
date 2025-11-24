import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1574267432644-f610a0b5f93b?w=1920)',
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Unlimited movies, TV shows, and more
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300">
                Watch anywhere. Cancel anytime.
              </p>
              <p className="text-lg mb-6">
                Ready to watch? Enter your email to create or restart your membership.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn-primary text-lg px-8 py-3 text-center">
                  Get Started
                </Link>
                <Link to="/browse" className="btn-secondary text-lg px-8 py-3 text-center">
                  Browse Content
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl mb-4">📺</div>
              <h3 className="text-2xl font-bold mb-3">Enjoy on your TV</h3>
              <p className="text-gray-400">
                Watch on Smart TVs, Playstation, Xbox, Chromecast, and more.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-3">Watch everywhere</h3>
              <p className="text-gray-400">
                Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold mb-3">Unlimited content</h3>
              <p className="text-gray-400">
                Access to thousands of movies and series in HD quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
