import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { COLOR_ACCENT, COLOR_PRIMARY } from "./AppStyles";
import { initializeApp, getApps } from "firebase/app";
import { EntryStackScreen } from "./screens/EntryStackScreen";
import {getAuth} from "firebase/auth"
import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

import {getFirestore} from "firebase/firestore";

// Make sure to create a file called "keys.json" in your project
// directory & add your Firebase configuration keys to that file.
// We add this file to our gitignore, since we don't want this to be
// published on Version Control.
const firebaseConfig = require("./keys.json");
var app;
if (getApps().length == 0) {
  app = initializeApp(firebaseConfig);
}
const auth = getAuth(app);
export {auth};
const db = getFirestore();
export {db};
// Theme Object for React Native Paper
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: COLOR_PRIMARY,
    accent: COLOR_ACCENT,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <EntryStackScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
