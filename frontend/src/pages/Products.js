import React, { useState, useEffect } from 'react';
import { products } from '../api/api';
import ProductDetail from '../components/Products/ProductDetail';

function Products() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    investment_type: '',
    risk_level: ''
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
    return true;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Investment Products</h1>
        <div className="flex gap-4">
          <select
            value={filters.investment_type}
            onChange={(e) => handleFilterChange('investment_type', e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="bond">Bond</option>
            <option value="fd">Fixed Deposit</option>
            <option value="mf">Mutual Fund</option>
            <option value="etf">ETF</option>
            <option value="other">Other</option>
          </select>
          <select
            value={filters.risk_level}
            onChange={(e) => handleFilterChange('risk_level', e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="moderate">Moderate Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                product.risk_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
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
    </div>
  );
}

export default Products;
