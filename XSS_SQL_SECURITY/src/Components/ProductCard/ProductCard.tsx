import React, { useState, useEffect, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  stock: number;
  currentPrice?: number;   
  discountApplied?: number; 
}

interface PromoResponse {
  newPrice: number;
  discount: number;
}

interface ErrorResponse {
  message: string;
}

export default function ProductCard(): React.JSX.Element {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [promoCode, setPromoCode] = useState<string>('');
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    axios.get<Product>('http://localhost:3000/auth/product/2')
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((err: AxiosError) => {
        setError('Failed to load product data.');
        setLoading(false);
      });
  }, []);

  const handleApplyPromo = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!promoCode.trim() || !product) return;

    setIsApplying(true);
    setError('');

    axios.post<PromoResponse>('http://localhost:3000/auth/apply-promo', {
      productId: product.id,
      promoCode: promoCode
    })
    .then(response => {
      setProduct({
        ...product,
        currentPrice: response.data.newPrice,
        discountApplied: response.data.discount
      });
      alert('Promo code applied successfully!');
    })
    .catch((err: AxiosError<ErrorResponse>) => {
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || 'Invalid or expired promo code.');
    })
    .finally(() => {
      setIsApplying(false);
    });
  };

  const handleCheckout = (): void => {
    if (!product) return;

    axios.post('http://localhost:3000/auth/checkout', {
      productId: product.id,
      promoCode: promoCode || null
    })
    .then(() => {
      alert('Purchase completed successfully and securely!');
      
      setProduct({
        ...product,
        stock: product.stock - 1
      });
    })
    .catch((err: AxiosError<ErrorResponse>) => {
      const serverMessage = err.response?.data?.message;
      alert(serverMessage || 'An error occurred during checkout.');
    });
  };

  if (loading) return <div className="text-center p-10 font-sans">Loading...</div>;
  if (error && !product) return <div className="text-center text-red-500 p-10 font-sans">{error}</div>;
  if (!product) return <div className="text-center p-10 font-sans">Product not found.</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6" dir="ltr">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
        
        <div className="relative h-64 bg-gray-200">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          {product.stock > 0 ? (
            <span className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              In Stock
            </span>
          ) : (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          )}
        </div>

        <div className="p-6">
          <div className="mb-5">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-indigo-600">
                EGP {product.currentPrice ?? product.price}
              </span>
              {product.currentPrice !== undefined && (
                <span className="text-sm text-gray-400 line-through">EGP {product.price}</span>
              )}
            </div>
            {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="promo-input" className="block text-xs font-semibold text-gray-500 mb-2">
              Have a promo code?
            </label>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input 
                type="text" 
                id="promo-input"
                value={promoCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)}
                placeholder="Enter code" 
                className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              <button 
                type="submit" 
                disabled={isApplying}
                className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-xl hover:bg-gray-900 transition-colors active:scale-95 disabled:opacity-50"
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </button>
            </form>
          </div>

          <button 
            type="button" 
            onClick={handleCheckout}
            disabled={product.stock <= 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {product.stock > 0 ? 'Buy Now' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}