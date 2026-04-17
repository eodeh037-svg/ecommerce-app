import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setSearchQuery } from '../redux/productSlice';
import type { RootState, AppDispatch } from '../redux/store';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { addToCart } from '../redux/cartSlice';
export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const navigation = useNavigation<NavProp>();
  const { products, loading, searchQuery, page } = useSelector(
    (state: RootState) => state.products
  );

 
  useEffect(() => {
    dispatch(fetchProducts(0));
  }, []);


  const filteredProducts = products.filter((item: any) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadMore = () => {
    dispatch(fetchProducts(page));
  };

  return (
    <View style={styles.container}>
      
   
      <TextInput
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={(text) => dispatch(setSearchQuery(text))}
        style={styles.search}
      />

      {/* PRODUCT LIST */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
  style={styles.card}
  onPress={() =>
    navigation.navigate('Details', { product: item })
  }
>
  <Text style={styles.title}>{item.title}</Text>
  <Text>₹{item.price}</Text>

  <TouchableOpacity
    onPress={() => dispatch(addToCart(item))}
    style={styles.cart}
  >
    <Text style={{ color: 'white' }}>+</Text>
  </TouchableOpacity>
</TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  cart:{
     marginTop: 10,
      backgroundColor: 'black',
      padding: 8,
      borderRadius: 6,

  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});