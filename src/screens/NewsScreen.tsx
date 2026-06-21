import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { espnApi } from '../api';
import { colors } from '../constants';
import { LEAGUES, DEFAULT_SCOREBOARD_LEAGUES } from '../constants/leagues';

export const NewsScreen: React.FC = () => {
    const [selectedLeague, setSelectedLeague] = useState(DEFAULT_SCOREBOARD_LEAGUES[0]);
    const league = LEAGUES.find((l) => l.slug === selectedLeague) ?? LEAGUES[0];

    const { data, isLoading } = useQuery({
        queryKey: ['news', league.slug],
        queryFn: () => espnApi.getNews(league.slug),
        staleTime: 10 * 60 * 1000,
    });

    const articles = data?.articles ?? [];

    return (
        <View style={styles.container}>
            {/* League Picker */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.leaguePicker}
                contentContainerStyle={styles.leaguePickerContent}
            >
                {LEAGUES.map((l) => (
                    <TouchableOpacity
                        key={l.slug}
                        onPress={() => setSelectedLeague(l.slug)}
                        style={[
                            styles.leagueChip,
                            l.slug === selectedLeague && styles.leagueChipActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.leagueChipText,
                                l.slug === selectedLeague && styles.leagueChipTextActive,
                            ]}
                            numberOfLines={1}
                        >
                            {l.shortName}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {isLoading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.list}>
                    {articles.map((article: any) => (
                        <TouchableOpacity
                            key={article.dataSourceIdentifier ?? article.headline}
                            style={styles.articleCard}
                            onPress={() => {
                                const link = article.links?.web?.href ?? article.links?.mobile?.href;
                                if (link) Linking.openURL(link);
                            }}
                        >
                            {article.images?.[0]?.url && (
                                <Image
                                    source={{ uri: article.images[0].url }}
                                    style={styles.articleImage}
                                />
                            )}
                            <View style={styles.articleContent}>
                                <Text style={styles.articleTitle} numberOfLines={3}>
                                    {article.headline}
                                </Text>
                                <Text style={styles.articleMeta} numberOfLines={1}>
                                    {article.published
                                        ? new Date(article.published).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })
                                        : ''}
                                </Text>
                                {article.description && (
                                    <Text style={styles.articleDesc} numberOfLines={2}>
                                        {article.description}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}

                    {articles.length === 0 && (
                        <Text style={styles.empty}>No news available for this league.</Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leaguePicker: {
        maxHeight: 44,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    leaguePickerContent: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
    },
    leagueChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: colors.surface,
        marginRight: 6,
    },
    leagueChipActive: {
        backgroundColor: colors.primary,
    },
    leagueChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textMuted,
    },
    leagueChipTextActive: {
        color: '#000',
    },
    list: {
        padding: 16,
        gap: 16,
    },
    articleCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
    },
    articleImage: {
        width: '100%',
        height: 160,
    },
    articleContent: {
        padding: 12,
    },
    articleTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.textPrimary,
        lineHeight: 20,
    },
    articleMeta: {
        fontSize: 11,
        color: colors.textMuted,
        marginTop: 4,
    },
    articleDesc: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 6,
        lineHeight: 18,
    },
    empty: {
        textAlign: 'center',
        color: colors.textMuted,
        marginTop: 40,
        fontSize: 14,
    },
});
