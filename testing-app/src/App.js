import React from 'react';
import { Routes, Route, Link, NavLink } from "react-router-dom";

import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles.scss';
import { LoginPage } from "./pages/LoginPage.jsx";
import { UserTypeSelection } from './pages/UserTypeSelection.jsx';

function App() {
  return <>
    <nav className="navbar has-shadow" role="navigation" aria-label="main navigation">
      <div className="navbar-start">
        <NavLink to="/" className="navbar-item">
          Home
        </NavLink>

        <NavLink to="/users" className="navbar-item">
          Users
        </NavLink>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            <Link to="/sign-up" className="button is-light has-text-weight-bold">
              Зареєструватися
            </Link>

            <Link to="/login" className="button is-success has-text-weight-bold">
              Увійти
            </Link>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <section className="section">
        <Routes>
          <Route path="sign-up" element={<UserTypeSelection />} />
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </section>

      {/* {error && <p className="notification is-danger is-light">{error}</p>} */}
    </main>
  </>;
}

export default App;
