// ============================================================
// ESPN API Type Definitions
// ============================================================

// --- Common ---
export interface TeamLogo {
    href: string;
    width: number;
    height: number;
    alt: string;
}

export interface Team {
    id: string;
    uid: string;
    location: string;
    name: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    isActive: boolean;
    logos: TeamLogo[];
    isNational: boolean;
}

// --- Scoreboard ---
export interface ScoreboardResponse {
    leagues: ScoreboardLeague[];
    events: ScoreboardEvent[];
}

export interface ScoreboardLeague {
    id: string;
    uid: string;
    name: string;
    abbreviation: string;
    slug: string;
    logos: TeamLogo[];
    calendarType?: string;
    calendar?: CalendarSection[];
}

export interface CalendarSection {
    label: string;
    startDate: string;
    endDate: string;
    entries?: CalendarEntry[];
}

export interface CalendarEntry {
    label: string;
    detail: string;
    value: string;
    startDate: string;
    endDate: string;
}

export interface ScoreboardEvent {
    id: string;
    uid: string;
    date: string;
    name: string;
    shortName: string;
    competitions: Competition[];
    status: EventStatus;
}

export interface Competition {
    id: string;
    date: string;
    attendance: number;
    type: { id: string; abbreviation: string };
    timeValid: boolean;
    competitors: Competitor[];
    venue?: Venue;
    status: EventStatus;
}

export interface Competitor {
    id: string;
    uid: string;
    type: string;
    order: number;
    homeAway: 'home' | 'away';
    team: Team;
    score: string;
    winner?: boolean;
    form?: string;
    statistics?: CompetitorStat[];
}

export interface CompetitorStat {
    name: string;
    abbreviation: string;
    displayValue: string;
}

export interface Venue {
    id: string;
    fullName: string;
    address: { city: string; country: string };
}

export interface EventStatus {
    clock: number;
    displayClock: string;
    period: number;
    type: {
        id: string;
        name: string;
        state: 'pre' | 'in' | 'post';
        completed: boolean;
        description: string;
        detail: string;
        shortDetail: string;
    };
}

// --- Standings ---
export interface StandingsResponse {
    uid: string;
    id: string;
    name: string;
    abbreviation: string;
    children: StandingsGroup[];
    seasons?: Season[];
}

export interface StandingsGroup {
    uid: string;
    id: string;
    name: string;
    abbreviation: string;
    standings: {
        id: string;
        name: string;
        displayName: string;
        season: number;
        seasonType: number;
        seasonDisplayName: string;
        entries: StandingsEntry[];
    };
}

export interface StandingsEntry {
    team: Team;
    note?: {
        color: string;
        description: string;
        rank: number;
    };
    stats: StandingStat[];
}

export interface StandingStat {
    name: string;
    displayName: string;
    shortDisplayName: string;
    description: string;
    abbreviation: string;
    type: string;
    value?: number;
    displayValue: string;
    summary?: string;
}

export interface Season {
    year: number;
    startDate: string;
    endDate: string;
    displayName: string;
    types: { id: string; name: string }[];
}

// --- Match Summary ---
export interface MatchSummaryResponse {
    boxscore?: BoxScore;
    gameInfo?: GameInfo;
    header?: MatchHeader;
    keyEvents?: KeyEvent[];
    commentary?: Commentary[];
    rosters?: Roster[];
}

export interface BoxScore {
    teams: BoxScoreTeam[];
    players: BoxScorePlayer[];
}

export interface BoxScoreTeam {
    team: Team;
    statistics: { name: string; displayValue: string }[];
}

export interface BoxScorePlayer {
    team: Team;
    statistics: {
        names: string[];
        labels: string[];
        athletes: {
            athlete: { id: string; displayName: string; position: { abbreviation: string } };
            stats: string[];
        }[];
    }[];
}

export interface GameInfo {
    venue: Venue;
    attendance: number;
}

export interface MatchHeader {
    id: string;
    competitions: Competition[];
    season: { year: number; type: number };
    league: { id: string; name: string; abbreviation: string; slug: string };
}

export interface KeyEvent {
    id: string;
    type: { id: string; text: string };
    clock: { value: number; displayValue: string };
    team: { id: string };
    participants?: { athlete: { id: string; displayName: string } }[];
    text: string;
}

export interface Commentary {
    time: string;
    text: string;
}

export interface Roster {
    team: Team;
    roster: {
        id: string;
        displayName: string;
        jersey: string;
        position: { id: string; name: string; abbreviation: string };
        starter: boolean;
        subbedIn?: boolean;
        subbedOut?: boolean;
    }[];
    formation?: string;
}

// --- Parsed/UI Types ---
export interface ParsedStandingsGroup {
    name: string;
    seasonDisplay: string;
    entries: ParsedStandingsEntry[];
}

export interface ParsedStandingsEntry {
    position: number;
    team: {
        id: string;
        name: string;
        abbreviation: string;
        logo: string;
    };
    gamesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    note?: {
        color: string;
        description: string;
    };
}

export interface ParsedMatch {
    id: string;
    date: string;
    homeTeam: {
        id: string;
        name: string;
        abbreviation: string;
        logo: string;
        score: string;
    };
    awayTeam: {
        id: string;
        name: string;
        abbreviation: string;
        logo: string;
        score: string;
    };
    status: {
        state: 'pre' | 'in' | 'post';
        detail: string;
        clock: string;
    };
    league: {
        slug: string;
        name: string;
        logo: string;
    };
    note?: string;
}

export interface BracketRound {
    label: string;
    value: string;
    matches: ParsedMatch[];
}
