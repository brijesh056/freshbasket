import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiPackage, FiShoppingBag, FiUsers, FiTag, FiLogOut } from 'react-icons/fi';
import './Admin.css';

const NAV = [
  { path: '/admin', icon: <FiHome />, label: 'Dashboard' },
  { path: '/admin/products', icon: <FiPackage />, label: 'Products' },
  { path: '/admin/categories', icon: <FiTag />, label: 'Categories' },
  { path: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
  { path: '/admin/users', icon: <FiUsers />, label: 'Users' }
];

export default function AdminLayout({ children, title }) {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">🛒 FreshBasket<span>Admin</span></div>
        <div className="admin-user-info">
          <div className="admin-avatar">{user?.name?.charAt(0)}</div>
          <div>
            <p className="admin-name">{user?.name}</p>
            <p className="admin-role">Administrator</p>
          </div>
        </div>
        <nav className="admin-nav">
          {NAV.map(n => (
            <Link key={n.path} to={n.path} className={`admin-nav-item ${pathname === n.path ? 'active' : ''}`}>
              {n.icon} {n.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-nav-item">🏠 Back to Store</Link>
          <button className="admin-nav-item danger" onClick={logout}><FiLogOut /> Logout</button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-page-title">{title}</h1>
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
