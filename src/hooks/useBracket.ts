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
                logo: home?.team.logos?.[0]?.href ?? (home?.team as any)?.logo ?? '',
                score: home?.score ?? '',
            },
            awayTeam: {
                id: away?.team.id ?? '',
                name: away?.team.displayName ?? '',
                abbreviation: away?.team.abbreviation ?? '',
                logo: away?.team.logos?.[0]?.href ?? (away?.team as any)?.logo ?? '',
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

/** Fetches the tournament calendar (rounds) for the current season */
export const useTournamentCalendar = (slug: string, hasGroupStage: boolean = true) => {
    return useQuery({
        queryKey: ['calendar', slug],
        queryFn: async () => {
            const data = await espnApi.getScoreboard(slug);
            const league = data.leagues?.[0];
            const calendar = league?.calendar ?? [];
            const entries: CalendarEntry[] = [];
            for (const section of calendar) {
                if (section.entries) {
                    for (const entry of section.entries) {
                        if (!hasGroupStage || entry.value !== '1') {
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

/** Fetches bracket matches for all knockout rounds using calendar entries */
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

/**
 * Fetches bracket for a historical season by its date range.
 * Groups matches by competition round notes or date clusters.
 */
export const useSeasonBracket = (slug: string, seasonStart?: string, seasonEnd?: string, hasGroupStage: boolean = true) => {
    return useQuery({
        queryKey: ['seasonBracket', slug, seasonStart, seasonEnd],
        queryFn: async (): Promise<BracketRound[]> => {
            if (!seasonStart || !seasonEnd) return [];
            const startDate = formatDate(seasonStart);
            const endDate = formatDate(seasonEnd);
            const data = await espnApi.getScoreboardByDateRange(slug, startDate, endDate);
            const allMatches = parseMatchesFromEvents(data.events ?? [], slug);

            // Group matches by their competition type/round note
            const roundMap = new Map<string, ParsedMatch[]>();
            for (const match of allMatches) {
                // Use the note (e.g. "1st Leg", "2nd Leg - X advance") or status
                // For group stage matches (no note), label them "Group Stage"
                const label = match.note || 'Group Stage';
                if (!roundMap.has(label)) {
                    roundMap.set(label, []);
                }
                roundMap.get(label)!.push(match);
            }

            // Convert to BracketRound array, filter out group stage if needed
            const rounds: BracketRound[] = [];
            let i = 0;
            for (const [label, matches] of roundMap) {
                if (hasGroupStage && label === 'Group Stage') continue;
                rounds.push({ label, value: String(i++), matches });
            }
            return rounds;
        },
        enabled: !!seasonStart && !!seasonEnd,
        staleTime: 24 * 60 * 60 * 1000, // Historical data doesn't change
    });
};
