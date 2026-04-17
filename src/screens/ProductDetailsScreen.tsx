import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function ProductDetailsScreen({ route }: any) {
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.thumbnail }} style={styles.image} />

      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
      <Text style={styles.desc}>{product.description}</Text>
  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  price: {
    fontSize: 18,
    color: 'green',
    marginVertical: 5,
  },
  desc: {
    fontSize: 14,
    color: '#444',
    marginTop: 10,
  },
});