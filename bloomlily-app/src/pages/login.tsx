import React, { useState } from "react";
import Logo from "../assets/image/logo_toka.png";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import * as WebAuthn from "@simplewebauthn/browser";
import "./login.css";

function Login() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // WebAuthn 対応の登録
  const handleWebAuthnRegistration = async () => {
    try {
      const options = await fetch("/api/webauthn/register-options").then((res) => res.json());

      const credential = await WebAuthn.startRegistration(options);

      await fetch("/api/webauthn/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });

      alert("WebAuthn 登録に成功しました");
    } catch (err) {
      console.error("WebAuthn 登録失敗:", err);
    }
  };

  // 登録処理
  const handleRegistration = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("登録成功:", userCredential.user);

      handleWebAuthnRegistration();
    } catch (error) {
      // console.error("登録エラー:", error.message); 
    }
  };

  // ログイン処理
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("ログイン成功:", userCredential.user);

      const options = await fetch("/api/webauthn/login-options").then((res) => res.json());
      const assertion = await WebAuthn.startAuthentication(options);

      await fetch("/api/webauthn/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assertion),
      });

      alert("ログイン成功");
    } catch (error) {
      // console.error("ログインエラー:", error.message);
    }
  };

  return (
    <div>
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="login-site-logo" />
      </div>
      {isSignUpMode ? (
        <div className="signup-container">
          <h1>New Account</h1>
          <form>
            <label>
              メールアドレス:
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              パスワード:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="button" onClick={handleRegistration}>
              Registration
            </button>
          </form>
          <button className="return" onClick={() => setIsSignUpMode(false)}>
            戻る
          </button>
        </div>
      ) : (
        <div className="container">
          <button className="buttonlogin" onClick={handleLogin}>
            Login
          </button>
          <button className="buttonsignup" onClick={() => setIsSignUpMode(true)}>
            New Account
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;
