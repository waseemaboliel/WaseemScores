export const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
export const ESPN_WEB_BASE = 'https://site.web.api.espn.com/apis/v2/sports/soccer';

export const endpoints = {
    scoreboard: (slug: string, date?: string) => {
        const base = `${ESPN_BASE}/${slug}/scoreboard`;
        return date ? `${base}?dates=${date}` : base;
    },

    scoreboardByDateRange: (slug: string, startDate: string, endDate: string) => {
        return `${ESPN_BASE}/${slug}/scoreboard?dates=${startDate}-${endDate}`;
    },

    standings: (slug: string, season?: number) => {
        const base = `${ESPN_WEB_BASE}/${slug}/standings`;
        return season ? `${base}?season=${season}` : base;
    },

    matchSummary: (slug: string, eventId: string) => {
        return `${ESPN_BASE}/${slug}/summary?event=${eventId}`;
    },

    leagueDiscovery: () => {
        return 'https://site.api.espn.com/apis/site/v2/leagues/dropdown?sport=soccer&limit=200';
    },

    teamInfo: (slug: string, teamId: string) => {
        return `${ESPN_BASE}/${slug}/teams/${teamId}`;
    },

    teamSchedule: (slug: string, teamId: string) => {
        return `${ESPN_BASE}/${slug}/teams/${teamId}/schedule`;
    },

    teamRoster: (slug: string, teamId: string, season?: number) => {
        const base = `${ESPN_BASE}/${slug}/teams/${teamId}/roster`;
        return season ? `${base}?season=${season}` : base;
    },

    athleteOverview: (slug: string, athleteId: string) => {
        return `https://site.api.espn.com/apis/common/v3/sports/soccer/${slug}/athletes/${athleteId}/overview`;
    },

    athleteInfo: (slug: string, athleteId: string) => {
        return `https://site.web.api.espn.com/apis/common/v3/sports/soccer/${slug}/athletes/${athleteId}`;
    },

    leagueStatistics: (slug: string, season?: number) => {
        const base = `${ESPN_BASE}/${slug}/statistics`;
        return season ? `${base}?season=${season}` : base;
    },

    news: (slug: string) => {
        return `${ESPN_BASE}/${slug}/news`;
    },
};
