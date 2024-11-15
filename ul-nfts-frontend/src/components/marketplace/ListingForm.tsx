import { useState } from 'react';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { useMarketplace } from '../../hooks/useMarketplace';

interface ListingFormProps {
    tokenId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const ListingForm: React.FC<ListingFormProps> = ({
    tokenId,
    onSuccess,
    onCancel
}) => {
    const [price, setPrice] = useState('');
    const { createListing, loading } = useMarketplace();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createListing(tokenId, price);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to create listing:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                label="Price (ARCH)"
                type="number"
                min="0"
                step="0.000001"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price in ARCH"
                required
            />

            <div className="flex justify-end space-x-4">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    loading={loading}
                >
                    Create Listing
                </Button>
            </div>
        </form>
    );
};