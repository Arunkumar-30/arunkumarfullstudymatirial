import { useReducer } from "react";


interface State{
    count:number;
    error:string | null;
}

interface Action{
    type: 'increment' | 'decrement';
}

function reducer(state:State,action:Action){

     const {type}= action;

     switch(type){
        case 'increment':
            const newCount= state.count + 1;
            const hasError= newCount > 10;
            
            return {
                ...state,
                count: hasError ? state.count : newCount,
                error: hasError ? 'Count cannot exceed 10' : null
            };
        case 'decrement':
            const newCount1= state.count - 1;
            const hasError1= newCount1 < 0;
            return {
                ...state,
                count: hasError1 ? state.count : newCount1,
                error: hasError1 ? 'Count cannot be negative' : null
            };
        default:
            return state;
     }
}

export default function UseReducerHook(){
       const [state,dispatch]= useReducer(reducer,{
        count:0,
        error:null
       })
    return(
        <div>
            <h1>UseReducer Hook</h1>
            <p>Count: {state.count}</p>
            {state.error && <p style={{color: 'red'}}>
                Error: {state.error}</p>}
          <button onClick={()=> dispatch({type:'decrement'})}>Decrement</button>
          <button onClick={()=> dispatch({type:'increment'})}>Increment</button>
        </div>
    )

}