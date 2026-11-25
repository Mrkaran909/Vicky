import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/**
 * Professional profile photo card — glass frame, cyan glow, soft 3D tilt.
 * Photo path: put your image at  public/profile.jpg  (or pass `src`).
 * Props: src, name, caption (optional – leave empty to hide).
 */
export default function ProfilePhoto({
  src = "/profile.jpg",
  name = "Vicky Mahato",
  caption = "",
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });

  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.figure
      className="pp-wrap"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <style>{CSS}</style>
      <motion.div
        ref={ref}
        className="pp-frame"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      >
        <span className="pp-glow" aria-hidden="true" />
        <div className="pp-inner">
          <img
            className="pp-img"
            src={src}
            alt={`${name} – professional portrait`}
            loading="lazy"
            decoding="async"
            width="800"
            height="1000"
          />
          <span className="pp-shade" aria-hidden="true" />
        </div>
        <span className="pp-corner pp-tl" aria-hidden="true" />
        <span className="pp-corner pp-br" aria-hidden="true" />
      </motion.div>
      <figcaption className="pp-cap">
        <strong>{name}</strong>
        {caption && <span>{caption}</span>}
      </figcaption>
    </motion.figure>
  );
}

const CSS = `
.pp-wrap{margin:0; width:min(100%,380px); display:flex; flex-direction:column; align-items:center; gap:18px}
.pp-frame{position:relative; width:100%; padding:10px; border-radius:26px;
  background:rgba(14,22,36,.55); border:1px solid rgba(160,200,230,.18);
  -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px);
  box-shadow:0 30px 60px -28px rgba(0,0,0,.85), 0 0 0 1px rgba(34,230,255,.18), 0 0 46px rgba(34,230,255,.18);
  transition:box-shadow .35s}
.pp-frame:hover{box-shadow:0 30px 70px -28px rgba(0,0,0,.9), 0 0 0 1px #22e6ff, 0 0 60px rgba(34,230,255,.38)}
.pp-glow{position:absolute; inset:-2px; border-radius:28px; z-index:-1; filter:blur(22px); opacity:.45;
  background:conic-gradient(from 180deg,#22e6ff,#4f7bff,#22e6ff)}
.pp-inner{position:relative; overflow:hidden; border-radius:18px; aspect-ratio:4/5; background:#08111d}
.pp-img{width:100%; height:100%; object-fit:cover; object-position:50% 18%; display:block}
.pp-shade{position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(180deg,transparent 60%,rgba(5,8,15,.55))}
.pp-corner{position:absolute; width:28px; height:28px; border:2px solid #22e6ff; opacity:.8; pointer-events:none}
.pp-tl{top:-6px; left:-6px; border-right:0; border-bottom:0; border-radius:10px 0 0 0}
.pp-br{bottom:-6px; right:-6px; border-left:0; border-top:0; border-radius:0 0 10px 0}
.pp-cap{display:flex; flex-direction:column; align-items:center; gap:4px; text-align:center}
.pp-cap strong{font-size:18px; letter-spacing:.14em; text-transform:uppercase; font-weight:700;
  background:linear-gradient(180deg,#fff,#9aa7b8); -webkit-background-clip:text; background-clip:text; color:transparent}
.pp-cap span{font-size:12px; letter-spacing:.25em; text-transform:uppercase; color:#22e6ff}
`;
