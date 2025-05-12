import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const API_KEY = "AIzaSyDSpuyXZHwuJuGS3la_Ph9twZAuCFXxp3c";
const genAI = new GoogleGenerativeAI(API_KEY);

export const GeminiService = {
    /**
     * Generate a meal plan based on user logs
     * @param {Array} logs - User logs for the last 7 days
     * @returns {Promise<Object>} - Meal plan
     */
    generateMealPlan: async (logs) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            // Format the logs for the prompt
            const formattedLogs = logs.map(log => {
                return `Date: ${new Date(log.date).toLocaleDateString()}
Food eaten: ${log.food}
Mood: ${log.mood}
Workout: ${log.workout ? 'Yes' : 'No'}`;
            }).join('\n\n');

            const prompt = `Based on the following log of a person's food intake, mood, and workout history for the past 7 days, 
create a nutritious Pakistani meal plan for the next 7 days. Include breakfast, lunch, dinner, and snacks for each day.
The meal plan should be balanced, culturally appropriate, and consider the person's patterns.

USER LOGS:
${formattedLogs}

For each meal, include:
1. Name of the dish
2. Brief description
3. Approximate protein, carbs, and calorie content

Format the response as JSON with this structure:
{
  "days": [
    {
      "day": "Day 1",
      "breakfast": { "name": "", "description": "", "protein": 0, "carbs": 0, "calories": 0 },
      "lunch": { "name": "", "description": "", "protein": 0, "carbs": 0, "calories": 0 },
      "dinner": { "name": "", "description": "", "protein": 0, "carbs": 0, "calories": 0 },
      "snacks": [{ "name": "", "description": "", "protein": 0, "carbs": 0, "calories": 0 }]
    },
    ...6 more days
  ]
}

Ensure the meal plan is realistic, nutritious, and includes traditional Pakistani dishes.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const textResponse = response.text();

            // Extract the JSON from the response
            const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) ||
                textResponse.match(/{[\s\S]*?}/);

            if (jsonMatch) {
                return JSON.parse(jsonMatch[1] || jsonMatch[0]);
            }

            // If JSON formatting fails, return the raw text
            return { text: textResponse };
        } catch (error) {
            console.error('Error generating meal plan:', error);
            throw new Error('Failed to generate meal plan. Please try again later.');
        }
    },

    /**
     * Generate a workout plan based on user logs
     * @param {Array} logs - User logs for the last 7 days
     * @returns {Promise<Object>} - Workout plan
     */
    generateWorkoutPlan: async (logs) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            // Format the logs for the prompt
            const formattedLogs = logs.map(log => {
                return `Date: ${new Date(log.date).toLocaleDateString()}
Food eaten: ${log.food}
Mood: ${log.mood}
Workout: ${log.workout ? 'Yes' : 'No'}`;
            }).join('\n\n');

            const prompt = `Based on the following log of a person's food intake, mood, and workout history for the past 7 days, 
create a personalized workout plan for the next 7 days. The plan should be appropriate for the person's patterns and consider their energy levels.

USER LOGS:
${formattedLogs}

Create a 7-day workout plan that includes:
1. Type of workout for each day
2. Duration
3. Intensity level
4. Specific exercises with reps/sets or duration
5. Estimated calories burned

Format the response as JSON with this structure:
{
  "days": [
    {
      "day": "Day 1",
      "type": "",
      "duration": "",
      "intensity": "",
      "exercises": [
        { "name": "", "sets": 0, "reps": 0, "duration": "" }
      ],
      "caloriesBurned": 0
    },
    ...6 more days
  ]
}

Include 1-2 rest days appropriately positioned. Ensure the workouts are varied and target different muscle groups.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const textResponse = response.text();

            // Extract the JSON from the response
            const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) ||
                textResponse.match(/{[\s\S]*?}/);

            if (jsonMatch) {
                return JSON.parse(jsonMatch[1] || jsonMatch[0]);
            }

            // If JSON formatting fails, return the raw text
            return { text: textResponse };
        } catch (error) {
            console.error('Error generating workout plan:', error);
            throw new Error('Failed to generate workout plan. Please try again later.');
        }
    },

    /**
     * Generate personalized suggestions based on user logs and meal plan
     * @param {Array} logs - User logs
     * @param {Object} mealPlan - Generated meal plan
     * @returns {Promise<Array>} - Array of suggestions
     */
    generateSuggestions: async (logs, mealPlan) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            // Prepare data for the prompt
            const logData = logs.length > 0 ? logs.map(log => {
                return `Date: ${new Date(log.date).toLocaleDateString()}
Food eaten: ${log.food}
Mood: ${log.mood}
Workout: ${log.workout ? 'Yes' : 'No'}`;
            }).join('\n\n') : "No log data available";

            // Extract meal plan data if available
            let mealPlanData = "No meal plan data available";
            if (mealPlan && mealPlan.days && mealPlan.days.length > 0) {
                mealPlanData = mealPlan.days.map(day => {
                    return `${day.day}:
- Breakfast: ${day.breakfast?.name || 'Not specified'}
- Lunch: ${day.lunch?.name || 'Not specified'}
- Dinner: ${day.dinner?.name || 'Not specified'}`;
                }).join('\n\n');
            }

            const prompt = `Based on the user's food logs and meal plan, provide 5 personalized health and nutrition suggestions.
These should be relevant to the user's eating habits, workout patterns, and mood.

USER LOGS:
${logData}

MEAL PLAN:
${mealPlanData}

Generate 5 suggestions that are personalized, actionable, and helpful.
Each suggestion should include:
1. A category (Nutrition, Fitness, Health, Recipe)
2. A title
3. Content (2-3 sentences)
4. An optional URL to a relevant article (use https://www.healthline.com/ or other reputable sites if needed)

Format your response as JSON with this structure:
[
  {
    "category": "Category",
    "title": "Suggestion Title",
    "content": "Detailed content with 2-3 sentences of advice.",
    "link": "https://www.example.com/article" (optional)
  },
  // more suggestions
]

If there is insufficient data, provide general health and nutrition tips for Pakistani cuisine and fitness.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const textResponse = response.text();

            // Extract the JSON from the response
            const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) ||
                textResponse.match(/\[[\s\S]*?\]/);

            if (jsonMatch) {
                return JSON.parse(jsonMatch[1] || jsonMatch[0]);
            }

            // If JSON parsing fails, create a default suggestion
            return [
                {
                    category: "Nutrition",
                    title: "Start with Your Daily Logs",
                    content: "To get personalized suggestions, please add daily logs about your meals, mood, and workouts. This will help us provide tailored advice for your health journey.",
                    link: null
                }
            ];
        } catch (error) {
            console.error('Error generating suggestions:', error);
            return [
                {
                    category: "Health",
                    title: "Suggestion Engine Error",
                    content: "There was an error generating personalized suggestions. Please try again later or add more logs to get better recommendations.",
                    link: null
                }
            ];
        }
    },

    /**
     * Search for articles and information using Gemini
     * @param {string} query - Search query
     * @returns {Promise<Array>} - Search results
     */
    searchArticles: async (query) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            const prompt = `Search for reliable information about "${query}" related to health, nutrition, or fitness.
