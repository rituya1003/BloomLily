import React, { useRef, useEffect, useState } from 'react';
import './canvas.css';

type CanvasProps = {
  selectedPart?: string;
  selectedPartName?: string;
};

type ImageData = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const Canvas: React.FC<CanvasProps> = ({ selectedPart, selectedPartName }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [resizing, setResizing] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setContext(ctx);
      }
    }
  }, []);

  // Resize canvas to fit the container
  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
  }, [containerRef]);

  // Handle drop event to add images
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const imageUrl = e.dataTransfer.getData('image/png');
    if (imageUrl && context) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setImages((prev) => [
          ...prev,
          { src: imageUrl, x: 50, y: 50, width: img.width / 2, height: img.height / 2 },
        ]);
      };
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // Redraw canvas content
  const redrawCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawGrid(); // Optional grid lines
      images.forEach((image) => {
        const img = new Image();
        img.src = image.src;
        img.onload = () => {
          context.drawImage(img, image.x, image.y, image.width, image.height);
        };
      });
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, [images]);

  // Handle mouse down to start dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      images.forEach((image, index) => {
        if (
          x >= image.x &&
          x <= image.x + image.width &&
          y >= image.y &&
          y <= image.y + image.height
        ) {
          setDragging(index);
          setDragOffset({ x: x - image.x, y: y - image.y });
        }
      });
    }
  };

  // Handle mouse move to drag images
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging !== null && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setImages((prev) =>
        prev.map((image, index) =>
          index === dragging ? { ...image, x: x - dragOffset.x, y: y - dragOffset.y } : image
        )
      );
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => setDragging(null);

  // Optional grid lines
  const drawGrid = () => {
    if (context && canvasRef.current) {
      const { width, height } = canvasRef.current;
      context.strokeStyle = '#e0e0e0';
      context.lineWidth = 0.5;
      for (let x = 0; x < width; x += 20) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }
    }
  };

  return (
    <div
      className="canvas-container"
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default Canvas;
