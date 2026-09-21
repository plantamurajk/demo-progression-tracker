#!/bin/bash
set -e

# Install frontend dependencies
npm install --prefix /home/runner/workspace

# Install backend dependencies
npm install --prefix /home/runner/workspace/backend
