import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { GeminiService } from '../../services/GeminiService';
import { translate } from '../../utils/translator';

export default function PlanScreen() {
  const router = useRouter();
  const { theme, logs, mealPlan, workoutPlan, setMealPlan, setWorkoutPlan, updateNutritionData, language } = useApp();
  const [activeTab, setActiveTab] = useState('meal'); // 'meal' or 'workout'
  const [selectedDay, setSelectedDay] = useState(0);
  const [generating, setGenerating] = useState(false);

  // Generate plans
  const generatePlans = async () => {
    try {
      setGenerating(true);
      // Generate meal plan
      const generatedMealPlan = await GeminiService.generateMealPlan(logs);
      setMealPlan(generatedMealPlan);

      // Generate workout plan
      const generatedWorkoutPlan = await GeminiService.generateWorkoutPlan(logs);
      setWorkoutPlan(generatedWorkoutPlan);

      // Calculate nutrition data
      const nutritionData = GeminiService.calculateNutritionData(generatedMealPlan);
      updateNutritionData(nutritionData);

      // Show success message
      Alert.alert(
        translate("Plans Generated Successfully", language),
        translate("Your personalized meal and workout plans have been created based on your logs.", language),
        [{ text: translate("Great!", language) }]
      );
    } catch (error) {
      console.error('Error generating plans:', error);
      Alert.alert(
        translate("Error", language),
        translate("There was an error generating your plans. Please try again.", language),
        [{ text: translate("OK", language) }]
      );
    } finally {
      setGenerating(false);
    }
  };

  // Calculate days with logs
  const daysWithLogs = logs.length;
  const needMoreLogs = daysWithLogs < 7;

  // Render the meal plan
  const renderMealPlan = () => {
    if (!mealPlan || !mealPlan.days || mealPlan.days.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            {translate("No meal plan available. Generate a plan to get started.", language)}
          </Text>
        </View>
      );
    }

    const day = mealPlan.days[selectedDay];

    return (
      <ScrollView>
        {/* Breakfast */}
        <View style={[styles.mealCard, {
          backgroundColor: theme.colors.card,
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }]}>
          <View style={styles.mealHeader}>
            <Ionicons name="sunny" size={24} color={theme.colors.secondary} />
            <Text style={[styles.mealTitle, { color: theme.colors.text }]}>
              {translate("Breakfast", language)}
            </Text>
          </View>
          <Text style={[styles.mealName, { color: theme.colors.primary }]}>
            {translate(day.breakfast?.name || 'Not specified', language)}
          </Text>
          <Text style={[styles.mealDescription, { color: theme.colors.text }]}>
            {translate(day.breakfast?.description || 'No description available', language)}
          </Text>
          <View style={[styles.nutritionContainer, { backgroundColor: theme.colors.background }]}>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: theme.colors.primary }]}>
                {day.breakfast?.protein || 0}g
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.colors.muted }]}>
                {translate("Protein", language)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: theme.colors.secondary }]}>
                {day.breakfast?.carbs || 0}g
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.colors.muted }]}>
                {translate("Carbs", language)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: theme.colors.error }]}>
                {day.breakfast?.calories || 0}
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.colors.muted }]}>
                {translate("Calories", language)}
              </Text>
            </View>
          </View>
        </View>

        {/* Lunch */}
        <View style={[styles.mealCard, {
          backgroundColor: theme.colors.card,
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }]}>
          <View style={styles.mealHeader}>
            <Ionicons name="restaurant" size={24} color={theme.colors.primary} />
            <Text style={[styles.mealTitle, { color: theme.colors.text }]}>
              {translate("Lunch", language)}
            </Text>
          </View>
          <Text style={[styles.mealName, { color: theme.colors.primary }]}>
            {translate(day.lunch?.name || 'Not specified', language)}
          </Text>
          <Text style={[styles.mealDescription, { color: theme.colors.text }]}>
            {translate(day.lunch?.description || 'No description available', language)}
          </Text>
          <View style={[styles.nutritionContainer, { backgroundColor: theme.colors.background }]}>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: theme.colors.primary }]}>
                {day.lunch?.protein || 0}g
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.colors.muted }]}>
                {translate("Protein", language)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: theme.colors.secondary }]}>
                {day.lunch?.carbs || 0}g
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.colors.muted }]}>
                {translate("Carbs", language)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: theme.colors.error }]}>
                {day.lunch?.calories || 0}
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.colors.muted }]}>
                {translate("Calories", language)}
              </Text>
            </View>
          </View>
        </View>

        {/* Dinner */}
        <View style={[styles.mealCard, {
          backgroundColor: theme.colors.card,
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }]}>
          <View style={styles.mealHeader}>
            <Ionicons name="moon" size={24} color={theme.colors.info} />
            <Text style={[styles.mealTitle, { color: theme.colors.text }]}>
              {translate("Dinner", language)}
            </Text>
          </View>
          <Text style={[styles.mealName, { color: theme.colors.primary }]}>
            {translate(day.dinner?.name || 'Not specified', language)}
          </Text>
          <Text style={[styles.mealDescription, { color: theme.colors.text }]}>
            {translate(day.dinner?.description || 'No description available', language)}
          </Text>
          <View style={[styles.nutritionContainer, { backgroundColor: theme.colors.background }]}>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: theme.colors.primary }]}>
                {day.dinner?.protein || 0}g
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.colors.muted }]}>
                {translate("Protein", language)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: theme.colors.secondary }]}>
                {day.dinner?.carbs || 0}g
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.colors.muted }]}>
                {translate("Carbs", language)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: theme.colors.error }]}>
                {day.dinner?.calories || 0}
              </Text>
              <Text style={[styles.nutritionLabel, { color: theme.colors.muted }]}>
                {translate("Calories", language)}
              </Text>
            </View>
          </View>
        </View>

        {/* Snacks */}
        {day.snacks && day.snacks.length > 0 && (
          <View style={[styles.mealCard, {
            backgroundColor: theme.colors.card,
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }]}>
            <View style={styles.mealHeader}>
              <Ionicons name="cafe" size={24} color={theme.colors.success} />
              <Text style={[styles.mealTitle, { color: theme.colors.text }]}>{translate("Snacks", language)}</Text>
            </View>

            {day.snacks.map((snack, index) => (
              <View key={index} style={index > 0 ? styles.snackDivider : null}>
                <Text style={[styles.mealName, { color: theme.colors.primary }]}>
                  {translate(snack.name || 'Not specified', language)}
                </Text>
                <Text style={[styles.mealDescription, { color: theme.colors.text }]}>
                  {translate(snack.description || 'No description available', language)}
                </Text>
                <View style={[styles.nutritionContainer, { backgroundColor: theme.colors.background }]}>
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionValue, { color: theme.colors.primary }]}>
                      {snack.protein || 0}g
                    </Text>
                    <Text style={[styles.nutritionLabel, { color: theme.colors.muted }]}>
                      {translate("Protein", language)}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionValue, { color: theme.colors.secondary }]}>
                      {snack.carbs || 0}g
                    </Text>
                    <Text style={[styles.nutritionLabel, { color: theme.colors.muted }]}>
                      {translate("Carbs", language)}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionValue, { color: theme.colors.error }]}>
                      {snack.calories || 0}
                    </Text>
                    <Text style={[styles.nutritionLabel, { color: theme.colors.muted }]}>
                      {translate("Calories", language)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  // Render the workout plan
  const renderWorkoutPlan = () => {
    if (!workoutPlan || !workoutPlan.days || workoutPlan.days.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            {translate("No workout plan available. Generate a plan to get started.", language)}
          </Text>
        </View>
      );
    }

    const day = workoutPlan.days[selectedDay];

    return (
      <ScrollView>
        <View style={[styles.workoutCard, {
          backgroundColor: theme.colors.card,
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }]}>
          <View style={styles.workoutHeader}>
            <View style={[styles.workoutTypeContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text style={[styles.workoutType, { color: theme.colors.primary }]}>
                {translate(day.type || 'General Workout', language)}
              </Text>
            </View>

            <View style={[styles.workoutStatsContainer, { backgroundColor: theme.colors.background }]}>
              <View style={styles.workoutStat}>
                <Ionicons name="time" size={20} color={theme.colors.primary} />
                <Text style={[styles.workoutStatText, { color: theme.colors.text }]}>
                  {day.duration || 'N/A'}
                </Text>
              </View>

              <View style={styles.workoutStat}>
                <Ionicons name="flame" size={20} color={theme.colors.secondary} />
                <Text style={[styles.workoutStatText, { color: theme.colors.text }]}>
                  {translate(day.intensity || 'N/A', language)}
                </Text>
              </View>

              <View style={styles.workoutStat}>
                <Ionicons name="flash" size={20} color={theme.colors.error} />
                <Text style={[styles.workoutStatText, { color: theme.colors.text }]}>
                  {day.caloriesBurned || 0} {translate("cal", language)}
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.workoutSectionTitle, { color: theme.colors.text }]}>
            {translate("Exercises", language)}
          </Text>

          {day.exercises && day.exercises.length > 0 ? (
            day.exercises.map((exercise, index) => (
              <View
                key={index}
                style={[
                  styles.exerciseItem,
                  { backgroundColor: theme.colors.background },
                  index === day.exercises.length - 1 ? { marginBottom: 0 } : null
                ]}
              >
                <Text style={[styles.exerciseName, { color: theme.colors.text }]}>
                  {translate(exercise.name, language)}
                </Text>
                <View style={styles.exerciseDetails}>
                  {exercise.sets && exercise.reps ? (
                    <View style={styles.exerciseMetric}>
                      <Text style={[styles.exerciseMetricValue, { color: theme.colors.primary }]}>
                        {exercise.sets} × {exercise.reps}
                      </Text>
                      <Text style={[styles.exerciseMetricLabel, { color: theme.colors.muted }]}>
                        {translate("Sets × Reps", language)}
                      </Text>
                    </View>
                  ) : exercise.duration ? (
                    <View style={styles.exerciseMetric}>
                      <Text style={[styles.exerciseMetricValue, { color: theme.colors.primary }]}>
                        {exercise.duration}
                      </Text>
                      <Text style={[styles.exerciseMetricLabel, { color: theme.colors.muted }]}>
                        {translate("Duration", language)}
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.exerciseDetail, { color: theme.colors.muted }]}>
                      {translate("As directed", language)}
                    </Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.restDay, { backgroundColor: theme.colors.background }]}>
              <Ionicons name="bed" size={40} color={theme.colors.secondary} />
              <Text style={[styles.restDayText, { color: theme.colors.text }]}>
                {translate("Rest Day", language)}
              </Text>
              <Text style={[styles.restDayDescription, { color: theme.colors.muted }]}>
                {translate("Take it easy today and allow your body to recover.", language)}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{translate("Your Plan", language)}</Text>

        <TouchableOpacity
          style={[styles.refreshButton, { backgroundColor: theme.colors.primary + '20' }]}
          onPress={generatePlans}
          disabled={needMoreLogs || generating}
        >
          {generating ? (
            <ActivityIndicator color={theme.colors.primary} size="small" />
          ) : (
            <>
              <Ionicons
                name="refresh"
                size={20}
                color={needMoreLogs ? theme.colors.disabled : theme.colors.primary}
              />
              <Text
                style={[
                  styles.refreshText,
                  { color: needMoreLogs ? theme.colors.disabled : theme.colors.primary }
                ]}
              >
                {translate("Regenerate", language)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {needMoreLogs ? (
        <View style={styles.needMoreLogsContainer}>
          <Ionicons name="alert-circle" size={50} color={theme.colors.warning} />
          <Text style={[styles.needMoreLogsText, { color: theme.colors.text }]}>
            {translate("You need at least 7 days of logs to generate a personalized plan.", language)}
          </Text>
          <Text style={[styles.needMoreLogsSubtext, { color: theme.colors.muted }]}>
            {translate("You currently have", language)} {daysWithLogs} {translate(daysWithLogs !== 1 ? "logs" : "log", language)}.
          </Text>
          <TouchableOpacity
            style={[styles.logButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push('/log')}
          >
            <Text style={styles.logButtonText}>{translate("Add Today's Log", language)}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Tab selectors */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'meal' && {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary
                },
                { borderColor: theme.colors.border }
              ]}
              onPress={() => setActiveTab('meal')}
            >
              <Ionicons
                name="restaurant"
                size={18}
                color={activeTab === 'meal' ? 'white' : theme.colors.text}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'meal' ? 'white' : theme.colors.text }
                ]}
              >
                {translate("Meal Plan", language)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'workout' && {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary
                },
                { borderColor: theme.colors.border }
              ]}
              onPress={() => setActiveTab('workout')}
            >
              <Ionicons
                name="fitness"
                size={18}
                color={activeTab === 'workout' ? 'white' : theme.colors.text}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'workout' ? 'white' : theme.colors.text }
                ]}
              >
                {translate("Workout Plan", language)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Day selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelector}
          >
            {Array.from({ length: 7 }, (_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dayButton,
                  selectedDay === i && {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary
                  },
                  { borderColor: theme.colors.border }
                ]}
                onPress={() => setSelectedDay(i)}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: selectedDay === i ? 'white' : theme.colors.text }
                  ]}
                >
                  {translate("Day", language)} {i + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Content */}
          <View style={styles.content}>
            {activeTab === 'meal' ? renderMealPlan() : renderWorkoutPlan()}
          </View>
        </>
      )}
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  refreshText: {
    fontWeight: '600',
    marginLeft: 6,
  },
  needMoreLogsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  needMoreLogsText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  needMoreLogsSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  logButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  logButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 4,
  },
  tabText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  daySelector: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  dayText: {
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  // Meal plan styles
  mealCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  mealDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  nutritionContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
  snackDivider: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
  },
  // Workout plan styles
  workoutCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  workoutHeader: {
    marginBottom: 16,
  },
  workoutTypeContainer: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  workoutType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  workoutStat: {
    alignItems: 'center',
    flex: 1,
  },
  workoutStatText: {
    marginTop: 4,
    fontWeight: '500',
  },
  workoutSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  exerciseItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
  },
  exerciseMetric: {
    marginRight: 16,
  },
  exerciseMetricValue: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  exerciseMetricLabel: {
    fontSize: 12,
  },
  exerciseDetail: {
    fontSize: 14,
  },
  restDay: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
  },
  restDayText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  restDayDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 