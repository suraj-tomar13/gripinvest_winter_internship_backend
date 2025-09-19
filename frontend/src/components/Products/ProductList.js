import React, { useState, useEffect } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from API here
    const mockProducts = [
      { id: 1, name: 'Sample Bond Fund', yield: '6.5%', risk: 'low' },
      { id: 2, name: 'Tech Growth ETF', yield: '12.0%', risk: 'high' },
    ];
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 border rounded shadow">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p>Yield: {product.yield}</p>
            <p>Risk: {product.risk}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;