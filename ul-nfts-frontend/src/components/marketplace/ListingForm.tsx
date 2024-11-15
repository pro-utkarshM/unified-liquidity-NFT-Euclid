import React, { useState } from 'react';
import { useMarketplace } from '../../hooks/useMarketplace';

interface ListingFormProps {
    tokenId: string;
    onSuccess?: () => void;
}

export const ListingForm: React.FC<ListingFormProps> = ({ tokenId, onSuccess }) => {
    const [price, setPrice] = useState('');
    const { createListing, loading } = useMarketplace();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createListing(tokenId, price);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Listing error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300">
                    Price (ARCH)
                </label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full bg-dark rounded-md border-gray-700"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
            >
                {loading ? 'Creating Listing...' : 'List NFT'}
            </button>
        </form>
    );
};