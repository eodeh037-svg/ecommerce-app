import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { addToCart } from '../redux/cartSlice';

type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  thumbnail?: string;
};

type Props = {
  route: {
    params: {
      product: Product;
    };
  };
};

export default function ProductDetailsScreen({ route }: Props) {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const product = route?.params?.product;

  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: product?.title || 'Product Details',
      headerTitleStyle: {
        fontWeight: '800',
        fontSize: 16,
      },
      headerShadowVisible: false,
    });
  }, [navigation, product]);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    Alert.alert(
      'Added to Cart 🛒',
      `${product.title} has been added successfully`
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

     
        <Image
          source={{
            uri: product.thumbnail || 'https://via.placeholder.com/500',
          }}
          style={styles.image}
        />

      
        <View style={styles.card}>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.row}>
            <Text style={styles.price}>₹{product.price}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>In Stock</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>

          <Text style={styles.desc}>
            {product.description ||
              'This product is carefully selected to give you premium quality, durability, and great user experience.'}
          </Text>
        </View>
      
      {/* BOTTOM ACTION BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.9}
        >
          <Text style={styles.cartText}>Add to Cart 🛒</Text>
        </TouchableOpacity>
      </View>
       </ScrollView>
    </View>
   

  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },

  image: {
    width: '100%',
    height: 340,
    resizeMode: 'cover',
  },

  card: {
    backgroundColor: '#fff',
    marginTop: -25,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111',
    lineHeight: 28,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  price: {
    fontSize: 20,
    fontWeight: '900',
    color: '#16a34a',
  },

  badge: {
    backgroundColor: '#e8f9ef',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  badgeText: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 12,
  },

  sectionTitle: {
    marginTop: 18,
    fontSize: 15,
    fontWeight: '800',
    color: '#222',
  },

  desc: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },

  bottomBar: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },

  cartBtn: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  cartText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red',
  },
});