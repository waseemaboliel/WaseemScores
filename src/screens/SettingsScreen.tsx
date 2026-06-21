import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
} from 'react-native';
import { colors, getLeagueBySlug } from '../constants';
import { useSettings } from '../stores';
import { useFavorites } from '../stores';

interface SettingRowProps {
    label: string;
    description?: string;
    value: boolean;
    onValueChange: (v: boolean) => void;
}

const SettingToggle: React.FC<SettingRowProps> = ({ label, description, value, onValueChange }) => (
    <View style={styles.row}>
        <View style={styles.rowLabel}>
            <Text style={styles.rowTitle}>{label}</Text>
            {description && <Text style={styles.rowDescription}>{description}</Text>}
        </View>
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor="#fff"
        />
    </View>
);

interface SettingOptionProps {
    label: string;
    options: { label: string; value: string }[];
    selected: string;
    onSelect: (value: string) => void;
}

const SettingOption: React.FC<SettingOptionProps> = ({ label, options, selected, onSelect }) => (
    <View style={styles.row}>
        <Text style={styles.rowTitle}>{label}</Text>
        <View style={styles.optionGroup}>
            {options.map((opt) => (
                <TouchableOpacity
                    key={opt.value}
                    style={[styles.optionBtn, selected === opt.value && styles.optionBtnActive]}
                    onPress={() => onSelect(opt.value)}
                >
                    <Text style={[styles.optionText, selected === opt.value && styles.optionTextActive]}>
                        {opt.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

export const SettingsScreen: React.FC = () => {
    const { settings, updateSetting } = useSettings();
    const { favoriteLeagues, favoriteTeams, toggleFavoriteLeague, toggleFavoriteTeam } = useFavorites();
    const [showLeagues, setShowLeagues] = useState(false);
    const [showTeams, setShowTeams] = useState(false);

    return (
        <ScrollView style={styles.container}>
            {/* General */}
            <Text style={styles.sectionHeader}>General</Text>
            <View style={styles.section}>
                <SettingOption
                    label="Time Format"
                    options={[
                        { label: '12h', value: '12h' },
                        { label: '24h', value: '24h' },
                    ]}
                    selected={settings.timeFormat}
                    onSelect={(v) => updateSetting('timeFormat', v as '12h' | '24h')}
                />
                <SettingToggle
                    label="Spoiler Mode"
                    description="Hide scores until you tap on a match"
                    value={settings.spoilerMode}
                    onValueChange={(v) => updateSetting('spoilerMode', v)}
                />
            </View>

            {/* Notifications */}
            <Text style={styles.sectionHeader}>Notifications</Text>
            <View style={styles.section}>
                <SettingToggle
                    label="Notifications"
                    description="Enable push notifications"
                    value={settings.notificationsEnabled}
                    onValueChange={(v) => updateSetting('notificationsEnabled', v)}
                />
                <SettingToggle
                    label="Goal Alerts"
                    description="Get notified when your favorite teams score"
                    value={settings.goalAlerts}
                    onValueChange={(v) => updateSetting('goalAlerts', v)}
                />
                <SettingToggle
                    label="Match Start Alerts"
                    description="Get notified when your favorite teams start playing"
                    value={settings.matchStartAlerts}
                    onValueChange={(v) => updateSetting('matchStartAlerts', v)}
                />
            </View>

            {/* Favorites Summary */}
            <Text style={styles.sectionHeader}>Favorites</Text>
            <View style={styles.section}>
                <TouchableOpacity style={styles.row} onPress={() => setShowLeagues(!showLeagues)}>
                    <Text style={styles.rowTitle}>Favorite Leagues</Text>
                    <View style={styles.rowRight}>
                        <Text style={styles.badge}>{favoriteLeagues.length}</Text>
                        <Text style={styles.chevron}>{showLeagues ? '▾' : '›'}</Text>
                    </View>
                </TouchableOpacity>
                {showLeagues && favoriteLeagues.map((slug) => {
                    const league = getLeagueBySlug(slug);
                    return (
                        <View key={slug} style={styles.favItem}>
                            <Text style={styles.favItemName}>{league?.shortName ?? slug}</Text>
                            <TouchableOpacity onPress={() => toggleFavoriteLeague(slug)} style={styles.removeBtn}>
                                <Text style={styles.removeText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
                {showLeagues && favoriteLeagues.length === 0 && (
                    <Text style={styles.emptyFav}>No favorite leagues — star them from Leagues tab</Text>
                )}

                <TouchableOpacity style={styles.row} onPress={() => setShowTeams(!showTeams)}>
                    <Text style={styles.rowTitle}>Favorite Teams</Text>
                    <View style={styles.rowRight}>
                        <Text style={styles.badge}>{favoriteTeams.length}</Text>
                        <Text style={styles.chevron}>{showTeams ? '▾' : '›'}</Text>
                    </View>
                </TouchableOpacity>
                {showTeams && favoriteTeams.map((teamId) => (
                    <View key={teamId} style={styles.favItem}>
                        <Text style={styles.favItemName}>Team #{teamId}</Text>
                        <TouchableOpacity onPress={() => toggleFavoriteTeam(teamId)} style={styles.removeBtn}>
                            <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                {showTeams && favoriteTeams.length === 0 && (
                    <Text style={styles.emptyFav}>No favorite teams — star them from team pages</Text>
                )}
            </View>

            {/* About */}
            <Text style={styles.sectionHeader}>About</Text>
            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.rowTitle}>Version</Text>
                    <Text style={styles.rowValue}>1.0.0</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowTitle}>Data Source</Text>
                    <Text style={styles.rowValue}>ESPN</Text>
                </View>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 8,
    },
    section: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.separator,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
    },
    rowLabel: {
        flex: 1,
        marginRight: 12,
    },
    rowTitle: {
        fontSize: 15,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    rowDescription: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    rowValue: {
        fontSize: 15,
        color: colors.textMuted,
    },
    badge: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '700',
        backgroundColor: colors.surfaceLight,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
        overflow: 'hidden',
    },
    optionGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    optionBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: colors.surfaceLight,
    },
    optionBtnActive: {
        backgroundColor: colors.primary,
    },
    optionText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textMuted,
    },
    optionTextActive: {
        color: colors.textPrimary,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    chevron: {
        fontSize: 14,
        color: colors.textMuted,
    },
    favItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
        backgroundColor: colors.surfaceLight + '40',
    },
    favItemName: {
        fontSize: 14,
        color: colors.textPrimary,
    },
    removeBtn: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: colors.live + '20',
    },
    removeText: {
        fontSize: 12,
        color: colors.live,
        fontWeight: '600',
    },
    emptyFav: {
        fontSize: 13,
        color: colors.textMuted,
        paddingHorizontal: 24,
        paddingVertical: 12,
        fontStyle: 'italic',
    },
});
