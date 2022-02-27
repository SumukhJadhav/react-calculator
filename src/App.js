import './App.css';
import './styles.css'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import React,{useReducer } from 'react'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state,{type, payload}){
  //Swithching operations for diffrent types of Inputs
  switch(type){
      //Switch Case for numbers
      case ACTIONS.ADD_DIGIT:
        if (payload.digit === "." && state.currentOperand == null) { return state } 
        if (payload.digit === "." && state.currentOperand.includes(".")) { return state } 

        if(state.overwrite){
          return{
            ...state,
            currentOperand: payload.digit,
            overwrite: false,
          }
        }

        if (payload.digit === "0" && state.currentOperand === "0") return state
        if (payload.digit === "." && state.currentOperand.includes(".")) return state
        
        return{
        ...state, 
        currentOperand:`${state.currentOperand || ""}${payload.digit}`,
        }

      //Switch Case for AC(All Clear)
      case ACTIONS.CLEAR:
        return {}

        //Switch Case for Deleting recent digit
      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite)
          return {
            ...state,
            overwrite: false,
            currentOperand: null
          }
          if (state.currentOperand == null) return state
          if(state.currentOperand.length === 1){
            return {...state, currentOperand: null}
          }

          return{
            ...state,
            currentOperand: state.currentOperand.slice(0,-1)
          }
        
      //Switch Case for "=" EVALUATE
      case ACTIONS.EVALUATE:
        if(state.operation == null || state.currentOperand == null || state.prevOperand == null){
          return state
        }
        return{
          ...state,
          overwrite: true,
          prevOperand: null,
          operation: null,
          currentOperand: evaluate(state),
        }
      //Switch Case for Opeartation {+,-,*,/}
      case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand == null && state.prevOperand == null){
          return state
        }
        if (state.currentOperand == null){
          return {
            ...state,
            operation : payload.operation,
          }
        }
        if(state.prevOperand == null){
            return {
              ...state,
              operation: payload.operation,
              prevOperand: state.currentOperand,
              currentOperand: null,
            }
        }
      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    }
}

//Main Evaluation Function
function evaluate({currentOperand, prevOperand, operation}){
  const prev = parseFloat(prevOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }
  return computation.toString()
}

//TO format into numbers to add commas in between
const INTEGET_FROMATTER = new Intl.NumberFormat('en-in',{
  maximumFractionDigits: 0,
})

function formatOperand(operand){
  if(operand == null) return
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return INTEGET_FROMATTER.format(integer)
  return `${INTEGET_FROMATTER.format(integer)}.${decimal}`
}


//Main
function App() {
  const[{currentOperand, prevOperand, operation},dispatch] = useReducer(reducer,{})
  
  return (
    <><div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(prevOperand)} {operation}</div>
        <div className="current-operand"> {formatOperand(currentOperand)} </div>
      </div>

      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>

      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>

      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />


      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />


      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />

      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    <br/>
    </div>
    <div className='title'>Pocket Calculator</div></>
  );
}

export default App;
