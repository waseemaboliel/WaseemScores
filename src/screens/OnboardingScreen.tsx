import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, LEAGUES } from '../constants';
import { useFavorites } from '../stores';
import { useSettings } from '../stores';

const POPULAR_TEAMS = [
    { id: '364', name: 'Liverpool', slug: 'eng.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png' },
    { id: '382', name: 'Manchester United', slug: 'eng.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png' },
    { id: '360', name: 'Manchester City', slug: 'eng.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/360.png' },
    { id: '363', name: 'Arsenal', slug: 'eng.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/363.png' },
    { id: '285', name: 'Chelsea', slug: 'eng.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/285.png' },
    { id: '367', name: 'Tottenham', slug: 'eng.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/367.png' },
    { id: '86', name: 'Real Madrid', slug: 'esp.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png' },
    { id: '83', name: 'Barcelona', slug: 'esp.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png' },
    { id: '114', name: 'Bayern Munich', slug: 'ger.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/114.png' },
    { id: '111', name: 'Juventus', slug: 'ita.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/111.png' },
    { id: '103', name: 'AC Milan', slug: 'ita.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/103.png' },
    { id: '104', name: 'Inter Milan', slug: 'ita.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/104.png' },
    { id: '160', name: 'Paris Saint-Germain', slug: 'fra.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png' },
    { id: '124', name: 'Borussia Dortmund', slug: 'ger.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png' },
    { id: '174', name: 'Aston Villa', slug: 'eng.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/174.png' },
    { id: '375', name: 'Newcastle', slug: 'eng.1', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/375.png' },
];

const topLeagues = LEAGUES.filter((l) => l.tier === 1);

type Step = 'leagues' | 'teams';

export const OnboardingScreen: React.FC = () => {
    const [step, setStep] = useState<Step>('leagues');
    const { toggleFavoriteLeague, toggleFavoriteTeam, isLeagueFavorite, isTeamFavorite } = useFavorites();
    const { completeOnboarding } = useSettings();

    const handleFinish = useCallback(() => {
        completeOnboarding();
    }, [completeOnboarding]);

    const renderLeagueItem = ({ item }: { item: typeof topLeagues[0] }) => {
        const selected = isLeagueFavorite(item.slug);
        return (
            <TouchableOpacity
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => toggleFavoriteLeague(item.slug)}
            >
                <Text style={styles.cardName}>{item.shortName}</Text>
                <Text style={[styles.checkmark, selected && styles.checkmarkVisible]}>✓</Text>
            </TouchableOpacity>
        );
    };

    const renderTeamItem = ({ item }: { item: typeof POPULAR_TEAMS[0] }) => {
        const selected = isTeamFavorite(item.id);
        return (
            <TouchableOpacity
                style={[styles.teamCard, selected && styles.cardSelected]}
                onPress={() => toggleFavoriteTeam(item.id)}
            >
                <Image source={{ uri: item.logo }} style={styles.teamLogo} />
                <Text style={styles.teamName} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.checkmark, selected && styles.checkmarkVisible]}>✓</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {step === 'leagues' ? 'Pick Your Leagues' : 'Pick Your Teams'}
                </Text>
                <Text style={styles.subtitle}>
                    {step === 'leagues'
                        ? 'Select the leagues you follow'
                        : 'Select your favorite teams'}
                </Text>
            </View>

            {step === 'leagues' ? (
                <FlatList
                    data={topLeagues}
                    keyExtractor={(item) => item.slug}
                    renderItem={renderLeagueItem}
                    contentContainerStyle={styles.list}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                />
            ) : (
                <FlatList
                    data={POPULAR_TEAMS}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTeamItem}
                    contentContainerStyle={styles.list}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                />
            )}

            <View style={styles.footer}>
                {step === 'leagues' ? (
                    <TouchableOpacity style={styles.nextBtn} onPress={() => setStep('teams')}>
                        <Text style={styles.nextBtnText}>Next</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.footerRow}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => setStep('leagues')}>
                            <Text style={styles.backBtnText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.nextBtn} onPress={handleFinish}>
                            <Text style={styles.nextBtnText}>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {step === 'leagues' && (
                    <TouchableOpacity onPress={handleFinish} style={styles.skipBtn}>
                        <Text style={styles.skipText}>Skip for now</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: 15,
        color: colors.textMuted,
        marginTop: 6,
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    columnWrapper: {
        gap: 10,
        marginBottom: 10,
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '15',
    },
    cardName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        flex: 1,
    },
    teamCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    teamLogo: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: 8,
    },
    teamName: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
    },
    checkmark: {
        fontSize: 18,
        color: colors.primary,
        opacity: 0,
    },
    checkmarkVisible: {
        opacity: 1,
    },
    footer: {
        padding: 20,
        gap: 12,
    },
    footerRow: {
        flexDirection: 'row',
        gap: 12,
    },
    nextBtn: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    nextBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    backBtn: {
        flex: 0.5,
        backgroundColor: colors.surfaceLight,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    backBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    skipBtn: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    skipText: {
        fontSize: 14,
        color: colors.textMuted,
    },
});
