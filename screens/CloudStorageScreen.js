import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../globals/styles';

const CloudStorageScreen = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const imageRefs = await storage().ref('images').listAll();
      const urls = await Promise.all(
        imageRefs.items.map(async (ref) => ({
          url: await ref.getDownloadURL(),
          path: ref.fullPath
        }))
      );
      setImages(urls);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });

      if (!result.canceled) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const uploadImage = async (uri) => {
    try {
      setUploading(true);
      setProgress(0);

      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const ref = storage().ref().child(`images/${filename}`);

      const task = ref.put(blob);

      // Progress monitoring
      task.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          Alert.alert('Error', error.message);
          setUploading(false);
        },
        async () => {
          const url = await ref.getDownloadURL();
          setImages([{ url, path: `images/${filename}` }, ...images]);
          setUploading(false);
          setProgress(0);
        }
      );
    } catch (error) {
      Alert.alert('Error', error.message);
      setUploading(false);
    }
  };

  const deleteImage = async (path) => {
    try {
      await storage().ref(path).delete();
      setImages(images.filter(img => img.path !== path));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteImage(item.path)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Cloud Storage Demo</Text>
      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={pickImage}
        disabled={uploading}
      >
        <Text style={styles.uploadButtonText}>
          {uploading ? 'Uploading...' : 'Pick an Image'}
        </Text>
      </TouchableOpacity>
      
      {uploading && (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.progressText}>{`${Math.round(progress)}%`}</Text>
        </View>
      )}

      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item) => item.path}
        numColumns={2}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    padding: 16,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  progressText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.primary,
  },
  list: {
    flex: 1,
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CloudStorageScreen; 