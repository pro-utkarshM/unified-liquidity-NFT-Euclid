// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/layout/Layout';
import { NFTDetail } from '../../components/nft/NFTDetail';
// import { LoadingScreen } from '../../components/shared/Loading';
// import { useNFTContract } from '../../hooks/useNFTContract';
import { NFTMetadata } from '../../services/types';
import { notificationService } from '../../services/notifications';
import { FaSpinner } from 'react-icons/fa';

// Mock data for different NFT types
const MOCK_NFT_DATA = {
    'undefined': {
        id: 'ulnft-1',
        name: 'Blue Chip DeFi Bundle #1',
        description: 'High-performance liquidity position across major DeFi protocols',
        owner: 'archway1xyz789...',
        created: '2024-03-15T10:30:00Z',
        totalValue: '$125,000',
        positions: [
            {
                pool_id: 'eth-usdc-1',
                token_pair: ['ETH', 'USDC'],
                amount: '50000',
                chain_id: 'ethereum',
                apy: '15.2%',
                volume24h: '$2.1M',
                poolShare: '0.05%'
            },
            {
                pool_id: 'atom-osmo-1',
                token_pair: ['ATOM', 'OSMO'],
                amount: '75000',
                chain_id: 'osmosis',
                apy: '18.5%',
                volume24h: '$850K',
                poolShare: '0.12%'
            }
        ],
        performance: {
            daily: '+2.1%',
            weekly: '+8.5%',
            monthly: '+22.3%',
            totalEarned: '$12,500'
        }
    },
    'ulnft-2': {
        id: 'ulnft-2',
        name: 'Stablecoin Yield Maximizer #2',
        description: 'Optimized stablecoin liquidity position for consistent yields',
        owner: 'archway1abc456...',
        created: '2024-03-14T15:45:00Z',
        totalValue: '$250,000',
        positions: [
            {
                pool_id: 'usdc-usdt-1',
                token_pair: ['USDC', 'USDT'],
                amount: '100000',
                chain_id: 'archway',
                apy: '8.5%',
                volume24h: '$5.3M',
                poolShare: '0.15%'
            },
            {
                pool_id: 'dai-usdc-1',
                token_pair: ['DAI', 'USDC'],
                amount: '150000',
                chain_id: 'osmosis',
                apy: '9.2%',
                volume24h: '$3.8M',
                poolShare: '0.18%'
            }
        ],
        performance: {
            daily: '+0.8%',
            weekly: '+3.2%',
            monthly: '+12.5%',
            totalEarned: '$25,000'
        }
    }
};

// Simulated blockchain interaction delays
const SIMULATED_DELAYS = {
    INITIAL_LOAD: 1500,
    BLOCKCHAIN_QUERY: 800,
    CONTRACT_INTERACTION: 1200
};

export default function NFTDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [nft, setNft] = useState<NFTMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingState, setLoadingState] = useState('Connecting to Archway network...');

    useEffect(() => {
        const loadNFT = async () => {
            if (!id) return;

            try {
                // Simulate blockchain interactions with realistic loading states
                setLoading(true);
                setLoadingState('Connecting to Archway network...');
                await new Promise(r => setTimeout(r, SIMULATED_DELAYS.INITIAL_LOAD));

                setLoadingState('Querying smart contract...');
                await new Promise(r => setTimeout(r, SIMULATED_DELAYS.BLOCKCHAIN_QUERY));

                setLoadingState('Fetching NFT metadata...');
                await new Promise(r => setTimeout(r, SIMULATED_DELAYS.CONTRACT_INTERACTION));

                // Get mock data
                const mockNFT = MOCK_NFT_DATA[id as keyof typeof MOCK_NFT_DATA];
                if (!mockNFT) {
                    throw new Error('NFT not found');
                }

                // Add some randomization to make it look more real
                const randomizedNFT = {
                    ...mockNFT,
                    positions: mockNFT.positions.map(pos => ({
                        ...pos,
                        apy: `${(parseFloat(pos.apy) + (Math.random() * 2 - 1)).toFixed(1)}%`,
                        volume24h: `$${(parseFloat(pos.volume24h.replace(/[^0-9.]/g, '')) + (Math.random() * 0.5)).toFixed(1)}M`
                    }))
                };

                setNft(randomizedNFT);
                notificationService.notify(
                    'NFT data fetched successfully',
                    'success'
                );
            } catch (error) {
                console.error('Failed to load NFT:', error);
                notificationService.notify(
                    'Failed to load NFT details',
                    'error'
                );
                router.push('/marketplace');
            } finally {
                setLoading(false);
            }
        };

        loadNFT();
    }, [id, router]);

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="bg-dark-light p-8 rounded-lg shadow-xl text-center">
                        <FaSpinner className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
                        <p className="text-lg text-gray-300 mb-2">{loadingState}</p>
                        <p className="text-sm text-gray-400">This may take a few moments...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!nft) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-300 mb-2">NFT Not Found</h2>
                        <p className="text-gray-400 mb-6">The NFT you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                        <button
                            onClick={() => router.push('/marketplace')}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg"
                        >
                            Return to Marketplace
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <NFTDetail
                    nft={nft}
                    onListingCreated={() => {
                        notificationService.notify(
                            'NFT listed successfully',
                            'success'
                        );
                        router.push('/marketplace');
                    }}
                />

                {/* Additional Stats Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-dark-light rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Performance Metrics</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Daily Return</span>
                                <span className="text-green-400">{nft.performance.daily}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Weekly Return</span>
                                <span className="text-green-400">{nft.performance.weekly}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Monthly Return</span>
                                <span className="text-green-400">{nft.performance.monthly}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Earned</span>
                                <span className="text-green-400">{nft.performance.totalEarned}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-dark-light rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Pool Information</h3>
                        <div className="space-y-4">
                            {nft.positions.map((position, index) => (
                                <div key={index} className="p-4 bg-dark rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-400">Pool Share</span>
                                        <span className="text-primary">{position.poolShare}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-400">24h Volume</span>
                                        <span className="text-white">{position.volume24h}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Current APY</span>
                                        <span className="text-green-400">{position.apy}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}