// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
// import { NFTGrid } from '../components/nft/NFTGrid';
// import { Button } from '../components/shared/Button';
import { useNFTContract } from '../hooks/useNFTContract';
import { useArchwayClient } from '../hooks/useArchwayClient';
import { NFTMetadata } from '../services/types';
// import { useRouter } from 'next/router';

export default function Portfolio() {
    const [, setNfts] = useState<NFTMetadata[]>([]);
    const [, setLoading] = useState(true);
    const { getUserNFTs } = useNFTContract();
    const { address, } = useArchwayClient();
    // const router = useRouter();

    const mockPositions = [
        {
            id: '1',
            name: 'Diversified DeFi Position #1',
            totalValue: '$25,000',
            dailyYield: '$12.50',
            chains: ['Ethereum', 'Osmosis', 'Archway'],
            pools: [
                { pair: 'ETH-USDC', share: '40%', apy: '8.5%' },
                { pair: 'OSMO-ATOM', share: '35%', apy: '12.3%' },
                { pair: 'ARCH-USDC', share: '25%', apy: '15.7%' }
            ]
        },
        // Add more mock positions...
    ];

    useEffect(() => {
        const loadNFTs = async () => {
            if (!address) return;

            try {
                const userNFTs = await getUserNFTs(address);
                setNfts(userNFTs);
            } catch (error) {
                console.error('Failed to load NFTs:', error);
            } finally {
                setLoading(false);
            }
        };

        loadNFTs();
    }, [address]);

    // if (!address) {
    //     return (
    //         <Layout>
    //             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    //                 <div className="text-center">
    //                     <h2 className="text-3xl font-bold mb-4">Connect Wallet</h2>
    //                     <p className="text-gray-400 mb-8">
    //                         Connect your wallet to view your portfolio
    //                     </p>
    //                     <Button onClick={connect}>Connect Wallet</Button>
    //                 </div>
    //             </div>
    //         </Layout>
    //     );
    // }
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gradient">Your Portfolio</h1>
                        <p className="text-xl text-gray-400 mt-2">Manage your cross-chain liquidity positions</p>
                    </div>
                    <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg">
                        Create Position
                    </button>
                </div>

                {/* Portfolio Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Stats cards */}
                </div>

                {/* Positions */}
                <div className="space-y-6">
                    {mockPositions.map((position) => (
                        <div key={position.id} className="bg-dark-light rounded-lg p-6">
                            {/* Position content */}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}