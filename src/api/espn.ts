import { endpoints } from './endpoints';
import type {
    ScoreboardResponse,
    StandingsResponse,
    MatchSummaryResponse,
} from './types';

const fetchJson = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`ESPN API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

export const espnApi = {
    getScoreboard: (slug: string, date?: string) =>
        fetchJson<ScoreboardResponse>(endpoints.scoreboard(slug, date)),

    getScoreboardByDateRange: (slug: string, startDate: string, endDate: string) =>
        fetchJson<ScoreboardResponse>(endpoints.scoreboardByDateRange(slug, startDate, endDate)),

    getStandings: (slug: string, season?: number) =>
        fetchJson<StandingsResponse>(endpoints.standings(slug, season)),

    getMatchSummary: (slug: string, eventId: string) =>
        fetchJson<MatchSummaryResponse>(endpoints.matchSummary(slug, eventId)),
};
