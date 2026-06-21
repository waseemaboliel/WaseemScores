import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import {
    ScoresScreen,
    StandingsScreen,
    MatchDetailScreen,
    SearchScreen,
    TeamDetailScreen,
    TopScorersScreen,
    NewsScreen,
    SettingsScreen,
    PlayerProfileScreen,
    OnboardingScreen,
} from '../screens';
import { colors } from '../constants';
import { useSettings } from '../stores';

const DarkTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.live,
    },
};

export type ScoresStackParamList = {
    ScoresList: undefined;
    MatchDetail: {
        eventId: string;
        slug: string;
        homeTeam: string;
        awayTeam: string;
    };
    TeamDetail: {
        teamId: string;
        slug: string;
        teamName: string;
    };
    PlayerProfile: {
        playerId: string;
        playerName: string;
        slug: string;
    };
    Settings: undefined;
};

const Stack = createNativeStackNavigator<ScoresStackParamList>();
const Tab = createBottomTabNavigator();

const ScoresStack: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
            headerTitleStyle: { fontWeight: '700', fontSize: 16 },
            headerShadowVisible: false,
        }}
    >
        <Stack.Screen name="ScoresList" component={ScoresScreen} options={{ title: 'Scores' }} />
        <Stack.Screen
            name="MatchDetail"
            component={MatchDetailScreen}
            options={({ route }) => ({
                title: `${route.params.homeTeam} vs ${route.params.awayTeam}`,
            })}
        />
        <Stack.Screen
            name="TeamDetail"
            component={TeamDetailScreen}
            options={({ route }) => ({
                title: route.params.teamName,
            })}
        />
        <Stack.Screen
            name="PlayerProfile"
            component={PlayerProfileScreen}
            options={({ route }) => ({
                title: route.params.playerName,
            })}
        />
        <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
        />
    </Stack.Navigator>
);

export const AppNavigator: React.FC = () => {
    const { onboardingComplete } = useSettings();

    if (!onboardingComplete) {
        return (
            <NavigationContainer theme={DarkTheme}>
                <OnboardingScreen />
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer theme={DarkTheme}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: colors.surface,
                        borderTopColor: colors.border,
                        borderTopWidth: 1,
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textMuted,
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                    },
                }}
            >
                <Tab.Screen
                    name="Scores"
                    component={ScoresStack}
                    options={{
                        tabBarLabel: 'Scores',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="football-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Standings"
                    component={StandingsScreen}
                    options={{
                        title: 'Standings',
                        tabBarLabel: 'Standings',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="podium-outline" size={size} color={color} />
                        ),
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: colors.surface,
                        },
                        headerTintColor: colors.textPrimary,
                        headerTitleStyle: {
                            fontWeight: '700',
                            fontSize: 18,
                        },
                        headerShadowVisible: false,
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{
                        title: 'Leagues',
                        tabBarLabel: 'Leagues',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="trophy-outline" size={size} color={color} />
                        ),
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: colors.surface,
                        },
                        headerTintColor: colors.textPrimary,
                        headerTitleStyle: {
                            fontWeight: '700',
                            fontSize: 18,
                        },
                        headerShadowVisible: false,
                    }}
                />
                <Tab.Screen
                    name="Stats"
                    component={TopScorersScreen}
                    options={{
                        title: 'Top Scorers',
                        tabBarLabel: 'Stats',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="stats-chart-outline" size={size} color={color} />
                        ),
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: colors.surface,
                        },
                        headerTintColor: colors.textPrimary,
                        headerTitleStyle: {
                            fontWeight: '700',
                            fontSize: 18,
                        },
                        headerShadowVisible: false,
                    }}
                />
                <Tab.Screen
                    name="News"
                    component={NewsScreen}
                    options={{
                        title: 'News',
                        tabBarLabel: 'News',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="newspaper-outline" size={size} color={color} />
                        ),
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: colors.surface,
                        },
                        headerTintColor: colors.textPrimary,
                        headerTitleStyle: {
                            fontWeight: '700',
                            fontSize: 18,
                        },
                        headerShadowVisible: false,
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
