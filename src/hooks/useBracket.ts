import { useQuery } from '@tanstack/react-query';
import { espnApi } from '../api';
import type { BracketRound, CalendarEntry, ParsedMatch } from '../api';

const parseMatchesFromEvents = (events: any[], slug: string): ParsedMatch[] => {
    return events.map((event: any) => {
        const comp = event.competitions[0];
        const home = comp.competitors.find((c: any) => c.homeAway === 'home');
        const away = comp.competitors.find((c: any) => c.homeAway === 'away');
        const notes = comp.notes ?? [];
        return {
            id: event.id,
            date: event.date,
            homeTeam: {
                id: home?.team.id ?? '',
                name: home?.team.displayName ?? '',
                abbreviation: home?.team.abbreviation ?? '',
                logo: home?.team.logos?.[0]?.href ?? '',
                score: home?.score ?? '',
            },
            awayTeam: {
                id: away?.team.id ?? '',
                name: away?.team.displayName ?? '',
                abbreviation: away?.team.abbreviation ?? '',
                logo: away?.team.logos?.[0]?.href ?? '',
                score: away?.score ?? '',
            },
            status: {
                state: event.status.type.state,
                detail: event.status.type.shortDetail,
                clock: event.status.displayClock,
            },
            league: {
                slug,
                name: '',
                logo: '',
            },
            note: notes[0]?.headline ?? undefined,
        };
    });
};

const formatDate = (isoDate: string): string => {
    const d = new Date(isoDate);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}${m}${day}`;
};

/** Fetches the tournament calendar (rounds) for a given league */
export const useTournamentCalendar = (slug: string) => {
    return useQuery({
        queryKey: ['calendar', slug],
        queryFn: async () => {
            const data = await espnApi.getScoreboard(slug);
            const league = data.leagues?.[0];
            const calendar = league?.calendar ?? [];
            // Extract knockout entries (skip Group stage, value=1)
            const entries: CalendarEntry[] = [];
            for (const section of calendar) {
                if (section.entries) {
                    for (const entry of section.entries) {
                        if (entry.value !== '1') {
                            entries.push(entry);
                        }
                    }
                }
            }
            return entries;
        },
        staleTime: 24 * 60 * 60 * 1000,
    });
};

/** Fetches bracket matches for all knockout rounds */
export const useBracket = (slug: string, rounds: CalendarEntry[]) => {
    return useQuery({
        queryKey: ['bracket', slug, rounds.map((r) => r.value).join(',')],
        queryFn: async (): Promise<BracketRound[]> => {
            const results = await Promise.allSettled(
                rounds.map(async (round) => {
                    const startDate = formatDate(round.startDate);
                    const endDate = formatDate(round.endDate);
                    const data = await espnApi.getScoreboardByDateRange(slug, startDate, endDate);
                    const matches = parseMatchesFromEvents(data.events ?? [], slug);
                    return {
                        label: round.label,
                        value: round.value,
                        matches,
                    };
                })
            );
            return results
                .filter((r): r is PromiseFulfilledResult<BracketRound> => r.status === 'fulfilled')
                .map((r) => r.value)
                .filter((r) => r.matches.length > 0);
        },
        enabled: rounds.length > 0,
        staleTime: 5 * 60 * 1000,
    });
};
