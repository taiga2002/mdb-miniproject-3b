import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, ScrollView, View } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import firebase from "firebase/app"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../../App"

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignUpScreen">;
}

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const onDismissSnackBar = () => setVisible(false);
  const showError = (error: string) => {
    setMessage(error);
    setVisible(true);
  };
  const auth = getAuth();
  const handleSignUp = () => {
    try{
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    console.log(userCredential);
  })}
  catch(error) {
    showError(error)
  };
}
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign Up Button (goes to Sign Up screen)
      - Reset Password Button
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/starts
  */
  return (
    <><Appbar.Header>
        <Appbar.Content title="Create an Account"/>
      </Appbar.Header>
      <View style={{ ...styles.container, padding: 30 }}>
        <TextInput
          placeholder="Email"
          label="Email"
          value={email}
          onChangeText={(email) => setEmail(email)}
          style={{ backgroundColor: "white", marginBottom: 10 }}
          autoComplete={false}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={(password) => setPassword(password)}
          style={{ backgroundColor: "white", marginBottom: 10 }}
          autoComplete={false}
          secureTextEntry
        />
        <Button
          mode="contained"
          onPress={handleSignUp}
          
          style={{ marginTop: 20 }}
          loading={loading}
        >CREATE AN ACCOUNT</Button>
        <Button
          onPress={()=>{navigation.navigate("SignInScreen")}}
          style={{ marginTop: 20 }}
          loading={loading}
        >OR, SIGN IN INSTEAD</Button>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#ffffff",
  },
});
