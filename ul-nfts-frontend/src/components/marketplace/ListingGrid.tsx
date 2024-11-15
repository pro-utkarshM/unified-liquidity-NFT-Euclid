import { MarketplaceListing } from '../../services/types';
import { ListingCard } from './ListingCard';
import { LoadingScreen } from '../shared/Loading';

interface ListingGridProps {
    listings: MarketplaceListing[];
    loading?: boolean;
    onListingPurchased?: () => void;
}

export const ListingGrid: React.FC<ListingGridProps> = ({
    listings,
    loading = false,
    onListingPurchased
}) => {
    if (loading) return <LoadingScreen />;

    if (listings.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No listings available</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
                <ListingCard
                    key={listing.listingId}
                    listing={listing}
                    onPurchase={onListingPurchased}
                />
            ))}
        </div>
    );
};