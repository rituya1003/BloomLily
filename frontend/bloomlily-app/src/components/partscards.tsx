import React, { useEffect, useState } from 'react';
import { storage } from '../firebase/firebaseConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import './partscards.css';

interface PartsCardsProps {
  partType: string;
  onPartSelect: (partName: string) => void;
}

const PartsCards: React.FC<PartsCardsProps> = ({ partType, onPartSelect }) => {
  const [images, setImages] = useState<{ url: string; name: string }[]>([]); // URLと名前のペア
  const [folderNames, setFolderNames] = useState<string[]>([]); // balloon専用のフォルダ名

  useEffect(() => {
    const fetchImages = async () => {
      try {
        let folderPath = '';

        switch (partType) {
          case 'sutando':
            folderPath = 'parts/sutando';
            break;
          case 'flowers':
            folderPath = 'parts/Flower';
            break;
          case 'balloon':
            folderPath = 'parts/balloon';
            break;
          case 'others':
            folderPath = 'parts/others';
            break;
          default:
            folderPath = '';
        }

        if (folderPath) {
          const listRef = ref(storage, folderPath);
          const res = await listAll(listRef);

          if (partType === 'balloon') {
            // balloonのサブフォルダ処理
            let fetchedFolderNames: string[] = [];
            let fetchedImages: { url: string; name: string }[] = [];

            for (let folder of res.prefixes) {
              fetchedFolderNames.push(folder.name); // フォルダ名を取得
              const subfolderRef = ref(storage, folder.fullPath);
              const subfolderRes = await listAll(subfolderRef);

              if (subfolderRes.items.length > 0) {
                const firstImageUrl = await getDownloadURL(subfolderRes.items[0]); // サブフォルダ内の最初の画像URL
                fetchedImages.push({
                  url: firstImageUrl,
                  name: folder.name, // balloonはフォルダ名を使う
                });
              }
            }

            setImages(fetchedImages); // 画像データを更新
            setFolderNames(fetchedFolderNames); // フォルダ名を保存
          } else {
            // balloon以外の画像取得
            const fetchedImages = await Promise.all(
              res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return { url, name: itemRef.name.replace(/\.[^/.]+$/, '') }; // 名前のみ
              })
            );

            setImages(fetchedImages);
            setFolderNames([]); // balloon以外ではフォルダ名は不要
          }
        } else {
          setImages([]);
          setFolderNames([]);
        }
      } catch (error) {
        console.error('Error fetching images from Firebase Storage:', error);
        setImages([]);
        setFolderNames([]);
      }
    };

    fetchImages();
  }, [partType]);

  return (
    <div className="parts-cards-container">
      {images.length > 0 ? (
        images.map((image, index) => (
          <div
            key={index}
            className="part-card"
            onClick={() =>
              partType === 'balloon'
                ? onPartSelect(folderNames[index]) // balloonではフォルダ名を渡す
                : onPartSelect(image.name) // 他では画像名を渡す
            }
          >
            <img src={image.url} alt={image.name} /> 
          </div>
        ))
      ) : (
        <p>パーツ読み込み中</p>
      )}
    </div>
  );
};

export default PartsCards;
