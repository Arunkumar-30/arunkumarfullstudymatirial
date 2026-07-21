import React, { useState } from 'react'
import { addTaskToList, addTaskToServer } from '../slices/taskSlice'
import { useDispatch } from 'react-redux'
const AddTask = () => {
    const [title,setTitle] = useState("")
    const [description,setDescription] = useState("")
    const dispatch = useDispatch()
    
    const addTask = (e)=>{
        e.preventDefault();
        console.log({title,description})
        // dispatch(addTaskToList({title,description}))
        dispatch(addTaskToServer({title,description}))
        setTitle('')
        setDescription('')
    }
    return (
        <>

        <div>

            <form class="max-w-sm mx-auto">
                <div class="mb-5">
                    <label for="title" class="block mb-2.5 text-sm font-medium text-heading">Your title</label>
                    <input type="text" id="title"
                        class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm 
    rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" value={title} onChange={(e)=>setTitle(e.target.value)}  required />
                </div>
                <div class="mb-5">
                    <label for="description" class="block mb-2.5 text-sm font-medium text-heading">Your description</label>
                    <input type="textkk" id="description" value={description} onChange={(e)=>setDescription(e.target.value)} class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" required />
                </div>

                <button type="submit" onClick={(e)=> addTask(e)} class="text-white bg-blue-500 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Add Task</button>
            </form>


        </div>
   
        </>
    )
}

export default AddTask
