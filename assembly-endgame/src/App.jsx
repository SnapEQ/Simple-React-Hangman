import { useState, useEffect } from 'react'
import { languages } from './assets/languages'
import clsx from "clsx"
import { getFarewellText, getRandomWord } from './assets/utils';
import Confetti from "react-confetti"









function App() {

  // State values
  const [currWord, setCurrWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [farewellMessage, setFarewellMessage] = useState('');

  console.log(currWord)


  // Derived values

  const wrongGuessArray = guessedLetters.filter(letter => !currWord.includes(letter));

  const wrongGuesses = wrongGuessArray.length;

  const isGameWon = [...currWord].every(letter => guessedLetters.includes(letter));

  const isGameLost = wrongGuesses >= languages.length - 1 || timeLeft === 0 ? true : false;

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


  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0 && !isGameOver) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);

      setTimeLeft(0);
    }


    return () => clearInterval(timer);

  }, [isRunning, timeLeft, isGameOver])


  function handleClick(letter) {


    if (!isRunning) {
      setIsRunning(true);
    }


    if (!guessedLetters.includes(letter)) {
      setGuessedLetters(prev => [...prev, letter]);

      if (!currWord.includes(letter)) {
        setFarewellMessage(getFarewellText(languages[wrongGuesses].name));

      }
    }
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

    const shouldRevealLetter = guessedLetters.includes(letter) ||
      (isGameLost && setTimeout(() => true, index * 200)); // Reveals letters with delay

    const letterClassName = clsx(
      "letter",
      (isGameLost && !guessedLetters.includes(letter)) && "missed-letter")

    return (
      <span
        key={index}
        className={letterClassName}
        style={{
          animationDelay: isGameLost ? `${index * 0.1}s` : '0s'
        }}
      >
        {shouldRevealLetter ? letter.toUpperCase() : " "}
      </span>
    );
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
          <p >{farewellMessage}</p>
        </>
      );
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
    setTimeLeft(5);
    setIsRunning(false);
    setFarewellMessage('');
  }



  return (
    <>
      <main className={isGameLost || timeLeft === 0 ? 'game-lost' : ''}>
        <header>
          <h1>Assembly: Endgame</h1>
          <p>Guess the word within {languages.length - 1} attempts to keep the programming word safe from Assembly!</p>
          <h2>
            Remaining guesses: {languages.length - wrongGuessArray.length - 1}
          </h2>
          <h2>
            Time remaining: {timeLeft}s
          </h2>
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

