import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import { espnApi } from '../api';
import type { ParsedMatch, ScoreboardResponse } from '../api';
import { MatchCard, ScoresSkeleton } from '../components';
import { colors, DEFAULT_SCOREBOARD_LEAGUES, getLeagueBySlug } from '../constants';
import { useFavorites } from '../stores';
import { useGoalNotifications } from '../hooks/useGoalNotifications';

interface LeagueSection {
    slug: string;
    name: string;
    matches: ParsedMatch[];
}

// Generate dates array: ±7 days from today
const generateDates = (): { key: string; label: string; dayLabel: string; date: Date }[] => {
    const dates: { key: string; label: string; dayLabel: string; date: Date }[] = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = -7; i <= 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const key = `${y}${m}${day}`;
        const dayLabel = i === 0 ? 'Today' : i === -1 ? 'Yesterday' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()];
        const label = `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`;
        dates.push({ key, label, dayLabel, date: d });
    }
    return dates;
};

const DATES = generateDates();
const TODAY_INDEX = 7; // index of today in the 15-day array

const formatDateKey = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
};

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

const fetchAllScoreboards = async (dateKey: string): Promise<LeagueSection[]> => {
    const results = await Promise.allSettled(
        DEFAULT_SCOREBOARD_LEAGUES.map(async (slug) => {
            const data = await espnApi.getScoreboard(slug, dateKey);
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
    const [selectedDateIndex, setSelectedDateIndex] = useState(TODAY_INDEX);
    const dateScrollRef = useRef<ScrollView>(null);
    const selectedDate = DATES[selectedDateIndex];
    const { favoriteLeagues } = useFavorites();

    const goToPrevDay = useCallback(() => {
        setSelectedDateIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const goToNextDay = useCallback(() => {
        setSelectedDateIndex((prev) => Math.min(DATES.length - 1, prev + 1));
    }, []);

    const swipeGesture = Gesture.Pan()
        .activeOffsetX([-30, 30])
        .failOffsetY([-20, 20])
        .onEnd((e) => {
            if (e.translationX > 80) {
                runOnJS(goToPrevDay)();
            } else if (e.translationX < -80) {
                runOnJS(goToNextDay)();
            }
        });

    const { data, isLoading, isError, refetch, isRefetching } = useQuery({
        queryKey: ['scoreboard', 'all', selectedDate.key],
        queryFn: () => fetchAllScoreboards(selectedDate.key),
        staleTime: selectedDateIndex === TODAY_INDEX ? 30 * 1000 : 5 * 60 * 1000,
        // Auto-poll every 30s when viewing today and there are live matches
        refetchInterval: (query) => {
            if (selectedDateIndex !== TODAY_INDEX) return false;
            const hasLive = query.state.data?.some((s) => s.matches.some((m) => m.status.state === 'in'));
            return hasLive ? 30 * 1000 : false;
        },
    });

    // Sort: favorites first, then live matches, then the rest
    const sortedData = data ? [...data].sort((a, b) => {
        const aFav = favoriteLeagues.includes(a.slug) ? 0 : 1;
        const bFav = favoriteLeagues.includes(b.slug) ? 0 : 1;
        if (aFav !== bFav) return aFav - bFav;
        const aLive = a.matches.some((m) => m.status.state === 'in') ? 0 : 1;
        const bLive = b.matches.some((m) => m.status.state === 'in') ? 0 : 1;
        return aLive - bLive;
    }) : data;

    // Goal notifications for favorite teams
    const allMatches = useMemo(
        () => sortedData?.flatMap((s) => s.matches) ?? [],
        [sortedData],
    );
    useGoalNotifications(allMatches);

    const renderContent = () => {
        if (isLoading) {
            return <ScoresSkeleton />;
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
                    <Text style={styles.emptyText}>No matches</Text>
                    <Text style={styles.emptySubtext}>No fixtures scheduled for this day</Text>
                </View>
            );
        }

        return (
            <FlatList
                style={styles.list}
                data={sortedData}
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

    return (
        <View style={styles.container}>
            {/* Date Picker */}
            <ScrollView
                ref={dateScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.datePicker}
                contentContainerStyle={styles.datePickerContent}
                contentOffset={{ x: Math.max(0, (selectedDateIndex - 2) * 64), y: 0 }}
            >
                {DATES.map((item, index) => (
                    <TouchableOpacity
                        key={item.key}
                        style={[
                            styles.dateItem,
                            index === selectedDateIndex && styles.dateItemActive,
                        ]}
                        onPress={() => setSelectedDateIndex(index)}
                    >
                        <Text style={[
                            styles.dateDayLabel,
                            index === selectedDateIndex && styles.dateLabelActive,
                            index === TODAY_INDEX && index !== selectedDateIndex && styles.dateTodayText,
                        ]}>
                            {item.dayLabel}
                        </Text>
                        <Text style={[
                            styles.dateLabel,
                            index === selectedDateIndex && styles.dateLabelActive,
                        ]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Content — swipeable */}
            <GestureDetector gesture={swipeGesture}>
                <Animated.View style={{ flex: 1 }}>
                    {renderContent()}
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    datePicker: {
        maxHeight: 64,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    datePickerContent: {
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    dateItem: {
        width: 56,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 12,
    },
    dateItemActive: {
        backgroundColor: colors.primary,
    },
    dateDayLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textMuted,
        marginBottom: 2,
    },
    dateLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    dateLabelActive: {
        color: colors.textPrimary,
    },
    dateTodayText: {
        color: colors.primary,
    },
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
