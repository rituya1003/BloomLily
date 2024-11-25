import React, { useState } from 'react';
import Header from '../components/header';
import './design.css';
import PartsCards from '../components/partscards';
import PartsDetails from '../components/partsdetails'; 
import Canvas from '../components/canvas';

const Design: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [selectedPartName, setSelectedPartName] = useState<string>(''); 

  // タブクリック時に選択されたパーツを設定
  const handleTabClick = (part: string) => {
    console.log(`Clicked tab: ${part}`);
    setSelectedPart(part);
  };

  // パーツカードがクリックされたときにそのパーツ名を設定
  const handlePartSelect = (partName: string) => {
    console.log("Selected part name:", partName); // デバッグ用
    setSelectedPartName(partName);
  };

  return (
    <div className="design-container">
      <Header />
      <div className="content-container">
        <div className="sidebar">
          <div className="tab-container">
            <div className="tab" onClick={() => handleTabClick('sutando')}>スタンド</div>
            <div className="tab" onClick={() => handleTabClick('flowers')}>花</div>
            <div className="tab" onClick={() => handleTabClick('balloon')}>バルーン</div>
            <div className="tab" onClick={() => handleTabClick('others')}>その他</div>
          </div>
          <div className="card-grid">
            {/* パーツカードの表示 */}
            <PartsCards partType={selectedPart} onPartSelect={handlePartSelect} />
          </div>
        </div>
        <div className="main-content">
          <div className="total-container">
            <h2>Total:</h2>
          </div>
          <div className="canvas-area">
            {/* キャンバスエリア */}
            <Canvas selectedPart={selectedPart} selectedPartName={selectedPartName} />
          </div>
        </div>
        <div className="right-content">
          <div className="save-button">保存</div>
          <div className="setting-area">
            {/* PartsDetails コンポーネントを表示 */}
            {selectedPart && selectedPartName && (
              <PartsDetails partType={selectedPart} partName={selectedPartName} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Design;
