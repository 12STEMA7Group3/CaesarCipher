import { useEffect, useState } from 'react'
import { setOfCharacters, specialCharacters } from './constants'
let decipheredLetters = [];
let caesarEquivalent = [];
const App = () => {
  // set the converted value everytime the value of the input text input
  // is changed
  // then set the output value to the converted value once the button to convert is clicked
  // If it's empty, then show the toolbox;
  const [colorScheme, setColorScheme] = useState('dark');
  const [outputValue, setOutputValue] = useState('');
  const [textInput, setTextInput] = useState('')
  const [showToolBox, setShowToolBox] = useState(false);
  const [shakeButton, setShakeButton] = useState(false);
  const [changeIndex, setChangeIndex] = useState(false);

  function caesarCipherFunction (textToConvert) {
    return new Promise ((resolve, reject) => {
      decipheredLetters = [];
      caesarEquivalent = [];
      let i, j, k, l, m;

      // declare the caesar cipher equivalent first
        for (i = 0; i < setOfCharacters.length; i++) {
          let caesarEquivalentToPush = i + 13
        if (i < 13) {
          caesarEquivalent.push(setOfCharacters[caesarEquivalentToPush])
        }
      }
      textToConvert = textToConvert.split('')
      for (j = 0; j < textToConvert.length; j++) {
        let upperCaseVersionOfTextToConvert = textToConvert[j].toUpperCase()
          // Handles the Caesar Equivalent
          for (k = 0; k < caesarEquivalent.length; k++) {
            // if the letter (from the input) is a lower case, then it will hold true, so we will use the letter from the set of characters and convert it,
            // else, use it as is
              if (upperCaseVersionOfTextToConvert == caesarEquivalent[k]) {
                  decipheredLetters.push(textToConvert[j] === caesarEquivalent[k].toLowerCase() ? setOfCharacters[k].toLowerCase() : setOfCharacters[k])
              }
          }
          // Vice Versa
          for (l = 0; l < setOfCharacters.length - 13; l++) {
              if (upperCaseVersionOfTextToConvert == setOfCharacters[l]) {
                  decipheredLetters.push(textToConvert[j] === setOfCharacters[l].toLowerCase() ? setOfCharacters[l + 13].toLowerCase() : setOfCharacters[l + 13])
              }
          }
          // Includes the strings if it exists
          if (upperCaseVersionOfTextToConvert == ' ') {
          decipheredLetters.push(textToConvert[j])
          }
          // checks for special characters
          for (m = 0; m < specialCharacters.length; m++) {
              if (upperCaseVersionOfTextToConvert == specialCharacters[m]) {
                  decipheredLetters.push(specialCharacters[m]);
              }
          }
      }
       textToConvert = decipheredLetters.join('');
       console.log(decipheredLetters)
       resolve(textToConvert)
      reject('An Error Has Occured')
    })
  }

  async function getConvertedInput (textInput) {
    return new Promise(async (resolve, reject) => {
      try {
        const toReturn = await caesarCipherFunction(textInput);
        resolve(toReturn);
      } catch(err) {
        const error = err;
        reject(error)
      }
    })
  };

  async function handleChange (event) {
    // text input is equals to the value inside the textbox that activated this function.
    // event.target refers to the html element
    setTextInput(event.target.value)
  }

  async function outputValueSetter () {
    // we set it to a promise since there might be a time where this needs to process
    // large chunks of texts
    const convertedInput = await getConvertedInput(textInput);
    // set it to loading for more schmazz
    while (convertedInput == '') {
      setOutputValue('loading...')
    }
      setOutputValue(convertedInput);
  }

  function UIinterface () {
    setShowToolBox(true);
    setShakeButton(true)
  }

  useEffect(() => {
    const body = document.body;
    const appContainer = document.querySelector('.App');
    const circleIcon = document.querySelector('.dark-light-mode-icon');
    const toolBox = document.querySelector('.toolbox');
    const backgroundColorOfBody = colorScheme === 'dark' ? '#101010' : '#f3e3d3';
    const backgroundColorOfApp = colorScheme === 'dark' ? '#a0c292' : '#00754a';
    const boxShadowOfCircleIcon = colorScheme === 'dark' ? '0 .05rem .45rem 0 white' : '0 .05rem .45rem 0 black';
    const backgroundColorOfToolBox = colorScheme === 'dark' ? '#f3e3d3' : '#101010';
    const textColorOfToolBox = colorScheme === 'dark' ? '#101010' : '#f3e3d3';

    body.style.setProperty('--based-on-color-scheme', backgroundColorOfBody);
    appContainer.style.setProperty('--background-color-of-app-on-color-scheme', backgroundColorOfApp);
    circleIcon.style.setProperty('--box-shadow-based-on-color-scheme', boxShadowOfCircleIcon);
    toolBox.style.setProperty('--based-on-color-scheme', backgroundColorOfToolBox);
    toolBox.style.setProperty('--based-on-color-scheme-text-color', textColorOfToolBox);
  }, [colorScheme])

  useEffect(() => {
    if (textInput == '') {
      setOutputValue('')
    }
  }, [textInput])

  useEffect(() => {
    setTimeout(() => {
      setChangeIndex(!changeIndex)
      setShowToolBox(false)
      setShakeButton(false)
    }, 250)
  }, [changeIndex])

  return (
    <>
      <div className={`${!showToolBox ? `hidden` : `flex`} toolbox`}>Please Insert a Text For Conversion</div>
      <div className="App">
        <nav className='nav-bar'>
          <h1>Caesar's Cipher</h1>
          <div
          className={`${colorScheme === 'light' ? 'light' : 'dark'} dark-light-mode-icon-container`}
          onClick={(e) => colorScheme === 'dark' ? setColorScheme('light') : setColorScheme('dark')}
          >
            <span className={`${colorScheme === 'light' ? 'dark translate-x-to-right' : 'light translate-x-to-left'} dark-light-mode-icon`} />
          </div>
        </nav>
        <main>
          <h2>Insert the Text That You Want to Cipher / Decipher</h2>
          <div className='input-container'>
            <textarea onChange={(event) => handleChange(event)} type='text' className={`${colorScheme === 'light' ? 'light' : 'dark'} text-area`} placeholder='Insert Text...' />
            <button onClick={() => {textInput !== '' ? outputValueSetter() : UIinterface()}} type='button' value='button' className={`${colorScheme === 'light' ? 'button-in-light' : 'button-in-dark'} ${shakeButton &&  `animate-shake-button`}`}>Convert</button>
          </div>
          <div className='output-container'>
            <h2>Result:</h2>
            <textarea readOnly type='text' value={outputValue} className={`${colorScheme === 'light' ? 'light' : 'dark'} text-area`} placeholder='Please Convert a Text For Me to Cipher / Decipher' />
          </div>
        </main>
      </div>
    </>
  )
}

export default App
