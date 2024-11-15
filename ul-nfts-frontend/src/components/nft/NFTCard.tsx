import React from 'react';
import { useRouter } from 'next/router';
import { LiquidityPosition } from '../../services/types';

interface NFTCardProps {
    tokenId: string;
    positions: LiquidityPosition[];
    onClick?: () => void;
}

export const NFTCard: React.FC<NFTCardProps> = ({ tokenId, positions, onClick }) => {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.push(`/nft/${tokenId}`);
        }
    };

    return (
        <div
            className="bg-dark-light rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex flex-col gap-4">
                <div className="bg-gradient-to-r from-primary to-secondary h-40 rounded-md flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">UL-NFT #{tokenId}</span>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Liquidity Positions</h3>
                    <div className="space-y-2">
                        {positions.map((position, idx) => (
                            <div key={idx} className="bg-dark p-2 rounded">
                                <p className="text-sm">Pool: {position.pool_id}</p>
                                <p className="text-sm text-gray-400">
                                    {position.token_pair[0]}/{position.token_pair[1]}
                                </p>
                                <p className="text-sm text-primary">{position.amount.toString()} LP Tokens</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};