import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto 2xl:p-44 lg:p-32 p-10">
      <div className="grid lg:grid-cols-3 sm:grid-cols-3 gap-6">
        <div className="lg:col-span-2 sm:col-span-2">
          <p className="2xl:text-2xl lg:text-xl text-primary mb-4 sm:text-lg">Hi! 👋</p>
          <p className="2xl:text-5xl lg:text-3xl text-xl">
            <a className="font-bold text-primary">I am Areydra</a>
            <a className="text-secondary">, a Software Engineer with over 4 years of experience.</a>
          </p>
          <p className="text-lg text-secondary 2xl:mt-14 lg:mt-8 mt-5 sm:text-base xs:text-sm">
            Currently
            <a className="text-primary"> working </a>
            at
            <a className="text-primary"> Flip </a>
            as a
            <a className="text-primary"> Software Engineer</a>
            , specializing in
            <a className="text-primary"> Mobile React Native</a>.
            Invite me to join your project {'->'} <a className="text-primary underline">areydra@gmail.com</a>
          </p>
        </div>
        <div className="lg:col-span-1 sm:col-span-1 lg:justify-self-end flex items-center">
          <Image
            src="/photo.jpg"
            alt="Vercel Logo"
            width={"0"}
            height={"0"}
            sizes="100vw"
            className="w-full h-auto rounded-[1rem] sm:w-60"
          />
        </div>
      </div>
      <div className="align-middle mt-20">
        <p className="2lg:text-8xl lg:text-5xl sm:text-3xl text-primary font-semibold xs:text-xl">
          Let's work together on your next project.
        </p>
        <p className="2lg:text-4xl lg:text-xl sm:text-lg underline text-secondary 2lg:mt-16 lg:mt-4">
          areydra@gmail.com
        </p>
      </div>
    </main>
  );
}
