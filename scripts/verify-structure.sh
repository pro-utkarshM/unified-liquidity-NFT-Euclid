#!/bin/bash

echo "Verifying project structure..."

# Check root directory
echo "Checking root directory..."
if [ ! -f "Cargo.toml" ]; then
    echo "ERROR: Root Cargo.toml is missing"
    exit 1
fi

# Check .cargo directory
echo "Checking .cargo directory..."
if [ ! -f ".cargo/config.toml" ]; then
    echo "ERROR: .cargo/config.toml is missing"
    mkdir -p .cargo
    exit 1
fi

# Check contracts directory
echo "Checking contracts directory..."
if [ ! -d "contracts" ]; then
    echo "ERROR: contracts directory is missing"
    exit 1
fi

# Check each contract
for contract in ul-nft-core marketplace liquidity-wrapper metadata-manager; do
    echo "Checking $contract..."
    if [ ! -d "contracts/$contract" ]; then
        echo "ERROR: contracts/$contract directory is missing"
        exit 1
    fi
    if [ ! -f "contracts/$contract/Cargo.toml" ]; then
        echo "ERROR: contracts/$contract/Cargo.toml is missing"
        exit 1
    fi
    if [ ! -d "contracts/$contract/src" ]; then
        echo "ERROR: contracts/$contract/src directory is missing"
        exit 1
    fi
done

# Create artifacts directory if missing
echo "Checking artifacts directory..."
mkdir -p artifacts

echo "Structure verification complete!"