import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useEffect, useState } from 'react'
import { NavigationContainer, StackActions } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator()

async function cacheFonts(fonts) {
  return fonts.map(async (font) => await FontAwesome.loadAsync(font))
}
let newTasks = [
  {description: "Task 1", completed: true, key:1, relatedTasks: [2]},
  {description: "Task 2", completed: true, key:2}
]

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={TodoHomeScreen}
        options={{ headerShown: false }}
        />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
function SettingsScreen() {
  return <Text>Settings Screen</Text>
}

function TodoHomeScreen() {
  let [tasks, setTasks] = useState(newTasks)
  useEffect(() => {
    async function getValue() {
      const value = await AsyncStorage.getItem("@tasks")
      if (value === null) {
        console.log(
          "Storing serialized tasks" + JSON.stringify(tasks)
        )
        await AsyncStorage.setItem("@tasks", JSON.stringify(tasks))
      } else {
        let parsedValue = JSON.parse(value)
        console.log("Retrieving serialized tasks")
        console.log(parsedValue)
        setTasks(JSON.parse(value))
      }
    }
    getValue()
  }, [])
  return <StackNavigator initialRouteName="ToDo List">
    <Stack.Screen name="ToDo List">
      {(props) => (
        <TodoScreen {...props} tasks={tasks} setTasks={setTasks} />
      )}
    </Stack.Screen>
    <Stack.Screen name="Details">
      {(props) => (
        <DetailsScreen {...props} setTasks={setTasks}  tasks={tasks}/>
      )}
    </Stack.Screen>
  </StackNavigator>
}

function DetailsScreen({navigation, route, setTasks, tasks,}) {
  let {description, completed, key, relatedTasks} = route.params.item
  useEffect(() => { 
    navigation.setOptions({
      title: description === "" ? "No title" : description,
    })
  }, [navigation])
  return (
    <View style={{ flex:1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen </Text>
      <Text>{description}</Text> 
      {
        relatedTasks !== undefined && relatedTasks.length > 0 ? 
        <>
          <Text>Related Tasks:</Text>
          {tasks.filter(task => relatedTasks.includes(task.key)).map(cTask => <Button
          key={cTask.key} title={cTask.description}
          onPress={() => {
            navigation.dispatch(StackActions.push('Details', {item:cTask}));
          }}
          />)
          }
        </>
      : undefined}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
