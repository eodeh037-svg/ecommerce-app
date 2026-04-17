import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert,Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { removeFromCart } from '../redux/cartSlice';
import { saveCartToStorage } from '../storage/ cartStorage';

export default function CartScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.cart);
const [modalIsVisible, setModalIsVisible] = useState(false)
  const total = items.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const handleRemove = (id: number) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => dispatch(removeFromCart(id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 My Cart</Text>

      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add some products to see them here</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.productTitle}>{item.title}</Text>
                  <Text style={styles.price}>${item.price}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleRemove(item.id)}
                  style={styles.removeBtn}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.footer}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>${total}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn}   onPress={() => setModalIsVisible(true)}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <Modal
  visible={modalIsVisible}
  transparent
  animationType="slide"
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>

      <Text style={styles.modalTitle}>🧾 Checkout</Text>

      <Text style={styles.modalText}>
        Items: {items.length}
      </Text>

      <Text style={styles.modalText}>
        Total: ₹{total}
      </Text>

      <Text style={styles.modalSub}>
        Confirm your order before proceeding
      </Text>

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setModalIsVisible(false)}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => {
            setModalIsVisible(false);
            Alert.alert("Success", "Order placed successfully 🎉");
          }}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>

    </View>
  </View>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 15,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2ecc71',
  },

  removeBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
  },

  removeText: {
    color: '#e74c3c',
    fontWeight: '600',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: '#fff',
    padding: 15,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderTopWidth: 1,
    borderColor: '#eee',
  },

  totalLabel: {
    fontSize: 12,
    color: '#888',
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
  },

  checkoutBtn: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  checkoutText: {
    color: '#fff',
    fontWeight: '700',
  },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '700',
  },

  emptySub: {
    marginTop: 5,
    color: '#777',
  },

  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalBox: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 15,
  padding: 20,
  alignItems: 'center',
},

modalTitle: {
  fontSize: 20,
  fontWeight: '800',
  marginBottom: 10,
},

modalText: {
  fontSize: 16,
  marginVertical: 5,
},

modalSub: {
  fontSize: 12,
  color: '#777',
  marginTop: 5,
  marginBottom: 15,
  textAlign: 'center',
},

modalButtons: {
  flexDirection: 'row',
  gap: 10,
},

cancelBtn: {
  padding: 10,
  backgroundColor: '#eee',
  borderRadius: 8,
  marginRight: 10,
},

cancelText: {
  fontWeight: '600',
},

confirmBtn: {
  padding: 10,
  backgroundColor: '#000',
  borderRadius: 8,
},

confirmText: {
  color: '#fff',
  fontWeight: '700',
},
});