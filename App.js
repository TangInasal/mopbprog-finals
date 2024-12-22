import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true); // Successful login
    } else {
      Alert.alert('Login Failed', 'Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Set the user as logged out
  };

  // Main Inventory Screen
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const addOrIncrementProduct = () => {
    // Validate product fields
    if (!productName.trim() || !productPrice.trim() || !productQuantity.trim()) {
      Alert.alert('Error', 'Please provide valid product name, price, and quantity.');
      return;
    }

    // Check if the product already exists
    const existingProduct = products.find(
      (product) => product.name.toLowerCase() === productName.trim().toLowerCase()
    );

    if (existingProduct) {
      // Increment existing product quantity
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === existingProduct.id
            ? { ...product, quantity: product.quantity + parseInt(productQuantity, 10) }
            : product
        )
      );
    } else {
      // Create a new product if it doesn't exist
      const newProduct = {
        id: Date.now().toString(),
        name: productName.trim(),
        price: parseFloat(productPrice.trim()),
        quantity: parseInt(productQuantity.trim(), 10),
      };
      setProducts((prevProducts) => [...prevProducts, newProduct]);
    }

    // Reset form fields after adding/incrementing product
    resetForm();
  };

  const updateProduct = () => {
    if (!selectedProduct || !productName.trim() || !productPrice.trim() || !productQuantity.trim()) {
      Alert.alert('Error', 'Please select a product and provide valid updated details.');
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === selectedProduct.id
          ? {
              ...product,
              name: productName.trim(),
              price: parseFloat(productPrice.trim()),
              quantity: parseInt(productQuantity.trim(), 10),
            }
          : product
      )
    );

    resetForm();
  };

  const deleteProduct = (id) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  const purchaseProduct = (product) => {
    if (product.quantity <= 0) {
      Alert.alert('Out of Stock', `Product "${product.name}" is out of stock.`);
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
      )
    );

    Alert.alert('Purchase Successful', `You purchased "${product.name}".`);
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setProductPrice(product.price.toString());
    setProductQuantity(product.quantity.toString());
  };

  const resetForm = () => {
    setProductName('');
    setProductPrice('');
    setProductQuantity('');
    setSelectedProduct(null);
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.loginContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.loginBox}>
              <Text style={styles.loginTitle}>Login</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#888"
                secureTextEntry
              />
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Dioca Store</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={productName}
            onChangeText={setProductName}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Product Price"
            value={productPrice}
            onChangeText={setProductPrice}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Product Quantity"
            value={productQuantity}
            onChangeText={setProductQuantity}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={selectedProduct ? updateProduct : addOrIncrementProduct}>
              <Text style={styles.buttonText}>{selectedProduct ? 'Update' : 'Add'} Product</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Inventory List Section */}
        <View style={styles.inventoryContainer}>
          <Text style={styles.subtitle}>Inventory</Text>
          {products.length === 0 ? (
            <Text style={styles.emptyMessage}>No products available.</Text>
          ) : (
            products.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <View style={styles.productDetails}>
                  <Text style={styles.productText}>{item.name}</Text>
                  <Text style={styles.productText}>Price: P{item.price.toFixed(2)}</Text>
                  <Text style={styles.productText}>Quantity: {item.quantity}</Text>
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => selectProduct(item)}>
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#e57373' }]}
                    onPress={() => deleteProduct(item.id)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#81c784' }]}
                    onPress={() => purchaseProduct(item)}
                  >
                    <Text style={styles.actionButtonText}>Buy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  scrollView: {
    flexGrow: 1,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-start',  // Centers content vertically
    alignItems: 'center',
    paddingTop: 150,      // Centers content horizontally
  },
  loginBox: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  loginTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  loginButton: {
    backgroundColor: '#388e3c',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 25,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#388e3c',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  inventoryContainer: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: '#ffffff',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
  },
  productText: {
    fontSize: 16,
    color: '#333',
  },
  productActions: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'column',
    paddingHorizontal: 40,
    width: '20%'
  },
  actionButton: {
    backgroundColor: '#66bb6a',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  logoutContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#e57373',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginLeft: -80,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});
