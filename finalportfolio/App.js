import { UserRegistration } from "./register";
import { UserLogin } from "./login";
import { ToDoHomeScreen } from "./toDo";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="UserLogin">
                <Stack.Screen name="UserLogin" component={UserLogin} />
                <Stack.Screen name="UserRegistration" component={UserRegistration} />
                <Stack.Screen name="ToDo" component={ToDoHomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
