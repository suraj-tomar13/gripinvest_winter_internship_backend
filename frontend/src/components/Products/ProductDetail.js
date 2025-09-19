import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams(); // Assumes you're using React Router
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch product details based on ID from API
    const mockProduct = {
      id: 1,
      name: 'Sample Bond Fund',
      description: 'A low-risk bond fund designed for stable returns.',
      yield: '6.5%',
      tenure: '36 months',
      risk: 'low',
    };
    setProduct(mockProduct);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Yield:</strong> {product.yield}</p>
      <p><strong>Tenure:</strong> {product.tenure}</p>
      <p><strong>Risk:</strong> {product.risk}</p>
      <button className="mt-4 p-2 bg-green-500 text-white rounded">
        Invest Now
      </button>
    </div>
  );
};

export default ProductDetail;