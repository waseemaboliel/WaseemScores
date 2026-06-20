import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { espnApi } from '../api';
import type { ParsedMatch, ScoreboardResponse } from '../api';
import { MatchCard } from '../components';
import { colors, DEFAULT_SCOREBOARD_LEAGUES, getLeagueBySlug } from '../constants';

interface LeagueSection {
    slug: string;
    name: string;
    matches: ParsedMatch[];
}

const parseMatches = (data: ScoreboardResponse, slug: string): ParsedMatch[] => {
    const league = data.leagues?.[0];
    return (
        data.events?.map((event) => {
            const comp = event.competitions[0];
            const home = comp.competitors.find((c) => c.homeAway === 'home');
            const away = comp.competitors.find((c) => c.homeAway === 'away');
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
                    name: league?.name ?? getLeagueBySlug(slug)?.shortName ?? slug,
                    logo: league?.logos?.[0]?.href ?? '',
                },
            };
        }) ?? []
    );
};

const fetchAllScoreboards = async (): Promise<LeagueSection[]> => {
    const results = await Promise.allSettled(
        DEFAULT_SCOREBOARD_LEAGUES.map(async (slug) => {
            const data = await espnApi.getScoreboard(slug);
            const matches = parseMatches(data, slug);
            return {
                slug,
                name: getLeagueBySlug(slug)?.shortName ?? slug,
                matches,
            };
        })
    );

    const sections = results
        .filter((r): r is PromiseFulfilledResult<LeagueSection> => r.status === 'fulfilled')
        .map((r) => r.value)
        .filter((section) => section.matches.length > 0);

    // Sort matches within each section: live first, then by date
    sections.forEach((section) => {
        section.matches.sort((a, b) => {
            const aLive = a.status.state === 'in';
            const bLive = b.status.state === 'in';
            if (aLive !== bLive) return aLive ? -1 : 1;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
    });

    // Sort sections: leagues with live matches first
    sections.sort((a, b) => {
        const aHasLive = a.matches.some((m) => m.status.state === 'in');
        const bHasLive = b.matches.some((m) => m.status.state === 'in');
        if (aHasLive !== bHasLive) return aHasLive ? -1 : 1;
        return 0;
    });

    return sections;
};

export const ScoresScreen: React.FC = () => {
    const { data, isLoading, isError, refetch, isRefetching } = useQuery({
        queryKey: ['scoreboard', 'all'],
        queryFn: fetchAllScoreboards,
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading scores...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Failed to load scores</Text>
                <Text style={styles.retryText} onPress={() => refetch()}>
                    Tap to retry
                </Text>
            </View>
        );
    }

    if (!data || data.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>No matches today</Text>
                <Text style={styles.emptySubtext}>Check back later for upcoming fixtures</Text>
            </View>
        );
    }

    return (
        <FlatList
            style={styles.list}
            data={data}
            keyExtractor={(item) => item.slug}
            refreshControl={
                <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={refetch}
                    tintColor={colors.primary}
                />
            }
            renderItem={({ item: section }) => (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{section.name}</Text>
                        <Text style={styles.matchCount}>{section.matches.length}</Text>
                    </View>
                    {section.matches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                    ))}
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: 12,
        color: colors.textSecondary,
        fontSize: 14,
    },
    errorText: {
        color: colors.live,
        fontSize: 16,
        fontWeight: '600',
    },
    retryText: {
        marginTop: 8,
        color: colors.accent,
        fontSize: 14,
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 18,
        fontWeight: '600',
    },
    emptySubtext: {
        marginTop: 6,
        color: colors.textMuted,
        fontSize: 14,
    },
    section: {
        backgroundColor: colors.surface,
        marginBottom: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    matchCount: {
        fontSize: 12,
        color: colors.textMuted,
        backgroundColor: colors.surfaceLight,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        overflow: 'hidden',
    },
});
