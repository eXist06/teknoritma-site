export default function Logo() {
  return (
    <div className="flex items-center">
      <div className="relative h-8 md:h-10 w-auto flex-shrink-0">
        <img
          src="/logo.png"
          alt="Teknoritma Logo"
          className="h-full w-auto object-contain"
        />
      </div>
    </div>
  );
}
