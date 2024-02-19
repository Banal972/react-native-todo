import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { theme } from './color';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos";

export default function App() {

  const [working,setWorking] = useState(true);
  const [text,setText] = useState('');
  const [toDos,setToDos] = useState({});
  useEffect(()=>{
    loadTodos();
  },[]);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload)=>setText(payload);
  const saveTodos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave));// json 형식으로 바꿔 저장합니다.
  }
  const loadTodos = async()=>{
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if(s){
      setToDos(JSON.parse(s)); // JSON 형식을 [] , {} 으로 수정해줍니다.
    }
  }
  
  const addToDo = async ()=>{
    if(text === ""){
      return;
    }
    const newTodos = {...toDos,[Date.now()] : {text,working}};
    setToDos(newTodos);
    await saveTodos(newTodos);
    setText('');
  }

  const deleteToDo = (key) => {
    if(Platform.OS == "web") {

      const ok = confirm("Do you want to delete this To Do?");
      if(ok){
        const newTodos = {...toDos}; // 복사해서
        delete newTodos[key]; // delete 해서 삭제하고
        setToDos(newTodos); // 저장
        saveTodos(newTodos);
      }

    }else{

      Alert.alert(
        "Delete To Do", 
        "Are you sure?",[
        {text : "Cancel"},
        { text : "I'm Sure", 
          onPress : async ()=>{
            const newTodos = {...toDos}; // 복사해서
            delete newTodos[key]; // delete 해서 삭제하고
            setToDos(newTodos); // 저장
            await saveTodos(newTodos);
        }}
      ]);

    }
    
    
  }

  return (
    <View style={styles.container}>
      
      <StatusBar style="auto" />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color : working ? "white" : theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color : !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View>

      {/* 텍스트 */}
      <View>
        <TextInput
          onChangeText={onChangeText}
          onSubmitEditing={addToDo}
          value={text}
          style={styles.input}
          returnKeyType="done"
          placeholder={working ? "Add a To Do" : "what do you want to go?"}
        />
      </View>

      {/* 리스트 */}
      <ScrollView>
        {
          Object.keys(toDos).map((key)=>
            toDos[key].working === working ? 
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={()=>deleteToDo(key)}>
                <FontAwesome name="trash" size={24} color={theme.grey} />
              </TouchableOpacity>
            </View>
            : null
          )
        }
      </ScrollView>
    
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal : 20, // 패딩을 가로방향으로 줌
  },
  header : {
    justifyContent : "space-between",
    flexDirection : "row",
    marginTop : 100
  },
  btnText : {
    fontSize : 38,
    fontWeight : "600",
  },
  input : {
    backgroundColor : "white",
    paddingVertical : 15,
    paddingHorizontal : 20,
    borderRadius : 30,
    marginVertical : 20,
    fontSize : 18
  },
  toDo : {
    backgroundColor : theme.toDoBg,
    marginVertical : 10,
    paddingVertical : 20,
    paddingHorizontal : 20,
    borderRadius : 15,
    flexDirection : "row",
    justifyContent : "space-between"
  },
  toDoText : {
    color : "white",
    fontSize : 16,
    fontWeight : 500
  }
});
