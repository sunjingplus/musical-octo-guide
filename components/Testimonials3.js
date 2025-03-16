import Image from "next/image";
import config from "../../../../config";

// The list of your testimonials. It needs 3 items to fill the row.
const list = [
  {
    // Optional, use for social media like Twitter. Does not link anywhere but cool to display
    username: ">",
    // REQUIRED
    name: "try now",
    title: "Text to Music",
    // REQUIRED
    text: " Generate music directly from simple descriptionsor lyrics",
    // Optional, a statically imported image (usually from your public folder—recommended) or a link to the person's avatar. Shows a fallback letter if not provided
  },
  {
    username: ">",
    // REQUIRED
    name: "try now",
    title: "Text to Music",
    // REQUIRED
    text: " Generate music directly from simple descriptionsor lyrics",
  },
  {
    username: ">",
    // REQUIRED
    name: "try now",
    title: "Text to Music",
    // REQUIRED
    text: " Generate music directly from simple descriptionsor lyrics",
  },
];

// A single testimonial, to be rendered in  a list
const Testimonial = ({ i }) => {
  const testimonial = list[i];

  if (!testimonial) return null;

  return (
    <li key={i}>
      <figure className="relative max-w-lg h-full  md:p-10 bg-transparent rounded-2xl max-md:text-sm flex flex-col text-white">
        {testimonial.img ? (
          <Image
            className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover mb-4"
            src={list[i].img}
            alt={`${list[i].name}'s testimonial for ${config.appName}`}
            width={48}
            height={48}
          />
        ) : (
          <span className="w-10 h-10 md:w-12 md:h-12 rounded-md flex justify-center items-center text-lg font-medium bg-pink-400 mb-4">
            {testimonial.name.charAt(0)}
          </span>
        )}
        <blockquote className="relative flex-1">
          <h4 className="font-medium mb-2">{testimonial.title}</h4>
          <p className="leading-relaxed">
            {testimonial.text}
          </p>
        </blockquote>
        <figcaption className="relative flex items-center justify-start gap-4 pt-4 mt-4 md:gap-8 md:pt-8 md:mt-8 border-t border-white/20">
          <div className="w-full flex items-center justify-between gap-2">
            <div>
              <a href="#" className="font-medium md:mb-0.5 text-pink-500">
                {testimonial.name}
                {testimonial.username}
              </a>
            </div>

            <div className="overflow-hidden rounded-full bg-transparent shrink-0"></div>
          </div>
        </figcaption>
      </figure>
    </li>
  );
};

const Testimonials3 = () => {
  return (
    <section id="testimonials" className="bg-gray-900 text-white">
      <div className="py-24  px-8 mx-[10vw]">
        <div className="flex flex-col  w-[40vw] mb-20">
          <div className="mb-8">
            <h2 className="sm:text-4xl text-3xl font-extrabold">
              Powerful Al music tool,one-click generation of perfect music
            </h2>
          </div>
          <p className=" leading-relaxed text-md">
            Generate dynamic music with one click through text description
          </p>
        </div>

        <ul
          role="list"
          className="flex flex-col items-center lg:flex-row lg:items-stretch gap-6 lg:gap-8"
        >
          {[...Array(3)].map((e, i) => (
            <Testimonial key={i} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials3;