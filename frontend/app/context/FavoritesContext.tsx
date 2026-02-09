"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL } from '../../lib/api';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loadFavorites: () => Promise<void>;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const loadFavorites = async () => {
    const token = getToken();
    if (!token) {
      setFavorites([]);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.map((p: any) => p._id));
      }
    } catch (err) {
      console.error('Erreur chargement favoris:', err);
    }
  };

  const addFavorite = async (productId: string) => {
    const token = getToken();
    if (!token) {
      alert('Veuillez vous connecter pour ajouter aux favoris');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      if (res.ok) {
        setFavorites(prev => [...prev, productId]);
      }
    } catch (err) {
      console.error('Erreur ajout favori:', err);
    }
  };

  const removeFavorite = async (productId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/favorites/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setFavorites(prev => prev.filter(id => id !== productId));
      }
    } catch (err) {
      console.error('Erreur suppression favori:', err);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      loadFavorites,
      favoritesCount: favorites.length
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
