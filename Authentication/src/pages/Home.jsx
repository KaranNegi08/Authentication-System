import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Header from "../components/header";

const Home = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const totalBubbles = 20;
    const generated = Array.from({ length: totalBubbles }).map((_, i) => ({
      id: i,
      size: Math.random() * 80 + 20, // 20–100px
      left: Math.random() * 100, // horizontal position
      duration: Math.random() * 10 + 15, // 15–25s
      delay: Math.random() * 5,
    }));
    setBubbles(generated);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Lighter Steel-Black Gradient Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #1a1a1a, #263c4a, #1b3a4b)",
            "linear-gradient(135deg, #202020, #2b4560, #1e3545)",
            "linear-gradient(135deg, #1a1a1a, #263c4a, #1b3a4b)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Bubbles */}
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full bg-blue-400/40 blur-md shadow-lg shadow-blue-600/30"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: -150,
          }}
          animate={{
            y: [0, -window.innerHeight - 200],
            opacity: [0, 0.8, 0.8, 0],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Foreground Content */}
      <div className="relative z-10 w-full">
        <Navbar />
        <Header />
      </div>
    </div>
  );
};

export default Home;



// import React from 'react'
// import Navbar from '../components/Navbar'
// import Header from '../components/header'

// const Home = () => {
//   return (
//     <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
//       <Navbar />
//       <Header />
//     </div>
//   )
// }

// export default Home
