import React, { useState } from 'react';
import './header.css'; // スタイルシートの読み込み
import logo from '../assets/image/logo.png'; // ローカルのロゴ画像をインポート
import user_icon from '../assets/image/user_icon.jpeg';

const Header = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <header className="site-header">
      <div className="top-row">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="site-logo" />
        </div>
        <div className="user-icon" onClick={toggleDropdown}>
          <img src={user_icon} alt="User" className="user-avatar" />
          {isDropdownVisible && (
            <div className="dropdown-menu">
              <ul>
                <li>
                  <a href="/login">ログイン</a>
                </li>
                <li>
                  <button
                    onClick={() => alert('ログアウトしました')} // ログアウトアクションの例
                    className="logout-button"
                  >
                    ログアウト
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <nav className="nav-menu">
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/design">Design</a></li>
          <li><a href="/Recruitment">Recruitment</a></li>
          <li><a href="gallery">Gallery</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
