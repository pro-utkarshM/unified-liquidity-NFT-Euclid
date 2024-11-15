import { useState } from 'react';
import { NFTCard } from './NFTCard';
import { NFTMetadata } from '../../services/types';
import { LoadingScreen } from '../shared/Loading';

interface NFTGridProps {
    nfts: NFTMetadata[];
    loading?: boolean;
    emptyMessage?: string;
}

export const NFTGrid: React.FC<NFTGridProps> = ({
    nfts,
    loading = false,
    emptyMessage = "No NFTs found"
}) => {
    const [sortBy, setSortBy] = useState<'recent' | 'value'>('recent');

    if (loading) return <LoadingScreen />;

    return (
        <div>
            {/* Sort Controls */}
            <div className="mb-6 flex justify-end">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'value')}
                    className="bg-dark-light border border-gray-700 rounded-lg px-4 py-2"
                >
                    <option value="recent">Most Recent</option>
                    <option value="value">Highest Value</option>
                </select>
            </div>

            {nfts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-400">{emptyMessage}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nfts.map((nft) => (
                        <NFTCard key={nft.tokenId} {...nft} />
                    ))}
                </div>
            )}
        </div>
    );
};