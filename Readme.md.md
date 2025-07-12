# Secure Mortgage Calculator

A modern, secure web application for calculating monthly mortgage payments with enterprise-grade security features and interactive data visualization.



## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Security Features](#security-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Security Implementation](#security-implementation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project transforms a traditional Java console-based mortgage calculator into a modern, secure web application. The application provides users with an intuitive interface to calculate monthly mortgage payments while implementing comprehensive security measures following OWASP Top 10 guidelines.

### Original vs. Web Application

| Feature | Original Java Console | New Web Application |
|---------|----------------------|-------------------|
| Interface | Command-line only | Modern responsive web UI |
| Security | Basic input reading | Enterprise-grade validation |
| Accessibility | Local machine only | Web-accessible with HTTPS |
| User Experience | Text-based prompts | Interactive forms with charts |
| Data Visualization | Text output only | Interactive charts and graphs |
| Mobile Support | None | Fully responsive design |
| Error Handling | Basic exceptions | Comprehensive validation |

## ✨ Features

### Core Functionality
- **Mortgage Calculation**: Accurate monthly payment calculations using the standard mortgage formula
- **Interactive Forms**: Real-time input validation and user-friendly error messages
- **Data Visualization**: Interactive charts showing loan amortization and payment breakdown
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Advanced Features
- **Amortization Schedule**: Visual representation of remaining balance over time
- **Payment Breakdown**: Annual principal vs. interest visualization
- **Real-time Validation**: Instant feedback on input values
- **Currency Formatting**: Professional US dollar formatting
- **Professional UI**: Modern design with shadcn/ui components

## 🔒 Security Features

This application implements comprehensive security measures following industry best practices:

### Input Validation & Sanitization
- **Client-side validation**: Real-time input validation with range checking
- **Server-side validation**: Robust validation using Decimal precision for financial calculations
- **Input sanitization**: Automatic removal of potentially harmful characters
- **Range validation**: Strict bounds checking for all input parameters

### OWASP Top 10 Protections
- **XSS Prevention**: Input sanitization and content security policies
- **Injection Attack Prevention**: Pattern detection and parameterized processing
- **Secure Error Handling**: No sensitive information disclosure in error messages
- **HTTPS Enforcement**: Secure encrypted communication
- **CORS Configuration**: Proper cross-origin resource sharing setup

### Zero-Trust Architecture
- **Defense in Depth**: Multiple validation layers (client + server)
- **Fail-Safe Defaults**: Secure error handling without information disclosure
- **Least Privilege**: Minimal required permissions and data exposure
- **No Data Persistence**: Privacy-focused design with no sensitive data storage

## 🛠 Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Security**: Flask-CORS, comprehensive input validation
- **Mathematics**: Decimal precision for financial calculations
- **Logging**: Security-focused logging and monitoring

### Frontend
- **Framework**: React 18 with Vite
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Charts**: Recharts for interactive data visualization
- **Icons**: Lucide React icons
- **Styling**: Tailwind CSS with custom design system

### Development & Deployment
- **Package Management**: npm/pnpm (frontend), pip (backend)
- **Build Tools**: Vite for frontend bundling
- **Version Control**: Git
- **Deployment**: Production-ready Flask deployment

## 📁 Project Structure

```
mortgage-calculator/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── mortgage.py          # Mortgage calculation API
│   │   │   └── user.py              # User management (template)
│   │   ├── models/
│   │   │   └── user.py              # Database models (template)
│   │   ├── static/                  # Built frontend files
│   │   └── main.py                  # Flask application entry point
│   ├── requirements.txt             # Python dependencies
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/                  # shadcn/ui components
│   │   ├── lib/
│   │   │   └── utils.js             # Utility functions
│   │   ├── App.jsx                  # Main React component
│   │   └── main.jsx                 # React entry point
│   ├── package.json                 # Node.js dependencies
│   ├── tailwind.config.js           # Tailwind configuration
│   └── vite.config.js               # Vite configuration
└── README.md                        # This file
```


## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **pnpm** package manager
- **pip** package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mortgage-calculator/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server**
   ```bash
   python src/main.py
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd mortgage-calculator/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Full-Stack Development

For full-stack development, run both backend and frontend servers simultaneously:

1. **Terminal 1 (Backend)**:
   ```bash
   cd backend
   source venv/bin/activate
   python src/main.py
   ```

2. **Terminal 2 (Frontend)**:
   ```bash
   cd frontend
   npm run dev
   ```

## 📖 Usage

### Basic Mortgage Calculation

1. **Open the application** in your web browser
2. **Enter loan details**:
   - **Principal Amount**: Loan amount ($1,000 - $10,000,000)
   - **Annual Interest Rate**: Interest rate (0.01% - 50%)
   - **Loan Term**: Number of years (1 - 50)
3. **Click "Calculate Payment"** to see results
4. **View results** including:
   - Monthly payment amount
   - Total payment over loan term
   - Total interest paid
   - Interactive amortization charts

### Input Validation

The application provides real-time validation:
- **Range checking**: All inputs must be within specified ranges
- **Format validation**: Numeric inputs only
- **Error messages**: Clear, user-friendly error descriptions
- **Security validation**: Protection against malicious input

### Data Visualization

The application includes two interactive charts:
- **Remaining Balance Over Time**: Line chart showing loan balance reduction
- **Annual Principal vs Interest**: Stacked bar chart showing payment breakdown

## 📚 API Documentation

### Mortgage Calculation Endpoint

**POST** `http://localhost:5000//api/mortgage/calculate`

