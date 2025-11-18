#!/usr/bin/env python3
"""
E2E Test Runner for Mifulacm Demo App

This script provides a Python-based interface for running Robot Framework E2E tests.
"""

import argparse
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import List, Optional

try:
    import requests
except ImportError:
    requests = None


class Colors:
    """ANSI color codes for terminal output"""
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'  # No Color


def print_colored(message: str, color: str = Colors.NC):
    """Print colored message to terminal"""
    print(f"{color}{message}{Colors.NC}")


def check_service_health(url: str, service_name: str, max_retries: int = 3) -> bool:
    """Check if a service is running and healthy"""
    if requests is None:
        print_colored("Warning: requests library not installed, skipping health check", Colors.YELLOW)
        return True

    print_colored(f"Checking if {service_name} is running at {url}...", Colors.YELLOW)

    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=5)
            if 200 <= response.status_code < 300:
                print_colored(f"✓ {service_name} is running", Colors.GREEN)
                return True
        except requests.RequestException:
            if attempt < max_retries - 1:
                time.sleep(1)
            continue

    print_colored(f"✗ {service_name} is not accessible at {url}", Colors.RED)
    return False


def run_robot_tests(
    test_path: str,
    results_dir: str,
    headless: bool = False,
    slow_mo: float = 0.0,
    tags: Optional[str] = None,
    exclude_tags: Optional[str] = None,
    rerun_failed: bool = False,
) -> int:
    """Run Robot Framework tests with specified options"""

    # Build robot command
    cmd: List[str] = [
        "uv", "run", "robot",
        "-d", results_dir,
        "-v", f"HEADLESS:{headless}",
        "-v", f"SLOW_MO:{slow_mo}",
    ]

    # Add tag filters
    if tags:
        cmd.extend(["--include", tags])

    if exclude_tags:
        cmd.extend(["--exclude", exclude_tags])

    # Add rerun failed option
    if rerun_failed:
        output_xml = Path(results_dir) / "output.xml"
        if output_xml.exists():
            cmd.extend(["--rerunfailed", str(output_xml)])
        else:
            print_colored("Warning: No previous output.xml found, ignoring --rerun-failed", Colors.YELLOW)

    cmd.append(test_path)

    # Print configuration
    print_colored("=== E2E Test Execution ===", Colors.GREEN)
    print(f"Headless mode: {headless}")
    print(f"Slow motion: {slow_mo}s")
    if tags:
        print(f"Include tags: {tags}")
    if exclude_tags:
        print(f"Exclude tags: {exclude_tags}")
    print(f"Test path: {test_path}")
    print(f"Results directory: {results_dir}")
    print()

    # Execute the tests
    print_colored("Starting test execution...", Colors.GREEN)
    print(f"Command: {' '.join(cmd)}")
    print()

    try:
        result = subprocess.run(cmd, check=False, timeout=600)
        return result.returncode
    except FileNotFoundError as exc:
        print_colored("Error: Required tool not found (uv/robot?)", Colors.RED)
        print(f"Missing executable while running: {' '.join(cmd)}")
        print(f"Exception: {exc}")
        print("Install robotframework and robotframework-browser (e.g., pip install robotframework robotframework-browser)")
        return 1
    except subprocess.TimeoutExpired:
        print_colored("Error: Test run timed out", Colors.RED)
        return 1


def main() -> int:
    parser = argparse.ArgumentParser(
        description="E2E Test Runner for Mifulacm Demo App",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_tests.py                          # Run all tests with browser visible
  python run_tests.py --headless               # Run all tests in headless mode
  python run_tests.py -s sites_list            # Run only sites_list suite
  python run_tests.py -t smoke                 # Run only tests tagged as 'smoke'
  python run_tests.py --slow                   # Run with slow motion for debugging
  python run_tests.py --rerun-failed           # Rerun only failed tests from last run
        """
    )

    parser.add_argument(
        "-s", "--suite",
        help="Run specific suite (sites_list or sites_form)",
        choices=["sites_list", "sites_form"],
    )

    parser.add_argument(
        "-t", "--tags",
        help="Run tests with specific tags (e.g., 'smoke', 'critical')",
    )

    parser.add_argument(
        "-e", "--exclude-tags",
        help="Exclude tests with specific tags",
    )

    parser.add_argument(
        "--headless",
        action="store_true",
        default=os.getenv("HEADLESS", "False").lower() == "true",
        help="Run in headless mode (no browser window)",
    )

    parser.add_argument(
        "--slow",
        action="store_true",
        help="Run with slow motion (1 second delay per action)",
    )

    parser.add_argument(
        "--skip-health-check",
        action="store_true",
        help="Skip backend/frontend health checks",
    )

    parser.add_argument(
        "--rerun-failed",
        action="store_true",
        help="Rerun only failed tests from the last run",
    )

    args = parser.parse_args()

    # Determine project paths
    script_dir = Path(__file__).parent
    e2e_dir = script_dir
    results_dir = e2e_dir / "results"

    # Create results directory
    results_dir.mkdir(exist_ok=True)

    # Check required tests folder exists
    tests_dir = e2e_dir / "tests"
    if not tests_dir.exists():
        print_colored("Error: e2e/tests directory not found", Colors.RED)
        print("Ensure you run from apps/ and that e2e/tests exists")
        return 1

    # Determine test path
    if args.suite:
        test_path = str(tests_dir / f"{args.suite}.robot")
        if not Path(test_path).exists():
            print_colored(f"Error: Test suite '{args.suite}' not found at {test_path}", Colors.RED)
            return 1
    else:
        test_path = str(tests_dir)

    # Health checks
    backend_url = os.getenv("API_URL", "http://localhost:8000") + "/health"
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:4200")

    if not args.skip_health_check:
        backend_ok = check_service_health(backend_url, "Backend")
        frontend_ok = check_service_health(frontend_url, "Frontend")

        if not backend_ok:
            print_colored("Please start the backend first: nx serve api", Colors.RED)
            return 1

        if not frontend_ok:
            print_colored("Please start the frontend first: nx serve frontend", Colors.RED)
            return 1

        print()

    # Run tests
    env_slow_mo = float(os.getenv("SLOW_MO", "0"))
    slow_mo = 1.0 if args.slow else env_slow_mo
    exit_code = run_robot_tests(
        test_path=test_path,
        results_dir=str(results_dir),
        headless=args.headless,
        slow_mo=slow_mo,
        tags=args.tags,
        exclude_tags=args.exclude_tags,
        rerun_failed=args.rerun_failed,
    )

    # Print results
    print()
    if exit_code == 0:
        print_colored("=== Tests completed successfully! ===", Colors.GREEN)
    else:
        print_colored("=== Tests failed! ===", Colors.RED)

    print()
    print("Test reports:")
    print(f"  Report: {results_dir}/report.html")
    print(f"  Log:    {results_dir}/log.html")
    print()
    print("To view reports:")
    print(f"  open {results_dir}/report.html")

    return exit_code


if __name__ == "__main__":
    sys.exit(main())
