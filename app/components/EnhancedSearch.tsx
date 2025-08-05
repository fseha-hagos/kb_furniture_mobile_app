import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface SearchFilter {
  category: string;
  priceRange: string;
  color: string;
  material: string;
  sortBy: string;
}

interface EnhancedSearchProps {
  onSearch: (query: string, filters: SearchFilter) => void;
  searchHistory: string[];
  onClearHistory: () => void;
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({ 
  onSearch, 
  searchHistory, 
  onClearHistory 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({
    category: '',
    priceRange: '',
    color: '',
    material: '',
    sortBy: 'relevance'
  });

  const categories: FilterOption[] = [
    { id: 'all', label: 'All Categories', value: '' },
    { id: 'sofas', label: 'Sofas & Couches', value: 'sofa' },
    { id: 'chairs', label: 'Chairs', value: 'chair' },
    { id: 'tables', label: 'Tables', value: 'table' },
    { id: 'beds', label: 'Beds', value: 'bed' },
    { id: 'storage', label: 'Storage', value: 'storage' },
    { id: 'lighting', label: 'Lighting', value: 'lighting' },
  ];

  const priceRanges: FilterOption[] = [
    { id: 'all', label: 'All Prices', value: '' },
    { id: 'under100', label: 'Under Birr 100', value: '0-100' },
    { id: '100-300', label: 'Birr 100 - Birr 300', value: '100-300' },
    { id: '300-500', label: 'Birr 300 - Birr 500', value: '300-500' },
    { id: '500-1000', label: 'Birr 500 - Birr 1000', value: '500-1000' },
    { id: 'over1000', label: 'Over Birr 1000', value: '1000+' },
  ];

  const colors: FilterOption[] = [
    { id: 'all', label: 'All Colors', value: '' },
    { id: 'black', label: 'Black', value: 'black' },
    { id: 'white', label: 'White', value: 'white' },
    { id: 'brown', label: 'Brown', value: 'brown' },
    { id: 'gray', label: 'Gray', value: 'gray' },
    { id: 'blue', label: 'Blue', value: 'blue' },
    { id: 'green', label: 'Green', value: 'green' },
  ];

  const materials: FilterOption[] = [
    { id: 'all', label: 'All Materials', value: '' },
    { id: 'wood', label: 'Wood', value: 'wood' },
    { id: 'leather', label: 'Leather', value: 'leather' },
    { id: 'fabric', label: 'Fabric', value: 'fabric' },
    { id: 'metal', label: 'Metal', value: 'metal' },
    { id: 'plastic', label: 'Plastic', value: 'plastic' },
  ];

  const sortOptions: FilterOption[] = [
    { id: 'relevance', label: 'Relevance', value: 'relevance' },
    { id: 'price-low', label: 'Price: Low to High', value: 'price-asc' },
    { id: 'price-high', label: 'Price: High to Low', value: 'price-desc' },
    { id: 'newest', label: 'Newest First', value: 'newest' },
    { id: 'rating', label: 'Highest Rated', value: 'rating' },
  ];

  const popularSearches = [
    'Modern sofa',
    'Dining table',
    'Bed frame',
    'Office chair',
    'Coffee table',
    'Bookshelf',
    'Dresser',
    'Nightstand'
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery, filters);
    }
  };

  const handleFilterChange = (filterType: keyof SearchFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      color: '',
      material: '',
      sortBy: 'relevance'
    });
  };

  const FilterSection = ({ title, options, selectedValue, onSelect }: any) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((option: FilterOption) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterChip,
              selectedValue === option.value && styles.filterChipActive
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
              styles.filterChipText,
              selectedValue === option.value && styles.filterChipTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const SearchHistoryItem = ({ query }: { query: string }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => {
        setSearchQuery(query);
        onSearch(query, filters);
      }}
    >
      <Ionicons name="time-outline" size={16} color="#666" />
      <Text style={styles.historyText}>{query}</Text>
    </TouchableOpacity>
  );

  const PopularSearchItem = ({ query }: { query: string }) => (
    <TouchableOpacity 
      style={styles.popularItem}
      onPress={() => {
        setSearchQuery(query);
        onSearch(query, filters);
      }}
    >
      <Text style={styles.popularText}>{query}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for furniture..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color="#00685C" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <FilterSection
              title="Category"
              options={categories}
              selectedValue={filters.category}
              onSelect={(value: string) => handleFilterChange('category', value)}
            />
            
            <FilterSection
              title="Price Range"
              options={priceRanges}
              selectedValue={filters.priceRange}
              onSelect={(value: string) => handleFilterChange('priceRange', value)}
            />
            
            <FilterSection
              title="Color"
              options={colors}
              selectedValue={filters.color}
              onSelect={(value: string) => handleFilterChange('color', value)}
            />
            
            <FilterSection
              title="Material"
              options={materials}
              selectedValue={filters.material}
              onSelect={(value: string) => handleFilterChange('material', value)}
            />
            
            <FilterSection
              title="Sort By"
              options={sortOptions}
              selectedValue={filters.sortBy}
              onSelect={(value: string) => handleFilterChange('sortBy', value)}
            />
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.applyFiltersButton}
            onPress={() => {
              handleSearch();
              setShowFilters(false);
            }}
          >
            <Text style={styles.applyFiltersText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Content */}
      {!showFilters && (
        <ScrollView style={styles.searchContent} showsVerticalScrollIndicator={false}>
          {/* Search History */}
          {searchHistory.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={onClearHistory}>
                  <Text style={styles.clearHistoryText}>Clear</Text>
                </TouchableOpacity>
              </View>
              {searchHistory.map((query, index) => (
                <SearchHistoryItem key={index} query={query} />
              ))}
            </View>
          )}

          {/* Popular Searches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.popularSearches}>
              {popularSearches.map((query, index) => (
                <PopularSearchItem key={index} query={query} />
              ))}
            </View>
          </View>

          {/* Quick Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Browse by Category</Text>
            <View style={styles.categoryGrid}>
              {categories.slice(1, 5).map((category) => (
                <TouchableOpacity 
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => {
                    setSearchQuery(category.label);
                    handleFilterChange('category', category.value);
                    onSearch(category.label, { ...filters, category: category.value });
                  }}
                >
                  <View style={styles.categoryIcon}>
                    <Ionicons name="grid-outline" size={24} color="#00685C" />
                  </View>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    maxHeight: 400,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#00685C',
  },
  filterSection: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  filterChipActive: {
    backgroundColor: '#00685C',
    borderColor: '#00685C',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  applyFiltersButton: {
    backgroundColor: '#00685C',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyFiltersText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContent: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearHistoryText: {
    fontSize: 14,
    color: '#00685C',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  popularSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  popularItem: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  popularText: {
    fontSize: 14,
    color: '#333',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default EnhancedSearch; 