import { Playfair_Display } from "next/font/google";
import { MerrakiiLanding } from "@/components/home/MerrakiiLanding";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-mk-serif",
  display: "swap",
});

export const metadata = {
  title: "Merrakii — Study abroad & Study in India",
  description:
    "Merrakii by Munjal Universal Consultancy. International study destinations, counselling, and India pathways — fields, exams, institutes, and guided enrolment.",
};

export default function HomePage() {
  return (
    <div
      className={`${playfair.variable} min-h-screen w-full max-w-[100%] overflow-x-clip font-sans antialiased`}
    >
      <MerrakiiLanding />
    </div>
  );
}
