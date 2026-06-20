import { useQuery } from '@tanstack/react-query';
import { espnApi } from '../api';
import type { ParsedMatch, ScoreboardResponse } from '../api';
import { DEFAULT_SCOREBOARD_LEAGUES, getLeagueBySlug } from '../constants';

const parseScoreboard = (data: ScoreboardResponse, slug: string): ParsedMatch[] => {
    const league = data.leagues?.[0];
    return data.events?.map((event) => {
        const competition = event.competitions[0];
        const homeComp = competition.competitors.find((c) => c.homeAway === 'home');
        const awayComp = competition.competitors.find((c) => c.homeAway === 'away');

        return {
            id: event.id,
            date: event.date,
            homeTeam: {
                id: homeComp?.team.id ?? '',
                name: homeComp?.team.displayName ?? '',
                abbreviation: homeComp?.team.abbreviation ?? '',
                logo: homeComp?.team.logos?.[0]?.href ?? '',
                score: homeComp?.score ?? '',
            },
            awayTeam: {
                id: awayComp?.team.id ?? '',
                name: awayComp?.team.displayName ?? '',
                abbreviation: awayComp?.team.abbreviation ?? '',
                logo: awayComp?.team.logos?.[0]?.href ?? '',
                score: awayComp?.score ?? '',
            },
            status: {
                state: event.status.type.state,
                detail: event.status.type.shortDetail,
                clock: event.status.displayClock,
            },
            league: {
                slug,
                name: league?.name ?? getLeagueBySlug(slug)?.shortName ?? slug,
                logo: league?.logos?.[0]?.href ?? '',
            },
        };
    }) ?? [];
};

export const useScoreboard = (slug: string, date?: string) => {
    return useQuery({
        queryKey: ['scoreboard', slug, date],
        queryFn: () => espnApi.getScoreboard(slug, date),
        select: (data) => parseScoreboard(data, slug),
        staleTime: 5 * 60 * 1000, // 5 min
        refetchInterval: (query) => {
            const matches = query.state.data;
            const hasLive = matches?.events?.some(
                (e: any) => e.status?.type?.state === 'in'
            );
            return hasLive ? 30 * 1000 : 5 * 60 * 1000;
        },
    });
};

export interface LeagueMatches {
    slug: string;
    name: string;
    logo: string;
    matches: ParsedMatch[];
}

export const useMultiLeagueScoreboard = (date?: string) => {
    const slugs = DEFAULT_SCOREBOARD_LEAGUES;

    const queries = slugs.map((slug) => ({
        queryKey: ['scoreboard', slug, date],
        queryFn: () => espnApi.getScoreboard(slug, date),
        select: (data: ScoreboardResponse): LeagueMatches => {
            const matches = parseScoreboard(data, slug);
            const league = getLeagueBySlug(slug);
            return {
                slug,
                name: league?.shortName ?? slug,
                logo: data.leagues?.[0]?.logos?.[0]?.href ?? '',
                matches,
            };
        },
        staleTime: 5 * 60 * 1000,
        enabled: true,
    }));

    // We'll use individual queries to avoid complexity
    // The screen will call useScoreboard for each league
    return { slugs };
};
