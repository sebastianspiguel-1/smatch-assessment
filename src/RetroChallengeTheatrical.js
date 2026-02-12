import React, { useEffect, useMemo, useRef, useState } from "react";
import "./RetroChallengeTheatrical.css";

/**
 * RetroChallenge — versión teatral + tablero (Start/Stop/Continue)
 * - Escenario con NPCs
 * - Turnos de diálogo (teatral)
 * - Acciones del facilitador (habilidades)
 * - Tablero retro como centro (S/S/C)
 * - Scoring por comportamiento + calidad de acciones (sin parecer examen)
 */

const SCENARIOS = [
  {
    id: "carryover",
    title: "Carry over alto y tensión",
    premise:
      "El sprint cerró con mucho carry over. Hay fricción y la sensación de que el sistema está empujando trabajo sin control.",
    npcs: [
      { id: "po", name: "Sofía (PO)", role: "PO", trait: "Defiende alcance", color: "indigo" },
      { id: "tl", name: "Martín (TL)", role: "TL", trait: "Busca estructura", color: "slate" },
      { id: "dev", name: "Leo (Dev)", role: "Dev", trait: "Directo, impaciente", color: "orange" },
      { id: "qa", name: "Carla (QA)", role: "QA", trait: "Cuello de botella", color: "emerald" },
      { id: "ux", name: "Nico (UX)", role: "UX", trait: "Callado, observa", color: "violet" },
    ],
    script: [
      // Beat 0: Apertura
      { speaker: "tl", tone: "neutral", text: "Ok. Cerramos sprint con muchísimo carry over. Necesitamos entender por qué y qué cambiamos." },
      { speaker: "po", tone: "defensive", text: "Yo lo que veo es que no llegamos porque siempre estiman de menos. Y después QA nos frena." },
      { speaker: "qa", tone: "tired", text: "QA no frena por gusto. Nos caen cambios al final y no hay criterios claros. Es imposible validar rápido." },

      // Beat 1: Blame / Tensión
      { speaker: "dev", tone: "blame", text: "Sinceramente, el problema es que entran historias sin definición. Después nos piden milagros." },
      { speaker: "po", tone: "blame", text: "Definición había. Lo que pasa es que ustedes se traban con detalles." },
      { speaker: "ux", tone: "quiet", text: "(silencio) ..." },

      // Beat 2: Evidencia (si el facilitador la desbloquea)
      { speaker: "tl", tone: "data", text: "Dato: 6 de 10 historias entraron al sprint sin AC completos. Y 4 cambiaron alcance después del día 6." },

      // Beat 3: Convergencia
      { speaker: "qa", tone: "neutral", text: "Si tuviéramos una política de entrada al sprint y Definition of Done más clara, yo podría planificar mejor." },
      { speaker: "dev", tone: "neutral", text: "Y si limitamos WIP o dejamos de meter cosas tarde, no se desarma todo." },

      // Beat 4: Cierre
      { speaker: "po", tone: "neutral", text: "Si acordamos un DoR mínimo, yo me comprometo. Pero necesito que me ayuden a definir qué entra." },
    ],
  },
];

