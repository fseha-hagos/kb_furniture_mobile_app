import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const categories = ['Chairs', 'Sofas', 'Beds', 'Lamps'];


interface myprops{
  selectedCategory: string;
  onSelect: (catagory: string)=> void;
}
const CategoryTabs = ({ selectedCategory, onSelect }: myprops) => {
  return (
    <View style={styles.container}>
      {categories.map((category, index) => {
        const isSelected = category === selectedCategory;
        return (
          <View key={index} style={styles.categoryContainer}>
            <TouchableOpacity onPress={() => onSelect(category)}>
              <Text style={styles.category}>{category}</Text>
            </TouchableOpacity>
            {isSelected && <View style={styles.selectedIndicator} />}
          </View>
        );
      })}
    </View>
  );
};
export default CategoryTabs;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    flexDirection: 'row',
  },
  categoryContainer: {
    alignItems: 'center',
    marginRight: 40,
  },
  category: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
  },
  selectedIndicator: {
    width: 15,
    height: 3,
    backgroundColor: 'black',
    borderRadius: 3,
  },
});
