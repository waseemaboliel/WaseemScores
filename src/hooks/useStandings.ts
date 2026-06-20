import { useQuery } from '@tanstack/react-query';
import { espnApi } from '../api';
import type { ParsedStandingsGroup, ParsedStandingsEntry, StandingsResponse } from '../api';

const parseGroup = (group: any): ParsedStandingsEntry[] => {
    if (!group?.standings?.entries) return [];
    const parsed = group.standings.entries.map((entry: any) => {
        const stats: Record<string, number> = {};
        entry.stats.forEach((s: any) => {
            if (s.value !== undefined) {
                stats[s.name] = s.value;
            }
        });
        return {
            position: stats.rank ?? 0,
            team: {
                id: entry.team.id,
                name: entry.team.displayName,
                abbreviation: entry.team.abbreviation,
                logo: entry.team.logos?.[0]?.href ?? '',
            },
            gamesPlayed: stats.gamesPlayed ?? 0,
            wins: stats.wins ?? 0,
            draws: stats.ties ?? 0,
            losses: stats.losses ?? 0,
            goalsFor: stats.pointsFor ?? 0,
            goalsAgainst: stats.pointsAgainst ?? 0,
            goalDifference: stats.pointDifferential ?? 0,
            points: stats.points ?? 0,
            note: entry.note
                ? { color: entry.note.color, description: entry.note.description }
                : undefined,
        };
    });
    // Sort by rank (position) ascending
    parsed.sort((a: ParsedStandingsEntry, b: ParsedStandingsEntry) => a.position - b.position);
    return parsed;
};

const parseStandings = (data: StandingsResponse): ParsedStandingsGroup[] => {
    if (!data.children?.length) return [];

    return data.children.map((group) => ({
        name: group.name,
        seasonDisplay: group.standings?.seasonDisplayName ?? '',
        entries: parseGroup(group),
    }));
};

export const useStandings = (slug: string, season?: number) => {
    return useQuery({
        queryKey: ['standings', slug, season],
        queryFn: () => espnApi.getStandings(slug, season),
        select: parseStandings,
        staleTime: 4 * 60 * 60 * 1000, // 4 hours
    });
};

export const useSeasons = (slug: string) => {
    return useQuery({
        queryKey: ['seasons', slug],
        queryFn: () => espnApi.getStandings(slug, 9999), // Invalid season returns season list
        select: (data) => data.seasons ?? [],
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
    });
};
