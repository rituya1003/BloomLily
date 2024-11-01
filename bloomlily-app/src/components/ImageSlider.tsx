// ImageSlider.js
import React, { useEffect, useState } from "react";
import { storage } from "../firebase/firebaseConfig"; // Firebaseの設定をインポート
import { ref, listAll, getDownloadURL } from "firebase/storage";
import "./ImageSlider.css"; // CSSファイルをインポート
import logo_toka from '../assets/image/logo_toka.png'; // ローカルのロゴ画像をインポート

const ImageSlider = () => {
  const [images, setImages] = useState<string[]>([]); // 画像のURLを格納する状態

  useEffect(() => {
    const fetchImages = async () => {
      const listRef = ref(storage, "gallery/completed/"); // ストレージのパスを指定
      const res = await listAll(listRef);
      const urls = await Promise.all(res.items.map(item => getDownloadURL(item)));
      setImages(urls);
    };

    fetchImages();
  }, []);

  return (
    <div className="jp_slide_img_wrapper">
      {/* オーバーレイ */}
      <div className="jp_slide_img_overlay">
        <div className="main_catch">
          {/* ロゴ表示エリア */}
          <div className="logo-container">
            <img src={logo_toka} alt="Logo" className="site-logo-toka" />
          </div>
        </div>
      </div>

      {/* 画像スライダー */}
      <div className="image-slider">
        <div className="slide-track">
          {/* Firebaseから取得した画像を表示 */}
          {images.map((image, index) => (
            <div
              key={index}
              className="slide"
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
