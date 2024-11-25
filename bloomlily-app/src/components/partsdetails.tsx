import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../firebase/firebaseConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import './partsdetails.css';

interface PartsDetailsProps {
  partType: string;
  partName: string;
}

const PartsDetails: React.FC<PartsDetailsProps> = ({ partType, partName }) => {
  const [color, setColor] = useState<string>('#ffffff'); // 初期色は白
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (partType === 'balloon' && partName) {
      fetchImageNames(partName);
    }
  }, [partType, partName]);

  useEffect(() => {
    if (selectedImage) {
      applyColorToImage(selectedImage, color);
    }
  }, [selectedImage, color]);

  const fetchImageNames = async (folderName: string) => {
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
      console.error('Error fetching image names:', error);
      setImageNames([]);
    }
  };

  const applyColorToImage = (imageUrl: string, color: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // CORSエラー回避
      img.src = imageUrl;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        for (let i = 0; i < imageData.data.length; i += 4) {
          const red = imageData.data[i];
          const green = imageData.data[i + 1];
          const blue = imageData.data[i + 2];

          const [newRed, newGreen, newBlue] = applyColorTransform(red, green, blue, color);
          imageData.data[i] = newRed;
          imageData.data[i + 1] = newGreen;
          imageData.data[i + 2] = newBlue;
        }

        ctx.putImageData(imageData, 0, 0);
      };
    }
  };

  const applyColorTransform = (r: number, g: number, b: number, color: string): [number, number, number] => {
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    const [targetR, targetG, targetB] = hexToRgb(color);

    return [
      Math.round(r * (targetR / 255)),
      Math.round(g * (targetG / 255)),
      Math.round(b * (targetB / 255)),
    ];
  };

  const renderDropdown = (options: string[]) => (
    <div className="dropdown">
      <label>Color:</label>
      <select
        onChange={(e) => setSelectedImage(`/parts/balloon/${partName}/${e.target.value}.png`)}
      >
        <option value="">選択してください</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="parts-details-container">
      <canvas ref={canvasRef} className="image-canvas"></canvas>
      {partType === 'balloon' && renderDropdown(imageNames)}
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="color-picker"
      />
    </div>
  );
};

export default PartsDetails;
