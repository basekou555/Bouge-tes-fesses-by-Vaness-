import { useState, useMemo } from 'react'
import {
  events,
  JOURS,
  JOURS_COURTS,
  CATEGORIES,
  VILLES,
  CATEGORIE_STYLE,
  type Jour,
  type Categorie,
  type Ville,
} from './events'

const JOUR_ORDER: Record<string, number> = {
  Lundi: 0, Mardi: 1, Mercredi: 2, Jeudi: 3,
  Vendredi: 4, Samedi: 5, Dimanche: 6,
}

// ─── EventCard ────────────────────────────────────────────────────────────────

function EventCard({ event }: { event: (typeof events)[0] }) {
  const { band } = CATEGORIE_STYLE[event.categorie]
  const isGratuit = event.gratuit

  return (
    <article
      style={{
        borderRadius: '16px',
        backgroundColor: isGratuit ? '#FFFBEB' : '#ffffff',
        border: `1px solid ${isGratuit ? '#F5C418' : '#e5e7eb'}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = '0 6px 16px rgba(0,0,0,0.11)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'
      }}
    >
      {/* Colored top band */}
      <div style={{ height: '12px', backgroundColor: band, flexShrink: 0 }} />

      {/* Card body */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>

        {/* Badges row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '999px',
              backgroundColor: band,
              color: '#ffffff',
              flexShrink: 0,
              letterSpacing: '0.02em',
            }}
          >
            {event.categorie}
          </span>
          {isGratuit && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 800,
                padding: '4px 11px',
                borderRadius: '999px',
                backgroundColor: '#F5C418',
                color: '#1B4FA0',
                flexShrink: 0,
                boxShadow: '0 1px 4px rgba(245,196,24,0.4)',
              }}
            >
              GRATUIT 🎉
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          style={{
            margin: 0,
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: '17px',
            lineHeight: '1.3',
            color: '#1a1a1a',
          }}
        >
          {event.titre}
        </h2>

        {/* Lieu + heure */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', fontSize: '13px', color: '#6b7280' }}>
            <span style={{ flexShrink: 0 }}>📍</span>
            <span>{event.lieu}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#6b7280' }}>
            <span>🕐</span>
            <span>{event.heure ?? 'Toute la journée'}</span>
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: '#4b5563',
            lineHeight: '1.5',
            fontStyle: 'normal',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.description}
        </p>

        {/* Day chip */}
        <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: '999px',
              backgroundColor: '#F3F4F6',
              color: '#374151',
            }}
          >
            {event.jour}{event.heure ? ` · ${event.heure}` : ' · Toute la journée'}
          </span>
        </div>
      </div>
    </article>
  )
}

// ─── FilterBtn ────────────────────────────────────────────────────────────────

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: '6px 14px',
        borderRadius: '999px',
        fontSize: '13px',
        fontWeight: 700,
        fontFamily: "'Nunito', sans-serif",
        cursor: 'pointer',
        border: `1.5px solid ${active ? '#F5C418' : '#CBD5E1'}`,
        backgroundColor: active ? '#F5C418' : '#ffffff',
        color: '#1B4FA0',
        boxShadow: active ? '0 2px 8px rgba(245,196,24,0.35)' : 'none',
        transition: 'all 0.12s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [selectedJour, setSelectedJour] = useState<Jour | 'Tous'>('Tous')
  const [selectedCat, setSelectedCat]   = useState<Categorie | 'Tous'>('Tous')
  const [selectedVille, setSelectedVille] = useState<Ville | 'Toutes'>('Toutes')

  const sorted = useMemo(() => {
    return events
      .filter((e) => {
        const jourOk  = selectedJour  === 'Tous'   || e.jour      === selectedJour
        const catOk   = selectedCat   === 'Tous'   || e.categorie === selectedCat
        const villeOk = selectedVille === 'Toutes' || e.ville     === selectedVille
        return jourOk && catOk && villeOk
      })
      .sort((a, b) => {
        const d = JOUR_ORDER[a.jour] - JOUR_ORDER[b.jour]
        if (d !== 0) return d
        if (!a.heure && !b.heure) return 0
        if (!a.heure) return -1
        if (!b.heure) return 1
        return a.heure.localeCompare(b.heure)
      })
  }, [selectedJour, selectedCat, selectedVille])

  const toggleJour  = (j: Jour)     => setSelectedJour( (p) => p === j ? 'Tous'   : j)
  const toggleCat   = (c: Categorie)=> setSelectedCat(  (p) => p === c ? 'Tous'   : c)
  const toggleVille = (v: Ville)    => setSelectedVille((p) => p === v ? 'Toutes' : v)

  return (
    <div style={{ minHeight: '100svh', backgroundColor: '#FDFAF3', fontFamily: "'Nunito', sans-serif" }}>

      {/* ── HEADER (intact) ── */}
      <header
        style={{
          background: 'linear-gradient(160deg, #F5C418 0%, #f7d040 100%)',
          padding: '24px 16px 28px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '4px', opacity: 0.6, userSelect: 'none', letterSpacing: '8px' }}>
          🌼🌼🌼
        </div>
        <h1
          style={{
            fontFamily: "'Pacifico', cursive",
            fontSize: 'clamp(26px, 8vw, 52px)',
            color: '#1B4FA0',
            textShadow: '2px 3px 0px rgba(255,255,255,0.4)',
            margin: '4px 0 2px',
            lineHeight: 1.2,
          }}
        >
          🌺 Bouge tes fesses
        </h1>
        <p
          style={{
            fontFamily: "'Pacifico', cursive",
            fontSize: 'clamp(15px, 5vw, 30px)',
            color: '#1B4FA0',
            opacity: 0.82,
            margin: '0 0 10px',
          }}
        >
          by Vaness'
        </p>
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#1B4FA0',
            borderRadius: '10px',
            padding: '6px 16px',
            marginBottom: '6px',
          }}
        >
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: 'clamp(12px, 3.5vw, 16px)' }}>
            Les p'tites sorties du Pays de Lorient 🌻
          </span>
        </div>
        <p style={{ margin: '6px 0 0', color: '#1B4FA0', opacity: 0.65, fontWeight: 600, fontSize: '13px' }}>
          Semaine du 11 au 17 mai 2025
        </p>
      </header>

      {/* ── STICKY FILTERS ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          padding: '12px 12px 10px',
        }}
      >
        <div style={{ maxWidth: '768px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Jours */}
          <div>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#1B4FA0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              📅 Par jour
            </p>
            <div style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '2px' }} className="no-scrollbar">
              <FilterBtn label="Tous"  active={selectedJour === 'Tous'} onClick={() => setSelectedJour('Tous')} />
              {JOURS.map((j) => (
                <FilterBtn key={j} label={JOURS_COURTS[j]} active={selectedJour === j} onClick={() => toggleJour(j)} />
              ))}
            </div>
          </div>

          {/* Catégories */}
          <div>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#1B4FA0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              🎨 Par catégorie
            </p>
            <div style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '2px' }} className="no-scrollbar">
              <FilterBtn label="Toutes" active={selectedCat === 'Tous'} onClick={() => setSelectedCat('Tous')} />
              {CATEGORIES.map((c) => (
                <FilterBtn key={c} label={c} active={selectedCat === c} onClick={() => toggleCat(c)} />
              ))}
            </div>
          </div>

          {/* Villes */}
          <div>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#1B4FA0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              📍 Par ville
            </p>
            <div style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '2px' }} className="no-scrollbar">
              <FilterBtn label="Toutes" active={selectedVille === 'Toutes'} onClick={() => setSelectedVille('Toutes')} />
              {VILLES.map((v) => (
                <FilterBtn key={v} label={v} active={selectedVille === v} onClick={() => toggleVille(v)} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: '768px', margin: '0 auto', padding: '20px 12px 32px' }}>

        {/* Compteur */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: '#1B4FA0',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '15px',
              padding: '8px 20px',
              borderRadius: '999px',
              boxShadow: '0 2px 8px rgba(27,79,160,0.3)',
            }}
          >
            {sorted.length} sortie{sorted.length !== 1 ? 's' : ''} cette semaine 🌺
          </span>
        </div>

        {/* Événements */}
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px' }}>
            <p style={{ fontSize: '48px', margin: '0 0 12px' }}>😴</p>
            <p style={{ fontWeight: 700, color: '#9CA3AF', fontSize: '16px', margin: 0 }}>
              Rien par ici… essaie un autre filtre !
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '12px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            }}
          >
            {sorted.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          backgroundColor: '#1B4FA0',
          textAlign: 'center',
          padding: '20px 16px',
        }}
      >
        <p style={{ margin: 0, color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>
          🌺 Bouge tes fesses by Vaness' — Pays de Lorient 🌻
        </p>
      </footer>
    </div>
  )
}
