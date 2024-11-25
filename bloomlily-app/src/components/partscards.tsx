import React, { useEffect, useState } from 'react'; // React、useEffect、useStateのインポート
import { storage } from '../firebase/firebaseConfig'; // Firebase Storageの設定をインポート
import { ref, listAll, getDownloadURL } from 'firebase/storage'; // Firebase Storageのメソッドをインポート
import "./partscards.css"; // CSSファイルのインポート

// パーツカードコンポーネントの型定義
interface PartsCardsProps {
  partType: string; // パーツの種類を指定するためのプロパティ
  onPartSelect: (partName: string) => void; // パーツ選択時に呼び出される関数
}

// パーツカードコンポーネントの定義
const PartsCards: React.FC<PartsCardsProps> = ({ partType, onPartSelect }) => {
  const [images, setImages] = useState<string[]>([]); // 画像URLを保持する状態
  const [folderNames, setFolderNames] = useState<string[]>([]); // フォルダ名を保持する状態

  // コンポーネントのマウント時に画像を取得する副作用
  useEffect(() => {
    const fetchImages = async () => {
      try {
        let folderPath = ''; // フォルダパスの初期化

        // partTypeに応じてフォルダパスを設定
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
          const listRef = ref(storage, folderPath); // Firebase Storage内のフォルダ参照を作成
          const res = await listAll(listRef); // フォルダ内のアイテムを取得

          let fetchedImages: string[] = []; // 取得した画像URLを格納する配列
          let fetchedFolderNames: string[] = []; // フォルダ名を格納する配列

          // "balloon"のとき、サブフォルダの処理を行う
          if (partType === 'balloon') {
            for (let folder of res.prefixes) {
              fetchedFolderNames.push(folder.name); // フォルダ名を取得して格納
              const subfolderRef = ref(storage, folder.fullPath); // サブフォルダ参照を作成
              const subfolderRes = await listAll(subfolderRef); // サブフォルダ内のアイテムを取得
              if (subfolderRes.items.length > 0) {
                const firstImageUrl = await getDownloadURL(subfolderRes.items[0]); // サブフォルダ内の最初の画像のURLを取得
                fetchedImages.push(firstImageUrl); // 画像URLを格納
              }
            }
          } else {
            // 他のpartTypeの場合は、すべての画像URLを取得
            fetchedImages = await Promise.all(
              res.items.map((itemRef) => getDownloadURL(itemRef))
            );
          }

          // 状態を更新
          setImages(fetchedImages);
          setFolderNames(fetchedFolderNames);
        } else {
          // 無効なパスの場合、状態をクリア
          setImages([]);
          setFolderNames([]);
        }
      } catch (error) {
        console.error('Error fetching images from Firebase Storage:', error); // エラーログ
        setImages([]); // エラー時に状態をリセット
        setFolderNames([]);
      }
    };

    fetchImages(); // 画像取得関数の呼び出し
  }, [partType]); // partTypeが変更されたときに再実行

  // コンポーネントのレンダリング
  return (
    <div className="parts-cards-container">
      {images.length > 0 ? (
        // 画像が存在する場合、カードをレンダリング
        images.map((url, index) => (
          <div key={index} className="part-card" onClick={() => onPartSelect(folderNames[index])}>
            <img src={url} alt={folderNames[index]} />
          </div>
        ))
      ) : (
        // 画像が存在しない場合、読み込み中のメッセージを表示
        <p>パーツ読み込み中</p>
      )}
    </div>
  );
};

export default PartsCards; // コンポーネントをエクスポート
