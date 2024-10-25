import Logo from "~/components/Logo";

export default function ContactPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex max-w-md flex-col gap-4">
        <h1 className="text-2xl font-bold">Contact</h1>
        <p>
          If you have any questions or feedback, please feel free to contact us
          at <a href="mailto:contact@apex.deal">contact@apex.deal</a>.
        </p>
        <p>
          1395 22nd St.
          <br />
          Apt 857
          <br />
          San Francisco, CA 94107
        </p>
        <Logo />
      </div>
    </div>
  );
}
