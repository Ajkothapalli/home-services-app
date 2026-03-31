import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import { MAX_PHOTOS_PER_JOB } from '../../config/constants';

// TODO: import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

interface PhotoUploaderProps {
  onPhotosSelected: (localUris: string[]) => void;
  maxPhotos?: number;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPhotosSelected,
  maxPhotos = MAX_PHOTOS_PER_JOB,
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const openCamera = () => {
    if (selectedPhotos.length >= maxPhotos) {
      Alert.alert('Limit Reached', `You can upload a maximum of ${maxPhotos} photos.`);
      return;
    }
    // TODO: launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => { ... })
    Alert.alert('Camera', 'Camera picker not yet implemented. Install react-native-image-picker.');
  };

  const openGallery = () => {
    if (selectedPhotos.length >= maxPhotos) {
      Alert.alert('Limit Reached', `You can upload a maximum of ${maxPhotos} photos.`);
      return;
    }
    // TODO: launchImageLibrary({ mediaType: 'photo', selectionLimit: maxPhotos - selectedPhotos.length }, (response) => { ... })
    Alert.alert('Gallery', 'Gallery picker not yet implemented. Install react-native-image-picker.');
  };

  const removePhoto = (uri: string) => {
    const updated = selectedPhotos.filter(p => p !== uri);
    setSelectedPhotos(updated);
    onPhotosSelected(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Photos ({selectedPhotos.length}/{maxPhotos})</Text>
      <FlatList
        data={selectedPhotos}
        horizontal
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={styles.photoWrapper}>
            <Image source={{ uri: item }} style={styles.photo} />
            <TouchableOpacity style={styles.removeButton} onPress={() => removePhoto(item)}>
              <Text style={styles.removeText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          selectedPhotos.length < maxPhotos ? (
            <TouchableOpacity style={styles.addButton} onPress={openGallery}>
              <Text style={styles.addIcon}>+</Text>
            </TouchableOpacity>
          ) : null
        }
        contentContainerStyle={styles.photoList}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={openCamera}>
          <Text style={styles.actionText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={openGallery}>
          <Text style={styles.actionText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  photoList: { gap: 8 },
  photoWrapper: { position: 'relative' },
  photo: { width: 80, height: 80, borderRadius: 8 },
  removeButton: { position: 'absolute', top: -6, right: -6, backgroundColor: '#EF4444', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  removeText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14, lineHeight: 16 },
  addButton: { width: 80, height: 80, borderRadius: 8, borderWidth: 2, borderColor: '#D1D5DB', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  addIcon: { fontSize: 24, color: '#9CA3AF' },
  buttonRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  actionButton: { flex: 1, paddingVertical: 10, backgroundColor: '#F3F4F6', borderRadius: 8, alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '500', color: '#374151' },
});

export default PhotoUploader;
