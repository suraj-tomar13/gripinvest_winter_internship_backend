import React, { useState } from 'react';
import { investments } from '../../api/api';

const ProductDetail = ({ product, onBack }) => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleInvest = async (e) => {
    e.preventDefault();
    if (!investmentAmount || investmentAmount < product.min_investment) {
      setError(`Minimum investment amount is $${product.min_investment}`);
      return;
    }

    try {
      setInvesting(true);
      setError('');
      await investments.invest(token, {
        product_id: product.id,
        amount: parseFloat(investmentAmount)
      });
      setMessage('Investment successful!');
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setInvesting(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateExpectedReturn = (amount) => {
    if (!amount) return 0;
    const principal = parseFloat(amount);
    const annualReturn = (principal * product.annual_yield) / 100;
    const totalReturn = principal + annualReturn;
    return totalReturn.toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-blue-500 hover:text-blue-700 transition duration-300"
        >
          ← Back to Products
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{message}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(product.risk_level)}`}>
              {product.risk_level} risk
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Type:</span>
                  <p className="text-gray-800">{product.investment_type.toUpperCase()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Annual Yield:</span>
                  <p className="text-gray-800">{product.annual_yield}%</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Tenure:</span>
                  <p className="text-gray-800">{product.tenure_months} months</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Min Investment:</span>
                  <p className="text-gray-800">${product.min_investment}</p>
                </div>
                {product.max_investment && (
                  <div>
                    <span className="font-medium text-gray-600">Max Investment:</span>
                    <p className="text-gray-800">${product.max_investment}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Investment Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Make Investment</h2>
          
          <form onSubmit={handleInvest} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Amount ($)
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                min={product.min_investment}
                max={product.max_investment || undefined}
                step="100"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Minimum: $${product.min_investment}`}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Minimum: ${product.min_investment}
                {product.max_investment && `, Maximum: $${product.max_investment}`}
              </p>
            </div>

            {investmentAmount && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Investment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Principal Amount:</span>
                    <span className="font-medium">${parseFloat(investmentAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Annual Yield:</span>
                    <span className="font-medium">{product.annual_yield}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Tenure:</span>
                    <span className="font-medium">{product.tenure_months} months</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-2">
                    <span className="text-blue-800 font-semibold">Expected Return:</span>
                    <span className="font-bold text-blue-800">${calculateExpectedReturn(investmentAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={investing || !investmentAmount}
              className="w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 transition duration-300 disabled:opacity-50"
            >
              {investing ? 'Processing Investment...' : 'Invest Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;