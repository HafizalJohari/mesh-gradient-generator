import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Play, Square, Download, Plus, Minus, RefreshCw, Pause, Moon, Sun } from 'lucide-react';
import GIF from 'gif.js.optimized';
import { FFmpeg } from '@ffmpeg/ffmpeg';

// UI Components
const Slider = ({ label, min, max, step, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer small-slider" // Added class "small-slider"
    />
    <span className="text-sm text-gray-500 dark:text-gray-400">{value}</span>
  </div>
);


const Button = ({ onClick, disabled, children, variant = 'primary', className = '' }) => {
  const baseStyle = "px-3 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const ColorInput = ({ value, onChange }) => (
  <input
    type="color"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full h-10 p-1 rounded border border-gray-300 dark:border-gray-700"
  />
);

const GradientPointCard = ({ point, index, updatePoint, removePoint }) => (
  <div className="mb-4 p-4 border rounded-lg dark:border-gray-700">
    <h4 className="font-semibold mb-2 dark:text-gray-300">Point {index + 1}</h4>
    <div className="flex gap-4 mb-2">
      <Slider label="X" min={0} max={100} step={1} value={point.x} onChange={(value) => updatePoint(index, 'x', value)} />
      <Slider label="Y" min={0} max={100} step={1} value={point.y} onChange={(value) => updatePoint(index, 'y', value)} />
    </div>
    <ColorInput value={point.color} onChange={(value) => updatePoint(index, 'color', value)} />
    <Button onClick={() => removePoint(index)} variant="danger" className="mt-2 w-full">
      <Minus className="mr-2 h-4 w-4" /> Remove Point
    </Button>
  </div>
);

const MeshGradientGenerator = () => {
  const [gradientPoints, setGradientPoints] = useState([
    { x: 0, y: 0, color: '#ff0000' },
    { x: 100, y: 0, color: '#00ff00' },
    { x: 0, y: 100, color: '#0000ff' },
    { x: 100, y: 100, color: '#ffff00' },
  ]);
  const [blur, setBlur] = useState(40);
  const [opacity, setOpacity] = useState(0.5);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frames, setFrames] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [error, setError] = useState(null);
  const [gifUrl, setGifUrl] = useState(null); // Simpan URL GIF
  const [isDarkMode, setIsDarkMode] = useState(false); // State untuk mod gelap
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const animationRef = useRef(null);
  const ffmpegRef = useRef(new FFmpeg({ log: true }));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const updatePoint = (index, key, value) => {
    const newPoints = [...gradientPoints];
    newPoints[index] = { ...newPoints[index], [key]: value };
    setGradientPoints(newPoints);
  };

  const addPoint = () => {
    if (gradientPoints.length < 8) {
      setGradientPoints([...gradientPoints, { x: 50, y: 50, color: '#ffffff' }]);
    } else {
      setError("Maximum of 8 points allowed");
    }
  };

  const removePoint = (index) => {
    if (gradientPoints.length > 2) {
      setGradientPoints(gradientPoints.filter((_, i) => i !== index));
    } else {
      setError("Minimum of 2 points required");
    }
  };

  const generateSVG = useCallback(() => {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="blur">
            <feGaussianBlur stdDeviation="${blur}" />
          </filter>
        </defs>
        ${gradientPoints.map((point, index) => `
          <circle
            cx="${point.x}"
            cy="${point.y}"
            r="50"
            fill="${point.color}"
            opacity="${opacity}"
            filter="url(#blur)"
          >
            <animate
              attributeName="cx"
              values="${point.x};${(point.x + 10) % 100};${point.x}"
              dur="5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="${point.y};${(point.y + 10) % 100};${point.y}"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
        `).join('')}
      </svg>
    `;
  }, [gradientPoints, blur, opacity]);

  const [svgString, setSvgString] = useState('');

  useEffect(() => {
    setSvgString(generateSVG());
  }, [generateSVG]);

  const captureFrame = useCallback(() => {
    const svg = svgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const frameData = canvas.toDataURL('image/png');
      setFrames(prevFrames => [...prevFrames, frameData]);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setError(null);
    setFrames([]);
    captureFrame();
  };

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    generateGif();
  }, []);

  useEffect(() => {
    let intervalId;
    if (isRecording) {
      intervalId = setInterval(captureFrame, 100);
      setTimeout(stopRecording, 5000); // Stop recording after 5 seconds
    }
    return () => clearInterval(intervalId);
  }, [isRecording, captureFrame, stopRecording]);

  const playAnimation = () => {
    setIsPlaying(true);
    playNextFrame();
  };

  const playNextFrame = () => {
    setCurrentFrame((prevFrame) => {
      const nextFrame = (prevFrame + 1) % frames.length;
      animationRef.current = requestAnimationFrame(playNextFrame);
      return nextFrame;
    });
  };

  const stopAnimation = () => {
    setIsPlaying(false);
    cancelAnimationFrame(animationRef.current);
  };

  const saveGifToMemory = (blob) => {
    const url = URL.createObjectURL(blob);
    setGifUrl(url); // Simpan URL GIF
  };

  const downloadGif = () => {
    if (!gifUrl) return;
    const link = document.createElement('a');
    link.href = gifUrl;
    link.download = 'mesh-gradient.gif';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateGif = () => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvasRef.current.width,
      height: canvasRef.current.height
    });

    frames.forEach(frame => {
      const img = new Image();
      img.src = frame;
      gif.addFrame(img, { delay: 100 });
    });

    gif.on('finished', (blob) => {
      saveGifToMemory(blob);
    });

    gif.render();
  };

  const generateVideo = async () => {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    const inputFiles = await Promise.all(frames.map(async (frame, index) => ({
      path: `frame${index}.png`,
      data: new Uint8Array(await (await fetch(frame)).arrayBuffer())
    })));

    inputFiles.forEach(({ path, data }) => {
      ffmpeg.FS('writeFile', path, data);
    });

    await ffmpeg.run('-framerate', '10', '-i', 'frame%d.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', 'output.mp4');
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);

    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'mesh-gradient.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSvg = () => {
    const svgData = svgString;
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = svgUrl;
    link.download = 'mesh-gradient.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetGradient = () => {
    setGradientPoints([
      { x: 0, y: 0, color: '#ff0000' },
      { x: 100, y: 0, color: '#00ff00' },
      { x: 0, y: 100, color: '#0000ff' },
      { x: 100, y: 100, color: '#ffff00' },
    ]);
    setBlur(40);
    setOpacity(0.5);
    setFrames([]);
    setGifUrl(null);
    setError(null);
    stopAnimation();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`p-4 max-w-6xl mx-auto ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center dark:text-gray-300">Mesh Gradient Generator</h2>
        <Button onClick={toggleDarkMode} variant="secondary">
          {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <div 
            className="w-full mb-4 border rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700"
            style={{ width: '720px', height: '405px' }}
            ref={svgRef}
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} width="720" height="405" />
          {frames.length > 0 && (
            <img src={frames[currentFrame]} alt="Animation preview" className="w-full mb-4 border rounded-lg dark:border-gray-700" />
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            {!isRecording ? (
              <Button onClick={startRecording} disabled={isRecording}>
                <Camera className="mr-2 h-4 w-4" /> Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="danger">
                <Square className="mr-2 h-4 w-4" /> Stop Recording
              </Button>
            )}
            {frames.length > 0 && (
              <>
                <Button onClick={isPlaying ? stopAnimation : playAnimation}>
                  {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                {gifUrl && (
                  <Button onClick={downloadGif} variant="secondary">
                    <Download className="mr-2 h-4 w-4" /> Download GIF
                  </Button>
                )}
                <Button onClick={generateVideo} variant="secondary">
                  <Download className="mr-2 h-4 w-4" /> Download Video
                </Button>
              </>
            )}
            <Button onClick={downloadSvg} variant="secondary">
              <Download className="mr-2 h-4 w-4" /> Download SVG
            </Button>
            <Button onClick={resetGradient} variant="secondary">
              <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
        </div>
        <div className="w-full lg:w-1/3">
          <h3 className="text-xl font-semibold mb-4 dark:text-gray-300">Gradient Points</h3>
          <div className="max-h-96 overflow-y-auto">
            {gradientPoints.map((point, index) => (
              <GradientPointCard
                key={index}
                point={point}
                index={index}
                updatePoint={updatePoint}
                removePoint={removePoint}
              />
            ))}
          </div>
          <Button onClick={addPoint} disabled={gradientPoints.length >= 8} className="w-full mt-4">
            <Plus className="mr-2 h-4 w-4" /> Add Point
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Slider label="Blur" min={0} max={100} step={1} value={blur} onChange={setBlur} />
  <Slider label="Opacity" min={0} max={1} step={0.01} value={opacity} onChange={setOpacity} />
</div>

    </div>
  );
};

export default MeshGradientGenerator;
