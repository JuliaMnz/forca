"use client";

import { useState, useEffect } from "react";

const WORDS = [
  "REACT","JAVASCRIPT","COMPONENTE","ESTADO",
  "PROJETO","FUNCAO","VERCEL","GITHUB","TESTE","DEPLOY"
];

const MAX_ERRORS = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function HangmanSVG({ errors }) {
  // Mostra partes conforme número de erros (0..MAX_ERRORS)
  return (
    <svg viewBox="0 0 200 250" style={{ width: "100%", maxWidth: 300 }}>
      {/* base / suporte */}
      <line x1="10" y1="230" x2="190" y2="230" strokeWidth="4" stroke="#222" />
      <line x1="50" y1="230" x2="50" y2="20" strokeWidth="4" stroke="#222" />
      <line x1="50" y1="20" x2="140" y2="20" strokeWidth="4" stroke="#222" />
      <line x1="140" y1="20" x2="140" y2="40" strokeWidth="4" stroke="#222" />

      {/* head */}
      {errors > 0 && <circle cx="140" cy="60" r="18" strokeWidth="4" stroke="#222" fill="none" />}
      {/* body */}
      {errors > 1 && <line x1="140" y1="78" x2="140" y2="130" strokeWidth="4" stroke="#222" />}
      {/* left arm */}
      {errors > 2 && <line x1="140" y1="90" x2="115" y2="110" strokeWidth="4" stroke="#222" />}
      {/* right arm */}
      {errors > 3 && <line x1="140" y1="90" x2="165" y2="110" strokeWidth="4" stroke="#222" />}
      {/* left leg */}
      {errors > 4 && <line x1="140" y1="130" x2="120" y2="170" strokeWidth="4" stroke="#222" />}
      {/* right leg */}
      {errors > 5 && <line x1="140" y1="130" x2="160" y2="170" strokeWidth="4" stroke="#222" />}
    </svg>
  );
}

