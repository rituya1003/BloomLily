import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../firebase/firebaseConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import './partsdetails.css';
import Vector from '../assets/image/Vector.png';
import eraser from '../assets/image/eraser.png';
import colorpalette from '../assets/image/color.png';
interface PartsDetailsProps {
  partType: string;
  partName?: string;
}

const PartsDetails: React.FC<PartsDetailsProps> = ({ partType, partName }) => {
  const [color, setColor] = useState<string>('#ffffff');
  const [penSize, setPenSize] = useState<number>(5);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [eraserSize, setEraserSize] = useState(10); // 消しゴムの初期太さ


  useEffect(() => {
    setColor('#000000');
    setSelectedImage(null);
    setOriginalImage(null);
  
    if (partType === 'flowers' && partName) {
      fetchNonBalloonImages('Flower', partName);
    } else if (partType === 'balloon' && partName) {
      fetchBalloonImages(partName); 
    } else if (partType !== 'balloon' && partName) {
      fetchNonBalloonImages(partType, partName); // その他のパーツタイプを処理
    }
  }, [partType, partName]);

  const handleImageSelect = (imageName: string) => {

    if (imageName === '') {
      setSelectedImage(imageNames.length > 0 ? `/parts/balloon/${partName}/${imageNames[0]}.png` : null);
    } else {
      const imageRef = ref(storage, `parts/balloon/${partName}/${imageName}.png`);
      getDownloadURL(imageRef)
        .then((url) => {
          setSelectedImage(url);

        })
        .catch((error) => console.error('選択した画像URL取得エラー:', error));
    }
  };

  // Balloonの画像取得
  const fetchBalloonImages = async (folderName: string) => {
    try {
      const folderRef = ref(storage, `parts/balloon/${folderName}`);
      const res = await listAll(folderRef);
      const imageUrls = await Promise.all(res.items.map((item) => getDownloadURL(item)));
      const names = res.items.map((item) => item.name.replace(/\.png$/, ''));
      setImageNames(names);

      if (imageUrls.length > 0) {
        setSelectedImage(imageUrls[0]);
      }
    } catch (error) {
      console.error('Balloon画像取得エラー', error);
      setImageNames([]);
    }
  };

// バルーン以外の画像取得
const fetchNonBalloonImages = async (partType: string, imageName: string) => {
  try {
    // ファイル名が拡張子付きかどうかをチェックし、適切に修正
    const fullImageName = imageName.includes('.') ? imageName : `${imageName}.png`;

    // 動的にパスを構築
    const imageRef = ref(storage, `parts/${partType}/${fullImageName}`);
    const imageUrl = await getDownloadURL(imageRef);

    // 取得したURLを状態に保存
    setOriginalImage(imageUrl);
    setSelectedImage(imageUrl);
  } catch (error) {
    console.error(`${partType} の画像取得エラー`, error);
    // 状態のリセット（エラー時の安全措置）
    setOriginalImage(null);
    setSelectedImage(null);
  }
};


  // Flowerのカラーピッカーで色を変更
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (originalImage) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = originalImage;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const [r, g, b] = hexToRgb(newColor);
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setSelectedImage(canvas.toDataURL());
      };
    }
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  // Others: Comment
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value);

  // Others: Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Others: Canvas drawing
  const handleCanvasDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = isEraser ? '#ffffff' : color;
    ctx.beginPath();
    ctx.arc(x, y, penSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="parts-details-container">
      {/* Flower */}
      {partType === 'flowers' && (
        <div>
          {selectedImage && <img src={selectedImage} alt="Selected flower preview" className="selected-image-preview" />}
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="color-picker"
          />
        </div>
      )}

      {/* Balloon */}
      {partType === 'balloon' && (
  <div className="dropdown">
    {selectedImage && (
      <img
        src={selectedImage}
        alt="Selected balloon preview"
        className="selected-image-preview"
        draggable="true" // ドラッグ可能に設定
        onDragStart={(e) => {
          e.dataTransfer.setData('image/png', selectedImage); // ドラッグデータとして画像URLを設定
        }}
      />
    )}
    <select
      value={color}
      onChange={(e) => {
        setColor(e.target.value);
        handleImageSelect(e.target.value);
      }}
    >
      <option value="">選択してください</option>
      {imageNames.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
)}


      {/* Others */}
      {partType === 'others' && (
        <div>
           {selectedImage && (
            <img src={selectedImage} alt="Selected balloon preview" className="selected-image-preview" />
          )}
          {partName === 'comment' && (
            <div className='textarea'>
              <textarea
                placeholder="コメント"
                value={comment}
                onChange={handleCommentChange}
              />
              <p className="comment-preview">{comment}</p>
            </div>
          )}

          {partName === 'image' && (
            <div className="file-upload-wrapper">
            <label className="custom-file-upload">
              ファイルを選択
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            {uploadedImage && <img src={uploadedImage} alt="Uploaded preview" className="uploaded-image-preview" />}
          </div>
          
          )}

{partName === 'pen' && (
  <div>
    <div className="icon-container">
      {/* ペン */}
      <button onClick={() => setIsEraser(false)} className="icon-button">
        <img src={Vector} alt="Pen Icon" className="icon" />
      </button>

      {/* 消しゴム */}
      <button onClick={() => setIsEraser(true)} className="icon-button">
        <img src={eraser} alt="Eraser Icon" className="icon" />
      </button>

      {/* カラーパレット */}
      <button
        onClick={() => setShowColorPalette(!showColorPalette)}className="icon-button">
        <img src={colorpalette} alt="Color Palette Icon" className="icon" />
      </button>
    </div>


    <div className="settings">
      {!isEraser && (
        <div className="pen-settings">

          {showColorPalette && (
            <div className="pen-option">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                title="ペンの色を選択"
              />
            </div>
          )}


          <div className="pen-option">
            <input
              type="range"
              min={1}
              max={20}
              value={penSize}
              onChange={(e) => setPenSize(Number(e.target.value))}
              title="ペンの太さ"
            />
          </div>
        </div>
      )}

      {isEraser && (
        <div className="eraser-settings">

          <div className="eraser-option">
            <input
              type="range"
              min={1}
              max={20}
              value={eraserSize}
              onChange={(e) => setEraserSize(Number(e.target.value))}
              title="消しゴムの太さ"
            />
          </div>
        </div>
      )}
    </div>
  </div>
)}

        </div>
      )}
    </div>
  );
};

export default PartsDetails;
