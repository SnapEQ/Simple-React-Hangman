import { useState } from 'react'
import { languages } from './assets/languages'
import clsx from "clsx"
import { getFarewellText, getRandomWord } from './assets/utils';
import Confetti from "react-confetti"


function App() {

  // State values
  const [currWord, setCurrWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  console.log(currWord)


  // Derived values

  const wrongGuessArray = guessedLetters.filter(letter => !currWord.includes(letter));

  const wrongGuesses = wrongGuessArray.length;

  const isGameWon = [...currWord].every(letter => guessedLetters.includes(letter));

  const isGameLost = wrongGuesses >= languages.length - 1 ? true : false;

  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect = lastGuessedLetter && !currWord.includes(lastGuessedLetter);

  // Static values

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';


  const languagesElements = languages.map((language, index) => {


    const isLanguageLost = index < wrongGuesses;



    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color
    }

    const className = clsx("chip", isLanguageLost && "lost")

    return (<span
      key={language.name}
      className={className}
      style={styles}
    >
      {language.name}
    </span>)
  })



  function handleClick(letter) {
    setGuessedLetters(prevLetters =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    )
  }

  const keyboard = [...alphabet].map((letter) => {


    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currWord.includes(letter)
    const isWrong = isGuessed && !currWord.includes(letter)

    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    })



    return (
      <button
        className={className}
        key={letter}
        onClick={() => handleClick(letter)}
        disabled={isGameOver}
      >
        {letter.toLocaleUpperCase()}
      </button>
    )
  })


  const currWordChars = [...currWord].map((letter, index) => {


    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )


    return (<span key={index} className={letterClassName}>
      {shouldRevealLetter ? letter.toUpperCase() : " "}
    </span>);

  });


  const gameStatusClass = clsx("result-message", {
    won: isGameWon,
    lost: isGameLost,
    farewell: isLastGuessIncorrect && !isGameOver
  })



  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <>
          <p className='farewell-message'>{getFarewellText(languages[wrongGuesses - 1].name)}</p>
        </>);
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!🎉</h2>
          <p> well done!</p>
        </>
      )
    }

    if (isGameLost) {
      return (
        <>
          <h2>Game Over!</h2>
          <p> You lose! Better start learing Aseembly 😭</p>
        </>
      )
    }

    return null;
  }

  function startNewGame() {
    setCurrWord(getRandomWord);
    setGuessedLetters([]);
  }



  return (
    <>
      <main>
        <header>
          <h1>Assembly: Endgame</h1>
          <p>Guess the word within {languages.length - 1} attempts to keep the programming word safe from Assembly!</p>

        </header>
        <section className={gameStatusClass}>
          {renderGameStatus()}

        </section>

        <section className='languages-chips'>
          {languagesElements}
        </section>
        <section className='letters-container'>
          {currWordChars}
        </section>
        <section className='keyboard'>
          {keyboard}
        </section>

        {isGameOver && <button className='new-game' onClick={startNewGame}>New Game</button>}
        {isGameWon && <Confetti
          recycle={false}
          numberOfPieces={1000}
        />}
      </main>
    </>
  )
}

export default App

