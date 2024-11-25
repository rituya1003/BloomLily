import React, { useRef, useEffect, useState } from 'react';
import './canvas.css';

interface CanvasProps {
  selectedPart: string; // 選択されたパーツのタイプ
  selectedPartName: string; // 選択されたパーツの名前
}

const Canvas: React.FC<CanvasProps> = ({ selectedPart, selectedPartName }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // キャンバスの参照
  const containerRef = useRef<HTMLDivElement | null>(null); // キャンバスの親コンテナの参照
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null); // キャンバスの2Dコンテキスト

  // キャンバスのコンテキストを初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setContext(ctx); // 取得したコンテキストを状態に保存
      }
    }
  }, []);

  // 親コンテナのサイズに合わせてキャンバスのサイズを設定
  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = width; // キャンバスの幅を設定
      canvasRef.current.height = height; // キャンバスの高さを設定
    }
  }, [containerRef]);

  // メモリ線を描画
  const drawGrid = () => {
    if (context && canvasRef.current) {
      const canvas = canvasRef.current;
      const step = 50; // メモリ間隔
      const { width, height } = canvas; // キャンバスの幅と高さ
      const startValue = 0; // メモリ値のスタート値
      const increment = 10; // メモリ値の増加量

      context.strokeStyle = 'rgba(0, 0, 0, 0.3)'; // メモリ線の色（薄く）
      context.lineWidth = 0.5; // メモリ線の太さ
      context.font = '10px Arial'; // メモリ値のフォント
      context.fillStyle = '#000'; // メモリ値の色

      // 縦線とメモリ値（右から左へ）
      for (let x = width - step; x >= 0; x -= step) {
        const reversedX = width - x; // メモリ値を反転
        context.beginPath();
        context.moveTo(x, 0); // 上端から
        context.lineTo(x, height); // 下端まで線を引く
        context.stroke();
        context.fillText(`${startValue + (reversedX / step) * increment}`, x + 2, 10); // メモリ値を描画
      }

      // 横線とメモリ値（下から上へ）
      for (let y = height - step; y >= 0; y -= step) {
        const reversedY = height - y; // メモリ値を反転
        context.beginPath();
        context.moveTo(0, y); // 左端から
        context.lineTo(width, y); // 右端まで線を引く
        context.stroke();
        context.fillText(`${startValue + (reversedY / step) * increment}`, 2, y - 2); // メモリ値を描画
      }
    }
  };

  // キャンバス全体の初期描画（背景とメモリ）
  useEffect(() => {
    if (context) {
      drawGrid(); // メモリ線を描画
    }
  }, [context]);

  return (
    <div className="canvas-container" ref={containerRef}>
      {/* キャンバス本体 */}
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
