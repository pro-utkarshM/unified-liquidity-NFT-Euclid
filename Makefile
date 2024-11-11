# Variables
CONTRACTS_DIR := contracts
LIQUIDITY_WRAPPER := $(CONTRACTS_DIR)/liquidity-wrapper
MARKETPLACE := $(CONTRACTS_DIR)/marketplace
METADATA_MANAGER := $(CONTRACTS_DIR)/metadata-manager
UL_NFT_CORE := $(CONTRACTS_DIR)/ul-nft-core
BUILD_DIR := target/wasm32-unknown-unknown/release
SCRIPTS_DIR := scripts

all: clean build deploy test

build: build_liquidity_wrapper build_marketplace build_metadata_manager build_ul_nft_core

build_liquidity_wrapper:
	@echo "Building Liquidity Wrapper contract..."
	cargo build --release --target wasm32-unknown-unknown --manifest-path $(LIQUIDITY_WRAPPER)/Cargo.toml

build_marketplace:
	@echo "Building Marketplace contract..."
	cargo build --release --target wasm32-unknown-unknown --manifest-path $(MARKETPLACE)/Cargo.toml

build_metadata_manager:
	@echo "Building Metadata Manager contract..."
	cargo build --release --target wasm32-unknown-unknown --manifest-path $(METADATA_MANAGER)/Cargo.toml

build_ul_nft_core:
	@echo "Building UL NFT Core contract..."
	cargo build --release --target wasm32-unknown-unknown --manifest-path $(UL_NFT_CORE)/Cargo.toml

deploy:
	@echo "Deploying contracts..."
	ts-node $(SCRIPTS_DIR)/deploy.ts

test:
	@echo "Running tests..."
	ts-node $(SCRIPTS_DIR)/test.ts

clean:
	@echo "Cleaning build artifacts..."
	cargo clean
	rm -rf $(BUILD_DIR)

.PHONY: all build deploy test clean build_liquidity_wrapper build_marketplace build_metadata_manager build_ul_nft_core
