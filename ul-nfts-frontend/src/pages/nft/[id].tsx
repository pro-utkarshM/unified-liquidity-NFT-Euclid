import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/layout/Layout';
import { NFTDetail } from '../../components/nft/NFTDetail';
import { LoadingScreen } from '../../components/shared/Loading';
import { useNFTContract } from '../../hooks/useNFTContract';
import { NFTMetadata } from '../../services/types';
import { notificationService } from '../../services/notifications';

export default function NFTDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [nft, setNft] = useState<NFTMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const { queryNFT } = useNFTContract();

    useEffect(() => {
        const loadNFT = async () => {
            if (!id) return;

            try {
                const nftData = await queryNFT(id as string);
                setNft(nftData);
            } catch (error) {
                console.error('Failed to load NFT:', error);
                notificationService.notify(
                    'Failed to load NFT details',
                    'error'
                );
                router.push('/marketplace');
            } finally {
                setLoading(false);
            }
        };

        loadNFT();
    }, [id]);

    if (loading) return <LoadingScreen />;
    if (!nft) return null;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <NFTDetail
                    nft={nft}
                    onListingCreated={() => router.push('/marketplace')}
                />
            </div>
        </Layout>
    );
}