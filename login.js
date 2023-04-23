import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Input } from "react-native-elements";
import { ErrorDisplay, invalidate } from "./error.js";

export function loginToApp(loginUsername, loginPassword) {
    return loginUsername === "test" && loginPassword === "Test1@";
}

export const UserLogin = ({ navigation }) => {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [incorrectCredentials, setIncorrectCredentials] = useState(false);

    function loginWrapper() {
        loginToApp(loginUsername, loginPassword) ? navigation.navigate("ToDo") : invalidate(incorrectCredentials, setIncorrectCredentials)
    }

    return (
        <SafeAreaView style={styles.container}>
            {incorrectCredentials && <ErrorDisplay errorMessage={"Wrong Username/Password"} />}
            <Input
                testID={"login-username"}
                style={styles.input}
                value={loginUsername}
                placeholder={"Username"}
                onChangeText={(text) => setLoginUsername(text)}
                autoCapitalize={"none"}
            />
            <Input
                testID={"login-password"}
                style={styles.input}
                value={loginPassword}
                placeholder={"Password"}
                onChangeText={(text) => setLoginPassword(text)}
                autoCapitalize={"none"}
                secureTextEntry
            />

            <Button testID={"login-button"} title={"Login"} onPress={() => loginWrapper()} />
            &nbsp;&nbsp;
            <Button testID={"login-register"} title={"Register"} onPress={() => navigation.navigate("UserRegistration")} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
