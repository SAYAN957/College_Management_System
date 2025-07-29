import React, { useState, useEffect } from 'react';

const educationalQuotes = [
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
  {
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
  },
  {
    text: 'Education is the most powerful weapon which you can use to change the world.',
    author: 'Nelson Mandela',
  },
  {
    text: 'Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that.',
    author: 'Martin Luther King Jr.',
  },
  {
    text: 'The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.',
    author: 'Helen Keller',
  },
  {
    text: 'The only limit to our realization of tomorrow will be our doubts of today.',
    author: 'Franklin D. Roosevelt',
  },
  {
    text: 'It always seems impossible until it’s done.',
    author: 'Nelson Mandela',
  },
  {
    text: 'Be the change that you wish to see in the world.',
    author: 'Mahatma Gandhi',
  },
  {
    text: 'The journey of a thousand miles begins with one step.',
    author: 'Lao Tzu',
  },
  {
    text: 'The time is always right to do what is right.',
    author: 'Martin Luther King Jr.',
  },
  {
    text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
    author: 'Mahatma Gandhi',
  },
  {
    text: 'The roots of education are bitter, but the fruit is sweet.',
    author: 'Aristotle',
  },
  {
    text: 'Education is the key to unlocking the world, a passport to freedom.',
    author: 'Oprah Winfrey',
  },
];

const Quotes = () => {
  const [quote, setQuote] = useState(educationalQuotes[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * educationalQuotes.length);
      setQuote(educationalQuotes[randomIndex]);
    }, 10000); // Change quote every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-black text-white bg-opacity-50 rounded-xl p-4 absolute bottom-0 left-0 w-full text-center">
      <p className="text-2xl italic">{quote.text}</p>
      <p className="text-base">- {quote.author}</p>
    </div>
  );
};

export default Quotes;