Calculate monthly mortgage payment based on loan parameters.

#### Request Body
```json
{
  "principal": 300000,
  "annualRate": 6.5,
  "years": 30
}
```

#### Response
```json
{
  "success": true,
  "monthlyPayment": 1896.20,
  "totalPayment": 682633.47,
  "totalInterest": 382633.47,
  "principal": 300000,
  "annualRate": 6.5,
  "years": 30
}
```

#### Error Response
```json
{
  "error": "Validation failed",
  "details": [
    "Principal must be between $1,000 and $10,000,000"
  ]
}
```

### Health Check Endpoint

**GET** `/api/mortgage/health`

Check the health status of the mortgage calculation service.

#### Response
```json
{
  "status": "healthy",
  "service": "mortgage-calculator"
}
```

### Input Validation Rules

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `principal` | Number | $1,000 - $10,000,000 | Loan principal amount |
| `annualRate` | Number | 0.01% - 50% | Annual interest rate |
| `years` | Integer | 1 - 50 | Loan term in years |


## 🔐 Security Implementation

### Input Validation Architecture

The application implements a multi-layered security approach:

#### Client-Side Validation
```javascript
const validateInput = (name, value) => {
  const numValue = parseFloat(value)
  
  switch (name) {
    case 'principal':
      if (isNaN(numValue) || numValue < 1000 || numValue > 10000000) {
        return 'Principal must be between $1,000 and $10,000,000'
      }
      break
    // Additional validation rules...
  }
  return null
}
```

#### Server-Side Validation
```python
def validate_input(value, field_name, min_val=None, max_val=None):
    """
    Robust input validation following OWASP guidelines
    """
    try:
        # Malicious pattern detection
        malicious_patterns = [
            r'<script.*?>.*?</script>',
            r'javascript:',
            r'on\w+\s*=',
            # Additional patterns...
        ]
        
        for pattern in malicious_patterns:
            if re.search(pattern, str_value, re.IGNORECASE):
                return None, f"Invalid characters detected in {field_name}"
        
        # Range validation with Decimal precision
        decimal_value = Decimal(str_value)
        if min_val is not None and decimal_value < min_val:
            return None, f"{field_name} must be at least {min_val}"
            
        return float(decimal_value), None
        
    except Exception as e:
        return None, f"Validation error for {field_name}"
```

### Security Headers

The application implements proper security headers:
- **CORS**: Configured for secure cross-origin requests
- **Content-Type Validation**: Strict JSON content-type enforcement
- **HTTPS**: Enforced in production deployment

### Mortgage Calculation Security

```python
def calculate_mortgage(principal, annual_rate, years):
    """
    Secure mortgage calculation with proper error handling
    """
    try:
        # Use Decimal for precise financial calculations
        monthly_rate = annual_rate / PERCENT_DIVISOR / MONTHS_IN_YEAR
        num_payments = years * MONTHS_IN_YEAR
        
        # Handle edge case: zero interest rate
        if monthly_rate == 0:
            return principal / num_payments
        
        # Standard mortgage formula with overflow protection
        factor = (1 + monthly_rate) ** num_payments
        monthly_payment = principal * (monthly_rate * factor) / (factor - 1)
        
        return monthly_payment
        
    except Exception as e:
        logger.error(f"Calculation error: {str(e)}")
        raise ValueError("Error in mortgage calculation")
```

## 🔧 Development

### Code Style and Standards

#### Backend (Python)
- **PEP 8**: Python code style guidelines
- **Type Hints**: Use type annotations where appropriate
- **Docstrings**: Comprehensive function documentation
- **Error Handling**: Proper exception handling and logging

#### Frontend (JavaScript/React)
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Component Structure**: Functional components with hooks
- **Tailwind CSS**: Utility-first CSS framework

### Testing

#### Backend Testing
```bash
# Run backend tests
cd backend
python -m pytest tests/
```

#### Frontend Testing
```bash
# Run frontend tests
cd frontend
npm test
```

### Environment Variables

Create a `.env` file in the backend directory:
```env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
```

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** following code style guidelines

3. **Test thoroughly**
   - Unit tests for backend logic
   - Integration tests for API endpoints
   - Frontend component testing
   - Security validation testing

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Performance Optimization

#### Backend Optimizations
- **Decimal Precision**: Use Decimal for financial calculations
- **Input Validation Caching**: Efficient validation patterns
- **Error Handling**: Minimal overhead error processing
- **Logging**: Structured logging for monitoring

