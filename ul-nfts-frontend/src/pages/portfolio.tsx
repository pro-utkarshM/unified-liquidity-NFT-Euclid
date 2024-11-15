import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { NFTGrid } from '../components/nft/NFTGrid';
import { Button } from '../components/shared/Button';
import { useNFTContract } from '../hooks/useNFTContract';
import { useArchwayClient } from '../hooks/useArchwayClient';
import { NFTMetadata } from '../services/types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

export default function Portfolio() {
    const [nfts, setNfts] = useState<NFTMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const { getUserNFTs } = useNFTContract();
    const { address, connect } = useArchwayClient();
    const router = useRouter();

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

    if (!address) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Connect Wallet</h2>
                        <p className="text-gray-400 mb-8">
                            Connect your wallet to view your portfolio
                        </p>
                        <Button onClick={connect}>Connect Wallet</Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Your Portfolio</h1>
                        <p className="text-gray-400">
                            Manage your unified liquidity positions
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push('/mint')}
                        icon={<PlusIcon className="w-5 h-5" />}
                    >
                        Create Position
                    </Button>
                </div>

                {/* Portfolio Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="card">
                        <h3 className="text-gray-400 mb-2">Total Value Locked</h3>
                        <p className="text-3xl font-bold text-gradient">$123,456</p>
                    </div>
                    <div className="card">
                        <h3 className="text-gray-400 mb-2">Active Positions</h3>
                        <p className="text-3xl font-bold text-gradient">{nfts.length}</p>
                    </div>
                    <div className="card">
                        <h3 className="text-gray-400 mb-2">Total Earnings</h3>
                        <p className="text-3xl font-bold text-gradient">$789</p>
                    </div>
                </div>

                <NFTGrid
                    nfts={nfts}
                    loading={loading}
                    emptyMessage="You don't have any positions yet. Create one to get started!"
                />
            </div>
        </Layout>
    );
}