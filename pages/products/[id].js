// pages/products/[id].js
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Đảm bảo dòng này có
import { supabase } from '../../lib/supabase';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query; // Get ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // Don't fetch until ID is available

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch product');
        }
        setProduct(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]); // Re-run when ID changes

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          throw new Error('User not authenticated');
        }
        const token = session.access_token;

        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to delete product');
        }

        alert('Product deleted successfully!');
        router.push('/products'); // Redirect to products page after deletion
      } catch (err) {
        alert(`Error deleting product: ${err.message}`);
      }
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Head>
        <title>{product.name} Details</title>
      </Head>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row">
          <div className="flex justify-center items-center bg-gray-100 rounded-md h-64 sm:w-1/2">
            <img src={product.image || '/placeholder.png'} alt={product.name} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="sm:w-1/2 sm:pl-6">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">{product.name}</h1>
            <p className="text-green-600 font-bold text-xl mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex space-x-4">
              
              <button
                onClick={
                  () => router.push(`/products/edit/${id}`)
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}