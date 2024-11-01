// src/pages/home.tsx
import React from 'react';
import './home.css';
import Header from '../components/header';
import Slider from '../components/ImageSlider'
import GallerySection from '../components/GallerySection';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <Header />  {/*ヘッダー*/}
            <Slider /> {/*メインアニメーション*/}

            <section className="design-section">
                <h2>Design</h2>
                <div className="design-cards">
                    <div className="design-card">
                        <div className="design-image-placeholder" />
                        <h3>標準型</h3>
                        <p>15,000円～</p>
                        <p>一般的なフラスタ </p>
                        <p>花のアレンジメントが正面から見やすく</p>
                        <p>シンプルでありながら美しい印象</p>
                    </div>
                    <div className="design-card">
                        <div className="design-image-placeholder" />
                        <h3>連結型（複数）</h3>
                        <p>100,000円～</p>
                        <p>複数のフラワースタンドを</p>
                        <p>連結させるフラスタ</p>
                        <p>インパクトのあるビジュアルを実現</p>
                    </div>
                    <div className="design-card">
                        <div className="design-image-placeholder" />
                        <h3>複数型（アーチ）</h3>
                        <p>100,000円～</p>
                        <p>複数のフラワースタンドを連結させ</p>
                        <p>アーチ状に配置されたフラスタ</p>
                        <p>立体感と華やかさが特徴</p>
                    </div>
                </div>
            </section>

            <GallerySection />

        </div>
    );
};

export default Home;
