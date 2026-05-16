export type Categorie =
  | 'Culture'
  | 'Concert'
  | 'Soirée'
  | 'Danse'
  | 'Humour'
  | 'Sport'
  | 'Bar & Jeux'
  | 'Nature & Balade'

export type Jour =
  | 'Lundi'
  | 'Mardi'
  | 'Mercredi'
  | 'Jeudi'
  | 'Vendredi'
  | 'Samedi'
  | 'Dimanche'

export interface Event {
  id: number
  titre: string
  lieu: string
  jour: Jour
  date: string
  heure: string | null
  gratuit: boolean
  categorie: Categorie
  description: string
}

export const events: Event[] = [
  { id: 1, titre: "Festival des arts de la rue — Avis de Temps Fort", lieu: "Port-Louis, Riantec, Locmiquélic, Gâvres", jour: "Mercredi", date: "2025-05-14", heure: null, gratuit: true, categorie: "Culture", description: "Arts de la rue sur plusieurs communes du pays de Lorient" },
  { id: 2, titre: "Festival de cirque Des Ronds dans l'eau", lieu: "Site de la Poterie, Hennebont", jour: "Jeudi", date: "2025-05-15", heure: null, gratuit: false, categorie: "Culture", description: "Festival de cirque et de convivialité, restauration sur place" },
  { id: 3, titre: "Fête de la Bretagne", lieu: "Salle des fêtes de Groix", jour: "Mercredi", date: "2025-05-14", heure: null, gratuit: false, categorie: "Culture", description: "Projection documentaire, atelier danse bretonne, repas, fest noz avec Fleuves" },
  { id: 4, titre: "Soirée techno — Le Triskell", lieu: "Le Triskell, Plouhinec", jour: "Vendredi", date: "2025-05-16", heure: "20h", gratuit: false, categorie: "Soirée", description: "Grosse soirée techno avec plusieurs DJs de collectifs" },
  { id: 5, titre: "Tropical Party by DJ Nasca", lieu: "La Baleine, Lorient", jour: "Samedi", date: "2025-05-17", heure: "21h", gratuit: true, categorie: "Soirée", description: "Afrobeat, dancehall, shatta, amapiano. Restauration 18h30–22h30" },
  { id: 6, titre: "Concert jazz Karpatt + La tête dans le sax", lieu: "La Loco, Quimperlé", jour: "Samedi", date: "2025-05-17", heure: "20h", gratuit: false, categorie: "Concert", description: "Jazz festif, grande salle" },
  { id: 7, titre: "Rendez-Fou Rock et Billig", lieu: "Crêperie Au Coin Tranquille, Quistinic", jour: "Samedi", date: "2025-05-17", heure: "12h", gratuit: true, categorie: "Concert", description: "Concerts rock, marché artisanal, coin cirque pour les enfants, tatoo, expo voitures anciennes" },
  { id: 8, titre: "Concert Three Sips Later", lieu: "V and B, Lorient", jour: "Vendredi", date: "2025-05-16", heure: "19h", gratuit: false, categorie: "Concert", description: "Pop soft rock, ambiance détendue" },
  { id: 9, titre: "Carton Comedy Club", lieu: "La Cervoiserie, Lorient", jour: "Vendredi", date: "2025-05-16", heure: "19h", gratuit: false, categorie: "Humour", description: "Stand-up comedy" },
  { id: 10, titre: "Cabaret d'improvisation théâtrale", lieu: "L'embarcadère, Lorient", jour: "Vendredi", date: "2025-05-16", heure: "20h30", gratuit: false, categorie: "Humour", description: "Soirée théâtre d'improvisation" },
  { id: 11, titre: "KBS Social — Ori'kiz", lieu: "Lorient", jour: "Dimanche", date: "2025-05-18", heure: "13h", gratuit: false, categorie: "Danse", description: "3 cours + sociale kizomba/bachata/semba. Profs Costa Zomba, David Yaye, Dan. 25€ full pass" },
  { id: 12, titre: "Après-midi danse Kizomba, Bachata, Salsa", lieu: "Salle Kergoff, Caudan", jour: "Dimanche", date: "2025-05-18", heure: "13h", gratuit: false, categorie: "Danse", description: "3 cours de 13h à 16h avec profs, semba, bachata et afro" },
  { id: 13, titre: "Match CEP Basket vs STB", lieu: "Palais des sports de Kervaric", jour: "Vendredi", date: "2025-05-16", heure: "20h", gratuit: false, categorie: "Sport", description: "NM1 — quart de finale play-offs" },
  { id: 14, titre: "Défi de la Petite Mer", lieu: "Hennebont → Gâvres → Port-Louis", jour: "Lundi", date: "2025-05-12", heure: "9h", gratuit: false, categorie: "Sport", description: "Rando/régate voile légère, kite, aviron, initiations SNSM" },
  { id: 15, titre: "Electronik Picnik — Raversound", lieu: "Anse du Magouer, Plouhinec", jour: "Samedi", date: "2025-05-17", heure: "14h", gratuit: false, categorie: "Soirée", description: "DJ set, massage, barber, structure gonflable enfants" },
  { id: 16, titre: "Blind test — L'embarcadère", lieu: "L'embarcadère, Lorient", jour: "Jeudi", date: "2025-05-15", heure: "21h", gratuit: false, categorie: "Bar & Jeux", description: "Soirée blind test" },
  { id: 17, titre: "Soirée jeux de société — Lucky Lude", lieu: "Maison des associations, Quimperlé", jour: "Jeudi", date: "2025-05-15", heure: "20h", gratuit: false, categorie: "Bar & Jeux", description: "Soirée jeux de société conviviale" },
  { id: 18, titre: "Fête du thé — La Filleule des Fées", lieu: "Écluse de Trébihan, Languidic", jour: "Samedi", date: "2025-05-17", heure: "14h", gratuit: false, categorie: "Nature & Balade", description: "Fête du thé, échanges, visite, crêpes, fabrication de pain" },
]

export const JOURS: Jour[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
export const JOURS_COURTS: Record<Jour, string> = {
  Lundi: 'Lun',
  Mardi: 'Mar',
  Mercredi: 'Mer',
  Jeudi: 'Jeu',
  Vendredi: 'Ven',
  Samedi: 'Sam',
  Dimanche: 'Dim',
}

export const CATEGORIES: Categorie[] = ['Culture', 'Concert', 'Soirée', 'Danse', 'Humour', 'Sport', 'Bar & Jeux', 'Nature & Balade']

export const CATEGORIE_COLORS: Record<Categorie, { bg: string; text: string; dot: string }> = {
  'Culture':        { bg: '#EDE9FE', text: '#5B21B6', dot: '#7C3AED' },
  'Concert':        { bg: '#FEE2E2', text: '#991B1B', dot: '#DC2626' },
  'Soirée':         { bg: '#1B4FA0', text: '#ffffff', dot: '#93C5FD' },
  'Danse':          { bg: '#FCE7F3', text: '#9D174D', dot: '#EC4899' },
  'Humour':         { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  'Sport':          { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  'Bar & Jeux':     { bg: '#FED7AA', text: '#92400E', dot: '#F97316' },
  'Nature & Balade':{ bg: '#DCFCE7', text: '#14532D', dot: '#22C55E' },
}
