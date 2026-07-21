import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskInList } from '../slices/taskSlice';
import { useNavigate } from 'react-router-dom';

const UpdateTask = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { selectedTask } = useSelector((state)=>state.tasks);

    const [title,setTitle] = useState("")
    const [description,setDescription] = useState("")

    useEffect(() => {
        if(selectedTask){
            setTitle(selectedTask.title)
            setDescription(selectedTask.description)
        }
    }, [selectedTask])

    const handleSubmit = (e) => {
        e.preventDefault()

        dispatch(updateTaskInList({
            id: selectedTask.id,
            title,
            description
        }))
        navigate('/')
    }

    return (
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium">
                    Title
                </label>
                <input 
                    type="text"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    className="border w-full p-2"
                />
            </div>

            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium">
                    Description
                </label>
                <input 
                    type="text"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    className="border w-full p-2"
                />
            </div>

            <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2"
            >
                Update Task
            </button>
        </form>
    )
}

export default UpdateTask
