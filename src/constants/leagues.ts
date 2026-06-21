export type Region =
    | 'fifa'
    | 'europe'
    | 'other';

export interface League {
    slug: string;
    name: string;
    shortName: string;
    region: Region;
    country?: string;
    hasStandings: boolean;
    tier: 1 | 2 | 3;
}

export const LEAGUES: League[] = [
    // === FIFA / Global ===
    { slug: 'fifa.world', name: 'FIFA World Cup', shortName: 'World Cup', region: 'fifa', hasStandings: true, tier: 1 },

    // === UEFA Club Competitions ===
    { slug: 'uefa.champions', name: 'UEFA Champions League', shortName: 'UCL', region: 'europe', hasStandings: true, tier: 1 },
    { slug: 'uefa.europa', name: 'UEFA Europa League', shortName: 'UEL', region: 'europe', hasStandings: true, tier: 1 },
    { slug: 'uefa.europa.conf', name: 'UEFA Europa Conference League', shortName: 'UECL', region: 'europe', hasStandings: true, tier: 1 },

    // === England ===
    { slug: 'eng.1', name: 'English Premier League', shortName: 'Premier League', region: 'europe', country: 'England', hasStandings: true, tier: 1 },
    { slug: 'eng.fa', name: 'English FA Cup', shortName: 'FA Cup', region: 'europe', country: 'England', hasStandings: false, tier: 2 },
    { slug: 'eng.league_cup', name: 'English Carabao Cup', shortName: 'Carabao Cup', region: 'europe', country: 'England', hasStandings: false, tier: 2 },
    { slug: 'eng.charity', name: 'English FA Community Shield', shortName: 'Community Shield', region: 'europe', country: 'England', hasStandings: false, tier: 2 },

    // === Spain ===
    { slug: 'esp.1', name: 'Spanish LALIGA', shortName: 'La Liga', region: 'europe', country: 'Spain', hasStandings: true, tier: 1 },
    { slug: 'esp.copa_del_rey', name: 'Copa del Rey', shortName: 'Copa del Rey', region: 'europe', country: 'Spain', hasStandings: false, tier: 2 },
    { slug: 'esp.super_cup', name: 'Spanish Supercopa', shortName: 'Supercopa', region: 'europe', country: 'Spain', hasStandings: false, tier: 2 },

    // === Italy ===
    { slug: 'ita.1', name: 'Italian Serie A', shortName: 'Serie A', region: 'europe', country: 'Italy', hasStandings: true, tier: 1 },
    { slug: 'ita.coppa_italia', name: 'Italian Coppa Italia', shortName: 'Coppa Italia', region: 'europe', country: 'Italy', hasStandings: false, tier: 2 },
    { slug: 'ita.super_cup', name: 'Italian Supercoppa', shortName: 'Supercoppa', region: 'europe', country: 'Italy', hasStandings: false, tier: 2 },

    // === Germany ===
    { slug: 'ger.1', name: 'German Bundesliga', shortName: 'Bundesliga', region: 'europe', country: 'Germany', hasStandings: true, tier: 1 },
    { slug: 'ger.dfb_pokal', name: 'German DFB Pokal', shortName: 'DFB Pokal', region: 'europe', country: 'Germany', hasStandings: false, tier: 2 },
    { slug: 'ger.super_cup', name: 'German Super Cup', shortName: 'DFL Super Cup', region: 'europe', country: 'Germany', hasStandings: false, tier: 2 },

    // === France ===
    { slug: 'fra.1', name: 'French Ligue 1', shortName: 'Ligue 1', region: 'europe', country: 'France', hasStandings: true, tier: 1 },
    { slug: 'fra.coupe_de_france', name: 'Coupe de France', shortName: 'Coupe de France', region: 'europe', country: 'France', hasStandings: false, tier: 2 },
    { slug: 'fra.super_cup', name: 'French Super Cup', shortName: 'Trophée des Champions', region: 'europe', country: 'France', hasStandings: false, tier: 2 },
];

// Helper functions
export const getLeagueBySlug = (slug: string): League | undefined =>
    LEAGUES.find((l) => l.slug === slug);

export const getLeaguesByRegion = (region: Region): League[] =>
    LEAGUES.filter((l) => l.region === region);

export const getLeaguesByTier = (tier: 1 | 2 | 3): League[] =>
    LEAGUES.filter((l) => l.tier === tier);

export const getTopLeagues = (): League[] =>
    LEAGUES.filter((l) => l.tier === 1);

export const getLeaguesWithStandings = (): League[] =>
    LEAGUES.filter((l) => l.hasStandings);

// Default leagues shown on the scoreboard (all active leagues)
export const DEFAULT_SCOREBOARD_LEAGUES: string[] = LEAGUES.map((l) => l.slug);
