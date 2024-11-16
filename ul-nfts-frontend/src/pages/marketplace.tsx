
import { Layout } from '../components/layout/Layout';
// import { ListingGrid } from '../components/marketplace/ListingGrid';
// import { Input } from '../components/shared/Input';
// import { Button } from '../components/shared/Button';
// import { useMarketplace } from '../hooks/useMarketplace';
// import { MarketplaceListing } from '../services/types';
import { FaEthereum } from 'react-icons/fa';

export default function Marketplace() {
    // const [, setListings] = useState<MarketplaceListing[]>([]);
    // const [, setLoading] = useState(true);
    // const [searchTerm, setSearchTerm] = useState('');
    // const [priceFilter, setPriceFilter] = useState<'asc' | 'desc'>('asc');

    // const { getListings } = useMarketplace();

    const mockListings = [
        {
            id: '1',
            name: 'USDC-ETH Pool Position',
            price: '1250',
            apy: '12.5%',
            tvl: '$500,000',
            chains: ['Ethereum', 'Osmosis']
        },
        {
            id: '2',
            name: 'ATOM-OSMO Pool Position',
            price: '850',
            apy: '15.2%',
            tvl: '$320,000',
            chains: ['Cosmos', 'Osmosis']
        },
        // Add more mock listings...
    ];

    // const loadListings = async () => {
    //     try {
    //         const fetchedListings = await getListings();
    //         setListings(fetchedListings);
    //     } catch (error) {
    //         console.error('Failed to load listings:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     loadListings();
    // }, []);

    // const filteredListings = listings
    //     .filter(listing =>
    //         listing.tokenId.toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    //     .sort((a, b) => {
    //         const priceA = Number(a.price);
    //         const priceB = Number(b.price);
    //         return priceFilter === 'asc' ? priceA - priceB : priceB - priceA;
    //     });
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gradient mb-4">NFT Marketplace</h1>
                    <p className="text-xl text-gray-400">
                        Trade tokenized liquidity positions across multiple chains
                    </p>
                </div>

                {/* Featured Listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockListings.map((listing) => (
                        <div key={listing.id} className="bg-dark-light rounded-lg p-6 hover:shadow-xl transition-all">
                            <div className="bg-gradient-to-br from-primary to-secondary h-48 rounded-lg mb-4 flex items-center justify-center">
                                <FaEthereum className="w-16 h-16 text-white opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{listing.name}</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Price</span>
                                    <span className="text-primary font-bold">{listing.price} ARCH</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">APY</span>
                                    <span className="text-green-400">{listing.apy}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">TVL</span>
                                    <span className="text-secondary">{listing.tvl}</span>
                                </div>
                                <div className="pt-4">
                                    <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}