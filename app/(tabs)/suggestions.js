import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { GeminiService } from '../../services/GeminiService';
import { translate } from '../../utils/translator';

export default function SuggestionsScreen() {
    const { language, theme, logs, mealPlan, workoutPlan } = useApp();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [errors, setErrors] = useState(false);

    // Generate suggestions based on user logs and meal plan
    useEffect(() => {
        if (logs.length > 0 && (mealPlan || workoutPlan)) {
            generateSuggestions();
        }
    }, [logs, mealPlan, workoutPlan]);

    const generateSuggestions = async () => {
        try {
            setGenerating(true);
            const generatedSuggestions = await GeminiService.generateSuggestions(logs, mealPlan);
            setSuggestions(generatedSuggestions);
            setErrors(false);
        } catch (error) {
            console.error('Error generating suggestions:', error);
            setErrors(true);
        } finally {
            setGenerating(false);
        }
    };

    // Search for articles and info using Gemini
    const searchArticles = async () => {
        if (!query.trim()) return;

        try {
            setSearchLoading(true);
            const results = await GeminiService.searchArticles(query);
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching articles:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    // Get appropriate icon for the suggestion category
    const getCategoryIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'nutrition':
                return 'nutrition';
            case 'fitness':
                return 'fitness';
            case 'health':
                return 'medkit';
            case 'recipe':
                return 'restaurant';
            default:
                return 'bulb';
        }
    };

    // Open a link
    const openLink = (url) => {
        if (url) {
            Linking.openURL(url);
        }
    };

    // Render loading state
    if (generating) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                    {translate("Generating personalized suggestions...", language)}
                </Text>
            </View>
        );
    }

    // Render error state
    if (errors) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <Ionicons name="warning" size={48} color={theme.colors.error} />
                <Text style={[styles.errorTitle, { color: theme.colors.error }]}>
                    {translate("Error generating suggestions", language)}
                </Text>
                <Text style={[styles.errorMessage, { color: theme.colors.text }]}>
                    {translate("We encountered an issue while creating your personalized suggestions. Please try again later.", language)}
                </Text>
                <TouchableOpacity
                    style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
                    onPress={generateSuggestions}
                >
                    <Text style={styles.retryButtonText}>{translate("Try Again", language)}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Render empty state
    if (suggestions.length === 0) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <Ionicons name="bulb-outline" size={64} color={theme.colors.primary} />
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                    {translate("No Suggestions Yet", language)}
                </Text>
                
                {logs.length === 0 ? (
                    <Text style={[styles.emptyMessage, { color: theme.colors.muted }]}>
                        {translate("Log your meals and activities to get personalized suggestions based on your habits.", language)}
                    </Text>
                ) : !mealPlan && !workoutPlan ? (
                    <Text style={[styles.emptyMessage, { color: theme.colors.muted }]}>
                        {translate("Generate a meal or workout plan first to receive personalized suggestions.", language)}
                    </Text>
                ) : (
                    <Text style={[styles.emptyMessage, { color: theme.colors.muted }]}>
                        {translate("We're preparing your personalized suggestions. Check back soon!", language)}
                    </Text>
                )}
                
                <TouchableOpacity
                    style={[styles.generateButton, { backgroundColor: theme.colors.primary }]}
                    onPress={generateSuggestions}
                    disabled={logs.length === 0 || (!mealPlan && !workoutPlan)}
                >
                    <Text style={styles.generateButtonText}>
                        {translate("Generate Suggestions", language)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Render suggestions
    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    {translate("Personalized Suggestions", language)}
                </Text>
                <TouchableOpacity
                    style={[styles.refreshButton, { backgroundColor: theme.colors.primary + '20' }]}
                    onPress={generateSuggestions}
                >
                    <Ionicons name="refresh" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {suggestions.map((suggestion, index) => (
                <View
                    key={index}
                    style={[
                        styles.card,
                        { backgroundColor: theme.colors.card, shadowColor: theme.colors.text }
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.categoryContainer}>
                            <Ionicons
                                name={getCategoryIcon(suggestion.category)}
                                size={20}
                                color={theme.colors.primary}
                                style={styles.categoryIcon}
                            />
                            <Text style={[styles.category, { color: theme.colors.primary }]}>
                                {translate(suggestion.category || "Tip", language)}
                            </Text>
                        </View>
                    </View>

                    <Text style={[styles.suggestionTitle, { color: theme.colors.text }]}>
                        {translate(suggestion.title, language)}
                    </Text>
                    
                    <Text style={[styles.content, { color: theme.colors.muted }]}>
                        {translate(suggestion.content, language)}
                    </Text>

                    {suggestion.link && (
                        <TouchableOpacity
                            style={[styles.linkButton, { borderColor: theme.colors.primary }]}
                            onPress={() => openLink(suggestion.link)}
                        >
                            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                                {translate("Read More", language)}
                            </Text>
                            <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
                        </TouchableOpacity>
                    )}
                </View>
            ))}
            
            <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.colors.muted }]}>
                    {translate("Suggestions are updated based on your logs and plans", language)}
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
        paddingTop: 0,
    },
    searchContainer: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        marginRight: 8,
    },
    searchButton: {
        padding: 12,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultsContainer: {
        marginTop: 16,
    },
    resultItem: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    resultDescription: {
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
    },
    resultUrl: {
        fontSize: 12,
    },
    suggestionsContainer: {
        borderRadius: 16,
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    refreshButton: {
        padding: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },
    suggestionsListContainer: {
        marginBottom: 8,
    },
    suggestionCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    suggestionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
    suggestionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    suggestionContent: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 12,
    },
    readMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    readMoreText: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    },
    emptySuggestions: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptySuggestionsText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    emptyMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    generateButton: {
        padding: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    generateButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        marginRight: 8,
    },
    category: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    footer: {
        padding: 16,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        padding: 8,
        borderRadius: 8,
    },
    linkText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 8,
    },
}); 