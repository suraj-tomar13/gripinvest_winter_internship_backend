import React, { useState, useEffect } from 'react';
import { products } from '../../api/api';

const ProductList = ({ onProductSelect }) => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    investment_type: '',
    risk_level: '',
    search: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await products.getAll();
      setProductList(response.products || []);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = productList.filter(product => {
    if (filters.investment_type && product.investment_type !== filters.investment_type) {
      return false;
    }
    if (filters.risk_level && product.risk_level !== filters.risk_level) {
      return false;
    }
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Filter Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search products..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Type
            </label>
            <select
              value={filters.investment_type}
              onChange={(e) => handleFilterChange('investment_type', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="bond">Bond</option>
              <option value="fd">Fixed Deposit</option>
              <option value="mf">Mutual Fund</option>
              <option value="etf">ETF</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Level
            </label>
            <select
              value={filters.risk_level}
              onChange={(e) => handleFilterChange('risk_level', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ investment_type: '', risk_level: '', search: '' })}
              className="w-full p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onProductSelect(product)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(product.risk_level)}`}>
                {product.risk_level} risk
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Type:</span> {product.investment_type.toUpperCase()}</p>
              <p><span className="font-medium">Annual Yield:</span> {product.annual_yield}%</p>
              <p><span className="font-medium">Tenure:</span> {product.tenure_months} months</p>
              <p><span className="font-medium">Min Investment:</span> ${product.min_investment}</p>
              {product.max_investment && (
                <p><span className="font-medium">Max Investment:</span> ${product.max_investment}</p>
              )}
            </div>
            
            <p className="mt-4 text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
            
            <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
              View Details
            </button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No products found matching your filters.
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-gray-600">
        Showing {filteredProducts.length} of {productList.length} products
      </div>
    </div>
  );
};

export default ProductList;