import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    SectionList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, LEAGUES, getLeaguesByRegion } from '../constants';
import type { League, Region } from '../constants';
import { useFavorites } from '../stores';

const REGION_LABELS: { region: Region; label: string }[] = [
    { region: 'fifa', label: '🌍 FIFA / Global' },
    { region: 'europe', label: '🇪🇺 Europe' },
    { region: 'other', label: '🌐 Other' },
];

interface LeagueSection {
    title: string;
    data: League[];
}

export const SearchScreen: React.FC = () => {
    const [query, setQuery] = useState('');
    const { isLeagueFavorite, toggleFavoriteLeague } = useFavorites();
    const navigation = useNavigation<any>();

    const navigateToLeague = (slug: string) => {
        navigation.navigate('Standings', { leagueSlug: slug });
    };

    const sections = useMemo((): LeagueSection[] => {
        const filtered = query.length > 0
            ? LEAGUES.filter((l) =>
                l.name.toLowerCase().includes(query.toLowerCase()) ||
                l.shortName.toLowerCase().includes(query.toLowerCase()) ||
                (l.country?.toLowerCase().includes(query.toLowerCase()) ?? false)
            )
            : LEAGUES;

        // If searching, show flat results
        if (query.length > 0) {
            const sorted = [...filtered].sort((a, b) => {
                const aFav = isLeagueFavorite(a.slug) ? 0 : 1;
                const bFav = isLeagueFavorite(b.slug) ? 0 : 1;
                return aFav - bFav;
            });
            return [{ title: `Results (${sorted.length})`, data: sorted }];
        }

        // Favorites section
        const favorites = LEAGUES.filter((l) => isLeagueFavorite(l.slug));
        const result: LeagueSection[] = [];

        if (favorites.length > 0) {
            result.push({ title: '⭐ Favorites', data: favorites });
        }

        // Grouped by region
        for (const { region, label } of REGION_LABELS) {
            const leagues = getLeaguesByRegion(region);
            if (leagues.length > 0) {
                result.push({ title: label, data: leagues });
            }
        }

        return result;
    }, [query, isLeagueFavorite]);

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.input}
                    placeholder="Search leagues..."
                    placeholderTextColor={colors.textMuted}
                    value={query}
                    onChangeText={setQuery}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
                        <Text style={styles.clearText}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.slug}
                renderSectionHeader={({ section }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={styles.leagueRow}>
                        <TouchableOpacity
                            onPress={() => toggleFavoriteLeague(item.slug)}
                            style={styles.starBtn}
                        >
                            <Text style={styles.starText}>
                                {isLeagueFavorite(item.slug) ? '★' : '☆'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.leagueInfoTouchable}
                            onPress={() => navigateToLeague(item.slug)}
                            activeOpacity={0.6}
                        >
                            <View style={styles.leagueInfo}>
                                <Text style={styles.leagueName}>{item.name}</Text>
                                <Text style={styles.leagueDetail}>
                                    {item.country ? `${item.country} • ` : ''}{item.region}
                                </Text>
                            </View>
                            <View style={styles.badges}>
                                {item.tier === 1 && (
                                    <View style={[styles.badge, styles.tierBadge]}>
                                        <Text style={styles.tierBadgeText}>Top</Text>
                                    </View>
                                )}
                                {item.hasStandings && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>Table</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No leagues found</Text>
                    </View>
                }
                stickySectionHeadersEnabled
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 12,
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingHorizontal: 14,
    },
    input: {
        flex: 1,
        height: 44,
        fontSize: 15,
        color: colors.textPrimary,
    },
    clearBtn: {
        padding: 6,
    },
    clearText: {
        fontSize: 16,
        color: colors.textMuted,
    },
    sectionHeader: {
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    leagueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    starBtn: {
        marginRight: 12,
        padding: 4,
    },
    starText: {
        fontSize: 20,
        color: colors.primary,
    },
    leagueInfo: {
        flex: 1,
    },
    leagueInfoTouchable: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    chevron: {
        fontSize: 20,
        color: colors.textMuted,
        marginLeft: 8,
    },
    leagueName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    leagueDetail: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    badges: {
        flexDirection: 'row',
        gap: 6,
    },
    badge: {
        backgroundColor: colors.surfaceLight,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    tierBadge: {
        backgroundColor: colors.primary + '22',
    },
    tierBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.primary,
    },
    emptyContainer: {
        paddingTop: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: colors.textMuted,
    },
});
