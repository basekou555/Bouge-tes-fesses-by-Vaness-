import { useState, useMemo } from 'react'
import {
  events,
  JOURS,
  JOURS_COURTS,
  CATEGORIES,
  CATEGORIE_COLORS,
  type Jour,
  type Categorie,
} from './events'

const JOUR_ORDER: Record<string, number> = {
  Lundi: 0, Mardi: 1, Mercredi: 2, Jeudi: 3,
  Vendredi: 4, Samedi: 5, Dimanche: 6,
}

function EventCard({ event }: { event: (typeof events)[0] }) {
  const colors = CATEGORIE_COLORS[event.categorie]
  return (
    <article
      style={{
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'
      }}
    >
      {/* Badges row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '999px',
            backgroundColor: colors.bg,
            color: colors.text,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: colors.dot,
            }}
          />
          {event.categorie}
        </span>
        {event.gratuit && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: '999px',
              backgroundColor: '#F5C418',
              color: '#1B4FA0',
              flexShrink: 0,
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
          fontWeight: 800,
          fontSize: '15px',
          lineHeight: '1.35',
          color: '#111827',
        }}
      >
        {event.titre}
      </h2>

      {/* Lieu + heure */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', fontSize: '13px', color: '#4B5563' }}>
          <span style={{ flexShrink: 0 }}>📍</span>
          <span>{event.lieu}</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#4B5563' }}>
          <span>🕐</span>
          <span>{event.heure ?? 'Toute la journée'}</span>
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: '13px',
          color: '#6B7280',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {event.description}
      </p>

      {/* Day chip */}
      <div>
        <span
          style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '6px',
            backgroundColor: '#EEF2FF',
            color: '#1B4FA0',
          }}
        >
          {event.jour}{event.heure ? ` · ${event.heure}` : ' · Toute la journée'}
        </span>
      </div>
    </article>
  )
}

function FilterBtn({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
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

export default function App() {
  const [selectedJour, setSelectedJour] = useState<Jour | 'Tous'>('Tous')
  const [selectedCat, setSelectedCat] = useState<Categorie | 'Tous'>('Tous')

  const sorted = useMemo(() => {
    return events
      .filter((e) => {
        const jourOk = selectedJour === 'Tous' || e.jour === selectedJour
        const catOk = selectedCat === 'Tous' || e.categorie === selectedCat
        return jourOk && catOk
      })
      .sort((a, b) => {
        const d = JOUR_ORDER[a.jour] - JOUR_ORDER[b.jour]
        if (d !== 0) return d
        if (!a.heure && !b.heure) return 0
        if (!a.heure) return -1
        if (!b.heure) return 1
        return a.heure.localeCompare(b.heure)
      })
  }, [selectedJour, selectedCat])

  const toggleJour = (jour: Jour) =>
    setSelectedJour((prev) => (prev === jour ? 'Tous' : jour))
  const toggleCat = (cat: Categorie) =>
    setSelectedCat((prev) => (prev === cat ? 'Tous' : cat))

  return (
    <div style={{ minHeight: '100svh', backgroundColor: '#FDFAF3', fontFamily: "'Nunito', sans-serif" }}>
      {/* ── HEADER ── */}
      <header
        style={{
          background: 'linear-gradient(160deg, #F5C418 0%, #f7d040 100%)',
          padding: '24px 16px 28px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative daisies */}
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
          <span
            style={{
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 'clamp(12px, 3.5vw, 16px)',
            }}
          >
            Les p'tites sorties du Pays de Lorient 🌻
          </span>
        </div>

        <p style={{ margin: '6px 0 0', color: '#1B4FA0', opacity: 0.65, fontWeight: 600, fontSize: '13px' }}>
          Semaine du 11 au 17 mai 2025
        </p>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: '768px', margin: '0 auto', padding: '20px 12px 32px' }}>

        {/* ── COMPTEUR ── */}
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
            }}
          >
            {sorted.length} sortie{sorted.length !== 1 ? 's' : ''} cette semaine 🌺
          </span>
        </div>

        {/* ── FILTRES JOURS ── */}
        <section style={{ marginBottom: '16px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#1B4FA0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            📅 Par jour
          </p>
          <div
            style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}
            className="no-scrollbar"
          >
            <FilterBtn label="Tous" active={selectedJour === 'Tous'} onClick={() => setSelectedJour('Tous')} />
            {JOURS.map((jour) => (
              <FilterBtn
                key={jour}
                label={JOURS_COURTS[jour]}
                active={selectedJour === jour}
                onClick={() => toggleJour(jour)}
              />
            ))}
          </div>
        </section>

        {/* ── FILTRES CATÉGORIES ── */}
        <section style={{ marginBottom: '24px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#1B4FA0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            🎨 Par catégorie
          </p>
          <div
            style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}
            className="no-scrollbar"
          >
            <FilterBtn label="Toutes" active={selectedCat === 'Tous'} onClick={() => setSelectedCat('Tous')} />
            {CATEGORIES.map((cat) => (
              <FilterBtn
                key={cat}
                label={cat}
                active={selectedCat === cat}
                onClick={() => toggleCat(cat)}
              />
            ))}
          </div>
        </section>

        {/* ── ÉVÉNEMENTS ── */}
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px' }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>😴</p>
            <p style={{ fontWeight: 700, color: '#9CA3AF', fontSize: '16px' }}>
              Rien ce jour-là… essaie un autre filtre !
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
          textAlign: 'center',
          padding: '20px 16px',
          borderTop: '2px solid #F5C418',
          marginTop: '8px',
        }}
      >
        <p style={{ margin: 0, color: '#9CA3AF', fontSize: '12px', fontWeight: 600 }}>
          🌺 Bouge tes fesses by Vaness' — Pays de Lorient 🌻
        </p>
      </footer>
    </div>
  )
}
