'use client';

const fonts = { fontFamily: '"Plus Jakarta Sans", sans-serif' };

interface HomeHeaderProps {
  firstName: string;
}

export default function HomeHeader({ firstName }: HomeHeaderProps) {
  return (
    <header className="flex flex-col gap-1 mb-2">
      <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight" style={fonts}>
        Welcome back, {firstName}!
      </h1>
      <p className="text-[#464555] font-medium" style={fonts}>
        Here's what's new across your family silos.
      </p>
    </header>
  );
}