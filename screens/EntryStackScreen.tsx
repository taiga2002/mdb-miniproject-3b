import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { AuthStackScreen } from "./AuthStack/AuthStackScreen";
import { RootStackScreen } from "./RootStack/RootStackScreen";
import firebase from 'firebase/compat/app';
import { onAuthStateChanged } from "firebase/auth";
import 'firebase/compat/auth';

import 'firebase/compat/firestore';
import {auth} from "../App"
/* Note: it is VERY important that you understand
    how this screen works!!! Read the logic on this screen
    carefully (also reference App.js, the entry point of
    our application). 
    
    Associated Reading:
      https://reactnavigation.org/docs/auth-flow/
      https://rnfirebase.io/auth/usage 
*/
export function EntryStackScreen() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
    setUser(currentUser);
     if (initializing) setInitializing(false);
    });
    return unsubscribe;
   }, [setUser]);

   if (initializing) {
     return <View />;
   } else if (!user) {
    return (
      <NavigationContainer>
        <AuthStackScreen />
      </NavigationContainer>
    );
   } else {
     return <RootStackScreen />;
   }
}
