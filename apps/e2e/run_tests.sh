#!/bin/bash

# E2E Test Runner Script for Mifulacm Demo App
# Usage: ./run_tests.sh [options]
#
# Options:
#   -h, --headless    Run in headless mode (no browser window)
#   -s, --suite       Run specific suite (sites_list or sites_form)
#   -t, --tags        Run tests with specific tags (e.g., "smoke" or "critical")
#   --slow            Run with slow motion (1 second delay per action)
#   --help            Show this help message

set -e

# Default values (overridable by env)
HEADLESS=${HEADLESS:-"False"}
SLOW_MO=${SLOW_MO:-"0.0"}
SUITE=""
TAGS=""
RESULTS_DIR="e2e/results"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--headless)
      HEADLESS="True"
      shift
      ;;
    -s|--suite)
      SUITE="$2"
      shift 2
      ;;
    -t|--tags)
      TAGS="$2"
      shift 2
      ;;
    --slow)
      SLOW_MO="1.0"
      shift
      ;;
    --help)
      echo "E2E Test Runner for Mifulacm Demo App"
      echo ""
      echo "Usage: ./run_tests.sh [options]"
      echo ""
      echo "Options:"
      echo "  -h, --headless    Run in headless mode (no browser window)"
      echo "  -s, --suite       Run specific suite (sites_list or sites_form)"
      echo "  -t, --tags        Run tests with specific tags (e.g., 'smoke' or 'critical')"
      echo "  --slow            Run with slow motion (1 second delay per action)"
      echo "  --help            Show this help message"
      echo ""
      echo "Examples:"
      echo "  ./run_tests.sh                          # Run all tests with browser visible"
      echo "  ./run_tests.sh --headless               # Run all tests in headless mode"
      echo "  ./run_tests.sh -s sites_list            # Run only sites_list suite"
      echo "  ./run_tests.sh -t smoke                 # Run only tests tagged as 'smoke'"
      echo "  ./run_tests.sh --slow                   # Run with slow motion for debugging"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Check if we're in the right directory
if [ ! -d "e2e" ]; then
  echo -e "${RED}Error: e2e directory not found${NC}"
  echo "Please run this script from the apps/ directory"
  exit 1
fi

# Check if Robot Framework Browser is installed
if ! uv run robot --version &> /dev/null; then
  echo -e "${RED}Error: Robot Framework not found${NC}"
  echo "Please install it first: uv pip install robotframework-browser"
  exit 1
fi

# Create results directory
mkdir -p "$RESULTS_DIR"

# Build the robot command
ROBOT_CMD="uv run robot -d $RESULTS_DIR"
ROBOT_CMD="$ROBOT_CMD -v HEADLESS:$HEADLESS"
ROBOT_CMD="$ROBOT_CMD -v SLOW_MO:$SLOW_MO"

# Add tags filter if specified
if [ -n "$TAGS" ]; then
  ROBOT_CMD="$ROBOT_CMD --include $TAGS"
fi

# Determine which tests to run
if [ -n "$SUITE" ]; then
  TEST_PATH="e2e/tests/${SUITE}.robot"
  if [ ! -f "$TEST_PATH" ]; then
    echo -e "${RED}Error: Test suite '$SUITE' not found at $TEST_PATH${NC}"
    exit 1
  fi
else
  TEST_PATH="e2e/tests/"
fi

# Print configuration
echo -e "${GREEN}=== E2E Test Execution ===${NC}"
echo "Headless mode: $HEADLESS"
echo "Slow motion: $SLOW_MO"
[ -n "$SUITE" ] && echo "Suite: $SUITE"
[ -n "$TAGS" ] && echo "Tags: $TAGS"
echo "Test path: $TEST_PATH"
echo "Results directory: $RESULTS_DIR"
echo ""

# Check if backend is running
echo -e "${YELLOW}Checking if backend is running...${NC}"
BACKEND_URL=${API_URL:-http://localhost:8000}/health
if ! curl --max-time 5 --connect-timeout 2 -s "$BACKEND_URL" > /dev/null 2>&1; then
  echo -e "${RED}Error: Backend not running at $BACKEND_URL${NC}"
  echo "Please start the backend first: nx serve api"
  exit 1
fi
echo -e "${GREEN}✓ Backend is running${NC}"

# Check if frontend is running
echo -e "${YELLOW}Checking if frontend is running...${NC}"
FRONTEND_URL=${FRONTEND_URL:-http://localhost:4200}
if ! curl --max-time 5 --connect-timeout 2 -s "$FRONTEND_URL" > /dev/null 2>&1; then
  echo -e "${RED}Error: Frontend not running at $FRONTEND_URL${NC}"
  echo "Please start the frontend first: nx serve frontend"
  exit 1
fi
echo -e "${GREEN}✓ Frontend is running${NC}"

# Run the tests
echo ""
echo -e "${GREEN}Starting test execution...${NC}"
echo "Command: $ROBOT_CMD $TEST_PATH"
echo ""

# Execute the tests
if $ROBOT_CMD $TEST_PATH; then
  echo ""
  echo -e "${GREEN}=== Tests completed successfully! ===${NC}"
  EXIT_CODE=0
else
  echo ""
  echo -e "${RED}=== Tests failed! ===${NC}"
  EXIT_CODE=1
fi

# Print results location
echo ""
echo "Test reports:"
echo "  Report: $RESULTS_DIR/report.html"
echo "  Log:    $RESULTS_DIR/log.html"
echo ""
echo "To view reports:"
echo "  open $RESULTS_DIR/report.html"

exit $EXIT_CODE
