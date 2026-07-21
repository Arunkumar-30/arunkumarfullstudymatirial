import './App.css'
import AddTask from './components/AddTask'
import ListTask from './components/ListTask'
import UpdateTask from './components/UpdateTask'
import { useSelector } from 'react-redux'
import { Routes, Route } from "react-router-dom"

function App() {

  const { taskList } = useSelector((state)=> state.tasks)

  return (
    <div className='max-w-3xl mx-auto'>
      <h1 className='text-center text-3xl'>Programming Task</h1>
      <p>{`Currently ${taskList.length} task`}</p>

      <Routes>
        <Route path="/" element={
          <>
            <AddTask/>
            <ListTask/>
          </>
        } />
        
        <Route path="/update-task" element={<UpdateTask/>} />
      </Routes>

    </div>
  )
}

export default App
