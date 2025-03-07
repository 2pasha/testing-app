const index = () => {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
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
        <h1 className="text-5xl font-bold">Welcome to My Knowledge Testing App</h1>
        <p className="mt-2">created by Kostyshyn Pavlo</p>
      </div>
    </div>
  );
};

export default index;
