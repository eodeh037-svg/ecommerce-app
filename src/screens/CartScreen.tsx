import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';

import {
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} from '../redux/cartSlice';

import { saveCartToStorage } from '../storage/ cartStorage'

export default function CartScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.cart);

  const [modalVisible, setModalVisible] = useState(false);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);
  
  useEffect(() => {
  console.log(' CART UPDATED:', items);
  saveCartToStorage(items);
}, [items]);

  const handleRemove = (id: number) => {
    Alert.alert('Remove Item', 'Remove this item from cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => dispatch(removeFromCart(id)),
      },
    ]);
  };

  const handleCheckout = () => {
    setModalVisible(false);
    dispatch(clearCart());

    Alert.alert('Success 🎉', 'Order placed successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Your Cart</Text>

      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add items to continue shopping</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 140 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.productTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                </View>

                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => dispatch(decreaseQty(item.id))}
                  >
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyNumber}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => dispatch(increaseQty(item.id))}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.subtotal}>
                  Subtotal: ₦{item.price * item.quantity}
                </Text>

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
              <Text style={styles.totalLabel}>
                {itemCount} item(s)
              </Text>
              <Text style={styles.totalPrice}>₦{total}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

          
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>

            <Text style={styles.modalTitle}>Order Summary</Text>

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Items</Text>
                <Text style={styles.summaryValue}>{itemCount}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₦{total}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotal}>Total</Text>
                <Text style={styles.summaryTotalValue}>₦{total}</Text>
              </View>
            </View>

            <Text style={styles.modalSub}>
              Confirm your order to continue
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={items.length === 0}
                style={[
                  styles.confirmBtn,
                  items.length === 0 && { opacity: 0.5 },
                ]}
                onPress={handleCheckout}
              >
                <Text style={styles.confirmText}>
                  Confirm Order
                </Text>
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
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  productTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },

  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2ecc71',
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  qtyBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },

  qtyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  qtyNumber: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
  },

  subtotal: {
    marginTop: 10,
    fontWeight: '600',
    color: '#444',
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
    fontWeight: '700',
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
    borderTopWidth: 1,
    borderColor: '#eee',
  },

  totalLabel: {
    fontSize: 12,
    color: '#777',
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: '900',
  },

  checkoutBtn: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  checkoutText: {
    color: '#fff',
    fontWeight: '800',
  },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '800',
  },

  emptySub: {
    marginTop: 5,
    color: '#777',
  },

  /* ===== MODAL ===== */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },

  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },

  closeBtn: {
    alignSelf: 'flex-end',
  },

  closeText: {
    fontSize: 18,
    fontWeight: '800',
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 15,
  },

  summaryBox: {
    backgroundColor: '#f8f9fb',
    padding: 15,
    borderRadius: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  summaryLabel: {
    color: '#555',
  },

  summaryValue: {
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },

  summaryTotal: {
    fontSize: 16,
    fontWeight: '900',
  },

  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2ecc71',
  },

  modalSub: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#777',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  cancelBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
  },

  cancelText: {
    fontWeight: '700',
  },

  confirmBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
  },

  confirmText: {
    color: '#fff',
    fontWeight: '800',
  },
});