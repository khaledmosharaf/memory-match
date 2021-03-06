import { useCallback, useEffect, useState } from 'react'
import './App.css'

const intialCardCollection = [
  { src: '/img/alphabet-02.jpg' },
  { src: '/img/alphabet-01.jpg' },
  { src: '/img/alphabet-03.jpg' },
  { src: '/img/alphabet-04.jpg' },
  { src: '/img/alphabet-05.jpg' },
  { src: '/img/alphabet-06.jpg' },
  { src: '/img/alphabet-07.jpg' },
  { src: '/img/alphabet-08.jpg' },
]
let unmatchedSound = new Audio('/audio/unmatched.wav')
let tapSound = new Audio('/audio/tap.wav')
let matchedSound = new Audio('/audio/matched.wav')

export default function App() {
  const [cards, setCards] = useState([])
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [turns, setTurns] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
  const [turnDisabled, setTurnDisabled] = useState(true)

  const shuffleCards = () => {
    const shuffledCards = [...intialCardCollection, ...intialCardCollection]
      .sort(() => Math.floor(Math.random() * (1 - -1 + 1) + -1))
      .map((card) => ({ ...card, id: Math.random(), matched: false }))
    setCards(shuffledCards)
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(0)
    setTurnDisabled(false)
  }

  const handleCardClick = (card) => {
    setTimeout(() => {
      tapSound.play()
    }, 50)
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  const resetTurn = useCallback(() => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setIsDisabled(false)
    setTurns((prevTurns) => prevTurns + 1)
  }, [])

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setIsDisabled(true)
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              matchedSound.play()

              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        // console.log('unmatched')
        setTimeout(() => {
          unmatchedSound.play()
        }, 200)
        setTimeout(() => resetTurn(), 1200)
      }
    }
  }, [choiceOne, choiceTwo, resetTurn])

  //// start game automatically at the start
  // useEffect(() => shuffleCards(), [])

  // console.log(cards)

  return (
    <div className='App'>
      <h1>Memory Match!</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className='card-grid'>
        {cards.map((card) => (
          <div
            key={card.id}
            className={
              card === choiceOne || card === choiceTwo || card.matched
                ? 'card card-flipped'
                : 'card'
            }
          >
            <img src={card.src} className='card-front' alt='front' />
            <img
              onClick={() => {
                !isDisabled && handleCardClick(card)
              }}
              src='/img/cover.jpg'
              className='card-back'
              alt='back'
            />
          </div>
        ))}
      </div>
      {!turnDisabled && <h3>Turns: {turns}</h3>}
      {console.log('Double Click Bug')}
    </div>
  )
}
