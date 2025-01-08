import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig'; // Firebaseの設定ファイルをインポート
import './GallerySection.css'; // CSSスタイルシートをインポート

const GallerySection = () => {
  // useStateフックを使ってギャラリーアイテムの状態を管理
  const [galleryItems, setGalleryItems] = useState<string[]>([]); // 画像のURLだけを管理

  useEffect(() => {
    // 画像を取得する非同期関数
    const fetchImages = async () => {
      // Firebase Storageの「gallery/completed」フォルダを参照
      const galleryRef = ref(storage, 'gallery/completed/');
      
      // フォルダ内のすべてのアイテムをリスト化
      const result = await listAll(galleryRef);
      
      // 画像ファイルのみのURLを取得
      const urls = await Promise.all(
        result.items
          .filter(item => item.name.match(/\.(jpg|jpeg|png|gif)$/)) // 画像ファイルのみをフィルタリング
          .map((item) => getDownloadURL(item)) // 各アイテムのURLを取得
      );
      console.log(urls); 
      // ランダムに6枚の画像を選択
      const randomUrls = selectRandomImages(urls, 6);
      
      // 取得したURLを状態に保存
      setGalleryItems(randomUrls);
    };

    fetchImages(); // 画像を取得する関数を呼び出す
  }, []); // 空の依存配列により、コンポーネントがマウントされたときのみ実行される

  // ランダムに指定した数の画像を選択する関数
  const selectRandomImages = (urls: string[], count: number) => {
    // 画像が指定数未満の場合はそのまま返す
    if (urls.length <= count) {
      return urls; // URLsがcountより少ない場合はそのまま返す
    }

    // ランダムに選択した画像を返す
    const selectedUrls: string[] = [];
    while (selectedUrls.length < count) {
      // ランダムなインデックスを生成
      const randomIndex = Math.floor(Math.random() * urls.length);
      // 既に選ばれていないURLを選ぶ
      if (!selectedUrls.includes(urls[randomIndex])) {
        selectedUrls.push(urls[randomIndex]);
      }
    }
    return selectedUrls; // 選択したURLを返す
  };

  return (
    <section className="gallery-section">
      <h2 className="gallery-title">Gallery</h2>
      <div className="gallery-grid">
        {galleryItems.map((imageUrl, index) => (
          <div key={index} className="gallery-item">
            <img src={imageUrl} alt={`Gallery Image ${index + 1}`} className="gallery-image" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection; // コンポーネントをエクスポート
