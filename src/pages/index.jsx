const index = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video - Fullscreen */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/video.webm" type="video/webm" />
        <source src="/videos/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black/50">
        <h1 className="text-5xl font-bold">Welcome to My Next.js App</h1>
      </div>
    </div>
  );
};

export default index;