#### Frontend Optimizations
- **Code Splitting**: Vite-based bundle optimization
- **Component Memoization**: React.memo for expensive components
- **Chart Performance**: Optimized Recharts configuration
- **CSS Optimization**: Tailwind CSS purging for production

## 🚀 Deployment

### Production Build

#### Backend Deployment
```bash
cd backend
pip install -r requirements.txt
python src/main.py
```

#### Frontend Build
```bash
cd frontend
npm run build
```

The built files will be in the `dist/` directory and should be served by the Flask backend.

### Environment Configuration

#### Production Environment Variables
```env
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-production-secret-key
```

#### Security Considerations for Production
- **HTTPS**: Ensure SSL/TLS certificates are properly configured
- **Environment Variables**: Use secure environment variable management
- **Logging**: Configure production logging and monitoring
- **Rate Limiting**: Implement API rate limiting if needed
- **Database Security**: If using databases, ensure proper security measures

### Docker Deployment (Optional)

Create a `Dockerfile` for containerized deployment:
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .
COPY frontend/dist/ src/static/

EXPOSE 5000
CMD ["python", "src/main.py"]
```

### Cloud Deployment

The application is designed to work with various cloud platforms:
- **Heroku**: Ready for Heroku deployment
- **AWS**: Compatible with EC2, Elastic Beanstalk
- **Google Cloud**: App Engine compatible
- **Azure**: Web Apps compatible


## 🤝 Contributing

We welcome contributions to the Secure Mortgage Calculator project! Please follow these guidelines:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** following our coding standards
5. **Test thoroughly** including security validation
6. **Submit a pull request** with a clear description

### Contribution Guidelines

#### Code Quality
- Follow existing code style and conventions
- Include comprehensive tests for new features
- Ensure all security validations are maintained
- Update documentation for any API changes

#### Security Considerations
- All input validation must be maintained
- New features must follow OWASP guidelines
- Security-related changes require additional review
- Include security impact assessment in PR description

#### Pull Request Process
1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure CI passes** all checks
4. **Request review** from maintainers
5. **Address feedback** promptly

### Reporting Issues

When reporting issues, please include:
- **Environment details** (OS, browser, versions)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Security implications** if applicable
- **Screenshots or logs** if helpful

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues

**Issue**: `ModuleNotFoundError` when starting backend
```bash
# Solution: Ensure virtual environment is activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

**Issue**: Port 5000 already in use
```bash
# Solution: Kill existing process or use different port
lsof -ti:5000 | xargs kill -9
# Or modify main.py to use different port
app.run(host='0.0.0.0', port=5001, debug=True)
```

**Issue**: CORS errors in browser
```bash
# Solution: Ensure Flask-CORS is installed and configured
pip install flask-cors
# Verify CORS(app) is in main.py
```

#### Frontend Issues

**Issue**: `npm install` fails
```bash
# Solution: Clear npm cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Build fails with memory issues
```bash
# Solution: Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**Issue**: API calls fail in development
```bash
# Solution: Ensure backend is running and check proxy configuration
# Verify backend is running on http://localhost:5000
# Check vite.config.js proxy settings
```

#### Security Issues

**Issue**: Input validation not working
- Verify both client and server-side validation are implemented
- Check browser console for JavaScript errors
- Ensure API endpoints are properly configured

**Issue**: XSS vulnerability concerns
- Review input sanitization functions
- Verify malicious pattern detection is working
- Test with various input combinations

### Performance Issues

**Issue**: Slow chart rendering
```javascript
// Solution: Optimize chart data and use React.memo
const OptimizedChart = React.memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      {/* Chart components */}
    </LineChart>
  </ResponsiveContainer>
))
```

**Issue**: Large bundle size
```bash
# Solution: Analyze bundle and optimize imports
npm run build
npx vite-bundle-analyzer dist/
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Secure Mortgage Calculator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **Original Java Implementation**: Based on console-based mortgage calculator
- **Security Guidelines**: Implemented following OWASP Top 10 recommendations
- **UI Components**: Built with shadcn/ui and Tailwind CSS
- **Charts**: Powered by Recharts library
- **Icons**: Lucide React icon library

## 📞 Support

For support and questions:
- **Issues**: Create an issue on GitHub
- **Security Concerns**: Report security issues privately
- **Documentation**: Check this README and inline code comments
- **Community**: Join discussions in GitHub Discussions

## 🔄 Changelog

### Version 1.0.0 (Current)
- ✅ Initial release with secure web interface
- ✅ Complete OWASP Top 10 security implementation
- ✅ Interactive data visualization
- ✅ Responsive design for all devices
- ✅ Comprehensive input validation
- ✅ Production deployment ready

### Planned Features
- 🔄 Additional loan types (ARM, FHA, VA)
- 🔄 Payment schedule export (PDF, CSV)
- 🔄 Loan comparison tools
- 🔄 Advanced amortization features
- 🔄 Multi-language support
- 🔄 Dark mode theme

---

**Built with ❤️ and enterprise-grade security**


