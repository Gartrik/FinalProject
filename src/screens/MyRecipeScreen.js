import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useNavigation, useFocusEffect } from "@react-navigation/native";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  
export default function MyRecipeScreen() {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const keys = await AsyncStorage.getAllKeys();
      const recipeKeys = keys.filter((key) => key.startsWith("recipe_"));
      const recipeItems = await AsyncStorage.multiGet(recipeKeys);
      const parsedRecipes = recipeItems.map(([key, value]) => JSON.parse(value));
      setRecipes(parsedRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [])
  );

  const handleAddRecipe = () => navigation.navigate("RecipesFormScreen");

  const deleteRecipe = async (idFood) => {
    try {
      const key = `recipe_${idFood}`;
      await AsyncStorage.removeItem(key);
      fetchRecipes();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const editRecipe = (recipe) => {
    navigation.navigate("RecipesFormScreen", {
      recipeToEdit: recipe,
      recipeId: recipe.idFood,
    });
  };

  const viewRecipeDetails = (recipe) => {
    navigation.navigate("RecipeDetail", { ...recipe });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"Back"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAddRecipe} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Recipe</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#f59e0b" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {recipes.length === 0 ? (
            <Text style={styles.noRecipesText}>No recipes added yet.</Text>
          ) : (
            recipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.idFood}
                style={styles.recipeCard}
                onPress={() => viewRecipeDetails(recipe)}
              >
                {recipe.recipeImage && (
                  <Image source={{ uri: recipe.recipeImage }} style={styles.recipeImage} />
                )}
                <Text style={styles.recipeTitle}>{recipe.recipeName}</Text>
                <Text style={styles.recipeDescription}>
                  {recipe.recipeInstructions?.substring(0, 50)}...
                </Text>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    onPress={() => editRecipe(recipe)}
                    style={styles.editButton}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteRecipe(recipe.idFood)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: wp(4),
      backgroundColor: "#F9FAFB",
    },
    backButton: {
      marginBottom: hp(1.5),
    },
    backButtonText: {
      fontSize: hp(2.2),
      color: "#4F75FF",
    },
    addButton: {
      backgroundColor: "#4F75FF",
      padding: wp(.7),
      alignItems: "center",
      borderRadius: 5,
      width:300,
     marginLeft:500
      // marginBottom: hp(2),
    },
    addButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(2.2),
    },
    scrollContainer: {
      paddingBottom: hp(2),
      height:'auto',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'row',
      flexWrap:'wrap'
    },
    norecipesText: {
      textAlign: "center",
      fontSize: hp(2),
      color: "#6B7280",
      marginTop: hp(5),
    },
    recipeCard: {
      width: 400, // Make recipe card width more compact
      height: 350, // Adjust the height of the card to fit content
      backgroundColor: "#fff",
      padding: wp(3),
      borderRadius: 8,
      marginTop: hp(2),
      marginBottom: hp(2),
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3, // for Android shadow
    },
    recipeImage: {
      width: 300, // Set width for recipe image
      height: 150, // Adjust height of the image
      borderRadius: 8,
      marginBottom: hp(1),
    },
    recipeTitle: {
      fontSize: hp(2),
      fontWeight: "600",
      color: "#111827",
      marginBottom: hp(0.5),
    },
    recipeDescription: {
      fontSize: hp(1.8),
      color: "#6B7280",
      marginBottom: hp(1.5),
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: hp(1),
    },
    editButton: {
      backgroundColor: "#34D399",
      padding: wp(.5),
      borderRadius: 5,
      width: 100, // Adjust width of buttons to be more compact
      alignItems: "center",
    },
    editButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.8),
    },
    deleteButton: {
      backgroundColor: "#EF4444",
      padding: wp(.5),
      borderRadius: 5,
      width: 100, // Adjust width of buttons to be more compact
      alignItems: "center",
    },
    deleteButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.8),
    },
  });
  