import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiChevronDown, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?search=${search.trim()}`); setSearch(''); }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛒</span>
          <span className="logo-text">Fresh<span>Basket</span></span>
        </Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for groceries, vegetables, fruits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit"><FiSearch /></button>
        </form>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <Link to="/wishlist" className="nav-icon-btn">
            <FiHeart />
            {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="nav-icon-btn">
            <FiShoppingCart />
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user.name?.split(' ')[0]}</span>
                <FiChevronDown className={`chevron ${dropdownOpen ? 'rotated' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu animate-fadeIn">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  {isAdmin && <Link to="/admin" className="dropdown-item"><FiSettings /> Admin Panel</Link>}
                  <Link to="/profile" className="dropdown-item"><FiUser /> My Profile</Link>
                  <Link to="/orders" className="dropdown-item"><FiPackage /> My Orders</Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={logout}><FiLogOut /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu animate-fadeIn">
          <form className="mobile-search" onSubmit={handleSearch}>
            <input type="text" placeholder="Search groceries..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button type="submit"><FiSearch /></button>
          </form>
          <Link to="/products" className="mobile-link">All Products</Link>
          <Link to="/cart" className="mobile-link">Cart {cartCount > 0 && <span className="badge-count">{cartCount}</span>}</Link>
          <Link to="/wishlist" className="mobile-link">Wishlist</Link>
          {user ? (
            <>
              <Link to="/profile" className="mobile-link">Profile</Link>
              <Link to="/orders" className="mobile-link">Orders</Link>
              {isAdmin && <Link to="/admin" className="mobile-link">Admin Panel</Link>}
              <button className="mobile-link danger" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link">Login</Link>
              <Link to="/register" className="mobile-link">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
