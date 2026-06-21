import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { colors, LEAGUES } from '../constants';
import type { League } from '../constants';
import { useFavorites } from '../stores';

export const SearchScreen: React.FC = () => {
    const [query, setQuery] = useState('');
    const { isLeagueFavorite, toggleFavoriteLeague } = useFavorites();

    const filteredLeagues = query.length > 0
        ? LEAGUES.filter((l) =>
            l.name.toLowerCase().includes(query.toLowerCase()) ||
            l.shortName.toLowerCase().includes(query.toLowerCase()) ||
            (l.country?.toLowerCase().includes(query.toLowerCase()) ?? false)
        )
        : LEAGUES;

    // Sort favorites first
    const sortedLeagues = [...filteredLeagues].sort((a, b) => {
        const aFav = isLeagueFavorite(a.slug) ? 0 : 1;
        const bFav = isLeagueFavorite(b.slug) ? 0 : 1;
        return aFav - bFav;
    });

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

            <FlatList
                data={sortedLeagues}
                keyExtractor={(item) => item.slug}
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
                        <View style={styles.leagueInfo}>
                            <Text style={styles.leagueName}>{item.name}</Text>
                            <Text style={styles.leagueDetail}>
                                {item.country ? `${item.country} • ` : ''}{item.region}
                            </Text>
                        </View>
                        <View style={styles.badges}>
                            {item.hasStandings && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>Table</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No leagues found</Text>
                    </View>
                }
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
    emptyContainer: {
        paddingTop: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: colors.textMuted,
    },
});
