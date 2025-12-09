const BASE_URL = "https://www.themealdb.com/api/json/v1/1"; // define the base API endpoint URL used for all meal-related fetch operations

export const MealAPI = {
    searchMealsByName: async (query) => { // define an async function that searches meals by name based on a user-provided query
        try { // start a try block to safely handle asynchronous errors
            const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`); // send an HTTP request to the meal API with the encoded query to retrieve matching meals
            const data = await response.json(); // parse the API response body as JSON to extract structured data
            return data.meals || []; // return the meals array if present, otherwise return an empty array to maintain consistent return type
        } catch (error) { // catch any network or parsing errors during the request or JSON conversion
            console.error("Error searching meals by name:", error); // log the error to help diagnose what went wrong during the meal search
            return []; // return an empty array as a fallback to prevent the application from breaking
        }
    }, 

    getMealById: async (id) => { // define an async function that retrieves a meal's details using its unique identifier
        try { // initiate error-handled execution for the asynchronous operation
            const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`); // send an HTTP request to fetch meal data corresponding to the provided id
            const data = await response.json(); // convert the API response into JSON format to access structured meal information
            return data.meals ? data.meals[0] : null; // return the first meal object if available, otherwise return null to signal no matching result
        } catch (error) { // capture failures such as network issues or JSON parsing errors
            console.error("Error getting meal by id:", error); // log the encountered error for debugging and diagnostics
            return null; // return null to maintain consistent failure output without breaking application flow
        }
    },    

    getRandomMeal: async () => { // define an async function that fetches a randomly selected meal from the API
        try { // begin protected execution to handle asynchronous failures
            const response = await fetch(`${BASE_URL}/random.php`); // send an HTTP request to retrieve a random meal from the endpoint
            const data = await response.json(); // parse the response body as JSON to access the structured meal information
            return data.meals ? data.meals[0] : null; // return the random meal object if present, otherwise return null to indicate absence of data
        } catch (error) { // handle network or parsing errors that may occur during the fetch process
            console.error("Error getting random meal:", error); // output error details to aid debugging and diagnostics
            return null; // return null to maintain reliable error-handling behavior for the caller
        }
    },    

    getRandomMeals: async (count = 6) => { // define an async function that retrieves multiple random meals with a default count of 6
        try { // begin controlled execution to catch asynchronous errors
            const promises = Array(count).fill().map(() => MealAPI.getRandomMeal()); // create an array of length 'count' and map each slot to a random-meal fetch promise
            const meals = await Promise.all(promises); // await completion of all random-meal fetch operations to aggregate their results
            return meals.filter((meal) => meal !== null); // remove null entries to return only successfully retrieved meals
        } catch (error) { // capture failures from promise creation or resolution
            console.error("Error getting random meals:", error); // log error information to assist debugging
            return []; // return an empty array to ensure consistent output format when failures occur
        }
    },
    
    getCategories: async () => { // define an async function that fetches the list of meal categories from the API
        try { // start a try block to safely handle asynchronous operations
            const response = await fetch(`${BASE_URL}/categories.php`); // send an HTTP request to retrieve category information from the endpoint
            const data = await response.json(); // parse the response as JSON to extract structured category data
            return data.categories || []; // return the categories array if present, otherwise default to an empty array for reliability
        } catch (error) { // catch any network or JSON parsing errors
            console.error("Error getting categories:", error); // output error details for diagnostic purposes
            return []; // return an empty array to prevent application failures due to missing data
        }
    },    

    filterByIngredient: async (ingredient) => { // define an async function that retrieves meals matching a specific ingredient
        try { // begin protected execution to handle asynchronous failures
            const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`); // send an HTTP request to filter meals by the encoded ingredient value
            const data = await response.json(); // parse the API response as JSON to extract structured meal data
            return data.meals || []; // return the meals array if present, otherwise return an empty array for consistent output
        } catch (error) { // handle network or parsing errors that may occur
            console.error("Error filtering by ingredient:", error); // log the encountered error to support debugging
            return []; // return an empty array to maintain predictable behavior after failure
        }
    },
    
    filterByCategory: async (category) => { // define an async function that retrieves meals belonging to a specified category
        try { // start a try block to manage asynchronous error handling
            const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`); // send an HTTP request to filter meals by the encoded category value
            const data = await response.json(); // parse the response into JSON format to access category-filtered meal data
            return data.meals || []; // return the meals array if available, otherwise return an empty array for stability
        } catch (error) { // catch network failures or issues during JSON parsing
            console.error("Error filtering by category:", error); // output the error details for analysis and debugging
            return []; // return an empty array to prevent failures
        }
    },

    transformMealData: (meal) => { // define a function that converts a raw meal object into a normalized structured format
        if (!meal) return null; // return null immediately when no meal object is provided to avoid processing invalid input
    
        const ingredients = []; // initialize an array to accumulate formatted ingredient–measure pairs
        
        for (let i = 1; i <= 20; i++) { // iterate through the 20 possible ingredient–measure slots defined by the API
            const ingredient = meal[`strIngredient${i}`]; // extract the ingredient name at position i from the meal object
            const measure = meal[`strMeasure${i}`]; // extract the corresponding measure at position i from the meal object
            
            if (ingredient && ingredient.trim()) { // ensure the ingredient exists and is not an empty or whitespace-only string
                const measureText = measure && measure.trim() ? `${measure.trim()} ` : ""; // prepare a measure prefix if defined and non-empty
                ingredients.push(`${measureText}${ingredient.trim()}`); // append the combined measure–ingredient string to the ingredients array
            }
        }
    
        const instructions = meal.strInstructions // verify that instructions exist before processing them
            ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim()) // split instructions into steps and keep only non-empty trimmed lines
            : []; // default to an empty array when the meal contains no instructions

        return {
            id: meal.idMeal,
            title: meal.strMeal,
            description: meal.strInstructions
                ? meal.strInstructions.substring(0, 120) + "..."
                : "Delicious meal from TheMealDB",
            image: meal.strMealThumb,
            cookTime: "30 minutes",
            servings: 4,
            category: meal.strCategory || "Main Course",
            area: meal.strArea,
            ingredients,
            instructions,
            originalData: meal,
        };
    },
};