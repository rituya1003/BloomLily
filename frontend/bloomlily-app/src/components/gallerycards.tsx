import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig"; // Firestoreの設定を正しくインポート
import "./gallerycards.css"

interface GalleryData {
  userId: string;
  event_name: string;
  details: string[];
  tags: string[];
  design_image_url?: string; // デザイン画像がない場合もあるためオプショナルに
  floral_photo_url: string;
}

// Firestoreのデータ取得とGalleryCardコンポーネントの定義
const GalleryCard: React.FC = () => {
  const [galleryData, setGalleryData] = useState<GalleryData[]>([]);
  const [likedCards, setLikedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gallery"));
        const data = querySnapshot.docs.map((doc) => doc.data() as GalleryData);
        setGalleryData(data);
      } catch (error) {
        console.error("画像が取得できませんでした:", error);
      }
    };

    fetchGalleryData();
  }, []);

  const toggleLike = (index: number) => {
    setLikedCards((prevLikedCards) => {
      const newLikedCards = new Set(prevLikedCards);
      if (newLikedCards.has(index)) {
        newLikedCards.delete(index);
      } else {
        newLikedCards.add(index);
      }
      return newLikedCards;
    });
  };

  return (
    <div className="gallery-cards">
      {galleryData.map((data, index) => (
        <div key={index} className="gallery-card">
          <div className="account-info">
            <span className="account-name">{data.userId}</span>
            <button 
              className={`like-button ${likedCards.has(index) ? "liked" : ""}`} 
              onClick={() => toggleLike(index)}
            >
              ♡
            </button>
          </div>
          <h2 className="event-title">公演名: {data.event_name}</h2>
          <p className="details">詳細: {data.details.join()}</p>
          <div className="tags">
            {data.tags.map((tag, idx) => (
              <span key={idx} className="tag">#{tag}</span>
            ))}
          </div>
          <div className="images">
            {data.design_image_url ? (
              <>
                <img src={data.floral_photo_url} alt="フローラル画像" className="floral-image" />
                <img src={data.design_image_url} alt="デザイン画像" className="design-image" />
              </>
            ) : (
              <img src={data.floral_photo_url} alt="フローラル画像" className="floral-image-large" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryCard;
