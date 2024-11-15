import { MarketplaceListing } from '../../services/types';
import { Button } from '../shared/Button';
import { useMarketplace } from '../../hooks/useMarketplace';
import { useArchwayClient } from '../../hooks/useArchwayClient';

interface ListingCardProps {
    listing: MarketplaceListing;
    onPurchase?: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onPurchase }) => {
    const { address } = useArchwayClient();
    const { buyNFT, loading } = useMarketplace();

    const handleBuy = async () => {
        try {
            await buyNFT(listing.listingId);
            onPurchase?.();
        } catch (error) {
            console.error('Purchase failed:', error);
        }
    };

    return (
        <div className="card hover:transform hover:-translate-y-1">
            <div className="aspect-square rounded-lg bg-gradient-to-br from-primary to-secondary mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">UL-NFT #{listing.tokenId}</span>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price</span>
                    <span className="text-xl font-bold text-primary">{listing.price.toString()} ARCH</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Seller</span>
                    <span className="text-gray-200">{`${listing.seller.slice(0, 6)}...${listing.seller.slice(-4)}`}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Listed</span>
                    <span className="text-gray-200">
                        {new Date(listing.createdAt * 1000).toLocaleDateString()}
                    </span>
                </div>

                {address && address !== listing.seller && (
                    <Button
                        variant="primary"
                        className="w-full"
                        onClick={handleBuy}
                        loading={loading}
                    >
                        Buy Now
                    </Button>
                )}
            </div>
        </div>
    );
};