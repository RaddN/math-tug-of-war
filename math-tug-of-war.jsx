import React, { useState, useEffect, useRef } from 'react';
import { Check, Users, Trophy, Zap, Timer, Award } from 'lucide-react';

// Custom hook for game timer
const useGameTimer = (isActive) => {
  const [time, setTime] = useState(30);
  
  useEffect(() => {
    if (!isActive || time === 0) return;
    
    const interval = setInterval(() => {
      setTime(t => Math.max(0, t - 1));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isActive, time]);
  
  return time;
};

// Animated rope component
const RopeVisual = ({ team1Score, team2Score, maxScore = 10 }) => {
  const totalScore = team1Score + team2Score;
  const position = totalScore > 0 
    ? ((team2Score - team1Score) / maxScore) * 50 
    : 0;
  
  const clampedPosition = Math.max(-50, Math.min(50, position));
  
  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-rose-500/10" />
      
      {/* Team zones */}
      <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-cyan-500/20 to-transparent border-r-2 border-cyan-500/30" />
      <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-rose-500/20 to-transparent border-l-2 border-rose-500/30" />
      
      {/* Center line */}
      <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
      
      {/* Characters */}
      <div 
        className="absolute transition-all duration-700 ease-out flex items-center gap-8"
        style={{ 
          transform: `translateX(${clampedPosition}%)`,
          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
        }}
      >
        {/* Team 1 (Cyan) - Left side */}
        <div className="flex gap-2">
          {[...Array(2)].map((_, i) => (
            <div 
              key={`t1-${i}`}
              className="relative"
              style={{
                animation: 'pullLeft 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`
              }}
            >
              <div className="w-16 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-t-full relative">
                {/* Head */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-cyan-300 to-cyan-500 rounded-full border-4 border-white" />
                {/* Arms */}
                <div className="absolute top-4 -right-2 w-8 h-2 bg-cyan-500 rounded-full rotate-45" />
                <div className="absolute top-4 -left-2 w-8 h-2 bg-cyan-500 rounded-full -rotate-45" />
              </div>
              {/* Legs */}
              <div className="flex gap-1 justify-center">
                <div className="w-5 h-8 bg-gradient-to-b from-cyan-600 to-cyan-700 rounded-b-lg" />
                <div className="w-5 h-8 bg-gradient-to-b from-cyan-600 to-cyan-700 rounded-b-lg" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Rope */}
        <div className="relative">
          <div className="w-32 h-3 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-full shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,0,0,0.3)_8px,rgba(0,0,0,0.3)_10px)]" />
            {/* Knot in middle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-600 rounded-full border-2 border-red-700 shadow-lg" />
          </div>
        </div>
        
        {/* Team 2 (Rose) - Right side */}
        <div className="flex gap-2">
          {[...Array(2)].map((_, i) => (
            <div 
              key={`t2-${i}`}
              className="relative"
              style={{
                animation: 'pullRight 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`
              }}
            >
              <div className="w-16 h-20 bg-gradient-to-br from-rose-400 to-rose-600 rounded-t-full relative">
                {/* Head */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-rose-300 to-rose-500 rounded-full border-4 border-white" />
                {/* Arms */}
                <div className="absolute top-4 -right-2 w-8 h-2 bg-rose-500 rounded-full rotate-45" />
                <div className="absolute top-4 -left-2 w-8 h-2 bg-rose-500 rounded-full -rotate-45" />
              </div>
              {/* Legs */}
              <div className="flex gap-1 justify-center">
                <div className="w-5 h-8 bg-gradient-to-b from-rose-600 to-rose-700 rounded-b-lg" />
                <div className="w-5 h-8 bg-gradient-to-b from-rose-600 to-rose-700 rounded-b-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Victory zones indicators */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <Trophy className="w-8 h-8 text-cyan-500" />
        <div className="text-xs font-bold text-cyan-600">CYAN WINS</div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <Trophy className="w-8 h-8 text-rose-500" />
        <div className="text-xs font-bold text-rose-600">ROSE WINS</div>
      </div>
    </div>
  );
};

// Number pad component
const NumberPad = ({ onNumberClick, onSubmit, currentAnswer, disabled }) => {
  const buttons = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['←', 0, '✓']
  ];
  
  return (
    <div className="space-y-3">
      <div className="h-16 bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl flex items-center justify-center shadow-inner">
        <div className="text-4xl font-black text-white tracking-wider">
          {currentAnswer || '0'}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {buttons.flat().map((btn, idx) => {
          const isBackspace = btn === '←';
          const isSubmit = btn === '✓';
          const isNumber = typeof btn === 'number';
          
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => {
                if (isBackspace) {
                  onNumberClick('backspace');
                } else if (isSubmit) {
                  onSubmit();
                } else {
                  onNumberClick(btn);
                }
              }}
              className={`
                h-16 rounded-xl font-black text-xl transition-all duration-200
                shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                ${isSubmit 
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700' 
                  : isBackspace
                  ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
                  : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700'
                }
              `}
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Score display component
const ScoreDisplay = ({ score, teamColor, label, position }) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${position === 'left' ? 'order-1' : 'order-3'}`}>
      <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">{label}</div>
      <div className={`
        w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center
        bg-gradient-to-br ${teamColor === 'cyan' ? 'from-cyan-400 to-cyan-600' : 'from-rose-400 to-rose-600'}
        border-4 border-white transform hover:scale-105 transition-transform
      `}>
        <div className="text-4xl font-black text-white">{score}</div>
      </div>
    </div>
  );
};

const MathTugOfWar = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, finished
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [activePlayer, setActivePlayer] = useState(1); // 1 or 2
  const [difficulty, setDifficulty] = useState('easy'); // easy, medium, hard
  const [gameMode, setGameMode] = useState('local'); // local, online
  const [winner, setWinner] = useState(null);
  
  const time = useGameTimer(gameState === 'playing');
  
  // Generate random math problem based on difficulty
  const generateProblem = () => {
    let num1, num2, operation;
    
    switch(difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = Math.random() > 0.5 ? '+' : '-';
        if (operation === '-' && num2 > num1) [num1, num2] = [num2, num1];
        break;
      case 'medium':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        operation = ['+', '-', '×'][Math.floor(Math.random() * 3)];
        if (operation === '-' && num2 > num1) [num1, num2] = [num2, num1];
        if (operation === '×') {
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
        }
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        operation = ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)];
        if (operation === '-' && num2 > num1) [num1, num2] = [num2, num1];
        if (operation === '×') {
          num1 = Math.floor(Math.random() * 15) + 1;
          num2 = Math.floor(Math.random() * 15) + 1;
        }
        if (operation === '÷') {
          num2 = Math.floor(Math.random() * 12) + 1;
          num1 = num2 * (Math.floor(Math.random() * 12) + 1);
        }
        break;
    }
    
    let answer;
    switch(operation) {
      case '+': answer = num1 + num2; break;
      case '-': answer = num1 - num2; break;
      case '×': answer = num1 * num2; break;
      case '÷': answer = num1 / num2; break;
    }
    
    setCurrentProblem({ num1, num2, operation, answer });
    setCurrentAnswer('');
  };
  
  const startGame = () => {
    setGameState('playing');
    setTeam1Score(0);
    setTeam2Score(0);
    setActivePlayer(1);
    setWinner(null);
    generateProblem();
  };
  
  const handleNumberClick = (num) => {
    if (num === 'backspace') {
      setCurrentAnswer(prev => prev.slice(0, -1));
    } else {
      if (currentAnswer.length < 4) {
        setCurrentAnswer(prev => prev + num.toString());
      }
    }
  };
  
  const handleSubmit = () => {
    if (!currentAnswer || !currentProblem) return;
    
    const userAnswer = parseInt(currentAnswer);
    
    if (userAnswer === currentProblem.answer) {
      // Correct answer - add point to active player's team
      if (activePlayer === 1) {
        setTeam1Score(prev => prev + 1);
      } else {
        setTeam2Score(prev => prev + 1);
      }
      
      // Switch to other player
      setActivePlayer(activePlayer === 1 ? 2 : 1);
      generateProblem();
    } else {
      // Wrong answer - just switch player
      setActivePlayer(activePlayer === 1 ? 2 : 1);
      generateProblem();
    }
  };
  
  // Check for winner
  useEffect(() => {
    if (team1Score >= 10) {
      setWinner('Team Cyan');
      setGameState('finished');
    } else if (team2Score >= 10) {
      setWinner('Team Rose');
      setGameState('finished');
    } else if (time === 0 && gameState === 'playing') {
      setWinner(team1Score > team2Score ? 'Team Cyan' : team2Score > team1Score ? 'Team Rose' : 'Tie');
      setGameState('finished');
    }
  }, [team1Score, team2Score, time, gameState]);
  
  // Menu screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 flex items-center justify-center">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Space+Mono:wght@700&display=swap');
          
          * {
            font-family: 'Fredoka', sans-serif;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.5)); }
            50% { filter: drop-shadow(0 0 40px rgba(255,255,255,0.8)); }
          }
        `}</style>
        
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <div className="inline-block" style={{ animation: 'float 3s ease-in-out infinite' }}>
              <Trophy className="w-24 h-24 text-yellow-300 mb-4 mx-auto" style={{ animation: 'glow 2s ease-in-out infinite' }} />
            </div>
            <h1 className="text-7xl font-black text-white mb-4 tracking-tight" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}>
              MATH TUG OF WAR
            </h1>
            <p className="text-2xl text-purple-100 font-semibold">Battle with numbers! Pull your team to victory!</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 border-white/20">
            <div className="mb-8">
              <label className="block text-white text-xl font-bold mb-4">Choose Difficulty</label>
              <div className="grid grid-cols-3 gap-4">
                {['easy', 'medium', 'hard'].map(level => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`
                      py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200
                      ${difficulty === level 
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white scale-105 shadow-xl' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                      }
                    `}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="w-full py-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-black text-3xl shadow-2xl hover:shadow-pink-500/50 hover:scale-105 transition-all duration-200"
            >
              START GAME
            </button>
          </div>
          
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-4 border-white/20">
            <h3 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-300" />
              How to Play
            </h3>
            <ul className="text-purple-100 space-y-2 text-lg">
              <li>• Players take turns solving math problems</li>
              <li>• Correct answers pull the rope toward your team</li>
              <li>• First team to reach 10 points wins!</li>
              <li>• Game ends after 30 seconds or when a team wins</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  // Game over screen
  if (gameState === 'finished') {
    const isCyanWinner = winner === 'Team Cyan';
    const isRoseWinner = winner === 'Team Rose';
    const isTie = winner === 'Tie';
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${
        isCyanWinner ? 'from-cyan-500 to-cyan-700' :
        isRoseWinner ? 'from-rose-500 to-rose-700' :
        'from-purple-500 to-indigo-700'
      } p-8 flex items-center justify-center`}>
        <div className="max-w-2xl w-full text-center">
          <div style={{ animation: 'float 3s ease-in-out infinite' }}>
            <Award className="w-32 h-32 text-yellow-300 mx-auto mb-8" style={{ animation: 'glow 2s ease-in-out infinite' }} />
          </div>
          
          <h1 className="text-8xl font-black text-white mb-6" style={{ textShadow: '6px 6px 0px rgba(0,0,0,0.3)' }}>
            {isTie ? "IT'S A TIE!" : `${winner} WINS!`}
          </h1>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 mb-8 border-4 border-white/30">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-6xl font-black text-cyan-200 mb-2">{team1Score}</div>
                <div className="text-2xl font-bold text-white">Team Cyan</div>
              </div>
              <div>
                <div className="text-6xl font-black text-rose-200 mb-2">{team2Score}</div>
                <div className="text-2xl font-bold text-white">Team Rose</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setGameState('menu')}
            className="px-12 py-6 bg-white text-purple-600 rounded-2xl font-black text-3xl shadow-2xl hover:scale-105 transition-all duration-200"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }
  
  // Playing screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Space+Mono:wght@700&display=swap');
        
        * {
          font-family: 'Fredoka', sans-serif;
        }
        
        @keyframes pullLeft {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(-3px) rotate(-2deg); }
        }
        
        @keyframes pullRight {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(3px) rotate(2deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <ScoreDisplay score={team1Score} teamColor="cyan" label="Team Cyan" position="left" />
          
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-white/20">
              <Timer className="w-6 h-6 text-yellow-300" />
              <div className="text-3xl font-black text-white font-['Space_Mono']">
                0:{time.toString().padStart(2, '0')}
              </div>
            </div>
            
            <div className="text-lg font-bold text-white/80 bg-white/10 px-6 py-2 rounded-full">
              {difficulty.toUpperCase()} MODE
            </div>
          </div>
          
          <ScoreDisplay score={team2Score} teamColor="rose" label="Team Rose" position="right" />
        </div>
        
        {/* Rope visual */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 mb-6 border-2 border-white/10">
          <RopeVisual team1Score={team1Score} team2Score={team2Score} />
        </div>
        
        {/* Game area */}
        <div className="grid grid-cols-2 gap-6">
          {/* Team 1 side */}
          <div className={`
            bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 backdrop-blur-lg rounded-3xl p-8 border-4
            ${activePlayer === 1 ? 'border-cyan-400 shadow-xl shadow-cyan-500/50' : 'border-white/10 opacity-50'}
            transition-all duration-300
          `}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 rounded-full bg-cyan-400" style={activePlayer === 1 ? { animation: 'pulse 1s ease-in-out infinite' } : {}} />
              <h2 className="text-3xl font-black text-white">Player 1</h2>
            </div>
            
            {activePlayer === 1 && currentProblem && (
              <>
                <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-8 mb-6 shadow-xl">
                  <div className="text-6xl font-black text-slate-800 text-center">
                    {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = ?
                  </div>
                </div>
                
                <NumberPad
                  onNumberClick={handleNumberClick}
                  onSubmit={handleSubmit}
                  currentAnswer={currentAnswer}
                  disabled={activePlayer !== 1}
                />
              </>
            )}
            
            {activePlayer !== 1 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">⏳</div>
                <div className="text-2xl font-bold text-white/60">Waiting...</div>
              </div>
            )}
          </div>
          
          {/* Team 2 side */}
          <div className={`
            bg-gradient-to-br from-rose-500/20 to-rose-600/10 backdrop-blur-lg rounded-3xl p-8 border-4
            ${activePlayer === 2 ? 'border-rose-400 shadow-xl shadow-rose-500/50' : 'border-white/10 opacity-50'}
            transition-all duration-300
          `}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 rounded-full bg-rose-400" style={activePlayer === 2 ? { animation: 'pulse 1s ease-in-out infinite' } : {}} />
              <h2 className="text-3xl font-black text-white">Player 2</h2>
            </div>
            
            {activePlayer === 2 && currentProblem && (
              <>
                <div className="bg-gradient-to-br from-white to-rose-50 rounded-2xl p-8 mb-6 shadow-xl">
                  <div className="text-6xl font-black text-slate-800 text-center">
                    {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = ?
                  </div>
                </div>
                
                <NumberPad
                  onNumberClick={handleNumberClick}
                  onSubmit={handleSubmit}
                  currentAnswer={currentAnswer}
                  disabled={activePlayer !== 2}
                />
              </>
            )}
            
            {activePlayer !== 2 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">⏳</div>
                <div className="text-2xl font-bold text-white/60">Waiting...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathTugOfWar;
