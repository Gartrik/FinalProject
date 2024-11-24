import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeId } = route.params || {};

  const [recipeName, setRecipeName] = useState(recipeToEdit ? recipeToEdit.recipeName : "");
  const [recipeImage, setRecipeImage] = useState(recipeToEdit ? recipeToEdit.recipeImage : "");
  const [ingredients, setIngredients] = useState(
    recipeToEdit ? recipeToEdit.ingredients.map((ing) => `${ing.ingredientName}: ${ing.measure}`).join("\n") : ""
  );
  const [description, setDescription] = useState(recipeToEdit ? recipeToEdit.recipeInstructions : "");
  const [idFood, setIdFood] = useState(100);

  useEffect(() => {
    const getNextId = async () => {
      const lastId = await AsyncStorage.getItem("lastIdFood");
      setIdFood(lastId ? parseInt(lastId, 10) + 1 : 100);
    };

    if (!recipeToEdit) {
      getNextId();
    }
  }, [recipeToEdit]);

  const saveRecipe = async () => {
  	if (!recipeName || !recipeImage || !ingredients || !description) {
      Alert.alert("Validation Error", "All fields must be filled before saving.");
      return;
    }
    const newRecipe = {
      idFood: recipeToEdit ? recipeToEdit.idFood : idFood,
      recipeName,
      recipeImage,
      recipeInstructions: description,
      ingredients: ingredients.split("\n").map((line) => {
        const [ingredientName, measure] = line.split(":").map((str) => str.trim());
        return { ingredientName, measure };
      }),
    };

    try {
      await AsyncStorage.setItem(`recipe_${newRecipe.idFood}`, JSON.stringify(newRecipe));

      if (!recipeToEdit) {
        await AsyncStorage.setItem("lastIdFood", newRecipe.idFood.toString());
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error saving the recipe:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"Back"}</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Recipe name"
        value={recipeName}
        onChangeText={setRecipeName}
        style={styles.input}
      />
      <TextInput
        placeholder="Recipe Image URL"
        value={recipeImage}
        onChangeText={setRecipeImage}
        style={styles.input}
      />
      {recipeImage ? (
        <Image source={{ uri: recipeImage }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
      )}
      <TextInput
        placeholder="Ingredients list (e.g., Beef: 1kg) Add each ingredient on a new line."
        value={ingredients}
        onChangeText={setIngredients}
        multiline={true}
        numberOfLines={6}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />
      <TextInput
        placeholder="Recipe Instructions"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={6}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />
      <TouchableOpacity onPress={saveRecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  input: {
    marginTop: hp(4),
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(.5),
    marginVertical: hp(1),
  },
  image: {
    width: 300,
    height:200,
    margin: wp(2),
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    padding: wp(2),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(.5),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
      marginBottom: hp(1.5),
    },
    backButtonText: {
      fontSize: hp(2.2),
      color: "#4F75FF",
    },
});
