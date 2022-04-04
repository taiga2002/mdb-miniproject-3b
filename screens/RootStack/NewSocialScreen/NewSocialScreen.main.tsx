import React, { useState, useEffect } from "react";
import { Platform, View } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { getFileObjectAsync } from "../../../Utils";
import {db} from "../../../App"
// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example
import DateTimePickerModal from "react-native-modal-datetime-picker";

// See https://docs.expo.io/versions/latest/sdk/imagepicker/
// Most of the image picker code is directly sourced from the example
import * as ImagePicker from "expo-image-picker";
import { styles } from "./NewSocialScreen.styles";

import { getFirestore, doc, collection, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { getApp } from "firebase/app";
import { SocialModel } from "../../../models/social";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewSocialScreen">;
}

export default function NewSocialScreen({ navigation }: Props) {
  // Event details.
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState<Date>();
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImage, setEventImage] = useState<string | undefined>(undefined);
  // Date picker.
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [visible, setVisible] = useState(false);
  // Snackbar.
  const [message, setMessage] = useState("");
  // Loading state for submit button
  const [loading, setLoading] = useState(false);

  // Code for ImagePicker (from docs)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  // Code for ImagePicker (from docs)
  const pickImage = async () => {
    console.log("picking image");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("done");
    if (!result.cancelled) {
      setEventImage(result.uri);
    }
  };

  // Code for DatePicker (from docs)
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Code for DatePicker (from docs)
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Code for DatePicker (from docs)
  const handleConfirm = (date: Date) => {
    date.setSeconds(0);
    setEventDate(date);
    hideDatePicker();
  };

  // Code for SnackBar (from docs)
  const onDismissSnackBar = () => setVisible(false);
  const showError = (error: string) => {
    setMessage(error);
    setVisible(!visible);
  };

  // This method is called AFTER all fields have been validated.
  const saveEvent = async () => {
    if (!eventName) {
      showError("Please enter an event name.");
      return;
    } else if (!eventDate) {
      showError("Please choose an event date.");
      return;
    } else if (!eventLocation) {
      showError("Please enter an event location.");
      return;
    } else if (!eventDescription) {
      showError("Please enter an event description.");
      return;
    } else if (!eventImage) {
      showError("Please choose an event image.");
      return;
    } else {
      setLoading(true);
    }

    try {
      // Firestore wants a File Object, so we first convert the file path
      // saved in eventImage to a file object.
      console.log("getting file object");
      const object: Blob = (await getFileObjectAsync(eventImage)) as Blob;
      // Generate a brand new doc ID by calling .doc() on the socials node.
      // const db = getFirestore();
      const socialsCollection = collection(db, "socials");
      const socialRef = doc(socialsCollection);
      console.log("putting file object");
      const storage = getStorage(getApp());
      const storageRef = ref(storage, socialRef.id + ".jpg");
      const result = await uploadBytesResumable(storageRef, object);
      console.log("getting download url");
      const downloadURL = await getDownloadURL(result.ref);
      const socialDoc: SocialModel = {
        eventName: eventName,
        eventDate: eventDate.getTime(),
        eventLocation: eventLocation,
        eventDescription: eventDescription,
        eventImage: downloadURL,
      };
      console.log("setting download url");
      await setDoc(socialRef, socialDoc);
      setLoading(false);
      navigation.goBack();
    } catch (error: any) {
      setLoading(false);
      showError(error.toString());
    }
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action onPress={navigation.goBack} icon="close" />
        <Appbar.Content title="Socials" />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <View style={{ ...styles.container, padding: 20 }}>
        <TextInput
          label="Event Name"
          value={eventName}
          onChangeText={(name) => setEventName(name)}
          style={{ backgroundColor: "white", marginBottom: 10 }}
          autoComplete={false}
        />
        <TextInput
          label="Event Location"
          value={eventLocation}
          onChangeText={(location) => setEventLocation(location)}
          style={{ backgroundColor: "white", marginBottom: 10 }}
          autoComplete={false}
        />
        <TextInput
          label="Event Description"
          value={eventDescription}
          multiline={true}
          onChangeText={(desc) => setEventDescription(desc)}
          style={{ backgroundColor: "white", marginBottom: 10 }}
          autoComplete={false}
        />
        <Button
          mode="outlined"
          onPress={showDatePicker}
          style={{ marginTop: 20 }}
        >
          {eventDate ? eventDate.toLocaleString() : "Choose a Date"}
        </Button>

        <Button mode="outlined" onPress={pickImage} style={{ marginTop: 20 }}>
          {eventImage ? "Change Image" : "Pick an Image"}
        </Button>
        <Button
          mode="contained"
          onPress={saveEvent}
          style={{ marginTop: 20 }}
          loading={loading}
        >
          Save Event
        </Button>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Snackbar
          duration={3000}
          visible={visible}
          onDismiss={onDismissSnackBar}
        >
          {message}
        </Snackbar>
      </View>
    </>
  );
}
