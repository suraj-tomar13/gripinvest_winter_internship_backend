import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from '../components/Products/ProductList';
import { products } from '../api/api';

// Mock the API
jest.mock('../api/api', () => ({
  products: {
    getAll: jest.fn()
  }
}));

describe('ProductList Component', () => {
  const mockOnProductSelect = jest.fn();
  const mockProducts = [
    {
      id: '1',
      name: 'Test Bond Fund',
      investment_type: 'bond',
      tenure_months: 36,
      annual_yield: 6.5,
      risk_level: 'low',
      min_investment: 1000,
      max_investment: 100000,
      description: 'A low-risk bond fund'
    },
    {
      id: '2',
      name: 'Growth Equity Fund',
      investment_type: 'mf',
      tenure_months: 60,
      annual_yield: 12.8,
      risk_level: 'high',
      min_investment: 2000,
      max_investment: 200000,
      description: 'A high-risk equity fund'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product list correctly', async () => {
    products.getAll.mockResolvedValueOnce({ products: mockProducts });

    render(<ProductList onProductSelect={mockOnProductSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Test Bond Fund')).toBeInTheDocument();
      expect(screen.getByText('Growth Equity Fund')).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    products.getAll.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<ProductList onProductSelect={mockOnProductSelect} />);
    
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('displays error message on API failure', async () => {
    products.getAll.mockRejectedValueOnce(new Error('API Error'));

    render(<ProductList onProductSelect={mockOnProductSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
    });
  });

  it('filters products by investment type', async () => {
    products.getAll.mockResolvedValueOnce({ products: mockProducts });

    render(<ProductList onProductSelect={mockOnProductSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Test Bond Fund')).toBeInTheDocument();
    });

    const typeFilter = screen.getByDisplayValue('All Types');
    fireEvent.change(typeFilter, { target: { value: 'bond' } });

    await waitFor(() => {
      expect(screen.getByText('Test Bond Fund')).toBeInTheDocument();
      expect(screen.queryByText('Growth Equity Fund')).not.toBeInTheDocument();
    });
  });

  it('filters products by risk level', async () => {
    products.getAll.mockResolvedValueOnce({ products: mockProducts });

    render(<ProductList onProductSelect={mockOnProductSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Test Bond Fund')).toBeInTheDocument();
    });

    const riskFilter = screen.getByDisplayValue('All Risk Levels');
    fireEvent.change(riskFilter, { target: { value: 'high' } });

    await waitFor(() => {
      expect(screen.getByText('Growth Equity Fund')).toBeInTheDocument();
      expect(screen.queryByText('Test Bond Fund')).not.toBeInTheDocument();
    });
  });

  it('searches products by name', async () => {
    products.getAll.mockResolvedValueOnce({ products: mockProducts });

    render(<ProductList onProductSelect={mockOnProductSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Test Bond Fund')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'Growth' } });

    await waitFor(() => {
      expect(screen.getByText('Growth Equity Fund')).toBeInTheDocument();
      expect(screen.queryByText('Test Bond Fund')).not.toBeInTheDocument();
    });
  });

  it('clears filters when clear button is clicked', async () => {
    products.getAll.mockResolvedValueOnce({ products: mockProducts });

    render(<ProductList onProductSelect={mockOnProductSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Test Bond Fund')).toBeInTheDocument();
    });

    // Apply a filter
    const typeFilter = screen.getByDisplayValue('All Types');
    fireEvent.change(typeFilter, { target: { value: 'bond' } });

    await waitFor(() => {
      expect(screen.queryByText('Growth Equity Fund')).not.toBeInTheDocument();
    });

    // Clear filters
    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText('Test Bond Fund')).toBeInTheDocument();
      expect(screen.getByText('Growth Equity Fund')).toBeInTheDocument();
    });
  });

  it('calls onProductSelect when product is clicked', async () => {
    products.getAll.mockResolvedValueOnce({ products: mockProducts });

    render(<ProductList onProductSelect={mockOnProductSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Test Bond Fund')).toBeInTheDocument();
    });

    const productCard = screen.getByText('Test Bond Fund').closest('div');
    fireEvent.click(productCard);

    expect(mockOnProductSelect).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('displays no products message when filtered results are empty', async () => {
    products.getAll.mockResolvedValueOnce({ products: mockProducts });

    render(<ProductList onProductSelect={mockOnProductSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Test Bond Fund')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'NonExistentProduct' } });

    await waitFor(() => {
      expect(screen.getByText('No products found matching your filters.')).toBeInTheDocument();
    });
  });

  it('shows results summary', async () => {
    products.getAll.mockResolvedValueOnce({ products: mockProducts });

    render(<ProductList onProductSelect={mockOnProductSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Showing 2 of 2 products')).toBeInTheDocument();
    });
  });
});