export default function JogoForca() {
  const [palavra, setPalavra] = useState(() => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  });
  const [letrasUsadas, setLetrasUsadas] = useState([]); // array de letras escolhidas
  const [erros, setErros] = useState(0);
  const [status, setStatus] = useState("jogando"); // jogando | ganhou | perdeu
  const [input, setInput] = useState("");

  // checa vitória/derrota
  useEffect(() => {
    if (!palavra) return;
    const letrasUnicas = Array.from(new Set(palavra.split("")));
    const todasAcertadas = letrasUnicas.every((l) => letrasUsadas.includes(l));
    if (todasAcertadas) {
      setStatus("ganhou");
      return;
    }
    if (erros >= MAX_ERRORS) {
      setStatus("perdeu");
      return;
    }
    setStatus("jogando");
  }, [letrasUsadas, erros, palavra]);

  function handleGuess(letra) {
    letra = letra.toUpperCase();
    if (status !== "jogando") return;
    if (!/^[A-Z]$/.test(letra)) return;
    if (letrasUsadas.includes(letra)) return; // já tentou
    // adiciona letra às usadas
    setLetrasUsadas((prev) => [...prev, letra]);
    // penaliza se estiver errada
    if (!palavra.includes(letra)) {
      setErros((prev) => Math.min(MAX_ERRORS, prev + 1));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input) return;
    handleGuess(input[0]);
    setInput("");
  }

  function reiniciar() {
    let nova;
    // garante palavra diferente (tenta algumas vezes)
    do {
      nova = WORDS[Math.floor(Math.random() * WORDS.length)];
    } while (nova === palavra && WORDS.length > 1);
    setPalavra(nova);
    setLetrasUsadas([]);
    setErros(0);
    setStatus("jogando");
    setInput("");
  }

  const renderPalavra = () =>
    palavra
      .split("")
      .map((l, idx) => (letrasUsadas.includes(l) ? l : "_"))
      .join(" ");

  const letrasCorretas = letrasUsadas.filter((l) => palavra.includes(l));
  const letrasErradas = letrasUsadas.filter((l) => !palavra.includes(l));

  // estilos inline simples para visual
  const styles = {
    container: { maxWidth: 1000, margin: "20px auto", padding: 16, textAlign: "center" },
    area: { display: "flex", gap: 20, alignItems: "flex-start", justifyContent: "center", flexWrap: "wrap" },
    left: { width: 320, minWidth: 260 },
    right: { flex: 1, minWidth: 300 },
    wordDisplay: { display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 12 },
    letterBox: { minWidth: 28, padding: "8px 6px", borderBottom: "2px solid #444", fontWeight: 700, fontSize: 18 },
    key: { margin: 4, padding: "8px 10px", minWidth: 36, borderRadius: 6, border: "1px solid #ddd", cursor: "pointer", background: "#fff" },
    keyDisabled: { opacity: 0.5, cursor: "not-allowed", background: "#f3f4f6" },
    correctBadge: { color: "#064e3b", fontWeight: 700, marginLeft: 8 },
    wrongBadge: { color: "#7f1d1d", fontWeight: 700, marginLeft: 8 }
  };

  return (
    <section style={styles.container}>
      <h1>Jogo da Forca</h1>
      <p style={{ marginTop: 6, color: "#374151" }}>Adivinhe a palavra — boa sorte!</p>

      <div style={styles.area}>
        <div style={styles.left}>
          <HangmanSVG errors={erros} />
          <div style={{ marginTop: 10, fontSize: 14 }}>
            <div>Tentativas restantes: <strong>{MAX_ERRORS - erros}</strong></div>
            <div style={{ marginTop: 8 }}>
              Letras usadas:
              {letrasUsadas.length === 0 ? (
                <span style={{ marginLeft: 8 }}>—</span>
              ) : (
                <span style={{ marginLeft: 8 }}>
                  {letrasUsadas.map((l) => (
                    <span
                      key={l}
                      style={{
                        display: "inline-block",
                        marginRight: 6,
                        padding: "4px 6px",
                        borderRadius: 4,
                        background: palavra.includes(l) ? "#dcfce7" : "#fee2e2",
                        border: palavra.includes(l) ? "1px solid #86efac" : "1px solid #fca5a5",
                        color: "#111",
                        fontWeight: 700
                      }}
                    >
                      {l}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={styles.right}>
          <div aria-live="polite" style={styles.wordDisplay}>
            {palavra.split("").map((c, i) => (
              <span key={i} style={styles.letterBox}>{letrasUsadas.includes(c) ? c : "_"}</span>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                maxLength={1}
                placeholder="Digite uma letra"
                style={{ padding: "8px 10px", fontSize: 16, marginRight: 8, borderRadius: 6, border: "1px solid #ccc" }}
              />
              <button type="submit" style={{ padding: "8px 12px", borderRadius: 6, background: "#2563eb", color: "#fff", border: "none" }}>
                Enviar
              </button>
              <button type="button" onClick={reiniciar} style={{ marginLeft: 8, padding: "8px 12px", borderRadius: 6, background: "#10b981", color: "#fff", border: "none" }}>
                Reiniciar
              </button>
            </form>

            <div role="group" aria-label="teclado" style={{ marginBottom: 12 }}>
              {ALPHABET.map((L) => {
                const used = letrasUsadas.includes(L);
                const correct = used && palavra.includes(L);
                const wrong = used && !palavra.includes(L);
                const disabled = used || status !== "jogando";
                const keyStyle = {
                  ...styles.key,
                  ...(disabled ? styles.keyDisabled : {}),
                  background: correct ? "#bbf7d0" : wrong ? "#fecaca" : undefined,
                  border: correct ? "1px solid #86efac" : wrong ? "1px solid #fca5a5" : undefined
                };
                return (
                  <button
                    key={L}
                    onClick={() => handleGuess(L)}
                    disabled={disabled}
                    aria-pressed={used}
                    style={keyStyle}
                  >
                    {L}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 6 }}>
              <strong>Acertadas:</strong>
              {letrasCorretas.length === 0 ? <span style={{ marginLeft: 8 }}>—</span> : letrasCorretas.map(l => <span key={l} style={{...styles.correctBadge}}>{l}</span>)}
            </div>
            <div style={{ marginTop: 6 }}>
              <strong>Erradas:</strong>
              {letrasErradas.length === 0 ? <span style={{ marginLeft: 8 }}>—</span> : letrasErradas.map(l => <span key={l} style={{...styles.wrongBadge}}>{l}</span>)}
            </div>

            <div style={{ marginTop: 16, textAlign: "center" }}>
              {status === "ganhou" && (
                <div>
                  <h2 style={{ color: "#065f46" }}>🎉 Parabéns — você ganhou!</h2>
                  <p>A palavra era: <strong>{palavra}</strong></p>
                </div>
              )}
              {status === "perdeu" && (
                <div>
                  <h2 style={{ color: "#7f1d1d" }}>☠️ Você perdeu</h2>
                  <p>A palavra era: <strong>{palavra}</strong></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
