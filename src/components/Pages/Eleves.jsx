import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plus, Search, X, User, Mail, Phone,
  MapPin, Calendar, Hash, School, ChevronRight,
  CheckCircle, AlertTriangle, BookOpen, Filter
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const CI = {
  orange: "#F77F00",
  vert: "#009A44",
  orangeLight: "rgba(247,127,0,0.10)",
  vertLight: "rgba(0,154,68,0.10)",
  bg: "#F5F6FA",
  muted: "#9099a8",
  dark: "#1a2236",
  text: "#2d3748",
  border: "rgba(0,0,0,0.08)",
};

const inputStyle = (focus) => ({
  width: "100%",
  background: focus ? "#fff" : "#F8F9FC",
  border: `1.5px solid ${focus ? CI.orange : "rgba(0,0,0,0.10)"}`,
  color: CI.dark,
  padding: "11px 14px 11px 40px",
  borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.92rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s",
  boxShadow: focus ? `0 0 0 3px ${CI.orange}18` : "none",
});

function Field({ icon: Icon, label, required, children }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: CI.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label} {required && <span style={{ color: "#e53e3e" }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        <Icon size={15} color={CI.muted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        {children}
      </div>
    </div>
  );
}

function InputField({ icon, label, required, type = "text", value, onChange, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <Field icon={icon} label={label} required={required}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle(focus)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </Field>
  );
}

function SelectField({ icon, label, required, value, onChange, options, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <Field icon={icon} label={label} required={required}>
      <select
        value={value}
        onChange={onChange}
        style={{ ...inputStyle(focus), appearance: "none", cursor: "pointer" }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.nom || o.label}</option>
        ))}
      </select>
    </Field>
  );
}

