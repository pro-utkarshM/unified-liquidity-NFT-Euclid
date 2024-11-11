#!/bin/bash

# Build contracts
echo "Building contracts..."
cargo build --release --target wasm32-unknown-unknown --manifest-path contracts/liquidity-wrapper/Cargo.toml
cargo build --release --target wasm32-unknown-unknown --manifest-path contracts/marketplace/Cargo.toml
cargo build --release --target wasm32-unknown-unknown --manifest-path contracts/metadata-manager/Cargo.toml
cargo build --release --target wasm32-unknown-unknown --manifest-path contracts/ul-nft-core/Cargo.toml

# Deploy contracts
echo "Deploying contracts..."
ts-node scripts/deploy.ts

# Run tests
echo "Running tests..."
ts-node scripts/test.ts
