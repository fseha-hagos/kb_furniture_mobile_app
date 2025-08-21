export interface usersType {
    userId: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    image: string,
    createdAt: string,
    updatedAt: string,
    isAdmin: boolean, 
}

// old product type
// export interface productsType {
//     productId: string,
//     title: string,
//     description: string,
//     price: number,
//     stock: number,
//     categoryId: string,
//     images: string[],
//     colors: string[];
//     variants: {
//         name: string;
//         price: string;
//         stock: number;
//       }[],
//     createdAt: string,
//     updatedAt: string,
// }


export interface productsType {
    productId: string,
    name: {
      "en": string,
      "am": string
    },
    description: {
      "en": string,
      "am": string
    },
    price: number,
    stock: number,
    categoryId: string,
    subCategoryId: string,
    images: string[],
    colors: string[];
    variants: {
        name: string;
        price: number;
        stock: number;
      }[],
    createdAt: string,
    updatedAt: string,
}

export interface cartType {
    product: productsType;
    quantity?: number;
    selectedColor?: string;
}

// old categories type

// export interface categoriesType {
//      categoryId: string,
//      name: string,
//      image: string,
//      parentId: string,
//      createdAt: string,
//      updatedAt: string,
// }
export interface categoriesType {
     categoryId: string,
     name: {
      en: string,
      am: string,
     },
     subcategories: {
      id: string,
      name: {
        en: string,
        am: string,
      },
     }[],
     image: string,
     createdAt: string,
     updatedAt: string,
}

export interface ordersType {
    orderId: string | null,
    userId: string | null,
    productId: string,
    quantity: number,
    totalPrice: number,
    items: object[],
    totalAmount: number,
    status: string,
    address: string,
    createdAt: string,
}

export interface reviewsType {
    reviewId: string,
    userId: string,
    productId: string,
    rating: number,
    comment: string,
    createdAt: string,
    userName: string,
    images?: string[],
}

export interface slidesType {
  id: string;
  image: string;
  title: {
    am: string,
    en: string
  };
  description : {
    am: string,
    en: string
  };
  price: number;
}

export interface marqueeType {
  id: string;
  text: string
}

export interface myProductsFromDatabaseProps {
    id: string,
    title: string,
    price: string,
    category : string[],
    colors: string[],
    desc: string,
    images: string[],
    isNew: boolean,
    rating: number,
}

export interface myProductsFromDatabasePeopsWithId {
  
  id: string,
  catagory : string,
  color: string,
  colors: string[],
  desc: string,
  image: string,
  isNew: boolean,
  price: string,
  rating: number,
  title: string,
  isLiked: boolean,
  totalPurchase : number
  }

export  const  PRODUCT_COLORS = {
      colors : [
      //1. Monochromatic:
"#000000",
"#333333", 
"#666666",
"#999999", 
"#CCCCCC", 

//2. Analogous:


"#D32F2F",
"#E91E63",
"#F44336",
"#FF5722",
"#FF8722",

//3. Complementary:
"#244568",
"#2196F3",
"#03A9F4",

"#FFC107",
"#FF9800",
"#FFEB3B",

//4. Triadic:
"#4CAF50",
"#8BC34A",
"#9C27B0",

//5. Tetradic:
"#D500F9",

  ]}