import React, { useState } from "react";
import {Alert, Button, StyleSheet, Text, TextComponent, TextInput, View} from "react-native";
import Checkbox from 'expo-checkbox';
import {Input} from "react-native-elements";
import {ErrorDisplay, invalidate} from "./error";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function finalValidate(property, setter, errorSetter, navigation, errors, fields, fieldSetters, errorSetters) {
    for (let error of errors) {
        if (error === true) {
            invalidate(property, setter)
            errorSetter("One or more field(s) are invalid, please check and retry")
            return
        }
    }

    let i = 0, username = "", password = "";
    for (let field of fields) {
        if (i === 2) {
            username = field
        }
        if (i === 4) {
            password = field
        }
        if (field === "") {
            invalidate(property, setter)
            errorSetter("One or more field(s) are invalid, please check and retry")
            return
        }
        i++;
    }
    await AsyncStorage.setItem("@login", JSON.stringify({"username":username, "password":password}))
    navigation.navigate("ToDo")
    cleanUpFields(fieldSetters, errorSetters)

}

function cleanUpFields(fieldSetters, errorSetters){
    for (let setField of fieldSetters) {
        setField("")
    }
    for (let setError of errorSetters) {
        setError(false)
    }
}
// https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
function isAlphaNumeric(str) {
    if (!isNaN(str)){
        return false
    }

    let code, i, len;
    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
}


function validateField(event, property, setter, errorSetter, value){
    switch (event.target.placeholder){
        case "Phone Number":
            if(event.target.value.match(/\(\d\d\d\) \d\d\d-\d\d\d\d/gm) == null){
                invalidate(property, setter)
                errorSetter("Please fill out a phone number in (xxx) xxx-xxxx format")
            } else{
                setter(false)
                errorSetter("")
            }
            break;
        case "Email":
            if(event.target.value.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i) === null){
                invalidate(property, setter)
                errorSetter("Please enter a valid email")
            } else {
                setter(false)
                errorSetter("")
            }
            break;
        case "Password":
            if(event.target.value.trim() === "") {
                invalidate(property, setter)
                errorSetter("Password is empty")
            }

            let upperCase = 0, lowerCase = 0, numberCount = 0, alphaNumeric = 0;
            for (let i = 0; i < event.target.value.length; i++) {
                if(!isNaN(event.target.value[i])){
                    numberCount++
                }

                if(isNaN(event.target.value[i]) && isAlphaNumeric(event.target.value[i]) && event.target.value[i] === event.target.value[i].toLowerCase()){
                    lowerCase++;
                }

                if(isNaN(event.target.value[i]) && isAlphaNumeric(event.target.value[i]) && event.target.value[i] === event.target.value[i].toUpperCase()){
                    upperCase++
                }

                if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(event.target.value[i])){
                    alphaNumeric++
                }
            }

            let invalidateError = "Password format invalid =>"
            if(upperCase !== 1) {
                invalidateError += " require one uppercase"
            }

            if(lowerCase !== 1) {
                invalidateError += " require one lowercase"
            }
            if(numberCount !== 1) {
                invalidateError += " require one number"
            }

            if(alphaNumeric !== 1) {
                invalidateError += " require one alphanumeric"
            }
            if(invalidateError.includes("require")){
                invalidate(property, setter, 10000);
                errorSetter(invalidateError)
            } else {
                setter(false)
                errorSetter("")
            }

            break;
        case "Confirm Password":
            if (value !== event.target.value){
                invalidate(property, setter, 4000);
                errorSetter("Password(s) do not match")
            } else {
                setter(false)
                errorSetter("")
            }
            break;
        case "First Name":
        case "Last Name":
            if (event.target.value.match(/^[^\d=?\\@#%^&*()]+$/gm) == null) {
                invalidate(property, setter)
                errorSetter("Please enter a name without numbers")
            } else {
                setter(false)
                errorSetter("")
            }
            break;
        case "Zip Code":
            if (event.target.value.length !== 5 && !/^\d+$/.test(event.target.value)) {
                invalidate(property, setter)
            } else {
                setter(false)
                errorSetter("")
            }
            break;
        case "Username":
            if(event.target.value.trim() === ""){
                invalidate(property, setter)
            } else {
                setter(false)
                errorSetter("")
            }
            break;
    }
}

