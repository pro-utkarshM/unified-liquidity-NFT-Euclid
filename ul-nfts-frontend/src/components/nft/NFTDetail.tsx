import { useState } from 'react';
import { NFTMetadata } from '../../services/types';
import { Button } from '../shared/Button';
import { ListingForm } from '../marketplace/ListingForm';
import { useMarketplace } from '../../hooks/useMarketplace';
import { useArchwayClient } from '../../hooks/useArchwayClient';

interface NFTDetailProps {
    nft: NFTMetadata;
    onListingCreated?: () => void;
}

export const NFTDetail: React.FC<NFTDetailProps> = ({ nft, onListingCreated }) => {
    const { address } = useArchwayClient();
    const { loading: marketplaceLoading } = useMarketplace();
    const [showListingForm, setShowListingForm] = useState(false);

    const isOwner = address === nft.owner;
    const totalValue = nft.positions.reduce((sum, pos) => sum + Number(pos.amount), 0);

    return (
        <div className="bg-dark-light rounded-xl p-6 md:p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - NFT Preview */}
                <div>
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">UL-NFT #{nft.tokenId}</span>
                    </div>

                    {isOwner && (
                        <div className="mt-6 space-y-4">
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={() => setShowListingForm(true)}
                            >
                                List for Sale
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                            >
                                Transfer
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right Column - Details */}
                <div>
                    <h1 className="text-2xl font-bold mb-4">Unified Liquidity Position #{nft.tokenId}</h1>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium mb-2">Positions</h2>
                            <div className="space-y-4">
                                {nft.positions.map((position, idx) => (
                                    <div key={idx} className="bg-dark rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-400">Pool #{position.pool_id}</span>
                                            <span className="text-primary">{position.amount.toString()} LP</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded">
                                                {position.token_pair[0]}
                                            </span>
                                            <span className="text-gray-400">+</span>
                                            <span className="text-sm bg-secondary/20 text-secondary px-2 py-1 rounded">
                                                {position.token_pair[1]}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-400">
                                            Chain: {position.chain_id}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium mb-2">Details</h2>
                            <div className="bg-dark rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Owner</span>
                                    <span className="text-primary">{`${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Total Value Locked</span>
                                    <span className="text-primary">{totalValue.toLocaleString()} LP</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Positions</span>
                                    <span className="text-primary">{nft.positions.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listing Modal */}
            {showListingForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-light rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">List NFT for Sale</h2>
                        <ListingForm
                            tokenId={nft.tokenId}
                            onSuccess={() => {
                                setShowListingForm(false);
                                onListingCreated?.();
                            }}
                            onCancel={() => setShowListingForm(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};