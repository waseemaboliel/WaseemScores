import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants';

interface EmptyStateProps {
    icon?: string;
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = '📭',
    title,
    subtitle,
    actionLabel,
    onAction,
}) => (
    <View style={styles.container}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {actionLabel && onAction && (
            <TouchableOpacity style={styles.actionBtn} onPress={onAction}>
                <Text style={styles.actionText}>{actionLabel}</Text>
            </TouchableOpacity>
        )}
    </View>
);

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    message = 'Something went wrong',
    onRetry,
}) => (
    <View style={styles.container}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>{message}</Text>
        <Text style={styles.subtitle}>Check your connection and try again</Text>
        {onRetry && (
            <TouchableOpacity style={styles.actionBtn} onPress={onRetry}>
                <Text style={styles.actionText}>Retry</Text>
            </TouchableOpacity>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
        backgroundColor: colors.background,
    },
    icon: {
        fontSize: 40,
        marginBottom: 16,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 20,
    },
    actionBtn: {
        marginTop: 20,
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 10,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
});
