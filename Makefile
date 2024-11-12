# Environment variables
DOCKER_TAG := 0.12.11
OPTIMIZER_IMAGE := cosmwasm/workspace-optimizer:$(DOCKER_TAG)
RUST_OPTIMIZER_IMAGE := cosmwasm/rust-optimizer:$(DOCKER_TAG)

# Paths
CONTRACTS_DIR := contracts
ARTIFACTS_DIR := artifacts
SCRIPTS_DIR := scripts

# Ensure artifacts directory exists
$(shell mkdir -p $(ARTIFACTS_DIR))

.PHONY: optimize
optimize:
	@echo "Optimizing contracts using Docker..."
	docker run --rm -v "$(shell pwd):/code" \
		--mount type=volume,source="$(shell basename $(shell pwd))_cache",target=/code/target \
		--mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
		--platform linux/arm64 \
		$(OPTIMIZER_IMAGE)
	@echo "Optimization complete! Optimized contracts are in the $(ARTIFACTS_DIR) directory"
	
	
# Local building (for development)
.PHONY: build
build: clean-target
	@echo "Building all contracts locally..."
	cd $(CONTRACTS_DIR) && cargo build --release --target wasm32-unknown-unknown


# Testing
.PHONY: test
test:
	@echo "Running contract tests..."
	cd $(CONTRACTS_DIR) && cargo test

# Generate schema
.PHONY: schema
schema:
	@echo "Generating schema for all contracts..."
	cd $(CONTRACTS_DIR)/ul-nft-core && cargo schema
	cd $(CONTRACTS_DIR)/marketplace && cargo schema
	cd $(CONTRACTS_DIR)/liquidity-wrapper && cargo schema
	cd $(CONTRACTS_DIR)/metadata-manager && cargo schema

# Clean everything
.PHONY: clean
clean: clean-target clean-artifacts

# Clean just target directories
.PHONY: clean-target
clean-target:
	@echo "Cleaning target directories..."
	cd $(CONTRACTS_DIR) && cargo clean
	rm -rf target

# Clean artifacts
.PHONY: clean-artifacts
clean-artifacts:
	@echo "Cleaning artifacts..."
	rm -rf $(ARTIFACTS_DIR)

# Clear cache (useful for dependency issues)
.PHONY: clear-cache
clear-cache:
	@echo "Clearing all caches..."
	@sh clear-cache.sh

# Check contract sizes
.PHONY: check-size
check-size:
	@echo "Checking contract sizes..."
	@for file in $(ARTIFACTS_DIR)/*.wasm; do \
		echo "$$file - $$(ls -lh $$file | awk '{print $$5}')"; \
	done

# Check contract sizes
.PHONY: check-size
check-size:
	@echo "Checking contract sizes..."
	@for file in $(ARTIFACTS_DIR)/*.wasm; do \
		echo "$$file - $$(ls -lh $$file | awk '{print $$5}')"; \
	done

# Deploy to testnet (requires .env configuration)
.PHONY: deploy-testnet
deploy-testnet: optimize
	@echo "Deploying to Archway testnet..."
	node $(SCRIPTS_DIR)/deploy.ts testnet

# Deploy to mainnet (requires .env configuration)
.PHONY: deploy-mainnet
deploy-mainnet: optimize
	@echo "Deploying to Archway mainnet..."
	node $(SCRIPTS_DIR)/deploy.ts mainnet

# Help command
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make optimize     - Optimize contracts using Docker (recommended for deployment)"
	@echo "  make build       - Build contracts locally (for development)"
	@echo "  make test        - Run contract tests"
	@echo "  make schema      - Generate schema for all contracts"
	@echo "  make clean       - Clean up build artifacts"
	@echo "  make check-size  - Check optimized contract sizes"
	@echo "  make deploy-testnet - Deploy to Archway testnet"
	@echo "  make deploy-mainnet - Deploy to Archway mainnet"