import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native';
import { Button, CheckBox, Input } from "@rneui/themed"
import * as Font from 'expo-font'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import React, { useEffect, useState } from 'react'
import { NavigationContainer, StackActions } from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DatePickerComponent from './pickdate'
import Notes from "./notes";

const Tab = createBottomTabNavigator()

async function cacheFonts(fonts) {
  return fonts.map(async (font) => await Font.loadAsync(font))
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
      </Tab.Navigator>
    </NavigationContainer>
  )
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
  return <Stack.Navigator initialRouteName="To Do List">
    <Stack.Screen name="To Do List">
      {(props) => (
        <TodoScreen {...props} tasks={tasks} setTasks={setTasks} />
      )}
    </Stack.Screen>
    <Stack.Screen name="Details">
      {(props) => (
        <DetailsScreen {...props} setTasks={setTasks}  tasks={tasks}/>
      )}
    </Stack.Screen>
  </Stack.Navigator>
}

function ShowCompletedStatus({completed}) {
    if (completed){
        return (
            <Text>Task has been completed!</Text>
        )
    }
    return (
        <Text>Task has not been completed yet.</Text>
    )
}

function DetailsScreen({navigation, route, setTasks, tasks,}) {
  let {description, notes, completionDay, completed, relatedTasks} = route.params.item
  useEffect(() => {
    navigation.setOptions({
      title: description === "" ? "No title" : description,
    })
  }, [navigation])
  return (
    <View style={{ flex:1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details</Text>
      <br/>
        <ShowCompletedStatus completed={completed}></ShowCompletedStatus>
      <br/>
      <br/>
      <Text>{"To-Do Item:"}</Text>
      <Text>{description}</Text>
      <br/>
      <br/>
      <br/>
        <Text>{"Completion Day:"}</Text>
        <Text>{completionDay}</Text>
        <br/>
        <br/>
        <br/>
        <Text>{"Notes:"}</Text>
      <Text>{notes}</Text>
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

function TodoScreen({navigation, tasks, setTasks}) {
    cacheFonts([FontAwesome.font])
  let [input, setInput] = useState("");
  let [completionDay, setCompletionDay] = useState(new Date());
  let [note, setNote] = useState("");
  let updateTask = async (task) => {
    task.completed = !task.completed
    setTasks([...tasks])
    await AsyncStorage.setItem('@tasks', JSON.stringify(tasks))
  }
  let addTask = async () => {
    let maxKey = 0
    tasks.forEach(task => {
      if(task.key > maxKey) {
        maxKey = task.key
      }
    })
  let newTasks = [
    ...tasks,
     {
        description: input,
        completionDay: transformDate(),
        notes: note,
        completed: false,
        key: maxKey + 1,
      },
    ]
    setTasks(newTasks)
    await AsyncStorage.setItem('@tasks', JSON.stringify(newTasks))
    setInput("")
  }
  let renderItem = ({item}) => {
    return (
      <View style={styles.horizontal}>

      <CheckBox
          textStyle={item.completed ? {
            textDecorationLine: "line-through",
            textDecorationStyle: "solid",
          } :undefined}
          title={item.description}
          checked={item.completed}
          onPress={() => updateTask(item)}
      />
          <Button
              title="Details"
              onPress={() => navigation.navigate("Details", { item })}
              style={{ padding: 10 }}
          />
          <Button
              title="Delete"
              onPress={() => deleteTask(item)}
              style={{ padding: 10 }}
          />

      </View>
    )
  }
  function transformDate(){
    return completionDay.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  const deleteTask = (incomingTask) => {
        const updatedItems = tasks.filter((task) => task.description !== incomingTask.description);
        setTasks(updatedItems);
    };

  return (
      <View style={[styles.container]}>
        <StatusBar style="auto" />
        <FlatList data={tasks} renderItem={renderItem} />
        <View style={[styles.horizontal, { flexDirection: 'column' }]}>
          <Input
              onChangeText={setInput}
              value={input}
              placeholder="New task..."
          ></Input>
          <Text>{"Completion"}</Text>
          <View style={[styles.horizontal, { flexDirection: 'column' }]}>
            <DatePickerComponent val={completionDay} setter={setCompletionDay} />
          </View>
          <Notes val={note} setter={setNote}></Notes>
          <br/>
          <Button title="Add Task" onPress={addTask} />
        </View>
      </View>
  );



}
const styles = StyleSheet.create({
  horizontal:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  settings: {
    textAlign: 'center'
  },

});
