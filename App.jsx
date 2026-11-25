import React from "react";
import { motion } from "framer-motion";
import ProfilePhoto from "./ProfilePhoto.jsx";
import CareerTimeline from "./CareerTimeline.jsx";

const CSS = `
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0; background:#05080f; color:#aeb9c7;
  font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; -webkit-font-smoothing:antialiased}
.nav{position:fixed; top:0; left:0; right:0; z-index:50; display:flex; justify-content:space-between; align-items:center;
  padding:14px 22px; background:rgba(5,8,15,.65); -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px);
  border-bottom:1px solid rgba(160,200,230,.1)}
.nav b{letter-spacing:.2em; text-transform:uppercase; font-size:13px; color:#e6edf5}
.nav a{margin-left:20px; font-size:12px; letter-spacing:.2em; text-transform:uppercase; color:#aeb9c7; text-decoration:none; transition:color .2s}
.nav a:hover{color:#22e6ff}
.hero{min-height:100svh; display:flex; align-items:center; justify-content:center; padding:110px 20px 70px; position:relative;
  background:radial-gradient(900px 500px at 50% 0%, rgba(34,230,255,.10), transparent 60%), #05080f}
.hero-in{max-width:1000px; width:100%; display:flex; flex-wrap:wrap; gap:48px; align-items:center; justify-content:center}
.hero-text{flex:1 1 320px; max-width:520px}
.eyebrow{display:inline-block; font-size:12px; letter-spacing:.35em; text-transform:uppercase; color:#22e6ff;
  padding:6px 14px; border:1px solid rgba(34,230,255,.35); border-radius:999px; background:rgba(34,230,255,.06)}
.hero h1{margin:22px 0 14px; font-size:clamp(40px,8vw,76px); line-height:1.02; letter-spacing:-.02em; font-weight:800;
  background:linear-gradient(180deg,#fff,#c9d3df 45%,#7d8a9b); -webkit-background-clip:text; background-clip:text; color:transparent}
.hero p{margin:0 0 26px; font-size:16px; line-height:1.6}
.cta{display:inline-block; padding:12px 24px; border-radius:999px; font-size:12px; letter-spacing:.18em; text-transform:uppercase;
  color:#04202a; background:linear-gradient(90deg,#22e6ff,#8ff3ff); text-decoration:none; font-weight:700;
  box-shadow:0 0 28px rgba(34,230,255,.4)}
.foot{padding:30px 20px 40px; text-align:center; font-size:12px; letter-spacing:.2em; text-transform:uppercase;
  color:rgba(174,185,199,.6); background:#05080f; border-top:1px solid rgba(160,200,230,.08)}
@media (max-width:820px){.nav a{margin-left:14px}.hero-text{text-align:center}}
`;

export default function App() {
  return (
    <>
      <style>{CSS}</style>
      <nav className="nav">
        <b>Vicky Mahato</b>
        <div>
          <a href="#home">Home</a>
          <a href="#career">Career</a>
        </div>
      </nav>

      <header id="home" className="hero">
        <div className="hero-in">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow">Portfolio</span>
            <h1>Vicky Mahato</h1>
            <p>Operations Professional</p>
            <a className="cta" href="#career">
              View Career Journey
            </a>
          </motion.div>
          <ProfilePhoto />
        </div>
      </header>

      <main>
        <CareerTimeline id="career" />
      </main>

      <footer className="foot">© {new Date().getFullYear()} Vicky Mahato</footer>
    </>
  );
}
