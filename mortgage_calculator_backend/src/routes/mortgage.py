from flask import Blueprint, request, jsonify
import re
from decimal import Decimal, InvalidOperation
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

mortgage_bp = Blueprint('mortgage', __name__)

def validate_input(value, field_name, min_val=None, max_val=None):
    """
    Robust input validation following OWASP guidelines
    Implements defense-in-depth patterns with multiple validation layers
    """
    try:
        # Convert to string and strip whitespace
        str_value = str(value).strip()
        
        # Check for empty input
        if not str_value:
            return None, f"{field_name} cannot be empty"
        
        # Check for malicious patterns (basic XSS/injection prevention)
        malicious_patterns = [
            r'<script.*?>.*?</script>',
            r'javascript:',
            r'on\w+\s*=',
            r'<.*?>',
            r'[;&|`$]',
            r'union\s+select',
            r'drop\s+table',
            r'insert\s+into',
            r'delete\s+from'
        ]
        
        for pattern in malicious_patterns:
            if re.search(pattern, str_value, re.IGNORECASE):
                logger.warning(f"Malicious pattern detected in {field_name}: {str_value}")
                return None, f"Invalid characters detected in {field_name}"
        
        # Convert to Decimal for precise financial calculations
        try:
            decimal_value = Decimal(str_value)
        except (InvalidOperation, ValueError):
            return None, f"{field_name} must be a valid number"
        
        # Range validation
        if min_val is not None and decimal_value < min_val:
            return None, f"{field_name} must be at least {min_val}"
        
        if max_val is not None and decimal_value > max_val:
            return None, f"{field_name} must be no more than {max_val}"
        
        return float(decimal_value), None
        
    except Exception as e:
        logger.error(f"Validation error for {field_name}: {str(e)}")
        return None, f"Validation error for {field_name}"

def calculate_mortgage(principal, annual_rate, years):
    """
    Calculate monthly mortgage payment using the standard mortgage formula
    Implements secure calculation with proper error handling
    """
    try:
        # Constants
        MONTHS_IN_YEAR = 12
        PERCENT_DIVISOR = 100
        
        # Convert annual rate to monthly rate
        monthly_rate = annual_rate / PERCENT_DIVISOR / MONTHS_IN_YEAR
        
        # Calculate total number of payments
        num_payments = years * MONTHS_IN_YEAR
        
        # Handle edge case: zero interest rate
        if monthly_rate == 0:
            return principal / num_payments
        
        # Mortgage formula: M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
        factor = (1 + monthly_rate) ** num_payments
        monthly_payment = principal * (monthly_rate * factor) / (factor - 1)
        
        return monthly_payment
        
    except Exception as e:
        logger.error(f"Calculation error: {str(e)}")
        raise ValueError("Error in mortgage calculation")

@mortgage_bp.route('/calculate', methods=['POST'])
def calculate():
    """
    Secure mortgage calculation endpoint
    Implements OWASP Top 10 protections and zero-trust principles
    """
    try:
        # Validate Content-Type
        if not request.is_json:
            return jsonify({
                'error': 'Content-Type must be application/json'
            }), 400
        
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'Request body cannot be empty'
            }), 400
        
        # Extract and validate inputs with strict bounds
        principal, principal_error = validate_input(
            data.get('principal'), 
            'Principal', 
            min_val=1000,  # Minimum loan amount
            max_val=10000000  # Maximum loan amount (10M)
        )
        
        annual_rate, rate_error = validate_input(
            data.get('annualRate'), 
            'Annual Interest Rate', 
            min_val=0.01,  # Minimum 0.01%
            max_val=50.0   # Maximum 50%
        )
        
        years, years_error = validate_input(
            data.get('years'), 
            'Years', 
            min_val=1,     # Minimum 1 year
            max_val=50     # Maximum 50 years
        )
        
        # Collect all validation errors
        errors = []
        if principal_error:
            errors.append(principal_error)
        if rate_error:
            errors.append(rate_error)
        if years_error:
            errors.append(years_error)
        
        if errors:
            return jsonify({
                'error': 'Validation failed',
                'details': errors
            }), 400
        
        # Perform calculation
        monthly_payment = calculate_mortgage(principal, annual_rate, years)
        
        # Calculate additional useful information
        total_payment = monthly_payment * years * 12
        total_interest = total_payment - principal
        
        # Log successful calculation (without sensitive data)
        logger.info(f"Mortgage calculation completed successfully")
        
        return jsonify({
            'success': True,
            'monthlyPayment': round(monthly_payment, 2),
            'totalPayment': round(total_payment, 2),
            'totalInterest': round(total_interest, 2),
            'principal': principal,
            'annualRate': annual_rate,
            'years': int(years)
        })
        
    except ValueError as e:
        logger.error(f"Calculation error: {str(e)}")
        return jsonify({
            'error': 'Calculation error occurred'
        }), 400
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'error': 'An unexpected error occurred'
        }), 500

@mortgage_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'mortgage-calculator'
    })

