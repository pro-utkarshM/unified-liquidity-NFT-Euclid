import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { NFTGrid } from '../components/nft/NFTGrid';
import { useNFTContract } from '../hooks/useNFTContract';

export default function Home() {
  const { queryNFT } = useNFTContract();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNFTs = async () => {
      // Implementation for loading NFTs
      setLoading(false);
    };

    loadNFTs();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gradient">
          Unified Liquidity NFTs
        </h1>

        <p className="text-xl mb-12 text-gray-300">
          Access diverse cross-chain liquidity positions through NFTs
        </p>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <NFTGrid nfts={nfts} />
        )}
      </div>
    </Layout>
  );
}