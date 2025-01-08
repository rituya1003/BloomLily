import React from 'react';
import Header from '../components/header';
import EventCards from '../components/eventcards';
import'./recruitment.css';

const Recruitment: React.FC = () => {
    return (
        <div className="home-container">
            <Header />  {/* ヘッダー */}
            
            <div className="search-and-create">
                <input 
                    type="text" 
                    placeholder="イベントを検索..." 
                    className="search-bar" 
                />
                <button className="create-button">
                    募集作成
                </button>
            </div>

            <EventCards /> {/* 募集のカード */}
        </div>
    );
};

export default Recruitment;
