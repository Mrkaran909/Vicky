import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  CAREER DATA — taken verbatim from the CV brief. Do not embellish.  */
/*  "visible" = always shown, "more" = revealed in the accordion.      */
/* ------------------------------------------------------------------ */
const STAGES = [
  {
    n: 1,
    company: "Reliance Trends",
    brand: "AJIO",
    period: "June 2019 – June 2021",
    designation: null,
    category: "Distribution & Retail Operations",
    icon: "network",
    visible: [
      "SAP ERP Operations",
      "B2B & B2C Operations",
      "Distribution Centre Management",
    ],
    more: [
      "30,000+ Monthly Shipments",
      "DC-to-DC Dispatch",
      "Logistics Partner Coordination",
    ],
  },
  {
    n: 2,
    company: "Instakart",
    brand: "Flipkart Grocery",
    period: "June 2021 – February 2022",
    designation: "Data Entry Operator",
    category: "Inventory Management",
    icon: "boxes",
    visible: [
      "Inventory Department Operations",
      "70+ Team Members Handled",
      "Product Segregation",
    ],
    more: [
      "Inventory Auditing",
      "5S & Picking Readiness",
      "Stock Take & Issue Resolution",
    ],
  },
  {
    n: 3,
    company: "Zomato Hyperpure",
    brand: null,
    period: "February 2022 – November 2024",
    designation: "Operations Executive FC",
    category: "Warehouse & Fulfilment Operations",
    icon: "warehouse",
    visible: [
      "Approximately 1.5 Lakh Sq. Ft. FC Operations",
      "200+ Floor Manpower",
      "3 Executives",
      "4,000+ SKU Inventory Monitoring",
    ],
    more: [
      "B2B & B2C Operations",
      "Cold Chain Management",
      "Warehouse Inventory Audits",
      "Picking, Packing & Dispatch",
    ],
  },
  {
    n: 4,
    company: "Delhivery Limited",
    brand: null,
    period: "November 2024 – Present",
    designation: "Associate – Client Service",
    category: "First-Mile & Client Operations",
    icon: "route",
    current: true,
    visible: [
      "21 First-Mile Centres",
      "450+ Daily Clients",
      "100+ Tonnes Daily Load Volume",
      "Four-State Operations Coordination",
    ],
    more: [
      "Client Onboarding & Relationship Management",
      "JARVIS Ticketing System",
      "Client Escalation Management",
      "Vehicle Placement Coordination",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Generic line icons (NOT company logos)                             */
/* ------------------------------------------------------------------ */
function StageIcon({ type }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
      {type === "network" && (
        <g {...p}>
          <circle cx="32" cy="14" r="6" />
          <circle cx="12" cy="48" r="6" />
          <circle cx="52" cy="48" r="6" />
          <path d="M28 19 16 43M36 19l12 24M18 48h28" />
        </g>
      )}
      {type === "boxes" && (
        <g {...p}>
          <path d="M8 34l12-6 12 6-12 6zM20 40v14l12 6V40M8 34v14l12 6" />
          <path d="M32 20l12-6 12 6-12 6zM44 26v14l12-6V20M32 20v14l12 6" />
        </g>
      )}
      {type === "warehouse" && (
        <g {...p}>
          <path d="M6 28 32 12l26 16v26H6z" />
          <path d="M18 54V36h28v18M18 44h28M32 36v18" />
        </g>
      )}
      {type === "route" && (
        <g {...p}>
          <circle cx="14" cy="50" r="5" />
          <path d="M19 50h22a8 8 0 0 0 0-16H26a8 8 0 0 1 0-16h14" />
          <path d="M48 8a6 6 0 0 1 6 6c0 5-6 11-6 11s-6-6-6-11a6 6 0 0 1 6-6z" />
          <circle cx="48" cy="14" r="2" />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  R3F — particles streaming along the glowing rail                   */
/*  Orthographic camera => 1 world unit = 1 CSS pixel.                 */
/* ------------------------------------------------------------------ */
const PARTICLE_COUNT = 44;

function RailParticles() {
  const ref = useRef();
  const { size } = useThree();
  const data = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const speed = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 800;
      speed[i] = 0.4 + Math.random() * 1.1;
    }
    return { pos, speed };
  }, []);

  useFrame((_, dt) => {
    const geo = ref.current?.geometry;
    if (!geo) return;
    const half = size.height / 2;
    const arr = geo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // travel downward (from stage 01 towards stage 04)
      arr[i * 3 + 1] -= data.speed[i] * dt * 90;
      if (arr[i * 3 + 1] < -half) arr[i * 3 + 1] = half;
      arr[i * 3] += Math.sin(arr[i * 3 + 1] * 0.03 + i) * dt * 4;
      if (Math.abs(arr[i * 3]) > 14) arr[i * 3] *= 0.9;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#22e6ff"
        size={3.2}
        sizeAttenuation={false}
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ParticleRail({ active }) {
  return (
    <div className="ct-canvas">
    <Canvas
      orthographic
      camera={{ zoom: 1, position: [0, 0, 100] }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      frameloop={active ? "always" : "never"}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <RailParticles />
    </Canvas>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated stage number (each stage enters differently)              */
/* ------------------------------------------------------------------ */
const NUMBER_ENTRANCES = [
  { initial: { y: 40, opacity: 0, filter: "blur(10px)" } },
  { initial: { x: -40, opacity: 0, filter: "blur(10px)" } },
  { initial: { scale: 0.4, opacity: 0, filter: "blur(10px)" } },
  { initial: { rotateX: -90, opacity: 0, filter: "blur(10px)" } },
];

function StageNumber({ n, inView, reduced }) {
  const [val, setVal] = useState(reduced ? n : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    const c = animate(0, n, {
      duration: 0.4 + n * 0.25,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => c.stop();
  }, [inView, n, reduced]);

  return (
    <motion.span
      className="ct-number"
      initial={NUMBER_ENTRANCES[n - 1].initial}
      animate={
        inView
          ? { x: 0, y: 0, scale: 1, rotateX: 0, opacity: 1, filter: "blur(0px)" }
          : undefined
      }
      transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`Stage ${n}`}
    >
      {String(val).padStart(2, "0")}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  One 3D glass card                                                  */
/* ------------------------------------------------------------------ */
function StageCard({ stage, index, reduced }) {
  const [open, setOpen] = useState(false);
  const itemRef = useRef(null);
  const cardRef = useRef(null);
  const inView = useInView(itemRef, { once: true, margin: "-12% 0px" });
  const nodeLit = useInView(itemRef, { margin: "-45% 0px -45% 0px", amount: 0 });
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (nodeLit) setLit(true);
  }, [nodeLit]);

  const side = index % 2 === 0 ? -1 : 1; // -1 = card on the left (desktop)
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sy = useSpring(ry, { stiffness: 160, damping: 18 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(420px circle at ${x}% ${y}%, rgba(34,230,255,.16), transparent 60%)`
  );

  const onMove = (e) => {
    if (reduced || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 14);
    rx.set(-(py - 0.5) * 14);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const panelId = `ct-more-${stage.n}`;

  return (
    <div
      ref={itemRef}
      className={`ct-item ${side === -1 ? "ct-left" : "ct-right"} ${lit ? "is-lit" : ""}`}
    >
      <span className="ct-node" aria-hidden="true">
        <span className="ct-node-core" />
        {stage.current && <span className="ct-node-pulse" />}
      </span>
      <span className="ct-link" aria-hidden="true" />

      <motion.div
        className="ct-reveal"
        initial={
          reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 70, rotateY: side * -38, scale: 0.92 }
        }
        animate={inView ? { opacity: 1, y: 0, rotateY: 0, scale: 1 } : undefined}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1200 }}
      >
        <motion.article
          ref={cardRef}
          className={`ct-card ${stage.current ? "is-current" : ""}`}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{
            rotateX: sx,
            rotateY: sy,
            transformPerspective: 1000,
            transformStyle: "preserve-3d",
          }}
        >
          <motion.span className="ct-spot" style={{ background: glow }} />
          <span className="ct-edge" aria-hidden="true" />

          {/* floating, generic, company-inspired visual (no logos) */}
          <motion.div
            className="ct-float"
            aria-hidden="true"
            style={{ translateZ: 60 }}
            animate={
              reduced
                ? undefined
                : { y: [0, -10, 0], rotate: [0, side * 4, 0] }
            }
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <StageIcon type={stage.icon} />
          </motion.div>

          <header className="ct-head">
            <StageNumber n={stage.n} inView={inView} reduced={reduced} />
            <div className="ct-title">
              <h3 className="ct-company">{stage.company}</h3>
              {stage.brand && (
                <span className="ct-brand">{stage.brand}</span>
              )}
            </div>
          </header>

          {stage.current && (
            <motion.div
              className="ct-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
            >
              <span className="ct-badge-dot" />
              CURRENT POSITION
            </motion.div>
          )}

          <dl className="ct-meta">
            <div>
              <dt>Duration</dt>
              <dd>{stage.period}</dd>
            </div>
            {stage.designation && (
              <div>
                <dt>Designation</dt>
                <dd>{stage.designation}</dd>
              </div>
            )}
            <div>
              <dt>Category</dt>
              <dd>{stage.category}</dd>
            </div>
          </dl>

          <ul className="ct-list">
            {stage.visible.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                key="more"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <ul className="ct-list ct-list-more">
                  {stage.more.map((d, i) => (
                    <motion.li
                      key={d}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * i + 0.1 }}
                    >
                      {d}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            className="ct-toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
          >
            <span>{open ? "Show less" : "More responsibilities"}</span>
            <motion.svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              aria-hidden="true"
            >
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </button>
        </motion.article>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export default function CareerTimeline({ id = "career" }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const railVisible = useInView(trackRef, { margin: "200px 0px" });

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 65%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const headY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id={id} ref={sectionRef} className="ct-section" aria-labelledby="ct-heading">
      <style>{CSS}</style>
      <div className="ct-bg" aria-hidden="true" />

      <div className="ct-wrap">
        <motion.div
          className="ct-intro"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="ct-eyebrow">Career Timeline</span>
          <h2 id="ct-heading" className="ct-heading">
            Professional Evolution
          </h2>
          <p className="ct-flow">
            <span>Distribution Operations</span>
            <i>→</i>
            <span>Inventory Management</span>
            <i>→</i>
            <span>Warehouse Operations</span>
            <i>→</i>
            <span>First-Mile &amp; Client Operations</span>
          </p>
        </motion.div>

        <div className="ct-track" ref={trackRef}>
          <div className="ct-rail" aria-hidden="true">
            <span className="ct-rail-base" />
            <motion.span
              className="ct-rail-fill"
              style={{ scaleY: reduced ? 1 : fill }}
            />
            {!reduced && (
              <motion.span className="ct-rail-head" style={{ top: headY }} />
            )}
            {!reduced && <ParticleRail active={railVisible} />}
          </div>

          {STAGES.map((s, i) => (
            <StageCard key={s.n} stage={s} index={i} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles — colours are CSS variables so they can be mapped to your   */
/*  existing theme tokens in one place (see :root block below).        */
/* ------------------------------------------------------------------ */
const CSS = `
.ct-section{
  --ct-cyan:#22e6ff; --ct-cyan-soft:rgba(34,230,255,.35);
  --ct-bg:#05080f; --ct-glass:rgba(14,22,36,.55);
  --ct-border:rgba(160,200,230,.14); --ct-text:#aeb9c7;
  --ct-silver:linear-gradient(180deg,#ffffff 0%,#c9d3df 45%,#7d8a9b 100%);
  --ct-gap:56px;
  position:relative; padding:120px 20px 140px; color:var(--ct-text);
  background:var(--ct-bg); overflow:hidden; isolation:isolate;
}
.ct-bg{position:absolute; inset:0; z-index:-1;
  background:
   radial-gradient(900px 500px at 50% -10%, rgba(34,230,255,.10), transparent 60%),
   radial-gradient(700px 500px at 85% 70%, rgba(60,90,255,.08), transparent 60%),
   linear-gradient(rgba(34,230,255,.035) 1px, transparent 1px) 0 0/48px 48px,
   linear-gradient(90deg, rgba(34,230,255,.035) 1px, transparent 1px) 0 0/48px 48px;
  -webkit-mask-image:linear-gradient(#000 70%, transparent); mask-image:linear-gradient(#000 70%, transparent);
}
.ct-wrap{max-width:1120px; margin:0 auto}
.ct-intro{text-align:center; margin-bottom:90px}
.ct-eyebrow{display:inline-block; font-size:12px; letter-spacing:.35em; text-transform:uppercase;
  color:var(--ct-cyan); padding:6px 14px; border:1px solid var(--ct-cyan-soft); border-radius:999px;
  background:rgba(34,230,255,.06)}
.ct-heading{margin:22px 0 18px; font-size:clamp(34px,6vw,64px); line-height:1.05; font-weight:700;
  letter-spacing:-.02em; background:var(--ct-silver); -webkit-background-clip:text; background-clip:text;
  color:transparent}
.ct-flow{display:flex; flex-wrap:wrap; gap:8px 12px; justify-content:center; font-size:13px;
  letter-spacing:.08em; text-transform:uppercase; margin:0}
.ct-flow i{color:var(--ct-cyan); font-style:normal}

.ct-track{position:relative; display:flex; flex-direction:column; gap:64px}
.ct-rail{position:absolute; top:0; bottom:0; left:50%; width:80px; transform:translateX(-50%); pointer-events:none}
.ct-rail-base,.ct-rail-fill{position:absolute; left:50%; top:0; bottom:0; width:2px; margin-left:-1px; border-radius:2px}
.ct-rail-base{background:linear-gradient(rgba(160,200,230,.18),rgba(160,200,230,.06))}
.ct-rail-fill{transform-origin:top; background:linear-gradient(var(--ct-cyan),#6aa8ff);
  box-shadow:0 0 12px var(--ct-cyan), 0 0 32px rgba(34,230,255,.5)}
.ct-rail-head{position:absolute; left:50%; width:12px; height:12px; margin:-6px 0 0 -6px; border-radius:50%;
  background:#fff; box-shadow:0 0 16px 4px var(--ct-cyan)}

.ct-canvas{position:sticky; top:0; height:100vh; height:100svh; width:100%}
.ct-item{position:relative; width:calc(50% - var(--ct-gap)); perspective:1200px}
.ct-left{margin-right:auto} .ct-right{margin-left:auto}
.ct-node{position:absolute; top:46px; width:22px; height:22px; z-index:3}
.ct-left .ct-node{right:calc(-1 * var(--ct-gap) - 11px)}
.ct-right .ct-node{left:calc(-1 * var(--ct-gap) - 11px)}
.ct-node-core{position:absolute; inset:4px; border-radius:50%; background:#0b1522;
  border:2px solid rgba(160,200,230,.35); transition:all .6s}
.is-lit .ct-node-core{background:var(--ct-cyan); border-color:#fff;
  box-shadow:0 0 14px var(--ct-cyan), 0 0 34px var(--ct-cyan-soft)}
.ct-node-pulse{position:absolute; inset:-6px; border-radius:50%; border:1px solid var(--ct-cyan);
  animation:ct-pulse 2s ease-out infinite}
@keyframes ct-pulse{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2);opacity:0}}
.ct-link{position:absolute; top:56px; height:2px; width:calc(var(--ct-gap) - 14px);
  background:linear-gradient(90deg,transparent,rgba(160,200,230,.25)); transition:background .6s; z-index:2}
.ct-left .ct-link{right:calc(-1 * var(--ct-gap) + 14px)}
.ct-right .ct-link{left:calc(-1 * var(--ct-gap) + 14px); transform:scaleX(-1)}
.is-lit .ct-link{background:linear-gradient(90deg,transparent,var(--ct-cyan)); box-shadow:0 0 10px var(--ct-cyan-soft)}

.ct-card{position:relative; padding:28px 28px 22px; border-radius:22px; overflow:visible;
  background:var(--ct-glass); border:1px solid var(--ct-border);
  -webkit-backdrop-filter:blur(18px) saturate(140%); backdrop-filter:blur(18px) saturate(140%);
  box-shadow:0 30px 60px -30px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.06);
  transition:border-color .35s, box-shadow .35s; will-change:transform}
.ct-card:hover{border-color:var(--ct-cyan);
  box-shadow:0 30px 70px -30px rgba(0,0,0,.9), 0 0 0 1px var(--ct-cyan-soft), 0 0 40px rgba(34,230,255,.22)}
.ct-card.is-current{border-color:rgba(34,230,255,.45)}
.ct-spot{position:absolute; inset:0; border-radius:inherit; pointer-events:none; opacity:0; transition:opacity .3s}
.ct-card:hover .ct-spot{opacity:1}
.ct-edge{position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background:linear-gradient(135deg,rgba(34,230,255,.18),transparent 35%); opacity:.5}

.ct-float{position:absolute; top:-26px; right:20px; color:var(--ct-cyan); opacity:.9;
  filter:drop-shadow(0 0 10px rgba(34,230,255,.55)); pointer-events:none}
.ct-head{display:flex; align-items:center; gap:18px; margin-bottom:18px; padding-right:56px}
.ct-number{font-size:clamp(46px,6vw,64px); font-weight:800; line-height:1; letter-spacing:-.03em;
  font-variant-numeric:tabular-nums; background:var(--ct-silver); -webkit-background-clip:text;
  background-clip:text; color:transparent; -webkit-text-stroke:1px rgba(34,230,255,.25);
  display:inline-block; transform-origin:center}
.ct-title{display:flex; flex-direction:column; gap:6px}
.ct-company{margin:0; font-size:clamp(18px,2.4vw,24px); font-weight:700; letter-spacing:.06em;
  text-transform:uppercase; background:var(--ct-silver); -webkit-background-clip:text;
  background-clip:text; color:transparent}
.ct-brand{font-size:12px; letter-spacing:.3em; text-transform:uppercase; color:var(--ct-cyan)}

.ct-badge{display:inline-flex; align-items:center; gap:8px; margin-bottom:16px; padding:7px 14px;
  font-size:11px; font-weight:700; letter-spacing:.22em; color:#04202a; border-radius:999px;
  background:linear-gradient(90deg,var(--ct-cyan),#8ff3ff); box-shadow:0 0 22px rgba(34,230,255,.55)}
.ct-badge-dot{width:7px; height:7px; border-radius:50%; background:#04202a; animation:ct-blink 1.4s infinite}
@keyframes ct-blink{50%{opacity:.25}}

.ct-meta{margin:0 0 18px; display:grid; gap:10px; padding-bottom:18px; border-bottom:1px solid var(--ct-border)}
.ct-meta dt{font-size:10px; letter-spacing:.25em; text-transform:uppercase; color:rgba(174,185,199,.6)}
.ct-meta dd{margin:2px 0 0; font-size:15px; color:#e6edf5}

.ct-list{list-style:none; margin:0; padding:0; display:grid; gap:9px}
.ct-list-more{padding-top:9px}
.ct-list li{position:relative; padding-left:20px; font-size:14.5px; line-height:1.45}
.ct-list li::before{content:""; position:absolute; left:0; top:.55em; width:7px; height:7px; border-radius:2px;
  background:var(--ct-cyan); box-shadow:0 0 8px var(--ct-cyan); transform:rotate(45deg)}

.ct-toggle{margin-top:18px; display:inline-flex; align-items:center; gap:8px; cursor:pointer;
  padding:9px 16px; font:inherit; font-size:12px; letter-spacing:.14em; text-transform:uppercase;
  color:var(--ct-cyan); background:rgba(34,230,255,.06); border:1px solid var(--ct-cyan-soft);
  border-radius:999px; transition:background .25s, box-shadow .25s}
.ct-toggle:hover{background:rgba(34,230,255,.14); box-shadow:0 0 18px rgba(34,230,255,.3)}
.ct-toggle:focus-visible{outline:2px solid var(--ct-cyan); outline-offset:3px}

@media (max-width:820px){
  .ct-section{padding:90px 16px 100px}
  .ct-rail{left:20px}
  .ct-item{width:calc(100% - 52px); margin-left:52px !important; margin-right:0 !important}
  .ct-left .ct-node,.ct-right .ct-node{left:-43px; right:auto}
  .ct-left .ct-link,.ct-right .ct-link{left:-32px; right:auto; width:32px; transform:scaleX(-1)}
  .ct-card{padding:24px 20px 20px}
  .ct-intro{margin-bottom:60px}
  .ct-track{gap:44px}
}
@media (prefers-reduced-motion:reduce){
  .ct-node-pulse,.ct-badge-dot{animation:none}
}
`;
