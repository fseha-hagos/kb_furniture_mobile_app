# KB Furniture App - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Structure](#architecture--structure)
3. [Authentication System](#authentication-system)
4. [Core Components](#core-components)
5. [Enhanced Features](#enhanced-features)
6. [Data Management](#data-management)
7. [Navigation Structure](#navigation-structure)
8. [API Integration](#api-integration)
9. [State Management](#state-management)
10. [UI/UX Guidelines](#uiux-guidelines)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Guide](#deployment-guide)
13. [Troubleshooting](#troubleshooting)
14. [Future Enhancements](#future-enhancements)

---

## 🏗️ Project Overview

### **Description**

KB Furniture is a comprehensive e-commerce mobile application built with React Native and Expo, specializing in furniture sales. The app provides a complete shopping experience with advanced features like personalized recommendations, order tracking, and customer support.

### **Key Features**

- 🔐 Secure authentication with Clerk
- 🛒 Advanced shopping cart with smart suggestions
- 📊 Personalized user dashboard
- 🔍 Advanced search with filters
- 📦 Order tracking and management
- 💬 Comprehensive support system
- 🔔 Real-time notifications
- ⚙️ User preferences and settings

### **Tech Stack**

- **Frontend**: React Native, Expo
- **Authentication**: Clerk
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **Navigation**: Expo Router
- **UI Components**: Custom components with React Native
- **Icons**: Expo Vector Icons (Ionicons)

---

## 🏛️ Architecture & Structure

### **Project Structure**

```
kb-furniture/
├── app/
│   ├── (auth)/                 # Authenticated routes
│   │   ├── (screens)/         # Protected screens
│   │   └── (tabs)/           # Tab navigation
│   ├── (public)/              # Public routes
│   ├── components/            # Reusable components
│   ├── context/              # State management
│   ├── hooks/                # Custom hooks
│   └── utils/                # Utility functions
├── assets/                   # Images, fonts, logos
├── constants/                # App constants
├── types/                    # TypeScript definitions
└── firebaseConfig.ts         # Firebase configuration
```

### **File Organization**

- **Components**: Modular, reusable UI components
- **Screens**: Page-level components with business logic
- **Context**: Global state management
- **Hooks**: Custom React hooks for shared logic
- **Utils**: Helper functions and utilities

---

## 🔐 Authentication System

### **Clerk Integration**

```typescript
// Authentication hooks
import { useAuth, useUser, useClerk } from "@clerk/clerk-expo";

// Usage in components
const { isSignedIn, isLoaded } = useAuth();
const { user } = useUser();
const { signOut } = useClerk();
```

### **Protected Routes**

```typescript
// RequireAuth component
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) {
    router.replace("/login");
    return null;
  }

  return <>{children}</>;
}
```

### **Authentication Flow**

1. **Public Routes**: Login, Register, Onboarding
2. **Protected Routes**: Dashboard, Cart, Profile, Orders
3. **Role-Based Access**: Admin features for authorized users

---

## 🧩 Core Components

### **1. Navbar Component**

```typescript
// app/components/navbar.tsx
interface NavbarProps {
  title: string;
  showBack: boolean;
  showSearch: boolean;
  onSearch?: (query: string) => void;
}
```

**Features:**

- Dynamic advertising messages
- Cart indicator with item count
- Search functionality
- Back navigation
- Responsive design

### **2. Cart Context**

```typescript
// app/context/cartContext.tsx
interface AuthProps {
  totalPrice?: number;
  carts?: cartType[];
  onAddToCart?: (item: productsType, selectedColor: string) => Promise<void>;
  deleteFromCart?: (item: productsType) => Promise<void>;
  handleLiked?: (item: productsType) => Promise<void>;
  refreshCart?: () => Promise<void>;
  likedProducts?: productsType[];
}
```

**State Management:**

- Cart items with quantities
- Total price calculation
- Liked products management
- AsyncStorage persistence

### **3. Product Cards**

```typescript
// app/components/productCards.tsx
interface ProductCardProps {
  product: productsType;
  onPress: () => void;
  showLikeButton?: boolean;
}
```

**Features:**

- Product image display
- Price and discount indicators
- Like/unlike functionality
- Add to cart button
- Color selection

---

## 🚀 Enhanced Features

### **1. User Dashboard**

```typescript
// app/components/UserDashboard.tsx
interface DashboardStats {
  ordersCount: number;
  favoritesCount: number;
  reviewsCount: number;
  totalSpent: number;
}
```

**Components:**

- **Stat Cards**: Visual metrics display
- **Quick Actions**: Direct navigation buttons
- **Recent Orders**: Horizontal scrollable cards
- **Recommendations**: Personalized product suggestions

### **2. Enhanced Cart**

```typescript
// app/components/EnhancedCart.tsx
interface CartItem {
  product: any;
  quantity: number;
  selectedColor: string;
}
```

**Features:**

- **Smart Suggestions**: Related products
- **Promo Code System**: Discount application
- **Order Summary**: Detailed cost breakdown
- **Quantity Management**: Add/remove with confirmation
- **Free Shipping Indicator**: Progress towards free shipping

### **3. Advanced Search**

```typescript
// app/components/EnhancedSearch.tsx
interface SearchFilter {
  category: string;
  priceRange: string;
  color: string;
  material: string;
  sortBy: string;
}
```

**Filter Options:**

- **Categories**: Sofas, Chairs, Tables, Beds, Storage, Lighting
- **Price Ranges**: Under $100, $100-$300, $300-$500, etc.
- **Colors**: Black, White, Brown, Gray, Blue, Green
- **Materials**: Wood, Leather, Fabric, Metal, Plastic
- **Sort Options**: Relevance, Price, Newest, Rating

### **4. Order Management**

```typescript
// app/(auth)/(screens)/orders.tsx
interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}
```

**Order Features:**

- **Status Tracking**: Visual status indicators
- **Order Actions**: Cancel, reorder, review
- **Tracking Information**: Shipping details
- **Filter System**: By status with counts

### **5. Notifications System**

```typescript
// app/(auth)/(screens)/notifications.tsx
interface Notification {
  id: string;
  type: "order" | "promotion" | "system" | "price-drop";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
```

**Notification Types:**

- **Order Updates**: Shipping, delivery confirmations
- **Promotions**: Special offers and discounts
- **Price Drops**: Items on wishlist price changes
- **System Messages**: App updates and announcements

### **6. Settings Management**

```typescript
// app/(auth)/(screens)/settings.tsx
interface SettingsSection {
  account: SettingItem[];
  preferences: SettingItem[];
  support: SettingItem[];
  privacy: SettingItem[];
}
```

**Settings Categories:**

- **Account**: Profile, payment methods, addresses
- **Preferences**: Notifications, theme, language
- **Support**: Help, terms, privacy policy
- **Privacy**: Data export, cache management

### **7. Help & Support**

```typescript
// app/(auth)/(screens)/support.tsx
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
```

**Support Features:**

- **FAQ System**: Categorized questions with search
- **Contact Options**: Phone, email, live chat, WhatsApp
- **Quick Actions**: Return policy, warranty, shipping info
- **Support Categories**: Orders, shipping, returns, payment

---

## 📊 Data Management

### **AsyncStorage Implementation**

```typescript
// Cart data persistence
const loadCartItems = async () => {
  let getCarts = await AsyncStorage.getItem("carts");
  let savedCarts = getCarts ? JSON.parse(getCarts) : [];
  setCarts(savedCarts);
  totalSum(savedCarts);
};

const addToCart = async (item: productsType, selectedColor: string) => {
  const updatedCarts = [
    ...carts,
    { product: item, quantity: 1, selectedColor },
  ];
  setCarts(updatedCarts);
  await AsyncStorage.setItem("carts", JSON.stringify(updatedCarts));
};
```

### **Data Models**

```typescript
// types/type.ts
export interface productsType {
  productId: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  colors: string[];
  specifications: ProductSpec[];
}

export interface cartType {
  product: productsType;
  quantity: number;
  selectedColor: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
}

export interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}
```

---

## 🧭 Navigation Structure

### **Route Configuration**

```typescript
// App navigation structure
app/
├── (public)/
│   ├── login.tsx
│   ├── register.tsx
│   ├── onBoarding.tsx
│   └── logoutHomeScreen.tsx
├── (auth)/
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   ├── search.tsx
│   │   ├── favorites.tsx
│   │   └── profile.tsx
│   └── (screens)/
│       ├── product.tsx
│       ├── cart.tsx
│       ├── orders.tsx
│       ├── notifications.tsx
│       ├── settings.tsx
│       ├── support.tsx
│       └── termsAndConditions.tsx
```

### **Navigation Guards**

```typescript
// Protected route wrapper
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) {
    router.replace("/login");
    return null;
  }

  return <>{children}</>;
}
```

### **Route Navigation Examples**

```typescript
// Correct navigation patterns
router.push("/(auth)/(tabs)/home"); // Home tab
router.push("/(auth)/(screens)/product"); // Product detail
router.push("/(auth)/(screens)/cart"); // Cart page
router.push("/(auth)/(screens)/orders"); // Order history
router.push("/(auth)/(screens)/settings"); // Settings page
router.push("/(auth)/(screens)/support"); // Support page
router.push("/(auth)/(screens)/notifications"); // Notifications
```

---

## 🔌 API Integration

### **Firebase Configuration**

```typescript
// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-domain.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-bucket.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### **Data Fetching Patterns**

```typescript
// Custom hooks for data fetching
export const useProducts = () => {
  const [products, setProducts] = useState<productsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // API call implementation
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, refetch: fetchProducts };
};
```

### **API Endpoints Structure**

```typescript
// API endpoints mapping
const API_ENDPOINTS = {
  // Products
  products: "/products",
  productById: (id: string) => `/products/${id}`,
  productsByCategory: (category: string) => `/products?category=${category}`,

  // Orders
  orders: "/orders",
  orderById: (id: string) => `/orders/${id}`,
  createOrder: "/orders",
  updateOrder: (id: string) => `/orders/${id}`,

  // User
  userProfile: "/user/profile",
  userOrders: "/user/orders",
  userFavorites: "/user/favorites",

  // Cart
  cart: "/cart",
  addToCart: "/cart/add",
  removeFromCart: "/cart/remove",

  // Search
  search: (query: string) => `/search?q=${query}`,
  searchWithFilters: (filters: SearchFilter) =>
    `/search?${new URLSearchParams(filters)}`,
};
```

---

## 🏪 State Management

### **Context Providers**

```typescript
// Cart context implementation
export const AuthProvider = ({ children }: any) => {
  const [carts, setCarts] = useState<cartType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [likedProducts, setLikedProducts] = useState<productsType[]>([]);

  const value = {
    totalPrice,
    carts,
    onAddToCart: addToCart,
    deleteFromCart,
    likedProducts,
    handleLiked,
    refreshCart,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### **Custom Hooks**

```typescript
// app/hooks/useUserRole.ts
export const useUserRole = () => {
  const { user } = useUser();
  const [role, setRole] = useState<string>("user");
  const [roleLoaded, setRoleLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch user role from backend
      fetchUserRole();
    }
  }, [user]);

  return { role, roleLoaded };
};

// app/hooks/useBackHandler.ts
export const useBackHandler = (onBackPress: () => boolean) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => backHandler.remove();
  }, [onBackPress]);
};
```

### **State Management Patterns**

```typescript
// Local state management
const [state, setState] = useState<StateType>(initialState);

// Async state management
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<DataType | null>(null);

// Form state management
const [formData, setFormData] = useState<FormData>({});
const [formErrors, setFormErrors] = useState<FormErrors>({});

// List state management
const [items, setItems] = useState<ItemType[]>([]);
const [selectedItems, setSelectedItems] = useState<string[]>([]);
```

---

## 🎨 UI/UX Guidelines

### **Color Scheme**

```typescript
// constants/Colors.ts
export const Colors = {
  primary: "#00685C",
  secondary: "#00897B",
  accent: "#4CAF50",
  background: "#F7F7F7",
  surface: "#FFFFFF",
  text: {
    primary: "#333333",
    secondary: "#666666",
    disabled: "#999999",
  },
  status: {
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",
  },
  orderStatus: {
    pending: "#9E9E9E",
    processing: "#FF9800",
    shipped: "#2196F3",
    delivered: "#4CAF50",
    cancelled: "#F44336",
  },
};
```

### **Typography**

```typescript
// Font sizes and weights
const typography = {
  h1: { fontSize: 24, fontWeight: "bold" },
  h2: { fontSize: 20, fontWeight: "600" },
  h3: { fontSize: 18, fontWeight: "600" },
  body: { fontSize: 16, fontWeight: "400" },
  caption: { fontSize: 14, fontWeight: "400" },
  small: { fontSize: 12, fontWeight: "400" },
};

// Usage in styles
const styles = StyleSheet.create({
  title: {
    ...typography.h1,
    color: Colors.text.primary,
  },
  subtitle: {
    ...typography.h3,
    color: Colors.text.secondary,
  },
});
```

### **Component Patterns**

```typescript
// Standard component structure
const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 1. State management
  const [state, setState] = useState();

  // 2. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 3. Event handlers
  const handlePress = () => {
    // Event logic
  };

  // 4. Render
  return <View style={styles.container}>{/* Component content */}</View>;
};

// Component props interface
interface ComponentProps {
  title: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
```

### **Common UI Components**

```typescript
// Button component
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}) => (
  <TouchableOpacity
    style={[styles.button, styles[variant], disabled && styles.disabled]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[styles.buttonText, styles[`${variant}Text`]]}>{title}</Text>
  </TouchableOpacity>
);

// Card component
const Card: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// Loading component
const LoadingSpinner: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={Colors.primary} />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);
```

---

## 🧪 Testing Strategy

### **Component Testing**

```typescript
// Example test structure
describe("UserDashboard", () => {
  it("should render dashboard stats correctly", () => {
    const stats = {
      ordersCount: 5,
      favoritesCount: 3,
      reviewsCount: 2,
      totalSpent: 1500,
    };

    render(<UserDashboard stats={stats} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should handle empty orders gracefully", () => {
    const stats = {
      ordersCount: 0,
      favoritesCount: 0,
      reviewsCount: 0,
      totalSpent: 0,
    };
    render(<UserDashboard stats={stats} recentOrders={[]} />);
    expect(screen.getByText("No recent orders")).toBeInTheDocument();
  });
});
```

### **Integration Testing**

```typescript
// Cart functionality testing
describe("Cart Integration", () => {
  it("should add item to cart", async () => {
    const product = mockProduct;
    const { getByText } = render(<ProductCard product={product} />);

    fireEvent.press(getByText("Add to Cart"));

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(product);
    });
  });

  it("should update total price when items are added", () => {
    const { getByText } = render(<EnhancedCart />);

    fireEvent.press(getByText("Add to Cart"));

    expect(getByText("$299.99")).toBeInTheDocument();
  });
});
```

### **API Testing**

```typescript
// Mock API responses
const mockProducts = [
  { id: "1", name: "Modern Sofa", price: 299.99 },
  { id: "2", name: "Dining Table", price: 449.99 },
];

// Test API calls
describe("Product API", () => {
  it("should fetch products successfully", async () => {
    mockApi.get("/products").mockResolvedValue({ data: mockProducts });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.loading).toBe(false);
    });
  });
});
```

---

## 🚀 Deployment Guide

### **Expo Build Configuration**

```json
// app.json
{
  "expo": {
    "name": "KB Furniture",
    "slug": "kb-furniture",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#00685C"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.kbfurniture.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#00685C"
      },
      "package": "com.kbfurniture.app"
    }
  }
}
```

### **Build Commands**

```bash
# Development
npm start

# Build for production
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android

# Local development
expo start --dev-client
```

### **Environment Configuration**

```typescript
// Environment variables
const ENV = {
  development: {
    API_URL: "http://localhost:3000/api",
    CLERK_PUBLISHABLE_KEY: "pk_test_...",
  },
  production: {
    API_URL: "https://api.kbfurniture.com",
    CLERK_PUBLISHABLE_KEY: "pk_live_...",
  },
};

export const config = ENV[process.env.NODE_ENV || "development"];
```

---

## 🔧 Troubleshooting

### **Common Issues**

#### **1. Navigation Errors**

```typescript
// ❌ Wrong - Causes TypeScript errors
router.push("/orders");

// ✅ Correct - Use proper route paths
router.push("/(auth)/(screens)/orders");
```

#### **2. TypeScript Errors**

```typescript
// ❌ Missing type definitions
const Component = ({ title }) => {
  return <Text>{title}</Text>;
};

// ✅ Proper TypeScript interface
interface ComponentProps {
  title: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({ title, onPress, children }) => {
  return <Text>{title}</Text>;
};
```

#### **3. AsyncStorage Issues**

```typescript
// ❌ No error handling
const loadData = async () => {
  const data = await AsyncStorage.getItem("key");
  return JSON.parse(data);
};

// ✅ Proper error handling
const loadData = async () => {
  try {
    const data = await AsyncStorage.getItem("key");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
};
```

#### **4. State Management Issues**

```typescript
// ❌ Direct state mutation
const updateCart = (item) => {
  carts.push(item); // This won't trigger re-render
};

// ✅ Proper state updates
const updateCart = (item) => {
  setCarts((prevCarts) => [...prevCarts, item]);
};
```

### **Performance Optimization**

```typescript
// 1. Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <View>{/* Component content */}</View>;
});

// 2. Use useCallback for event handlers
const handlePress = useCallback(() => {
  // Handler logic
}, [dependencies]);

// 3. Optimize list rendering
const renderItem = useCallback(
  ({ item }) => <ProductCard product={item} />,
  []
);

// 4. Lazy load components
const LazyComponent = lazy(() => import("./LazyComponent"));

// 5. Optimize images
const OptimizedImage = ({ source, style }) => (
  <Image source={source} style={style} resizeMode="cover" fadeDuration={0} />
);
```

### **Debugging Tips**

```typescript
// 1. Console logging
console.log("Component rendered with props:", props);
console.log("State updated:", state);

// 2. React DevTools
// Install react-devtools for debugging

// 3. Network debugging
const logApiCall = async (url, options) => {
  console.log("API Call:", url, options);
  try {
    const response = await fetch(url, options);
    console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// 4. Performance monitoring
const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      console.log(`${componentName} render time:`, endTime - startTime);
    };
  });
};
```

---

## 📈 Future Enhancements

### **Planned Features**

#### **1. Payment Integration**

```typescript
// Stripe integration
import { CardField, useStripe } from "@stripe/stripe-react-native";

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();

  const handlePayment = async () => {
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: "Card",
    });
  };
};
```

#### **2. Push Notifications**

```typescript
// Push notification setup
import * as Notifications from "expo-notifications";

const setupNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Permission not granted for notifications");
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  // Send token to backend
};
```

#### **3. AR Furniture Preview**

```typescript
// AR integration with ViroReact
import { ViroARScene, ViroText } from "react-viro";

const ARFurniturePreview = () => {
  return (
    <ViroARScene>
      <ViroText
        text="Modern Sofa"
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
      />
    </ViroARScene>
  );
};
```

#### **4. Social Features**

```typescript
// Review and rating system
interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: Date;
}

// Social sharing
import * as Sharing from "expo-sharing";

const shareProduct = async (product) => {
  const message = `Check out this amazing ${product.name} on KB Furniture!`;
  await Sharing.shareAsync(message);
};
```

#### **5. Loyalty Program**

```typescript
// Points system
interface LoyaltyPoints {
  userId: string;
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  rewards: Reward[];
}

const calculatePoints = (orderTotal: number) => {
  return Math.floor(orderTotal * 0.1); // 10% of order value
};
```

#### **6. Multi-language Support**

```typescript
// Internationalization
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
};

i18n.use(initReactI18next).init({ resources, lng: "en" });
```

#### **7. Dark Mode**

```typescript
// Theme context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

#### **8. Offline Support**

```typescript
// Offline data sync
import NetInfo from "@react-native-community/netinfo";

const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });

    return unsubscribe;
  }, []);

  return { isOnline };
};
```

### **Scalability Considerations**

#### **1. Microservices Architecture**

```typescript
// Service separation
const services = {
  auth: "https://auth.kbfurniture.com",
  products: "https://products.kbfurniture.com",
  orders: "https://orders.kbfurniture.com",
  payments: "https://payments.kbfurniture.com",
};
```

#### **2. CDN Integration**

```typescript
// Image optimization
const getOptimizedImageUrl = (imageUrl: string, width: number) => {
  return `${CDN_BASE_URL}/images/${imageUrl}?w=${width}&q=80`;
};
```

#### **3. Caching Strategy**

```typescript
// Redis caching
const cacheKey = `product:${productId}`;
const cachedProduct = await redis.get(cacheKey);

if (!cachedProduct) {
  const product = await fetchProduct(productId);
  await redis.setex(cacheKey, 3600, JSON.stringify(product));
}
```

#### **4. Database Optimization**

```typescript
// Indexing strategy
// MongoDB indexes
db.products.createIndex({ category: 1, price: 1 });
db.products.createIndex({ name: "text" });
db.orders.createIndex({ userId: 1, createdAt: -1 });
```

---

## 📞 Support & Maintenance

### **Contact Information**

- **Developer**: [Your Name]
- **Email**: [your-email@domain.com]
- **GitHub**: [github-username]
- **Documentation**: [docs-url]

### **Maintenance Schedule**

- **Weekly**: Security updates and bug fixes
- **Monthly**: Feature updates and performance optimization
- **Quarterly**: Major version releases
- **Annually**: Architecture review and refactoring

### **Monitoring & Analytics**

```typescript
// Error tracking
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});

// Analytics
import analytics from "@react-native-firebase/analytics";

const trackEvent = (eventName: string, parameters?: object) => {
  analytics.logEvent(eventName, parameters);
};
```

---

## 📚 Additional Resources

### **Useful Links**

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **Development Tools**

- **React DevTools**: For component debugging
- **Flipper**: For network and performance debugging
- **Metro Bundler**: For bundling and hot reloading
- **ESLint**: For code quality and consistency

### **Best Practices**

1. **Code Organization**: Keep components small and focused
2. **Type Safety**: Use TypeScript for all new code
3. **Performance**: Optimize renders and bundle size
4. **Testing**: Write tests for critical functionality
5. **Documentation**: Keep documentation up to date
6. **Security**: Validate all user inputs
7. **Accessibility**: Follow WCAG guidelines

---

This comprehensive documentation provides a complete reference for the KB Furniture app, covering all aspects from development to deployment. It serves as a guide for developers, maintainers, and stakeholders involved in the project.
