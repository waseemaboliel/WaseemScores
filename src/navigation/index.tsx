import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScoresScreen, StandingsScreen } from '../screens';
import { colors } from '../constants';

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

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer theme={DarkTheme}>
            <Tab.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.surface,
                        shadowColor: 'transparent',
                        elevation: 0,
                    },
                    headerTintColor: colors.textPrimary,
                    headerTitleStyle: {
                        fontWeight: '700',
                        fontSize: 18,
                    },
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
                    component={ScoresScreen}
                    options={{
                        title: 'Scores',
                        tabBarLabel: 'Scores',
                    }}
                />
                <Tab.Screen
                    name="Standings"
                    component={StandingsScreen}
                    options={{
                        title: 'Standings',
                        tabBarLabel: 'Standings',
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
