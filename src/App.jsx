import { useEffect, useMemo, useState } from 'react'
import './App.css'

export default function App() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  const handleNumberClick = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num))
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.')
      setWaitingForNewValue(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const result = performCalculation(previousValue, inputValue, operation)
      setDisplay(String(result))
      setPreviousValue(result)
    }

    setWaitingForNewValue(true)
    setOperation(nextOperation)
  }

  const performCalculation = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current
      case '-':
        return prev - current
      case '*':
        return prev * current
      case '/':
        return current !== 0 ? prev / current : 0
      default:
        return current
    }
  }

  const handleEquals = () => {
    const inputValue = parseFloat(display)

    if (operation && previousValue !== null) {
      const result = performCalculation(previousValue, inputValue, operation)
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const handleBackspace = () => {
    if (waitingForNewValue) {
      return
    }
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  const handleToggleSign = () => {
    if (display === '0') {
      return
    }
    setDisplay(display.startsWith('-') ? display.slice(1) : `-${display}`)
  }

  const handlePercent = () => {
    const inputValue = parseFloat(display)
    if (Number.isNaN(inputValue)) {
      return
    }

    if (operation && previousValue !== null) {
      const percentValue = (previousValue * inputValue) / 100
      setDisplay(String(percentValue))
      setWaitingForNewValue(true)
      return
    }

    setDisplay(String(inputValue / 100))
  }

  const formattedDisplay = useMemo(() => {
    if (display === '0') {
      return '0'
    }
    if (!display.includes('.')) {
      const numberValue = Number(display)
      if (!Number.isFinite(numberValue)) {
        return display
      }
      return numberValue.toLocaleString('en-US')
    }

    const [integerPart, decimalPart] = display.split('.')
    const numberValue = Number(integerPart)
    const formattedInteger = Number.isFinite(numberValue)
      ? numberValue.toLocaleString('en-US')
      : integerPart
    return `${formattedInteger}.${decimalPart}`
  }, [display])

  const expressionPreview = useMemo(() => {
    if (previousValue === null || !operation) {
      return ''
    }
    return `${previousValue} ${operation}`
  }, [previousValue, operation])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event

      if (/^[0-9]$/.test(key)) {
        handleNumberClick(Number(key))
        return
      }

      if (key === '.') {
        handleDecimal()
        return
      }

      if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperation(key)
        return
      }

      if (key === 'Enter' || key === '=') {
        handleEquals()
        return
      }

      if (key === 'Backspace') {
        handleBackspace()
        return
      }

      if (key === 'Escape') {
        handleClear()
        return
      }

      if (key === '%') {
        handlePercent()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [display, operation, previousValue, waitingForNewValue])

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display-panel">
          <div className="display-history">{expressionPreview || 'Ready'}</div>
          <input
            type="text"
            className="display"
            value={formattedDisplay}
            readOnly
          />
        </div>

        <div className="buttons">
          <button className="btn btn-function" onClick={handleClear}>AC</button>
          <button className="btn btn-function" onClick={handleBackspace}>DEL</button>
          <button className="btn btn-function" onClick={handleToggleSign}>+/-</button>
          <button className="btn btn-function" onClick={handlePercent}>%</button>

          <button className="btn" onClick={() => handleNumberClick(7)}>7</button>
          <button className="btn" onClick={() => handleNumberClick(8)}>8</button>
          <button className="btn" onClick={() => handleNumberClick(9)}>9</button>
          <button
            className={`btn btn-function ${operation === '/' ? 'is-active' : ''}`}
            onClick={() => handleOperation('/')}
          >
            /
          </button>

          <button className="btn" onClick={() => handleNumberClick(4)}>4</button>
          <button className="btn" onClick={() => handleNumberClick(5)}>5</button>
          <button className="btn" onClick={() => handleNumberClick(6)}>6</button>
          <button
            className={`btn btn-function ${operation === '*' ? 'is-active' : ''}`}
            onClick={() => handleOperation('*')}
          >
            ×
          </button>

          <button className="btn" onClick={() => handleNumberClick(1)}>1</button>
          <button className="btn" onClick={() => handleNumberClick(2)}>2</button>
          <button className="btn" onClick={() => handleNumberClick(3)}>3</button>
          <button
            className={`btn btn-function ${operation === '-' ? 'is-active' : ''}`}
            onClick={() => handleOperation('-')}
          >
            −
          </button>

          <button className="btn btn-zero" onClick={() => handleNumberClick(0)}>0</button>
          <button className="btn" onClick={handleDecimal}>.</button>
          <button
            className={`btn btn-function ${operation === '+' ? 'is-active' : ''}`}
            onClick={() => handleOperation('+')}
          >
            +
          </button>

          <button className="btn btn-equals" onClick={handleEquals}>=</button>
        </div>
      </div>
    </div>
  )
}