export default function Eleves() {
  const navigate = useNavigate();
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filtreClasse, setFiltreClasse] = useState("");

  const [form, setForm] = useState({
    matricule: "", nom: "", prenom: "", date_naissance: "",
    email: "", contact: "", quartier: "", classe_id: ""
  });

  // Charger élèves et classes
  useEffect(() => {
    fetchEleves();
    fetchClasses();
  }, []);

  async function fetchEleves() {
    try {
      setLoading(true);
      const res = await api.get("/eleves");
      setEleves(res.data);
    } catch {
      toast.error("Impossible de charger les élèves.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchClasses() {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch {
      toast.error("Impossible de charger les classes.");
    }
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  // Générer matricule automatiquement
  function genererMatricule() {
    const annee = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 9000) + 1000;
    handleChange("matricule", `EL${annee}${rand}`);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.matricule || !form.nom || !form.prenom || !form.date_naissance || !form.classe_id) {
      toast.error("Remplis tous les champs obligatoires !");
      return;
    }
    setSaving(true);
    try {
      await api.post("/eleves", form);
      toast.success(`Élève ${form.prenom} ${form.nom} ajouté avec succès ! 🎉`);
      setForm({ matricule: "", nom: "", prenom: "", date_naissance: "", email: "", contact: "", quartier: "", classe_id: "" });
      setShowForm(false);
      fetchEleves();
    } catch (error) {
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error("Erreur lors de l'ajout de l'élève.");
      }
    } finally {
      setSaving(false);
    }
  }

  // Filtrage
  const elevesFiltres = eleves.filter(e => {
    const matchSearch = search === "" ||
      e.nom?.toLowerCase().includes(search.toLowerCase()) ||
      e.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      e.matricule?.toLowerCase().includes(search.toLowerCase());
    const matchClasse = filtreClasse === "" || String(e.classe_id) === String(filtreClasse);
    return matchSearch && matchClasse;
  });

  function getInitiales(nom, prenom) {
    return `${prenom?.[0] || ""}${nom?.[0] || ""}`.toUpperCase();
  }

  const avatarColors = [CI.orange, CI.vert, "#6c63ff", "#e53e3e", "#00bcd4"];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: CI.bg, minHeight: "100vh", color: CI.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={{ background: "#fff", borderBottom: `1px solid ${CI.border}`, padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <motion.button whileHover={{ x: -3 }} onClick={() => navigate("/dashboard")}
            style={{ background: "none", border: "none", color: CI.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", padding: "6px 10px", borderRadius: 8 }}
          >
            <ArrowLeft size={16} /> Retour
          </motion.button>
          <div style={{ width: 1, height: 20, background: CI.border }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, color: CI.orange }}>
            École<span style={{ color: CI.dark, fontWeight: 700 }}>Track</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 6px 20px rgba(247,127,0,0.3)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, background: CI.orange, color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer" }}
        >
          <Plus size={17} /> Nouvel élève
        </motion.button>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* TITRE + STATS */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "1.5rem" }}
        >
          <div style={{ height: 4, width: 48, background: `linear-gradient(90deg, ${CI.orange}, ${CI.vert})`, borderRadius: 2, marginBottom: "0.75rem" }} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900, color: CI.dark, marginBottom: 4 }}>
            Gestion des Élèves
          </h1>
          <p style={{ color: CI.muted, fontSize: "0.88rem" }}>
            {eleves.length} élève{eleves.length > 1 ? "s" : ""} enregistré{eleves.length > 1 ? "s" : ""} · Année scolaire 2024–2025
          </p>
        </motion.div>

        {/* STATS RAPIDES */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}
        >
          {[
            { label: "Total élèves", value: eleves.length, color: CI.orange, icon: <User size={18}/> },
            { label: "Classes", value: classes.length, color: "#6c63ff", icon: <School size={18}/> },
            { label: "Résultats ce filtre", value: elevesFiltres.length, color: CI.vert, icon: <Filter size={18}/> },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "1rem", border: `1px solid ${CI.border}`, borderTop: `3px solid ${s.color}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ color: s.color, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "'Playfair Display', serif", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.72rem", color: CI.muted, fontWeight: 600, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* BARRE RECHERCHE + FILTRE */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}
        >
          <div style={{ position: "relative", flex: 2, minWidth: 200 }}>
            <Search size={16} color={CI.muted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou matricule..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", background: "#fff", border: `1px solid ${CI.border}`, color: CI.dark, padding: "11px 14px 11px 40px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: CI.muted }}>
                <X size={14} />
              </button>
            )}
          </div>
          <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
            <School size={15} color={CI.muted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
            <select
              value={filtreClasse}
              onChange={e => setFiltreClasse(e.target.value)}
              style={{ width: "100%", background: "#fff", border: `1px solid ${CI.border}`, color: CI.dark, padding: "11px 14px 11px 38px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none", appearance: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            >
              <option value="">Toutes les classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
        </motion.div>

        {/* LISTE ÉLÈVES */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: CI.muted }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              style={{ width: 36, height: 36, border: `3px solid ${CI.orange}30`, borderTopColor: CI.orange, borderRadius: "50%", margin: "0 auto 1rem" }}
            />
            Chargement des élèves...
          </div>
        ) : elevesFiltres.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", borderRadius: 20, border: `1px solid ${CI.border}` }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: CI.dark, marginBottom: 8 }}>Aucun élève trouvé</h3>
            <p style={{ color: CI.muted, fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              {search ? "Modifie ta recherche ou" : "Commence par"} ajouter un élève.
            </p>
            <motion.button whileHover={{ scale: 1.03 }} onClick={() => setShowForm(true)}
              style={{ background: CI.orange, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Plus size={16} /> Ajouter un élève
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {elevesFiltres.map((eleve, i) => {
              const color = avatarColors[i % avatarColors.length];
              const classe = classes.find(c => c.id === eleve.classe_id);
              return (
                <motion.div key={eleve.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(0,0,0,0.08)" }}
                  style={{ background: "#fff", borderRadius: 18, border: `1px solid ${CI.border}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", cursor: "pointer" }}
                >
                  {/* Bande drapeau */}
                  <div style={{ height: 4, background: `linear-gradient(90deg, ${CI.orange} 33%, #fff 33%, #fff 66%, ${CI.vert} 66%)` }} />

                  <div style={{ padding: "1.2rem" }}>
                    {/* En-tête carte */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}bb)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                        {getInitiales(eleve.nom, eleve.prenom)}
                      </div>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: CI.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {eleve.prenom} {eleve.nom}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: CI.muted, marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                          <Hash size={11} /> {eleve.matricule}
                        </div>
                      </div>
                      <div style={{ background: color + "18", color, borderRadius: 8, padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0 }}>
                        {eleve.classe?.nom || classe?.nom || "—"}
                      </div>
                    </div>

                    {/* Infos */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      {[
                        { icon: <Calendar size={12}/>, label: eleve.date_naissance ? new Date(eleve.date_naissance).toLocaleDateString("fr-FR") : "—" },
                        { icon: <Phone size={12}/>, label: eleve.contact || "—" },
                        { icon: <Mail size={12}/>, label: eleve.email || "—" },
                        { icon: <MapPin size={12}/>, label: eleve.quartier || "—" },
                      ].map((info, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: 6, color: CI.muted, fontSize: "0.78rem", overflow: "hidden" }}>
                          <span style={{ flexShrink: 0 }}>{info.icon}</span>
                          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{info.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bouton voir */}
                    <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: CI.orangeLight, borderRadius: 9, border: `1px solid rgba(247,127,0,0.2)` }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: CI.orange }}>Voir le dossier</span>
                      <ChevronRight size={15} color={CI.orange} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL FORMULAIRE */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}
            >
              {/* En-tête modal */}
              <div style={{ padding: "1.5rem 1.8rem", borderBottom: `1px solid ${CI.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
                <div>
                  <div style={{ height: 3, width: 36, background: `linear-gradient(90deg, ${CI.orange}, ${CI.vert})`, borderRadius: 2, marginBottom: 8 }} />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 900, color: CI.dark, margin: 0 }}>
                    Inscription d'un élève
                  </h2>
                  <p style={{ color: CI.muted, fontSize: "0.8rem", margin: "3px 0 0" }}>Remplis les informations de l'élève</p>
                </div>
                <button onClick={() => setShowForm(false)}
                  style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: CI.muted }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: "1.5rem 1.8rem" }}>

                {/* Matricule avec générateur auto */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: CI.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Matricule <span style={{ color: "#e53e3e" }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <Hash size={15} color={CI.muted} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                      <input type="text" value={form.matricule} onChange={e => handleChange("matricule", e.target.value)}
                        placeholder="Ex: EL20240001"
                        style={{ ...inputStyle(false), paddingLeft: 40 }}
                      />
                    </div>
                    <motion.button type="button" whileHover={{ scale: 1.03 }} onClick={genererMatricule}
                      style={{ background: CI.orangeLight, border: `1px solid rgba(247,127,0,0.3)`, color: CI.orange, borderRadius: 10, padding: "0 14px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      Auto ✨
                    </motion.button>
                  </div>
                </div>

                {/* Nom & Prénom */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.8rem" }}>
                  <InputField icon={User} label="Nom" required value={form.nom} onChange={e => handleChange("nom", e.target.value)} placeholder="Nom de famille" />
                  <InputField icon={User} label="Prénom" required value={form.prenom} onChange={e => handleChange("prenom", e.target.value)} placeholder="Prénom(s)" />
                </div>

                {/* Date de naissance */}
                <InputField icon={Calendar} label="Date de naissance" required type="date" value={form.date_naissance} onChange={e => handleChange("date_naissance", e.target.value)} placeholder="" />

                {/* Classe */}
                <SelectField icon={School} label="Classe" required value={form.classe_id} onChange={e => handleChange("classe_id", e.target.value)}
                  options={classes} placeholder="Choisir une classe"
                />

                {/* Contact & Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.8rem" }}>
                  <InputField icon={Phone} label="Contact" type="tel" value={form.contact} onChange={e => handleChange("contact", e.target.value)} placeholder="+225 07 00 00 00 00" />
                  <InputField icon={Mail} label="Email" type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="email@exemple.com" />
                </div>

                {/* Quartier */}
                <InputField icon={MapPin} label="Quartier" value={form.quartier} onChange={e => handleChange("quartier", e.target.value)} placeholder="Quartier de résidence" />

                {/* Boutons */}
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                  <button type="button" onClick={() => setShowForm(false)}
                    style={{ flex: 1, padding: "12px", background: "#f0f0f0", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", color: CI.muted }}
                  >
                    Annuler
                  </button>
                  <motion.button type="submit" disabled={saving}
                    whileHover={{ scale: saving ? 1 : 1.02, boxShadow: saving ? "none" : "0 6px 20px rgba(247,127,0,0.3)" }}
                    whileTap={{ scale: saving ? 1 : 0.97 }}
                    style={{ flex: 2, padding: "12px", background: saving ? `${CI.orange}80` : CI.orange, color: "#fff", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    {saving ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                        />
                        Enregistrement...
                      </>
                    ) : (
                      <><CheckCircle size={17} /> Inscrire l'élève</>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}