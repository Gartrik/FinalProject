import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoritesSlice";

export default function CustomRecipesScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const route = useRoute();
  const { recipe } = route.params || {};

  const favoriteRecipe = useSelector(
    (state) => state.favorites.favoriterecipes
  );

  const isFavourite = recipe && favoriteRecipe.includes(recipe.idFood);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No Recipe Details Available</Text>
      </View>
    );
  }

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(recipe));
  };

  const formattedInstructions = recipe.recipeInstructions
    ? recipe.recipeInstructions.replace(/\r\n|\r/g, "\n").split("\n")
    : ["No instructions provided."];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Recipe Image */}
      <View style={styles.imageContainer}>
        {recipe.recipeImage ? (
          <Image source={{ uri: recipe.recipeImage }} style={styles.recipeImage} />
        ) : (
          <Text style={styles.placeholderText}>No Image Available</Text>
        )}
      </View>

      {/* Top Buttons */}
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.favoriteButton}
        >
          <Text>{isFavourite ? "♥" : "♡"}</Text>
        </TouchableOpacity>
      </View>

      {/* Recipe Details */}
      <View style={styles.contentContainer}>
        {/* Recipe Name */}
        <Text style={styles.recipeTitle}>{recipe.recipeName || "Untitled Recipe"}</Text>

        {/* Recipe ID */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recipe ID</Text>
          <Text style={styles.contentText}>{recipe.idFood}</Text>
        </View>

        {/* Ingredients */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ing, index) => (
              <Text key={index} style={styles.contentText}>
                - {ing.ingredientName}: {ing.measure}
              </Text>
            ))
          ) : (
            <Text style={styles.contentText}>No ingredients available</Text>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {formattedInstructions.map((line, index) => (
            <Text key={index} style={styles.contentText}>
              {line}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  recipeImage: {
    width: wp(98),
    height: hp(50),
    borderRadius: 35,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginTop: 4,
  },
  placeholderText: {
    textAlign: "center",
    fontSize: hp(2),
    color: "#9CA3AF",
    marginTop: hp(5),
  },
  contentContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
  },
  recipeTitle: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: hp(2),
  },
  sectionContainer: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: hp(1),
  },
  topButtonsContainer: {
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(4),
  },
  backButton: {
    padding: 8,
    borderRadius: 50,
    marginLeft: wp(5),
    backgroundColor: "white",
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 50,
    marginRight: wp(5),
    backgroundColor: "white",
  },
  contentText: {
    fontSize: hp(1.8),
    color: "#4B5563",
    marginBottom: 5,
  },
});