const SKILLS = [
  {
    id: "frame",
    label: "Enmarcar",
    hint: "Define objetivo y reglas.",
    effect: { clarity: +10, tension: -6 },
    generates: [
      { col: "continue", text: "Alinear objetivo y reglas de retro al inicio (timebox + foco en sistema)", tag: "facilitación" },
    ],
  },
  {
    id: "deblame",
    label: "Desactivar blame",
    hint: "Cambia de culpa a sistema.",
    effect: { clarity: +6, tension: -12 },
    generates: [
      { col: "start", text: "Acordar lenguaje: hablar del sistema (proceso/políticas), no de culpas", tag: "clima" },
    ],
  },
  {
    id: "inviteQuiet",
    label: "Invitar voz silenciosa",
    hint: "Trae a quien no habla.",
    effect: { clarity: +6, tension: -2, participation: +10 },
    generates: [
      { col: "start", text: "Rotación de voz: ronda corta para escuchar a quienes no hablaron", tag: "facilitación" },
    ],
  },
  {
    id: "askEvidence",
    label: "Pedir evidencia",
    hint: "Convierte opinión en dato.",
    effect: { clarity: +12, tension: -3, evidence: +20 },
    generates: [
      { col: "start", text: "Definir evidencias mínimas: AC completos antes de entrar al sprint", tag: "flujo" },
    ],
  },
  {
    id: "timebox",
    label: "Timebox + foco",
    hint: "Reduce deriva.",
    effect: { clarity: +8, tension: -4 },
    generates: [
      { col: "stop", text: "Dejar de abrir temas sin cierre; timebox por tema y decisión explícita", tag: "facilitación" },
    ],
  },
  {
    id: "converge",
    label: "Converger",
    hint: "Baja a 2–4 decisiones.",
    effect: { clarity: +10, tension: -2 },
    generates: [
      { col: "stop", text: "Dejar de meter trabajo tarde al sprint sin AC y sin impacto evaluado", tag: "flujo" },
      { col: "start", text: "Implementar DoR mínimo (AC + datos + dependencias) para entrada al sprint", tag: "proceso" },
    ],
  },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function uid() {
  return (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).toString();
}

function hasMetric(s) {
  return /(\b\d+(\.\d+)?\b)|(%|ms|min|hora|d[ií]a|seman|SLA|SLO|P\d)/i.test(s || "");
}
function hasTimebox(s) {
  return /(hoy|mañana|esta semana|próxima semana|\b\d+\s*(d[ií]as?|semanas?|horas?)\b|fecha|deadline|antes del)/i.test(
    s || ""
  );
}

function scoreSeniority(total) {
  if (total >= 85) return { label: "Senior", desc: "Conduce tensión, usa evidencia y sale con acciones ejecutables." };
  if (total >= 70) return { label: "Semi Senior", desc: "Buen criterio; falta precisión o cierre en acciones." };
  if (total >= 55) return { label: "Mid", desc: "Enfoque correcto pero general; le cuesta convertir en decisiones." };
  if (total >= 40) return { label: "Junior", desc: "Responde al ruido; necesita estructura y foco en sistema." };
  return { label: "Inicial", desc: "Muy superficial o sin señales de facilitación." };
}

function initialBoard() {
  return {
    start: [],
    stop: [],
    continue: [],
  };
}

export default function RetroChallengeTheatrical() {
  const scenario = SCENARIOS[0];

  // Scene control
  const [scene, setScene] = useState("intro"); // intro | play | actions | outro
  const [beat, setBeat] = useState(0);

  // NPC state
  const [speakerId, setSpeakerId] = useState(scenario.script[0].speaker);
  const [lastLine, setLastLine] = useState(scenario.script[0]);

  // World state (gamefeel)
  const [tension, setTension] = useState(44);
  const [clarity, setClarity] = useState(26);
  const [participation, setParticipation] = useState(22);
  const [evidence, setEvidence] = useState(0);

  // Skill cooldowns
  const [cooldowns, setCooldowns] = useState(() =>
    Object.fromEntries(SKILLS.map((s) => [s.id, 0]))
  );

  // Retro board
  const [board, setBoard] = useState(initialBoard());

  // Notes created from dialogue (auto-capture)
  const [autoCapture, setAutoCapture] = useState(true);

  // Actions (final)
  const [actionCards, setActionCards] = useState([
    { id: uid(), fromNoteId: null, statement: "", owner: "", timeframe: "", metric: "" },
    { id: uid(), fromNoteId: null, statement: "", owner: "", timeframe: "", metric: "" },
  ]);

  // Score evidence (internal)
  const score = useMemo(() => {
    // Behavior-based score
    let facil = 0;
    facil += clamp(clarity / 2, 0, 30); // clarity → facil
    facil += clamp((100 - tension) / 4, 0, 20); // lower tension helps
    facil += clamp(participation / 5, 0, 10);
    facil += clamp(evidence / 5, 0, 10);

    // Action quality
    const filled = actionCards.filter((a) => a.statement.trim().length > 0);
    let actionScore = 0;

    for (const a of filled.slice(0, 4)) {
      let s = 0;
      s += a.statement.trim().length >= 18 ? 10 : a.statement.trim().length >= 8 ? 6 : 2;
      s += a.owner.trim().length >= 2 ? 6 : 0;
      s += hasTimebox(a.timeframe) ? 6 : 0;
      s += (hasMetric(a.metric) || a.metric.trim().length >= 2) ? 6 : 0;
      actionScore += s;
    }

    // Reward 2–4 good actions (not many mediocre)
    const strong = filled.filter(
      (a) =>
        a.statement.trim().length >= 18 &&
        a.owner.trim().length >= 2 &&
        hasTimebox(a.timeframe) &&
        (hasMetric(a.metric) || a.metric.trim().length >= 2)
    ).length;

    actionScore += strong >= 2 ? 6 : strong === 1 ? 3 : 0;
    actionScore = clamp(actionScore, 0, 30);

    const total = clamp(Math.round(facil + actionScore), 0, 100);
    return { total, band: scoreSeniority(total), actionScore, facilScore: Math.round(facil) };
  }, [clarity, tension, participation, evidence, actionCards]);

  const stageRef = useRef(null);

  useEffect(() => {
    // cooldown tick
    if (scene !== "play") return;
    const t = setInterval(() => {
      setCooldowns((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const k of Object.keys(next)) {
          if (next[k] > 0) {
            next[k] = next[k] - 1;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 800);
    return () => clearInterval(t);
  }, [scene]);

  function resetRun() {
    setBeat(0);
    setSpeakerId(scenario.script[0].speaker);
    setLastLine(scenario.script[0]);
    setTension(44);
    setClarity(26);
    setParticipation(22);
    setEvidence(0);
    setCooldowns(Object.fromEntries(SKILLS.map((s) => [s.id, 0])));
    setBoard(initialBoard());
    setActionCards([
      { id: uid(), fromNoteId: null, statement: "", owner: "", timeframe: "", metric: "" },
      { id: uid(), fromNoteId: null, statement: "", owner: "", timeframe: "", metric: "" },
    ]);
    setScene("intro");
  }

  function startPlay() {
    setScene("play");
    setBeat(0);
    const line = scenario.script[0];
    setSpeakerId(line.speaker);
    setLastLine(line);
    stageRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }

  function nextBeat() {
    const nextIndex = beat + 1;
    if (nextIndex >= scenario.script.length) {
      // move to actions step
      setScene("actions");
      return;
    }
    setBeat(nextIndex);
    const line = scenario.script[nextIndex];
    setSpeakerId(line.speaker);
    setLastLine(line);

    // Auto-capture: convert dialogue into retro notes ONLY if evidence is present or line is actionable
    if (autoCapture) {
      const generated = dialogueToNotes(line, evidence);
      if (generated.length) {
        setBoard((prev) => addNotes(prev, generated));
      }
    }

    // world dynamics (script drives tension a bit)
    if (line.tone === "blame") setTension((t) => clamp(t + 8, 0, 100));
    if (line.tone === "defensive") setTension((t) => clamp(t + 5, 0, 100));
    if (line.tone === "data") setClarity((c) => clamp(c + 10, 0, 100));
  }

function applySkill(skillId) {    const skill = SKILLS.find((s) => s.id === skillId);
    if (!skill) return;
    if (cooldowns[skillId] > 0) return;

    // Apply effects
    setClarity((c) => clamp(c + (skill.effect.clarity || 0), 0, 100));
    setTension((t) => clamp(t + (skill.effect.tension || 0), 0, 100));
    setParticipation((p) => clamp(p + (skill.effect.participation || 0), 0, 100));
    setEvidence((e) => clamp(e + (skill.effect.evidence || 0), 0, 100));

    // Generate board notes (this is the “game reward”)
    if (skill.generates?.length) {
      const notes = skill.generates.map((g) => ({
        id: uid(),
        col: g.col,
        text: g.text,
        tag: g.tag,
        source: "skill",
      }));
      setBoard((prev) => addNotes(prev, notes));
    }

    // Cooldown
    setCooldowns((prev) => ({ ...prev, [skillId]: 3 }));

    // Small narrative effect: if you deblame, reduce tension reactions
    if (skillId === "deblame") {
      setLastLine((l) => ({ ...l, text: l.text + " (baja el tono en la sala)" }));
    }
  }

  function addManualNote(col) {
    const text = prompt("Nota breve (1 línea):");
    if (!text) return;
    const note = { id: uid(), col, text: text.trim(), tag: "manual", source: "manual" };
    setBoard((prev) => addNotes(prev, [note]));
  }

  function moveNote(noteId, toCol) {
    setBoard((prev) => {
      const all = [...prev.start, ...prev.stop, ...prev.continue];
      const note = all.find((n) => n.id === noteId);
      if (!note) return prev;
      const cleaned = removeNote(prev, noteId);
      const moved = { ...note, col: toCol };
      return addNotes(cleaned, [moved]);
    });
  }

  function createActionFromNote(note) {
    // put into first empty action slot
    setActionCards((prev) => {
      const next = [...prev];
      const idx = next.findIndex((a) => !a.statement.trim());
      const target = idx === -1 ? next.length : idx;
      if (idx === -1) next.push({ id: uid(), fromNoteId: note.id, statement: "", owner: "", timeframe: "", metric: "" });
      next[target] = {
        ...next[target],
        fromNoteId: note.id,
        statement: note.text,
      };
      return next;
    });
  }

  function updateAction(id, patch) {
    setActionCards((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function addActionCard() {
    setActionCards((prev) => [...prev, { id: uid(), fromNoteId: null, statement: "", owner: "", timeframe: "", metric: "" }]);
  }

  return (
    <div className="rtc-page">
      <div className="rtc-topbar">
        <div className="rtc-brand">
          <span className="rtc-dot" />
          <div>
            <div className="rtc-title">Retro Challenge</div>
            <div className="rtc-sub">Simulación teatral + tablero • Score por evidencias</div>
          </div>
        </div>

        <div className="rtc-score">
          <div className="rtc-scoreNum">{score.total}</div>
          <div className="rtc-scoreMeta">
            <div className="rtc-scoreBand">{score.band.label}</div>
            <div className="rtc-scoreDesc">{score.band.desc}</div>
          </div>
        </div>
      </div>

      <div className="rtc-shell">
        {scene === "intro" && (
          <div className="rtc-hero">
            <div className="rtc-heroLeft">
              <div className="rtc-kicker">No es un examen. Es una sala con gente real.</div>
              <h1 className="rtc-h1">
                Facilitá una retro con tensión.
                <br />
                Transformá caos en mejoras.
              </h1>
              <p className="rtc-lead">
                Vas a ver un escenario teatral con personas, turnos y fricción. Tu objetivo es sostener el clima,
                pedir evidencia, llegar a causas defendibles y terminar con 2–4 mejoras ejecutables.
              </p>

              <div className="rtc-heroChips">
                <span className="rtc-chip">Facilitación</span>
                <span className="rtc-chip">Root cause</span>
                <span className="rtc-chip">Improvement actions</span>
                <span className="rtc-chip">Seguimiento</span>
              </div>

              <div className="rtc-heroCTA">
                <button className="rtc-btnPrimary" onClick={startPlay}>
                  Entrar a la sala
                </button>
                <button className="rtc-btnGhost" onClick={() => setAutoCapture((v) => !v)}>
                  Auto-captura: {autoCapture ? "On" : "Off"}
                </button>
              </div>

              <div className="rtc-note">
                Tip: el tablero se completa con lo que aparece en la conversación, pero se vuelve “bueno” cuando intervenís bien.
              </div>
            </div>

            <div className="rtc-heroRight">
              <div className="rtc-card">
                <div className="rtc-cardTag">Escenario</div>
                <div className="rtc-cardTitle">{scenario.title}</div>
                <div className="rtc-cardText">{scenario.premise}</div>

                <div className="rtc-npcList">
                  {scenario.npcs.map((n) => (
                    <div key={n.id} className="rtc-npcLine">
                      <span className={`rtc-avatar rtc-avatar--${n.color}`} />
                      <div>
                        <div className="rtc-npcName">{n.name}</div>
                        <div className="rtc-npcMeta">{n.role} • {n.trait}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rtc-card rtc-card--soft">
                <div className="rtc-cardTag">Cómo se puntúa</div>
                <div className="rtc-miniGrid">
                  <div className="rtc-miniKPI"><b>Clima</b> (tensión)</div>
                  <div className="rtc-miniKPI"><b>Claridad</b> (foco)</div>
                  <div className="rtc-miniKPI"><b>Evidencia</b> (datos)</div>
                  <div className="rtc-miniKPI"><b>Acciones</b> (owner/métrica/horizonte)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(scene === "play" || scene === "actions" || scene === "outro") && (
          <>
            {/* STAGE */}
            <div className="rtc-stage" ref={stageRef}>
              <div className="rtc-stageHeader">
                <div>
                  <div className="rtc-stageTag">Sala de retro</div>
                  <div className="rtc-stageTitle">{scenario.title}</div>
                </div>

                <div className="rtc-meters">
                  <Meter label="Tensión" value={tension} tone="warn" />
                  <Meter label="Claridad" value={clarity} tone="primary" />
                  <Meter label="Participación" value={participation} tone="ok" />
                  <Meter label="Evidencia" value={evidence} tone="slate" />
                </div>
              </div>

              <div className="rtc-npcRow">
                {scenario.npcs.map((n) => (
                  <NPC
                    key={n.id}
                    npc={n}
                    active={n.id === speakerId}
                    tension={tension}
                    clarity={clarity}
                  />
                ))}
              </div>

              <div className="rtc-dialogue">
                <div className="rtc-bubble">
                  <div className="rtc-bubbleTop">
                    <span className="rtc-bubbleName">{npcName(scenario, lastLine.speaker)}</span>
                    <span className={`rtc-tone rtc-tone--${lastLine.tone}`}>{toneLabel(lastLine.tone)}</span>
                  </div>
                  <div className="rtc-bubbleText">{lastLine.text}</div>
                </div>

                {scene === "play" && (
                  <div className="rtc-dialogueActions">
                    <button className="rtc-btnGhost" onClick={nextBeat}>
                      Siguiente intervención del equipo
                    </button>
                    <button className="rtc-btnSoft" onClick={() => setScene("actions")}>
                      Ir a mejoras
                    </button>
                  </div>
                )}
              </div>

              {/* FACILITATOR CONSOLE */}
              {scene === "play" && (
                <div className="rtc-console">
                  <div className="rtc-consoleTitle">Consola del facilitador</div>
                  <div className="rtc-skillGrid">
                    {SKILLS.map((s) => {
                      const cd = cooldowns[s.id] || 0;
                      return (
                        <button
                          key={s.id}
                          className={`rtc-skill ${cd ? "rtc-skill--cd" : ""}`}
onClick={() => applySkill(s.id)}
                          disabled={cd > 0}
                          title={s.hint}
                        >
                          <div className="rtc-skillLabel">{s.label}</div>
                          <div className="rtc-skillHint">{s.hint}</div>
                          {cd > 0 && <div className="rtc-skillCd">Cooldown</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RETRO BOARD */}
            <div className="rtc-boardWrap">
              <div className="rtc-boardHeader">
                <div>
                  <div className="rtc-boardTag">Tablero</div>
                  <div className="rtc-boardTitle">Start / Stop / Continue</div>
                </div>
                <div className="rtc-boardActions">
                  <button className="rtc-btnSoft" onClick={() => addManualNote("start")}>+ Nota Start</button>
                  <button className="rtc-btnSoft" onClick={() => addManualNote("stop")}>+ Nota Stop</button>
                  <button className="rtc-btnSoft" onClick={() => addManualNote("continue")}>+ Nota Continue</button>
                </div>
              </div>

              <div className="rtc-board">
                <BoardCol
                  title="Start"
                  subtitle="Lo que empezamos"
                  notes={board.start}
                  onMove={moveNote}
                  onAction={createActionFromNote}
                />
                <BoardCol
                  title="Stop"
                  subtitle="Lo que dejamos de hacer"
                  notes={board.stop}
                  onMove={moveNote}
                  onAction={createActionFromNote}
                />
                <BoardCol
                  title="Continue"
                  subtitle="Lo que mantenemos"
                  notes={board.continue}
                  onMove={moveNote}
                  onAction={createActionFromNote}
                />
              </div>

              <div className="rtc-boardHint">
                Convertí 2–4 notas en acciones reales. El juego se gana cuando el tablero se vuelve ejecutable.
              </div>
            </div>

            {/* ACTIONS */}
            {scene === "actions" && (
              <div className="rtc-actionsWrap">
                <div className="rtc-actionsHeader">
                  <div>
                    <div className="rtc-actionsTag">Cierre</div>
                    <div className="rtc-actionsTitle">Acciones ejecutables</div>
                    <div className="rtc-actionsLead">
                      Tomá tus notas más valiosas y convertílas en 2–4 acciones con owner, horizonte y métrica.
                    </div>
                  </div>
                  <button className="rtc-btnSoft" onClick={addActionCard}>+ Agregar acción</button>
                </div>

                <div className="rtc-actionGrid">
                  {actionCards.map((a, idx) => (
                    <div key={a.id} className="rtc-actionCard">
                      <div className="rtc-actionTop">
                        <div className="rtc-actionIdx">Acción {idx + 1}</div>
                        <div className="rtc-actionScoreTag">
                          {qualityTag(a)}
                        </div>
                      </div>

                      <label className="rtc-label">Acción (1 línea)</label>
                      <textarea
                        className="rtc-textarea"
                        rows={3}
                        value={a.statement}
                        onChange={(e) => updateAction(a.id, { statement: e.target.value })}
                        placeholder="Ej: Implementar DoR mínimo y bloquear entrada al sprint sin AC completos."
                      />

                      <div className="rtc-row2">
                        <div>
                          <label className="rtc-label">Owner</label>
                          <input
                            className="rtc-input"
                            value={a.owner}
                            onChange={(e) => updateAction(a.id, { owner: e.target.value })}
                            placeholder="Ej: PO + TL"
                          />
                        </div>
                        <div>
                          <label className="rtc-label">Horizonte</label>
                          <input
                            className="rtc-input"
                            value={a.timeframe}
                            onChange={(e) => updateAction(a.id, { timeframe: e.target.value })}
                            placeholder="Ej: 2 semanas (antes del próximo planning)"
                          />
                        </div>
                      </div>

                      <label className="rtc-label">Métrica / criterio de éxito</label>
                      <input
                        className="rtc-input"
                        value={a.metric}
                        onChange={(e) => updateAction(a.id, { metric: e.target.value })}
                        placeholder="Ej: -30% carry over, +AC completos, menor lead time"
                      />

                      <div className="rtc-qualityRow">
                        <span className={`rtc-q ${a.owner.trim() ? "on" : ""}`}>Owner</span>
                        <span className={`rtc-q ${hasTimebox(a.timeframe) ? "on" : ""}`}>Horizonte</span>
                        <span className={`rtc-q ${(hasMetric(a.metric) || a.metric.trim()) ? "on" : ""}`}>Métrica</span>
                        <span className={`rtc-q ${a.statement.trim().length >= 18 ? "on" : ""}`}>Concreta</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rtc-actionsFooter">
                  <button className="rtc-btnGhost" onClick={() => setScene("play")}>Volver a la sala</button>
                  <button className="rtc-btnPrimary" onClick={() => setScene("outro")}>Finalizar</button>
                </div>

                <div className="rtc-internalScore">
                  <div className="rtc-internalLine">
                    Facilitación: <b>{score.facilScore}</b> • Acciones: <b>{score.actionScore}</b> • Total: <b>{score.total}</b>
                  </div>
                  <div className="rtc-internalSmall">
                    (Esto es interno. Lo importante es que el candidato lo sienta como una experiencia, no como un examen.)
                  </div>
                </div>
              </div>
            )}

            {scene === "outro" && (
              <div className="rtc-outro">
                <div className="rtc-outroCard">
                  <div className="rtc-outroTag">Resultado</div>
                  <div className="rtc-outroScore">{score.total} / 100</div>
                  <div className="rtc-outroBand">{score.band.label}</div>
                  <div className="rtc-outroDesc">{score.band.desc}</div>

                  <div className="rtc-outroBtns">
                    <button className="rtc-btnPrimary" onClick={resetRun}>Reiniciar</button>
                    <button className="rtc-btnGhost" onClick={() => setScene("play")}>Volver a la sala</button>
                  </div>

                  <div className="rtc-outroHint">
                    Próximo paso: exportar un “informe HR” (evidencias) sin mostrarlo al candidato durante el juego.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- helpers / components ---------- */

function npcName(scenario, id) {
  return scenario.npcs.find((n) => n.id === id)?.name ?? id;
}

function toneLabel(tone) {
  const map = {
    neutral: "neutral",
    defensive: "defensivo",
    tired: "agotado",
    blame: "culpa",
    data: "dato",
    quiet: "silencio",
  };
  return map[tone] ?? tone;
}

function dialogueToNotes(line, evidence) {
  // Convert dialogue lines to potential notes, but keep it short and game-like.
  // Gate "data" notes behind evidence (or if the line itself is data).
  const out = [];

  const t = line.text.toLowerCase();

  // If blame appears, it's a Stop candidate.
  if (line.tone === "blame" || t.includes("culpa") || t.includes("milagro")) {
    out.push({ id: uid(), col: "stop", text: "Evitar blame: reencuadrar a sistema y acuerdos", tag: "clima", source: "dialogue" });
  }

  // "AC", "criterios", "definición" becomes Start.
  if (t.includes("criter") || t.includes("ac") || t.includes("definici")) {
    out.push({ id: uid(), col: "start", text: "Política de entrada (DoR) con AC claros antes de iniciar", tag: "proceso", source: "dialogue" });
  }

  // QA bottleneck becomes Start/Stop depending on framing
  if (t.includes("qa") && t.includes("final")) {
    out.push({ id: uid(), col: "start", text: "Planificar QA antes; evitar acumulación al final del sprint", tag: "flujo", source: "dialogue" });
  }

  // Data line (strong note) only if evidence unlocked or tone is data
  if (line.tone === "data" || evidence >= 20) {
    if (t.includes("histor") && (t.includes("ac") || t.includes("criter"))) {
      out.push({
        id: uid(),
        col: "start",
        text: "Medir % de historias con AC completos al entrar al sprint (objetivo: subirlo)",
        tag: "evidencia",
        source: "dialogue",
      });
    }
    if (t.includes("cambi") && t.includes("alcance")) {
      out.push({
        id: uid(),
        col: "stop",
        text: "Frenar cambios de alcance sin renegociar objetivo/impacto del sprint",
        tag: "flujo",
        source: "dialogue",
      });
    }
  }

  // Keep it tight: max 2 notes per line
  return out.slice(0, 2);
}

function addNotes(prev, notes) {
  const next = { ...prev, start: [...prev.start], stop: [...prev.stop], continue: [...prev.continue] };
  for (const n of notes) {
    next[n.col] = [n, ...next[n.col]];
  }
  return next;
}

function removeNote(prev, noteId) {
  return {
    start: prev.start.filter((n) => n.id !== noteId),
    stop: prev.stop.filter((n) => n.id !== noteId),
    continue: prev.continue.filter((n) => n.id !== noteId),
  };
}

function qualityTag(a) {
  const okOwner = a.owner.trim().length >= 2;
  const okTime = hasTimebox(a.timeframe);
  const okMetric = hasMetric(a.metric) || a.metric.trim().length >= 2;
  const okAction = a.statement.trim().length >= 18;
  const c = [okOwner, okTime, okMetric, okAction].filter(Boolean).length;
  if (c === 4) return "Acción fuerte";
  if (c === 3) return "Casi completa";
  if (c === 2) return "Incompleta";
  return "Borrador";
}

function Meter({ label, value, tone }) {
  return (
    <div className="rtc-meter">
      <div className="rtc-meterTop">
        <span className="rtc-meterLabel">{label}</span>
        <span className="rtc-meterVal">{Math.round(value)}</span>
      </div>
      <div className="rtc-meterTrack">
        <div className={`rtc-meterFill rtc-meterFill--${tone}`} style={{ width: `${clamp(value, 0, 100)}%` }} />
      </div>
    </div>
  );
}

function NPC({ npc, active, tension, clarity }) {
  // simple mood heuristic for visual flavor
  const mood = clamp(50 + (clarity - tension) / 2, 0, 100);
  return (
    <div className={`rtc-npc ${active ? "rtc-npc--active" : ""}`}>
      <div className={`rtc-avatarBig rtc-avatarBig--${npc.color}`} />
      <div className="rtc-npcInfo">
        <div className="rtc-npcName2">{npc.role}</div>
        <div className="rtc-npcTrait">{npc.trait}</div>
        <div className="rtc-npcMood">
          <div className="rtc-npcMoodTrack">
            <div className="rtc-npcMoodFill" style={{ width: `${mood}%` }} />
          </div>
          <div className="rtc-npcMoodLabel">{mood >= 60 ? "estable" : mood >= 40 ? "tenso" : "frágil"}</div>
        </div>
      </div>
    </div>
  );
}

function BoardCol({ title, subtitle, notes, onMove, onAction }) {
  return (
    <div className="rtc-col">
      <div className="rtc-colHead">
        <div className="rtc-colTitle">{title}</div>
        <div className="rtc-colSub">{subtitle}</div>
      </div>

      <div className="rtc-colBody">
        {notes.length === 0 && (
          <div className="rtc-empty">
            Todavía no hay notas.
            <div className="rtc-emptyHint">Las buenas notas aparecen cuando facilitás bien.</div>
          </div>
        )}

        {notes.map((n) => (
          <div key={n.id} className="rtc-noteCard">
            <div className="rtc-noteText">{n.text}</div>
            <div className="rtc-noteMeta">
              <span className={`rtc-tag rtc-tag--${tagTone(n.tag)}`}>{n.tag}</span>
              <span className="rtc-src">{n.source}</span>
            </div>
            <div className="rtc-noteBtns">
              <button className="rtc-miniBtn" onClick={() => onMove(n.id, "start")}>Start</button>
              <button className="rtc-miniBtn" onClick={() => onMove(n.id, "stop")}>Stop</button>
              <button className="rtc-miniBtn" onClick={() => onMove(n.id, "continue")}>Continue</button>
              <button className="rtc-miniBtn rtc-miniBtn--primary" onClick={() => onAction(n)}>→ Acción</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function tagTone(tag) {
  if (tag === "evidencia") return "primary";
  if (tag === "clima") return "warn";
  if (tag === "proceso") return "ok";
  if (tag === "flujo") return "slate";
  return "neutral";
}