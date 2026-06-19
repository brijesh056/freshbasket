import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';

export default function Wishlist() {
  const { wishlist } = useWishlist();
  return (
    <div className="container page-wrapper">
      <h1 className="section-title" style={{ marginBottom: 8 }}>My Wishlist</h1>
      <p className="section-subtitle">{wishlist.length} saved items</p>
      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">❤️</div>
          <p className="empty-state-title">Your wishlist is empty</p>
          <p className="empty-state-text">Save products you love for later!</p>
          <Link to="/products" className="btn btn-primary btn-lg">Explore Products</Link>
        </div>
      ) : (
        <div className="products-grid">{wishlist.map(p => <ProductCard key={p._id} product={p} />)}</div>
      )}
    </div>
  );
}
