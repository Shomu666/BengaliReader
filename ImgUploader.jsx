import React, { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

const ImgUploader = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [typedText, setTypedText] = useState("");
  const [currSentenceIndex, setCurrSentenceIndex] = useState(0);

  const sentences = [
    "Can't read Bengali?",
    "Want to read Bengali?",
    "Listen to any Bengali Book"
  ]
  
  useEffect(() => {
    let charIndex = 0;
    const currSentence = sentences[currSentenceIndex]
    setTypedText("")

    const typingInterval = setInterval(() => {
      if(charIndex <= currSentence.length - 1){
        setTypedText(currSentence.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          setTypedText("");
          setCurrSentenceIndex((prev) => (prev + 1) % sentences.length)
        }, 2000)
      }
    }, 100)
     return () => clearInterval(typingInterval)
  }, [currSentenceIndex]);



  const handleInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  const extractText = async () => {
    if (!image) {
      alert("Please upload an Image first");
      return;
    }
    setIsLoading(true);
    setText("");
    try {
      // await Tesseract.loadLanguage('ben');
      const {
        data: { text },
      } = await Tesseract.recognize(image, "ben", {
        logger: (m) => console.log(m),
      });

      setText(text);
      setImage(null)
    } catch (error) {
      console.log(error.message);
      alert("Failed to extract text");
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = () => {
    if (!text) return;
    responsiveVoice.cancel();

    responsiveVoice.speak(text, "Bangla India Female", {
      rate: 0.9,
      pitch: 0.8,
      volume: 1,
    });
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    responsiveVoice.cancel();
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-4 items-center justify-center">
      <h1 className="text-2xl text-green-900 font-extrabold">
        {typedText}
      </h1>
      <div className="flex items-center justify-between">
        <label
          className="bg-red-300 p-2 border-red-400 border-2 rounded-md text-2xl font-bold cursor-pointer"
          htmlFor="image_upload"
        >
          {text ? 'Choose another image' : 'Choose something'}
        </label>
        <input
          type="file"
          accept="image/*"
          id="image_upload"
          className="hidden"
          onChange={handleInput}
        />
      </div>
      {image && (
        <div className="flex flex-col items-center justify-center gap-3">
         <img
            src={image}
            alt="Uploaded Image"
            className="h-40 w-36 border-red-400 border-4 rounded-md"
          />
          
          <button
            onClick={extractText}
            className="bg-green-500 text-white px-2 py-1 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Extract Text"
            )}
          </button>
        </div>
      )}
      {text && (
        <div className=" mt-4 py-8 px-20 flex flex-col items-center justify-center gap-3">
          <p className="text-xl font-semibold">{text}</p>
          <button
            className="rounded-full p-2 bg-blue-300 font-extrabold"
            onClick={toggleAudio}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImgUploader;
