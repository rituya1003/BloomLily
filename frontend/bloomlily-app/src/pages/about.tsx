import React from 'react';
import './about.css';
import processImage1 from '../assets/image/Flame_blue.png';  // 各セクションに使用する画像
import processImage2 from '../assets/image/Flame_yellow.png';
import creatorImage from '../assets/image/creator.png';  // クリエイターの画像
import mail from '../assets/image/mail.png';
import x from '../assets/image/x.png';
import github from '../assets/image/github.png';
import Header from '../components/header';
import Logo from '../assets/image/logo.png'

const About = () => {
  return (
    <div className="about-container">
        <Header />
      <header className="about-header">
      <div className="logo-container">
          <img src={Logo} alt="Logo" className="site-logo" />
        </div>
        <p className="special-text">「大切な瞬間に、あなたの花を贈ろう」</p>
        <p className="special-text">大好きな人に思いを</p>
        <p>特別なイベントをより華やかに彩り、思いを届けるフラワースタンドの贈り物を、誰もが手軽に楽しめるようにするためのプラットフォームです。</p>
        <p>イベントのために素敵なフラワースタンドを贈りたいけれど</p>
        <p>・デザインをどうしよう？</p>
        <p>・思い描くものがあるのに絵が書けない！</p>
        <p>・フラスタってどれだけお金がかかるの！？</p>
        <p>・一緒にフラスタを出す人を探したい！</p>
        <p>という悩みを解決します。</p>

      </header>

      <section className="about-features">
        <h2>Features</h2>
        <div className="features-container">
          <div className="feature-item">
            <img src={processImage1} alt="Feature 1" />
            <h3>デザインツール</h3>
            <div className="feature-description">
                <p>カスタマイズ可能なパーツ</p>
                <p>カラーオプションで</p>
                <p>自分だけのフラワースタンドをデザイン</p>
            </div>
          </div>
          <div className="feature-item">
          <img src={processImage1} alt="Feature 1" />
          <h3>リアルタイム見積もり</h3>
            <div className="feature-description">
                <p>使用する花やパーツを自動で見積もり</p>
                <p>予算管理が簡単で</p>
                <p>安心してデザインできる</p>
            </div>
          </div>
          <div className="feature-item">
            <img src={processImage1} alt="Feature 1" />
            <h3>募集機能</h3>
            <div className="feature-description">
                <p>出資者募集や絵師募集ができ</p>
                <p>金銭取引なども</p>
                <p>このサイトで解決</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-process">
        <h2>Process</h2>
        <ul className="process-list">
          <li><span className="step-font">Step1</span> フラスタを贈ることができるか確認</li>
            <p>会場/主催に確認すること</p>
            <p>・ファンがフラスタを贈ることができるか</p>
            <p>・フラスタのサイズ規定</p>
            <p>・フラスタの装飾などに制限があるか</p>
            <p>フラスタ搬入可能時間、搬出可能時間、搬入口の場所</p>
          <li><span className="step-font">Step2</span> フラスタのデザインを考える</li>
            <p>・お贈りする公演、出演者のイメージ（推しカラー等）</p>
            <p>・何故このイメージになったのか</p>
            <p>・（こだわりがある場合は）使用してほしい花の種類</p>
          <li><span className="step-font">Step3</span> お花屋さんまたは仲介サイトを選ぶ</li>
            <p>・Step1で確認したことを伝える</p>
            <p>・デザインの詳しい打ち合わせをする</p>
            <p>・予算を決める</p>
          <li><span className="step-font">Step4</span> 参加者や絵師を集める</li>
            <p>・共同出資する方を探す</p>
            <p>・金銭の管理をする</p>
            <p>・パネルを使用する場合は担当する方を募る</p>
          <li><span className="step-font">Step5</span> パネルの印刷</li>
            <p>・イラストを作成</p>
            <p>・印刷会社に問い合わせしパネルのサイズを等を入力</p>
            <p>・入稿する</p>
          <li><span className="step-font">Step6</span> フラスタ制作</li>
            <p>・入金を済ませてから制作開始</p>
            <p>・細かいデザイン等のすり合わせをし花屋さんに作成してもらう</p>
            <p>・パネルをお花屋さんに送る</p>
          <li><span className="step-font">Step7</span> 納品</li>
            <p>・Step1で確認したフラスタ搬入可能時間、搬出可能時間、搬入口の場所にお花屋さんがお届けしてくれます</p>
            <p>・納品後フラスタのお写真が欲しい場合事前に連絡しておきましょう</p>
          <li><span className="step-font">Step8</span> 回収</li>
            <p>・お花屋さんが自社でフラスタを回収</p>
            <p>・持って帰りたい装飾品等がある場合は事前にお花屋さんに連絡しておきましょう</p>
        </ul>
      </section>


      <section className="about-creator">
  <h2>Operator</h2>
  <div className="creator-profile">
    <img src={processImage2} alt="Frame Background" className="feature-background" />
    
    <div className="content">
      <img src={creatorImage} alt="Creator" className="creator-image" />
      
      <div className="creator-details">
        <h3>凛月夜</h3>
        <p>
          <img src={mail} alt="Mail Icon" className="icon" /> tuki1220322@gmail.com
        </p>
        <p>
          <img src={x} alt="X Icon" className="icon" /> @Tuki_sen_1220 (オタク垢)
        </p>
        <p>
          <img src={x} alt="X Icon" className="icon" /> @miri_2223 (就活垢)
        </p>
        <p>
          <img src={github} alt="GitHub Icon" className="icon" /> rituya1003
        </p>
      </div>
    </div>
  </div>
</section>


    </div>
  );
};

export default About;
