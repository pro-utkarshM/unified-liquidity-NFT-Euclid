#!/bin/bash
rm -rf target/
rm -rf artifacts/
rm -rf contracts/target/
find . -name "Cargo.lock" -type f -delete
