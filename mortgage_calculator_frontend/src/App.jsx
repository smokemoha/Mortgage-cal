import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Calculator, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import './App.css'

/**
 * Main application component for the Secure Mortgage Calculator.
 * This component handles user input, calculates mortgage details, displays results,
 * and visualizes amortization data using charts.
 */
function App() {
  // State variables to manage form data, calculation results, loading status, errors, and chart data.
  const [formData, setFormData] = useState({
    principal: '',
    annualRate: '',
    years: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [chartData, setChartData] = useState([])

  /**
   * Validates individual input fields based on their name and value.
   * This provides client-side validation for immediate feedback and defense in depth.
   * @param {string} name - The name of the input field (e.g., 'principal', 'annualRate', 'years').
   * @param {string} value - The current value of the input field.
   * @returns {string|null} An error message if validation fails, otherwise null.
   */
  const validateInput = (name, value) => {
    const numValue = parseFloat(value)
    
    switch (name) {
      case 'principal':
        if (isNaN(numValue) || numValue < 1000 || numValue > 10000000) {
          return 'Principal must be between $1,000 and $10,000,000'
        }
        break
      case 'annualRate':
        if (isNaN(numValue) || numValue < 0.01 || numValue > 50) {
          return 'Interest rate must be between 0.01% and 50%'
        }
        break
      case 'years':
        if (isNaN(numValue) || numValue < 1 || numValue > 50 || !Number.isInteger(numValue)) {
          return 'Years must be a whole number between 1 and 50'
        }
        break
      default:
        return null
    }
    return null
  }

  /**
   * Handles changes to input fields, sanitizing the input and updating the form data state.
   * It also clears any previous validation errors related to the changed field.
   * @param {Object} e - The event object from the input change.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Sanitize input - remove potentially harmful characters to prevent XSS attacks.
    const sanitizedValue = value.replace(/[<>'"&]/g, '')
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))
    
    // Clear previous errors for this specific field.
    setErrors(prev => prev.filter(error => !error.includes(name)))
  }

  /**
   * Generates amortization data for charting purposes.
   * It calculates yearly interest, principal paid, and remaining balance.
   * @param {number} principal - The initial loan principal.
   * @param {number} monthlyPayment - The calculated monthly payment.
   * @param {number} annualRate - The annual interest rate.
   * @param {number} years - The loan term in years.
   * @returns {Array<Object>} An array of objects, each representing a year's amortization data.
   */
  const generateAmortizationData = (principal, monthlyPayment, annualRate, years) => {
    const data = []
    let remainingBalance = principal
    const monthlyRate = annualRate / 100 / 12
    const totalMonths = years * 12
    
    // Loop through each year to calculate amortization details.
    for (let year = 1; year <= years; year++) {
      let yearlyInterest = 0
      let yearlyPrincipal = 0
      
      // Loop through each month within the year.
      for (let month = 1; month <= 12 && (year - 1) * 12 + month <= totalMonths; month++) {
        const interestPayment = remainingBalance * monthlyRate
        const principalPayment = monthlyPayment - interestPayment
        
        yearlyInterest += interestPayment
        yearlyPrincipal += principalPayment
        remainingBalance -= principalPayment
      }
      
      // Add yearly amortization data to the array.
      data.push({
        year,
        balance: Math.max(0, remainingBalance), // Ensure balance doesn't go below zero.
        interest: yearlyInterest,
        principal: yearlyPrincipal,
        totalPaid: (monthlyPayment * 12 * year)
      })
    }
    
    return data
  }

  /**
   * Handles the form submission, performing client-side validation and then sending
   * the data to a backend API for mortgage calculation. Updates state with results or errors.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    
    // Perform client-side validation before sending to the backend.
    const validationErrors = []
    Object.entries(formData).forEach(([name, value]) => {
      if (!value.trim()) {
        validationErrors.push(`${name} is required`)
        return
      }
      
      const error = validateInput(name, value)
      if (error) {
        validationErrors.push(error)
      }
    })
    
    // If there are validation errors, display them and stop the submission.
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }
    
    try {
      // Send a POST request to the mortgage calculation API.
      const response = await fetch('http://localhost:5000//api/mortgage/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          principal: parseFloat(formData.principal),
          annualRate: parseFloat(formData.annualRate),
          years: parseInt(formData.years)
        })
      })
      
      const data = await response.json()
      
      // Handle API response: if not OK, set errors; otherwise, set results and generate chart data.
      if (!response.ok) {
        if (data.details) {
          setErrors(data.details)
        } else {
          setErrors([data.error || 'An error occurred'])
        }
        return
      }
      
      setResult(data)
      
      // Generate chart data based on the successful calculation results.
      const chartData = generateAmortizationData(
        data.principal,
        data.monthlyPayment,
        data.annualRate,
        data.years
      )
      setChartData(chartData)
      
    } catch (error) {
      // Catch and display network or other unexpected errors.
      console.error('Error during mortgage calculation:', error)
      setErrors(['Network error. Please try again.'])
    } finally {
      // Always set loading to false after the request completes.
      setLoading(false)
    }
  }

  /**
   * Formats a given amount into a US dollar currency string.
   * @param {number} amount - The numeric amount to format.
   * @returns {string} The formatted currency string (e.g., "$1,234.56").
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Application Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900"> Mortgage Calculator</h1>
          </div>
          <p className="text-lg text-gray-600">Calculate your monthly mortgage payments with enterprise-grade security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 lg:max-w-2xl lg:mx-auto gap-8">
          {/* Input Form Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Loan Details
              </CardTitle>
              <CardDescription>
                Enter your loan information to calculate monthly payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Principal Input Field */}
                <div className="space-y-2">
                  <Label htmlFor="principal">Principal Amount ($)</Label>
                  <Input
                    id="principal"
                    name="principal"
                    type="number"
                    placeholder="e.g., 300000"
                    value={formData.principal}
                    onChange={handleInputChange}
                    min="1000"
                    max="10000000"
                    step="1000"
                    className="text-lg"
                  />
                </div>

                {/* Annual Interest Rate Input Field */}
                <div className="space-y-2">
                  <Label htmlFor="annualRate">Annual Interest Rate (%)</Label>
                  <Input
                    id="annualRate"
                    name="annualRate"
                    type="number"
                    placeholder="e.g., 6.5"
                    value={formData.annualRate}
                    onChange={handleInputChange}
                    min="0.01"
                    max="50"
                    step="0.01"
                    className="text-lg"
                  />
                </div>

                {/* Loan Term (Years) Input Field */}
                <div className="space-y-2">
                  <Label htmlFor="years">Loan Term (Years)</Label>
                  <Input
                    id="years"
                    name="years"
                    type="number"
                    placeholder="e.g., 30"
                    value={formData.years}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
                    step="1"
                    className="text-lg"
                  />
                </div>

                {/* Error Display Section */}
                {errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full text-lg py-6" 
                  disabled={loading}
                >
                  {loading ? 'Calculating...' : 'Calculate Payment'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Display Card (conditionally rendered) */}
          {result && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Monthly Payment Summary */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Monthly Payment</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatCurrency(result.monthlyPayment)}
                    </div>
                  </div>

                  {/* Total Payment and Total Interest Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Total Payment</div>
                      <div className="text-xl font-semibold">
                        {formatCurrency(result.totalPayment)}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Total Interest</div>
                      <div className="text-xl font-semibold">
                        {formatCurrency(result.totalInterest)}
                      </div>
                    </div>
                  </div>

                  {/* Loan Details Summary */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Principal: {formatCurrency(result.principal)}</div>
                    <div>Interest Rate: {result.annualRate}%</div>
                    <div>Loan Term: {result.years} years</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Charts Section (conditionally rendered) */}
        {/* This section conditionally renders the charts only if there is data available in the `chartData` state. */}
        {chartData.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Remaining Balance Over Time Line Chart */}
            {/* This Card component encapsulates the Line Chart displaying the remaining loan balance over the years. */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Remaining Balance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ResponsiveContainer ensures the chart scales properly within its parent container. */}
                <ResponsiveContainer width="100%" height={300}>
                  {/* LineChart component from recharts, configured with the amortization data. */}
                  <LineChart data={chartData}>
                    {/* CartesianGrid adds a grid to the chart for better readability. */}
                    <CartesianGrid strokeDasharray="3 3" />
                    {/* XAxis displays the 'year' data from chartData on the horizontal axis. */}
                    <XAxis dataKey="year" />
                    {/* YAxis displays the balance data on the vertical axis, formatted to show in thousands with a dollar sign. */}
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    {/* Tooltip displays detailed information when hovering over data points. The formatter ensures currency display. */}
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    {/* Line component represents the remaining balance. */}
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      dot={{ fill: '#2563eb' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Annual Principal vs Interest Bar Chart */}
            {/* This Card component encapsulates the Bar Chart displaying the annual principal and interest payments. */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Annual Principal vs Interest</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ResponsiveContainer ensures the chart scales properly within its parent container. */}
                <ResponsiveContainer width="100%" height={300}>
                  {/* BarChart component from recharts, configured with the amortization data. */}
                  <BarChart data={chartData}>
                    {/* CartesianGrid adds a grid to the chart for better readability. */}
                    <CartesianGrid strokeDasharray="3 3" />
                    {/* XAxis displays the 'year' data from chartData on the horizontal axis. */}
                    <XAxis dataKey="year" />
                    {/* YAxis displays the principal and interest data on the vertical axis, formatted to show in thousands with a dollar sign. */}
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    {/* Tooltip displays detailed information when hovering over data points. The formatter ensures currency display. */}
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    {/* Bar for principal payments, stacked with interest payments. */}
                    <Bar dataKey="principal" stackId="a" fill="#10b981" />
                    {/* Bar for interest payments, stacked with principal payments. */}
                    <Bar dataKey="interest" stackId="a" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        
      </div>
    </div>
  )
}

export default App


