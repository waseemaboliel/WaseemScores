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
};
