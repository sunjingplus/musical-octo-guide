import Image from "next/image";

// A beautiful single testimonial with a user name and a company logo
const Testimonial = () => {
  return (
    <section
      className="relative isolate overflow-hidden  px-8 py-24 sm:py-32 bg-gray-900"
      id="testimonials"
    >
      <h2 className= "text-center font-medium text-white text-6xl mb-20">Unleash your creativity</h2>
      <div className="absolute inset-0 -z-10 " />
      <div className="mx-[10vw] ">
        {/* First Testimonial */}
        <figure className="flex flex-col lg:flex-row items-center gap-12 mb-12">
          <div className=" rounded-xl border border-base-content/5 bg-base-content/5 p-1.5 lg:w-1/2">
            <img
              className="rounded-lg md:max-w-[35vw] object-center shadow-lg"
              src="/img/makebestmusic.png"
              alt="A testimonial from a happy customer"
            />
          </div>
          <div className="lg:w-1/2">
            <blockquote className="text-lg  leading-8 text-white">
              <p>Create Music</p>
              You have the option to create instrumental music by using simple
              descriptive words. Additionally, you can generate vocal music by
              providing lyrics and specifying a desired style. This allows for a
              versatile approach to music creation, catering to both
              instrumental and vocal preferences with ease.
            </blockquote>
            <button
              className="bg-black text-white px-10 py-4 mt-6 rounded-2xl transition-all duration-100 hover:scale-105 active:scale-95"
              style={{
                boxShadow: "-1px -1px 1px 1px rgba(255, 75, 219, 0.75)", // 玫红色阴影
              }}
            >
              Try this magic for yourself
            </button>
          </div>
        </figure>

        {/* Second Testimonial */}
        <figure className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-12">
          <div className="relative rounded-xl border border-base-content/5 bg-base-content/5 p-1.5  lg:w-1/2">
            <img
              className="rounded-lg md:max-w-[35vw] object-center shadow-md"
              src="/img/makebestmusic.png"
              alt="A testimonial from a happy customer"
            />
          </div>
          <div className="lg:w-1/2">
            <blockquote className="text-lg  leading-8 text-white sm:text-xl ">
              <p>Create Music</p>
              You have the option to create instrumental music by using simple
              descriptive words. Additionally, you can generate vocal music by
              providing lyrics and specifying a desired style. This allows for a
              versatile approach to music creation, catering to both
              instrumental and vocal preferences with ease.
            </blockquote>
            <button
              className="bg-black text-white px-10 py-4 mt-6 rounded-2xl transition-all duration-100 hover:scale-105 active:scale-95"
              style={{
                boxShadow: "-1px -1px 1px 1px rgba(255, 75, 219, 0.75)", // 玫红色阴影
              }}
            >
              Try this magic for yourself
            </button>
          </div>
        </figure>

        {/* Third Testimonial */}
        <figure className="flex flex-col lg:flex-row items-center gap-12">
          <div className="relative rounded-xl border border-base-content/5 bg-base-content/5 p-1.5  lg:w-1/2">
            <img
              className="rounded-lg md:max-w-[35vw] object-center shadow-md"
              src="/img/makebestmusic.png"
              alt="A testimonial from a happy customer"
            />
          </div>
          <div className="lg:w-1/2">
            <blockquote className="text-lg  leading-8 text-white sm:text-xl ">
              <p>Create Music</p>
              You have the option to create instrumental music by using simple
              descriptive words. Additionally, you can generate vocal music by
              providing lyrics and specifying a desired style. This allows for a
              versatile approach to music creation, catering to both
              instrumental and vocal preferences with ease.
            </blockquote>
            <button
              className="bg-black text-white px-10 py-4 mt-6 rounded-2xl transition-all duration-100 hover:scale-105 active:scale-95"
              style={{
                boxShadow: "-1px -1px 1px 1px rgba(255, 75, 219, 0.75)", // 玫红色阴影
              }}
            >
              Try this magic for yourself
            </button>
          </div>
        </figure>
      </div>
    </section>
  );
};

export default Testimonial;
