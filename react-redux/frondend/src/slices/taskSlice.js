import { createSlice,createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";

const initialState = {
    taskList :[],
    selectedTask:{},
    isLoading:false,
    error:''
}

// GET
export const getTasksFromServer = createAsyncThunk(
    "tasks/getTasksFromServer",
    async (_,{rejectWithValue }) =>{
        const response = await fetch("http://localhost:5000/tasks");
        if(response.ok){
            const jsonresponse = await response.json()
            return jsonresponse
        }else{
            return rejectWithValue({error:"no tasks found"})
        }
    }
)

// POST 
export const addTaskToServer = createAsyncThunk(
    "tasks/addTaskToServer",
    async (task,{rejectWithValue})=>{
        const options = {
            method:'POST',
            body:JSON.stringify(task),
            headers:{
                "Content-type":"application/json"
            }
        }
        const response = await fetch("http://localhost:5000/tasks",options)
          if(response.ok){
            const jsonresponse = await response.json()
            return jsonresponse
        }else{
            return rejectWithValue({error:"no tasks found"})
        }
    }
)

const taskSlice = createSlice({
    name:'taskSlice',
    initialState:initialState,
    reducers:{
        addTaskToList:(state,action)=>{
            const id = Math.random() * 100
            let task = {...action.payload,id}
            state.taskList.push(task)
        },
        removeTaskFromList:(state,action)=>{
            state.taskList = state.taskList.filter((task)=> task.id !== action.payload)
        },
        updateTaskInList:(state,action)=>{
          state.taskList = state.taskList.map((task)=> task.id === action.payload.id ? action.payload : task)  
        },
        setSelectedTask:(state,action)=>{
            state.selectedTask = action.payload
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(getTasksFromServer.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getTasksFromServer.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.error = "";
                state.taskList = action.payload
            })
            .addCase(getTasksFromServer.rejected,(state,action)=>{
                state.error = action.payload.error
                state.isLoading = false
                state.taskList = []
            })
            .addCase(addTaskToServer.pending,(state)=>{
                state.isLoading = false
            })
             .addCase(addTaskToServer.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.error = "";
                state.taskList.push(action.payload)
            })
            .addCase(addTaskToServer.rejected,(state,action)=>{
                state.error = action.payload.error
                state.isLoading = false
            })
    }
})
export const { 
    addTaskToList, 
    removeTaskFromList, 
    updateTaskInList , 
    setSelectedTask
} = taskSlice.actions
export default taskSlice.reducer