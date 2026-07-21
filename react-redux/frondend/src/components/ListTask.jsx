import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { setSelectedTask,removeTaskFromList, getTasksFromServer } from '../slices/taskSlice';

const ListTask = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { taskList } = useSelector((state)=>state.tasks);
    console.log(taskList)

    const updateTask = (task)=>{
        dispatch(setSelectedTask(task))
        navigate("/update-task")
    }
    useEffect(()=>{
        dispatch(getTasksFromServer())
    },[dispatch])
    const deleteTask = (id) => {
  if(window.confirm("Are you sure you want to delete?")) {
    dispatch(removeTaskFromList(id))
  }
}

    return (
        <div className='mt-10'>
            <div className="relative overflow-x-auto shadow rounded border">
                <table className="w-full text-sm text-left">
                    <thead className="border-b">
                        <tr>
                            <th className="px-6 py-3">#</th>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taskList && taskList.map((task,index)=>(
                            <tr key={task.id} className="border-b">
                                <td className="px-6 py-4">{index+1}</td>
                                <td className="px-6 py-4">{task.title}</td>
                                <td className="px-6 py-4">{task.description}</td>
                                <td className="px-6 py-4 space-x-3">
                                    <button 
                                        className="text-blue-500"
                                        onClick={()=>updateTask(task)}
                                    >
                                        Edit
                                    </button>
                                        <button 
                                        className="text-blue-500"
                                        onClick={()=>deleteTask(task.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListTask
