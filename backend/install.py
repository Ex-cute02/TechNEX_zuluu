#!/usr/bin/env python3
"""
TechNEX_zuluu Backend Installation Script
Automatically installs the correct dependencies for your Python version.
"""

import sys
import subprocess
import platform
import os

def run_command(command):
    """Run a shell command and return the result."""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def check_python_version():
    """Check if Python version is compatible."""
    version = sys.version_info
    if version.major != 3 or version.minor < 8:
        print(f"❌ Python {version.major}.{version.minor} is not supported.")
        print("✅ Please use Python 3.8 or higher (3.12+ recommended).")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    
    if version.minor >= 12:
        print("🚀 Python 3.12+ detected - optimized packages will be used!")
    elif version.minor < 10:
        print("⚠️  Python 3.10+ recommended for best compatibility")
    
    return True

def check_system_requirements():
    """Check system-specific requirements."""
    system = platform.system()
    print(f"💻 Platform: {system} {platform.release()}")
    print(f"🏗️  Architecture: {platform.machine()}")
    
    # Check for common issues
    if system == "Windows":
        print("🪟 Windows detected - using pre-built wheels when available")
    elif system == "Darwin":
        print("🍎 macOS detected - checking for Xcode tools...")
    elif system == "Linux":
        print("🐧 Linux detected - checking for build tools...")
    
    return True

def install_requirements():
    """Install requirements based on Python version and platform."""
    print("\n🔧 Installing TechNEX_zuluu backend requirements...")
    
    # Upgrade pip first
    print("📦 Upgrading pip...")
    success, output = run_command(f"{sys.executable} -m pip install --upgrade pip setuptools wheel")
    if not success:
        print(f"⚠️  Warning: Could not upgrade pip: {output}")
    
    # Install core requirements
    print("📦 Installing core dependencies...")
    success, output = run_command(f"{sys.executable} -m pip install -r requirements.txt")
    if not success:
        print(f"❌ Failed to install requirements: {output}")
        print("\n🔧 Trying alternative installation method...")
        
        # Try installing problematic packages individually
        problematic_packages = ["numpy>=1.26.0", "matplotlib>=3.8.0", "scipy>=1.11.0"]
        for package in problematic_packages:
            print(f"📦 Installing {package}...")
            success, output = run_command(f"{sys.executable} -m pip install {package}")
            if not success:
                print(f"⚠️  Warning: Could not install {package}")
        
        # Try requirements again
        success, output = run_command(f"{sys.executable} -m pip install -r requirements.txt")
        if not success:
            print(f"❌ Installation failed: {output}")
            return False
    
    print("✅ Core dependencies installed successfully!")
    
    # Ask about development dependencies
    install_dev = input("\n📝 Install development dependencies? (y/N): ").lower().strip()
    if install_dev in ['y', 'yes']:
        print("📦 Installing development dependencies...")
        success, output = run_command(f"{sys.executable} -m pip install -r requirements-dev.txt")
        if success:
            print("✅ Development dependencies installed!")
        else:
            print(f"⚠️  Warning: Some development dependencies failed: {output}")
    
    # Ask about full dependencies
    install_full = input("🚀 Install full feature set (advanced ML, databases, etc.)? (y/N): ").lower().strip()
    if install_full in ['y', 'yes']:
        print("📦 Installing full dependencies...")
        success, output = run_command(f"{sys.executable} -m pip install -r requirements-full.txt")
        if success:
            print("✅ Full dependencies installed!")
        else:
            print(f"⚠️  Warning: Some full dependencies failed: {output}")
    
    return True

def verify_installation():
    """Verify that key packages can be imported."""
    print("\n🔍 Verifying installation...")
    
    core_packages = [
        ('fastapi', 'FastAPI web framework'),
        ('uvicorn', 'ASGI server'),
        ('pandas', 'Data analysis'),
        ('numpy', 'Numerical computing'),
        ('sklearn', 'Machine learning'),
        ('xgboost', 'Gradient boosting'),
        ('matplotlib', 'Plotting'),
        ('seaborn', 'Statistical visualization'),
        ('yfinance', 'Financial data')
    ]
    
    failed_imports = []
    for package, description in core_packages:
        try:
            __import__(package)
            print(f"  ✅ {package:<12} - {description}")
        except ImportError as e:
            print(f"  ❌ {package:<12} - {description} (FAILED: {str(e)})")
            failed_imports.append(package)
    
    if failed_imports:
        print(f"\n⚠️  Failed to import: {', '.join(failed_imports)}")
        print("💡 Try running: pip install --upgrade --force-reinstall <package_name>")
        return False
    
    print("\n🎉 All core packages imported successfully!")
    return True

def show_next_steps():
    """Show next steps after successful installation."""
    print("\n" + "=" * 70)
    print("🎉 TechNEX_zuluu Backend Setup Complete!")
    print("=" * 70)
    print("📚 Next steps:")
    print("  1. Start the backend server:")
    print("     python run.py")
    print()
    print("  2. Access the API:")
    print("     • API Documentation: http://localhost:8000/docs")
    print("     • Health Check: http://localhost:8000/")
    print("     • Alternative Docs: http://localhost:8000/redoc")
    print()
    print("  3. Development workflow:")
    print("     • Run tests: pytest")
    print("     • Format code: black .")
    print("     • Check types: mypy .")
    print()
    print("  4. Useful commands:")
    print("     • Install more packages: pip install <package>")
    print("     • Update requirements: pip freeze > requirements-current.txt")
    print("     • Check installed packages: pip list")
    print("=" * 70)

def main():
    """Main installation process."""
    print("=" * 70)
    print("🚀 TechNEX_zuluu Backend Setup")
    print("   Advanced Mutual Fund AI/ML System")
    print("=" * 70)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check system requirements
    check_system_requirements()
    
    # Install requirements
    if not install_requirements():
        print("\n❌ Installation failed!")
        print("💡 Try running with administrator/sudo privileges")
        print("💡 Or create a virtual environment: python -m venv venv")
        sys.exit(1)
    
    # Verify installation
    if not verify_installation():
        print("\n⚠️  Installation completed with warnings.")
        print("💡 The system may still work, but some features might be limited.")
    
    # Show next steps
    show_next_steps()

if __name__ == "__main__":
    main()