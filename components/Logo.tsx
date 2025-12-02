export default function Logo() {
  return (
    <div className="flex items-center">
      <div className="relative h-10 md:h-12 w-auto flex-shrink-0">
        <img
          src="/logo.png"
          alt="Teknoritma Logo"
          className="h-full w-auto object-contain"
        />
      </div>
    </div>
  );
}