Provide 3 relevant articles or resources that would be helpful.

Format your response as JSON with this structure:
[
  {
    "title": "Article Title",
    "description": "Brief description of the article (2-3 sentences)",
    "url": "https://www.example.com/article"
  },
  // more results
]

Only include reputable sources. Prioritize:
- Healthline, Mayo Clinic, WebMD for health topics
- Nutrition.gov, Eat Right for nutrition topics
- ACE Fitness, NHS UK for fitness topics

If the search is about Pakistani foods or recipes, include at least one resource specific to Pakistani cuisine.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const textResponse = response.text();

            // Extract the JSON from the response
            const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) ||
                textResponse.match(/\[[\s\S]*?\]/);

            if (jsonMatch) {
                return JSON.parse(jsonMatch[1] || jsonMatch[0]);
            }

            // If JSON parsing fails, create a default result
            return [
                {
                    title: "Search Results Not Available",
                    description: "We couldn't process your search at this time. Please try a different search term or try again later.",
                    url: "https://www.healthline.com/"
                }
            ];
        } catch (error) {
            console.error('Error searching articles:', error);
            return [
                {
                    title: "Search Error",
                    description: "There was an error processing your search. Please try again with different keywords or check your internet connection.",
                    url: "https://www.healthline.com/"
                }
            ];
        }
    },

    /**
     * Calculate nutrition data from meal plan
     * @param {Object} mealPlan - The meal plan
     * @returns {Object} - Nutrition data
     */
    calculateNutritionData: (mealPlan) => {
        if (!mealPlan || !mealPlan.days) {
            return {
                protein: [],
                carbs: [],
                calories: [],
                days: []
            };
        }

        const nutritionData = {
            protein: [],
            carbs: [],
            calories: [],
            days: []
        };

        mealPlan.days.forEach((day, index) => {
            let dailyProtein = 0;
            let dailyCarbs = 0;
            let dailyCalories = 0;

            // Add breakfast nutrition
            if (day.breakfast) {
                dailyProtein += day.breakfast.protein || 0;
                dailyCarbs += day.breakfast.carbs || 0;
                dailyCalories += day.breakfast.calories || 0;
            }

            // Add lunch nutrition
            if (day.lunch) {
                dailyProtein += day.lunch.protein || 0;
                dailyCarbs += day.lunch.carbs || 0;
                dailyCalories += day.lunch.calories || 0;
            }

            // Add dinner nutrition
            if (day.dinner) {
                dailyProtein += day.dinner.protein || 0;
                dailyCarbs += day.dinner.carbs || 0;
                dailyCalories += day.dinner.calories || 0;
            }

            // Add snacks nutrition
            if (day.snacks && Array.isArray(day.snacks)) {
                day.snacks.forEach(snack => {
                    dailyProtein += snack.protein || 0;
                    dailyCarbs += snack.carbs || 0;
                    dailyCalories += snack.calories || 0;
                });
            }

            nutritionData.protein.push(dailyProtein);
            nutritionData.carbs.push(dailyCarbs);
            nutritionData.calories.push(dailyCalories);
            nutritionData.days.push(`Day ${index + 1}`);
        });

        return nutritionData;
    }
}; 