import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, TextInput, StyleSheet, Alert } from 'react-native';
import styles from './profileStyles';

const InfoRow = ({ icon, label, initialValue, updateFunction, editIcon }) => {
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleEditSubmit = () => {
    if (value.trim() === '') {
      Alert.alert('Error', 'Username cannot be empty');
      setValue(initialValue); 
      setEditMode(false);
      return;
    }

    if (value !== initialValue) {
      updateFunction(value.trim());
    }
    setEditMode(false);
  };

  return (
    <View style={styles.infoRow}>
    <Image source={icon} style={styles.icon} />
    {editMode ? (
      <TextInput
        style={styles.input}
        onChangeText={setValue}
        value={value}
        autoFocus={true}
        onSubmitEditing={handleEditSubmit}
        onBlur={handleEditSubmit}
        returnKeyType="done"
      />
    ) : (
      <View style={{ flexDirection: 'row', alignItems: 'center', flexGrow: 1 }}>
        <Text style={styles.infoText}>{label}</Text>
        <Text style={styles.infoText}>{value.length > 14 ? `${value.slice(0, 14)}...` : value}</Text>
        {editIcon && (
          <TouchableOpacity onPress={() => setEditMode(true)}>
            <Image source={editIcon} style={styles.editIcon} />
          </TouchableOpacity>
        )}
      </View>
    )}
  </View>
);
};

export default InfoRow;
