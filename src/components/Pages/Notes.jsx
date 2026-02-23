// src/pages/Notes.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertTriangle, CheckCircle, Award } from "lucide-react";
import { elevesData } from "../../data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function getNoteClass(note) {
  if (note >= 14) return { bg: "rgba(46,204,138,0.12)", color: "#2ecc8a" };
  if (note >= 10) return { bg: "rgba(244,168,64,0.12)", color: "#f4a840" };
  return { bg: "rgba(255,79,90,0.12)", color: "#ff4f5a" };
}

function getInitiales(nom) {
  return nom.split(" ").slice(0, 2).map((n) => n[0]).join("");
}

export default function Notes() {
  const { eleveId } = useParams();
  const navigate = useNavigate();
  const eleve = elevesData.find((e) => e.id === parseInt(eleveId)) || elevesData[0];
  const [trimActif, setTrimActif] = useState(eleve.trimestres[1]);

  const barData = trimActif.notes.map((n) => ({
    matiere: n.matiere.split(" ")[0],
    note: n.note,
    coeff: n.coeff,
  }));

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0f1e", minHeight: "100vh", color: "#e8edf5" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={{ background: "#121c35", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 2rem", position: "sticky", top: 0, zIndex: 100, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 900, color: "#f4a840" }}>
          École<span style={{ color: "#e8edf5", fontWeight: 700 }}>Track</span>
        </div>
        <motion.button whileHover={{ x: -4 }} onClick={() => navigate("/dashboard")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#8892a4", padding: "8px 16px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem" }}>
          <ArrowLeft size={16} /> Retour au tableau de bord
        </motion.button>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* EN-TÊTE ÉLÈVE */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ background: "#161f38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.8rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #f4a840, #e8870f)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900, color: "#0a0f1e", flexShrink: 0 }}>
            {getInitiales(eleve.nom)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#fff" }}>{eleve.nom}</div>
            <div style={{ color: "#8892a4", fontSize: "0.875rem", marginTop: 4 }}>
              📚 {eleve.classe} &nbsp;·&nbsp; 📅 Année {eleve.annee}
            </div>
          </div>
          <div style={{ background: "rgba(244,168,64,0.1)", border: "1px solid rgba(244,168,64,0.25)", color: "#f4a840", padding: "8px 16px", borderRadius: 10, fontSize: "0.88rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <Award size={16} /> Rang {eleve.rang} / {eleve.effectif}
          </div>
        </motion.div>

        {/* ALERTES */}
        <AnimatePresence>
          {eleve.alertes.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
              {eleve.alertes.map((a, i) => (
                <div key={i} style={{ background: "rgba(255,79,90,0.07)", border: "1px solid rgba(255,79,90,0.25)", borderRadius: 14, padding: "1.2rem 1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <AlertTriangle size={20} color="#ff4f5a" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ color: "#ff4f5a", fontWeight: 700, fontSize: "0.9rem", marginBottom: 4 }}>Discordance — {a.matiere} (Trim. {a.trimestre})</div>
                    <div style={{ color: "#8892a4", fontSize: "0.85rem", lineHeight: 1.6 }}>
                      Note déclarée par l'élève : <strong style={{ color: "#fff" }}>{a.noteDeclaree}/20</strong> &nbsp;vs&nbsp; Note officielle : <strong style={{ color: "#ff4f5a" }}>{a.noteOfficielle}/20</strong>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SÉLECTEUR TRIMESTRE */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {eleve.trimestres.map((t) => (
            <motion.button
              key={t.numero}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTrimActif(t)}
              style={{
                background: trimActif.numero === t.numero ? "rgba(244,168,64,0.15)" : "#161f38",
                border: trimActif.numero === t.numero ? "1px solid rgba(244,168,64,0.5)" : "1px solid rgba(255,255,255,0.07)",
                color: trimActif.numero === t.numero ? "#f4a840" : "#8892a4",
                padding: "10px 20px", borderRadius: 10, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem",
              }}
            >
              {t.numero === 1 ? "1er" : `${t.numero}ème`} Trimestre
              <span style={{ marginLeft: 8, color: t.moyenne >= 10 ? "#2ecc8a" : "#ff4f5a" }}>({t.moyenne}/20)</span>
            </motion.button>
          ))}
        </div>

        {/* GRAPHIQUE BARRES */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ background: "#161f38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#8892a4", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.2rem" }}>📊 Notes par matière</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="matiere" tick={{ fill: "#8892a4", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 20]} tick={{ fill: "#8892a4", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#121c35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e8edf5", fontFamily: "DM Sans" }}
                formatter={(v) => [`${v}/20`, "Note"]}
              />
              <Bar dataKey="note" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.note >= 14 ? "#2ecc8a" : entry.note >= 10 ? "#f4a840" : "#ff4f5a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* TABLEAU DES NOTES */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} style={{ background: "#161f38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden", marginBottom: "1.5rem" }}>
          <div style={{ padding: "1.2rem 1.8rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Bulletin officiel — {trimActif.numero === 1 ? "1er" : `${trimActif.numero}ème`} Trimestre</span>
            <span style={{ fontSize: "0.78rem", color: "#8892a4" }}>Moyenne : <strong style={{ color: trimActif.moyenne >= 10 ? "#2ecc8a" : "#ff4f5a" }}>{trimActif.moyenne}/20</strong></span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                {["Matière", "Note /20", "Coeff.", "Appréciation", "Enseignant"].map((h) => (
                  <th key={h} style={{ padding: "0.85rem 1.5rem", textAlign: "left", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.8px", color: "#8892a4", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trimActif.notes.map((n, i) => {
                const nc = getNoteClass(n.note);
                const appr = n.note >= 16 ? "Très Bien" : n.note >= 14 ? "Bien" : n.note >= 12 ? "Assez Bien" : n.note >= 10 ? "Passable" : "Insuffisant";
                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td style={{ padding: "0.95rem 1.5rem", fontWeight: 500 }}>{n.matiere}</td>
                    <td style={{ padding: "0.95rem 1.5rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 28, borderRadius: 8, background: nc.bg, color: nc.color, fontWeight: 700, fontSize: "0.88rem" }}>{n.note}</span>
                    </td>
                    <td style={{ padding: "0.95rem 1.5rem", color: "#8892a4" }}>×{n.coeff}</td>
                    <td style={{ padding: "0.95rem 1.5rem", color: nc.color, fontWeight: 600, fontSize: "0.85rem" }}>{appr}</td>
                    <td style={{ padding: "0.95rem 1.5rem", color: "#8892a4", fontSize: "0.85rem" }}>{n.enseignant}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* OBSERVATION + DÉCISION */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ background: "#161f38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.8rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#8892a4", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>💬 Observation du conseil de classe</div>
          <p style={{ color: "#e8edf5", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "1.2rem" }}>{eleve.observation}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={18} color="#2ecc8a" />
            <span style={{ color: "#2ecc8a", fontWeight: 700, fontSize: "0.9rem" }}>{eleve.decision}</span>
          </div>
        </motion.div>

      </main>
    </div>
  );
}