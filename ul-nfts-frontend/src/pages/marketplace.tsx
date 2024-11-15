import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { ListingGrid } from '../components/marketplace/ListingGrid';
import { Input } from '../components/shared/Input';
import { Button } from '../components/shared/Button';
import { useMarketplace } from '../hooks/useMarketplace';
import { MarketplaceListing } from '../services/types';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function Marketplace() {
    const [listings, setListings] = useState<MarketplaceListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState<'asc' | 'desc'>('asc');

    const { getListings } = useMarketplace();

    const loadListings = async () => {
        try {
            const fetchedListings = await getListings();
            setListings(fetchedListings);
        } catch (error) {
            console.error('Failed to load listings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadListings();
    }, []);

    const filteredListings = listings
        .filter(listing =>
            listing.tokenId.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const priceA = Number(a.price);
            const priceB = Number(b.price);
            return priceFilter === 'asc' ? priceA - priceB : priceB - priceA;
        });

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">NFT Marketplace</h1>
                    <p className="text-gray-400">
                        Discover and trade unified liquidity positions
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-grow">
                        <Input
                            placeholder="Search by token ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                            icon={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value as 'asc' | 'desc')}
                            className="bg-dark-light border border-gray-700 rounded-lg px-4 py-2"
                        >
                            <option value="asc">Price: Low to High</option>
                            <option value="desc">Price: High to Low</option>
                        </select>
                        <Button
                            variant="outline"
                            icon={<FunnelIcon className="w-5 h-5" />}
                        >
                            Filters
                        </Button>
                    </div>
                </div>

                <ListingGrid
                    listings={filteredListings}
                    loading={loading}
                    onListingPurchased={loadListings}
                />
            </div>
        </Layout>
    );
}