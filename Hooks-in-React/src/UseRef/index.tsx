import { useEffect, useRef,useState} from 'react'

interface Props {}

export default function UseRefHook({}:Props){
    const [count,setCount] = useState(0)
    const countRef = useRef(0)

    const handleClick = () => {
        setCount(count + 1)
        countRef.current += 1
        console.log('State Count:', count)
        console.log('Ref Count:', countRef.current)
    }
    return (
        <div>
            <h1>useRef Hook Example</h1>    
            <p>State Count: {count}</p>
            <p>Ref Count: {countRef.current}</p>
            <button onClick={handleClick}>Increment</button>
        </div>
    )
}


export function UseRefExample({}:Props){
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])
      

    return(
        <div>
            <h1>useRef Example</h1>
            <input ref={inputRef} type="text" placeholder="Focus me on mount" />
        </div>
    )
}