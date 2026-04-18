import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProducts, setSearchQuery } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';

import type { RootState, AppDispatch } from '../redux/store';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();

  const { products, loading, searchQuery, page } = useSelector(
    (state: RootState) => state.products
  );

  const cart = useSelector((state: RootState) => state.cart.items);

  const isFetchingMore = useRef(false);

  useEffect(() => {
    dispatch(fetchProducts(0));
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    return products.filter((item: any) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const showLoader = loading && !isSearching;

  const loadMore = async () => {
    if (loading || isFetchingMore.current || isSearching) return;

    isFetchingMore.current = true;

    try {
      await dispatch(fetchProducts(page)).unwrap();
    } catch (err) {
      console.log('Pagination error:', err);
    } finally {
      isFetchingMore.current = false;
    }
  };

  const handleAddToCart = (item: any) => {
    dispatch(addToCart(item));
    Alert.alert('Added 🛒', `${item.title} added to cart`);
  };

  const isEmptySearch = isSearching && filteredProducts.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🛍️ EojShop</Text>

      <TextInput
        placeholder="Search for products, brands..."
        value={searchQuery}
        onChangeText={(text) => dispatch(setSearchQuery(text))}
        style={styles.search}
        placeholderTextColor="#999"
      />

   
      <TouchableOpacity
        style={styles.floatingCart}
        onPress={() => navigation.navigate('Cart')}
      >
        <Text style={styles.cartIcon}>🛒</Text>

        {cart.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cart.length}</Text>
          </View>
        )}
      </TouchableOpacity>

   
      {isEmptySearch ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No products found 😢</Text>
          <Text style={styles.emptySub}>
            Try another keyword
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id?.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            showLoader ? (
              <ActivityIndicator size="large" color="#000" />
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.thumbnail }} style={styles.image} />

              <View style={styles.info}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Details', { product: item })
                  }
                >
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>

                  <Text style={styles.price}>₹{item.price}</Text>
                </TouchableOpacity>

                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => handleAddToCart(item)}
                    style={styles.cartBtn}
                  >
                    <Text style={styles.cartText}>Add</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Details', { product: item })
                    }
                    style={styles.viewBtn}
                  >
                    <Text style={styles.viewText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    paddingHorizontal: 14,
    paddingTop: 10,
  },

  header: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111',
    marginBottom: 12,
  },

  search: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  image: {
    width: 110,
    height: 110,
  },

  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#222',
  },

  price: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '900',
    color: '#16a34a',
  },

  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },

  cartBtn: {
    backgroundColor: '#111',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  cartText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },

  viewBtn: {
    borderWidth: 1.5,
    borderColor: '#111',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  viewText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111',
  },

  floatingCart: {
    position: 'absolute',
    top: '5.8%',
    right: 15,
    backgroundColor: '#111',
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 999,
  },

  cartIcon: {
    fontSize: 20,
    color: '#fff',
  },

  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff3b30',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },


  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
  },

  emptySub: {
    marginTop: 6,
    fontSize: 13,
    color: '#777',
  },
});