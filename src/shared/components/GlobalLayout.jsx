import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './GlobalLayout.css';

const GlobalLayout = ({ children }) => {
  return (
    <div className="toolkit-layout">
      <Header />
      <main className="toolkit-main">{children}</main>
      <Footer />
    </div>
  );
};

export default GlobalLayout;
