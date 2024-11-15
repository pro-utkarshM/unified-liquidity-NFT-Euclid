# Environment variables
DOCKER_TAG := 0.15.0
OPTIMIZER_IMAGE := cosmwasm/workspace-optimizer-arm64:$(DOCKER_TAG)

# Paths
CONTRACTS_DIR := contracts
ARTIFACTS_DIR := artifacts
SCRIPTS_DIR := scripts

# Ensure directories exist
$(shell mkdir -p $(ARTIFACTS_DIR))

# Generate lockfile if it doesn't exist
.PHONY: ensure-lockfile
ensure-lockfile:
	@if [ ! -f "Cargo.lock" ]; then \
		echo "Generating Cargo.lock..."; \
		cargo generate-lockfile; \
	fi

.PHONY: optimize
optimize: clean ensure-lockfile
	@echo "Checking Docker..."
	@if ! docker info > /dev/null 2>&1; then \
		echo "Docker is not running or not accessible"; \
		exit 1; \
	fi

	@echo "Optimizing contracts using Docker..."
	docker run --rm -v "$(shell pwd):/code" \
		--mount type=volume,source="$(shell basename $(shell pwd))_cache",target=/code/target \
		--mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
		--platform linux/arm64 \
		$(OPTIMIZER_IMAGE)
	@echo "Optimization complete! Optimized contracts are in the $(ARTIFACTS_DIR) directory"

.PHONY: clean
clean:
	@echo "Cleaning up build artifacts..."
	rm -rf target/
	rm -rf $(ARTIFACTS_DIR)
	rm -rf contracts/target/

# Don't remove Cargo.lock in clean anymore
.PHONY: clean-full
clean-full: clean
	@echo "Removing Cargo.lock files..."
	rm -f Cargo.lock
	rm -f contracts/*/Cargo.lock

.PHONY: build
build: ensure-lockfile
	@echo "Building all contracts locally..."
	cargo build --release --target wasm32-unknown-unknown

.PHONY: test
test: ensure-lockfile
	@echo "Running contract tests..."
	cargo test

.PHONY: schema
schema: ensure-lockfile
	@echo "Generating schema for all contracts..."
	cd $(CONTRACTS_DIR)/ul-nft-core && cargo schema
	cd $(CONTRACTS_DIR)/marketplace && cargo schema
	cd $(CONTRACTS_DIR)/liquidity-wrapper && cargo schema
	cd $(CONTRACTS_DIR)/metadata-manager && cargo schema

.PHONY: check-size
check-size:
	@echo "Checking contract sizes..."
	@for file in $(ARTIFACTS_DIR)/*.wasm; do \
		echo "$$file - $$(ls -lh $$file | awk '{print $$5}')"; \
	done

# Help command
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make optimize     - Optimize contracts using Docker (recommended for deployment)"
	@echo "  make build       - Build contracts locally (for development)"
	@echo "  make test        - Run contract tests"
	@echo "  make schema      - Generate schema for all contracts"
	@echo "  make clean       - Clean up build artifacts"
	@echo "  make clean-full  - Clean up everything including Cargo.lock"
	@echo "  make check-size  - Check optimized contract sizes"
