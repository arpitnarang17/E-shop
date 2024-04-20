import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

const Header = () => {
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: '',
    });
    localStorage.removeItem('auth');
    toast.success('Logout Successfully');
  };

  useEffect(() => {
    // Initialize Bootstrap dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener('click', () => {
        const dropdownMenu = dropdown.nextElementSibling;
        dropdownMenu.classList.toggle('show');
      });
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', (event) => {
      if (!event.target.matches('.dropdown-toggle')) {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach((dropdownMenu) => {
          if (dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
          }
        });
      }
    });

    return () => {
      // Cleanup event listeners
      window.removeEventListener('click', () => {});
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink to="/" className="navbar-brand">
        🛒 Ecommerce App
      </NavLink>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/category" className="nav-link">
              Category
            </NavLink>
          </li>
          {!auth.user ? (
            <>
              <li className="nav-item">
                <NavLink to="/register" className="nav-link">
                  Register
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
              </li>
            </>
          ) : (
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {auth?.user?.name}
              </NavLink>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <NavLink to={`/dashboard/${auth?.user?.role===1 ?'admin' :'user'}`} className="dropdown-item">
                  Dashboard
                </NavLink>
                <div className="dropdown-divider"></div>
                <NavLink onClick={handleLogout} to="/login" className="dropdown-item">
                  Logout
                </NavLink>
              </div>
            </li>
          )}
          <li className="nav-item">
            <NavLink to="/cart" className="nav-link">
              Cart(0)
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;