export const UserRegistration = ({ navigation }) => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [signUpForNewsletter, setSignUpForNewsletter] = useState(false);


    const [incorrectPhoneNumber, setIncorrectPhoneNumber] = useState(false);
    const [incorrectEmail, setIncorrectEmail] = useState(false);
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    const [incorrectPasswordMatch, setIncorrectPasswordMatch] = useState(false);
    const [incorrectFirstName, setIncorrectFirstName] = useState(false);
    const [incorrectLastName, setIncorrectLastName] = useState(false);
    const [incorrectZipCode, setIncorrectZipCode] = useState(false);
    const [incorrectUsername, setIncorrectUsername] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [finalErrorMessage, setFinalErrorMessage] = useState(false)


    return (
    <View style={styles.container}>
        {incorrectFirstName && <ErrorDisplay errorMessage={errorMessage}/>}
            <Input
                testID={"firstname"}
                style={styles.input}
                value={firstName}
                placeholder={"First Name"}
                onChangeText={(text) => setFirstName(text)}
                onChange={(e) => validateField(e, incorrectFirstName, setIncorrectFirstName, setErrorMessage)}
                autoCapitalize={"none"}
            />

            {incorrectLastName && <ErrorDisplay errorMessage={errorMessage}/>}
            <Input
                testID={"lastname"}
                style={styles.input}
                value={lastName}
                placeholder={"Last Name"}
                onChangeText={(text) => setLastName(text)}
                onChange={(e) => validateField(e, incorrectLastName, setIncorrectLastName, setErrorMessage)}
                autoCapitalize={"none"}
            />

            {incorrectUsername && <ErrorDisplay errorMessage={errorMessage}/>}
            <Input
                testID={"username"}
                style={styles.input}
                value={username}
                placeholder={"Username"}
                onChangeText={(text) => setUsername(text)}
                onChange={(e) => validateField(e, incorrectUsername, setIncorrectUsername, setErrorMessage)}
                autoCapitalize={"none"}
            />

            {incorrectPhoneNumber && <ErrorDisplay errorMessage={errorMessage}/>}
            <Input
                testID={"phonenumber"}
                style={styles.input}
                value={phoneNumber}
                placeholder={"Phone Number"}
                onChangeText={(text) => setPhoneNumber(text)}
                onChange={(e) => validateField(e, incorrectPhoneNumber, setIncorrectPhoneNumber, setErrorMessage)}
                autoCapitalize={"none"}
            />

            {incorrectPassword && <ErrorDisplay errorMessage={errorMessage}/>}
            <Input
                testID={"password"}
                style={styles.input}
                value={password}
                placeholder={"Password"}
                onChange={(e) => validateField(e, incorrectPassword, setIncorrectPassword, setErrorMessage)}
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
            />

            {incorrectPasswordMatch && <ErrorDisplay errorMessage={errorMessage}/>}
            <Input
                testID={"confirmpassword"}
                style={styles.input}
                value={confirmPassword}
                placeholder={"Confirm Password"}
                secureTextEntry
                onChange={(e) => validateField(e, incorrectPasswordMatch, setIncorrectPasswordMatch, setErrorMessage, password)}
                onChangeText={(text) => setConfirmPassword(text)}
            />

            {incorrectEmail && <ErrorDisplay errorMessage={errorMessage}/>}
            <Input
                testID={"email"}
                style={styles.input}
                onChange={(e) => validateField(e, incorrectEmail, setIncorrectEmail, setErrorMessage)}
                value={email}
                placeholder={"Email"}
                onChangeText={(text) =>  setEmail(text)}
            />

            {incorrectZipCode && <ErrorDisplay errorMessage={errorMessage}/>}
            <Input
                testID={"zip"}
                style={styles.input}
                onChange={(e) => validateField(e, incorrectZipCode, setIncorrectZipCode, setErrorMessage)}
                value={zipCode}
                placeholder={"Zip Code"}
                onChangeText={(text) => setZipCode(text)}
            />

            <Checkbox
                value={signUpForNewsletter}
                onValueChange={() => {setSignUpForNewsletter(!signUpForNewsletter)}}
            />
            <Text>{'Subscribe to our newsletter regarding new updates'}</Text>
            &nbsp;&nbsp;
            <Button title={"Sign Up"} onPress={() => finalValidate(
                finalErrorMessage,
                setFinalErrorMessage,
                setFinalErrorMessage,
                navigation,
                [incorrectPhoneNumber, incorrectEmail, incorrectPasswordMatch, incorrectFirstName, incorrectLastName, incorrectZipCode, incorrectUsername],
                [firstName, lastName, username, password, confirmPassword, phoneNumber, email, zipCode],
                [setFirstName, setLastName, setUsername, setPassword, setConfirmPassword, setPhoneNumber, setEmail, setZipCode, setSignUpForNewsletter],
                [setIncorrectPhoneNumber, setIncorrectEmail, setIncorrectPassword, setIncorrectPasswordMatch, setIncorrectFirstName, setIncorrectLastName, setIncorrectZipCode, setIncorrectUsername],
            )}/>

            {(finalErrorMessage) && <ErrorDisplay errorMessage={finalErrorMessage}/>}

    </View>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        borderRadius: 5,
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
