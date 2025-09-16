import React, { useState } from 'react';

const CalculatorPage = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handlePlusMinus = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  return (
    <div className="calculator-page">
      <div className="page-header">
        <h1>🧮 Calculator</h1>
      </div>
      
      <div className="calculator-container">
        <div className="calculator">
          <div className="calculator-display">
            <div className="display-value">{display}</div>
          </div>
          
          <div className="calculator-buttons">
            <div className="button-row">
              <button className="calc-btn function-btn" onClick={clear}>AC</button>
              <button className="calc-btn function-btn" onClick={handlePlusMinus}>+/-</button>
              <button className="calc-btn function-btn" onClick={handlePercentage}>%</button>
              <button className="calc-btn operator-btn" onClick={() => performOperation('÷')}>÷</button>
            </div>
            
            <div className="button-row">
              <button className="calc-btn number-btn" onClick={() => inputNumber(7)}>7</button>
              <button className="calc-btn number-btn" onClick={() => inputNumber(8)}>8</button>
              <button className="calc-btn number-btn" onClick={() => inputNumber(9)}>9</button>
              <button className="calc-btn operator-btn" onClick={() => performOperation('×')}>×</button>
            </div>
            
            <div className="button-row">
              <button className="calc-btn number-btn" onClick={() => inputNumber(4)}>4</button>
              <button className="calc-btn number-btn" onClick={() => inputNumber(5)}>5</button>
              <button className="calc-btn number-btn" onClick={() => inputNumber(6)}>6</button>
              <button className="calc-btn operator-btn" onClick={() => performOperation('-')}>-</button>
            </div>
            
            <div className="button-row">
              <button className="calc-btn number-btn" onClick={() => inputNumber(1)}>1</button>
              <button className="calc-btn number-btn" onClick={() => inputNumber(2)}>2</button>
              <button className="calc-btn number-btn" onClick={() => inputNumber(3)}>3</button>
              <button className="calc-btn operator-btn" onClick={() => performOperation('+')}>+</button>
            </div>
            
            <div className="button-row">
              <button className="calc-btn number-btn zero-btn" onClick={() => inputNumber(0)}>0</button>
              <button className="calc-btn number-btn" onClick={inputDecimal}>.</button>
              <button className="calc-btn operator-btn" onClick={handleEquals}>=</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
