// import { useEffect, useState } from 'react';
// import { Layout } from '../components/layout/Layout';
// import { NFTGrid } from '../components/nft/NFTGrid';
// import { Button } from '../components/shared/Button';
// import { useNFTContract } from '../hooks/useNFTContract';
// import { NFTMetadata } from '../services/types';
// import { useRouter } from 'next/router';

// export default function Home() {
//   const [featuredNFTs, setFeaturedNFTs] = useState<NFTMetadata[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const { getUserNFTs } = useNFTContract();

//   useEffect(() => {
//     const loadFeaturedNFTs = async () => {
//       try {
//         // In a real app, you might want to fetch specifically featured/trending NFTs
//         const nfts = await getUserNFTs('featured');
//         setFeaturedNFTs(nfts.slice(0, 6)); // Show only top 6
//       } catch (error) {
//         console.error('Failed to load featured NFTs:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadFeaturedNFTs();
//   }, []);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { NFTGrid } from '../components/nft/NFTGrid';
import { Button } from '../components/shared/Button';
import { NFTS, TRENDING_POOLS } from '../services/Data';
import { useRouter } from 'next/router';
import { FaChartLine, FaLock, FaExchangeAlt, FaSyncAlt } from 'react-icons/fa';

export default function Home() {
  const [featuredNFTs, setFeaturedNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setFeaturedNFTs(NFTS);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);


  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-dark overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-10" />
        </div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Unified Liquidity NFTs
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              Trade tokenized cross-chain liquidity positions powered by Euclid Protocol and Archway.
              Access diverse DeFi opportunities through a single NFT.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button
                size="lg"
                onClick={() => router.push('/marketplace')}
              >
                Explore Marketplace
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/portfolio')}
              >
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {/* <section className="py-12 bg-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Featured Pools Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold">Trending Pools</h2>
          <p className="mt-2 text-gray-400">Most popular liquidity positions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRENDING_POOLS.map((pool) => (
            <div key={pool.id} className="bg-dark-light rounded-lg p-6 hover:shadow-xl transition-all">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{pool.name}</h3>
                <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                  {pool.apy} APY
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">TVL</span>
                  <span className="text-white">{pool.tvl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Volume</span>
                  <span className="text-white">{pool.volume24h}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Chains</span>
                  <span className="text-white">{pool.chains.join(', ')}</span>
                </div>
              </div>

              <button
                className="w-full mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                onClick={() => router.push('/marketplace')}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose UL-NFTs?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Enhanced Yields</h3>
              <p className="text-gray-400">Access optimal yields across multiple chains automatically</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Audited</h3>
              <p className="text-gray-400">Built on battle-tested protocols with multiple security layers</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExchangeAlt className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Trading</h3>
              <p className="text-gray-400">Trade complex positions with a single click</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSyncAlt className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Auto-Rebalancing</h3>
              <p className="text-gray-400">Positions automatically adjust for optimal performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured NFTs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold">Featured Positions</h2>
          <p className="mt-2 text-gray-400">Discover popular liquidity positions</p>
        </div>

        <NFTGrid nfts={featuredNFTs} loading={loading} />
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="rounded-full bg-primary/20 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Choose Positions</h3>
              <p className="text-gray-400">Select from a variety of cross-chain liquidity pools to create your portfolio</p>
            </div>

            <div className="card">
              <div className="rounded-full bg-primary/20 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Mint NFT</h3>
              <p className="text-gray-400">Your positions are tokenized into a single, tradeable NFT</p>
            </div>

            <div className="card">
              <div className="rounded-full bg-primary/20 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Trade & Earn</h3>
              <p className="text-gray-400">Trade your positions or earn yields from your liquidity provision</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}