export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://w-store.tn';

export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://w-store.tn';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://w-store.tn';
};

export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des produits');
  }
  return response.json();
};