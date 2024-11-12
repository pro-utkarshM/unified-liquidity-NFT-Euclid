#!/bin/bash

# Remove target directories
rm -rf target/
rm -rf contracts/target/
rm -rf artifacts/

# Remove Cargo.lock files
rm -f Cargo.lock
rm -f contracts/Cargo.lock
rm -f contracts/*/Cargo.lock

# Clean cargo cache (optional)
cargo clean

echo "Cache cleared successfully!"