import React from 'react';
import Header from '../components/header';
import GalleryCard from '../components/gallerycards';
import './gallery.css'

const Gallery: React.FC = () => {
    return (
        <div className="home-container">
            <Header />  {/* ヘッダー */}
            
            <div className="search-and-create">
                <input 
                    type="text" 
                    placeholder="検索" 
                    className="search-bar" 
                />
                <button className="create-button">
                    投稿
                </button>
            </div>
            <GalleryCard />
        </div>
    );
};

export default Gallery;
