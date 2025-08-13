export default function Story({ name, location, summary, quote, takeaway, imageSource, imageAltText }) {
  return (
    <div className="mt-12 space-y-1 max-w-4xl mx-auto pl-10 pr-10 gap-10">
      <h2 className="text-4xl font-bold text-darkPurple">{name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="order-2 md:order-1 flex flex-col justify-center h-full">
          <p className="text-2xl text-purple-700 font-normal mt-2">{location}</p>
          <p className="text-xl mt-2">{summary}</p>
        </div>
        <div className="order-1 md:order-2 flex items-center">
          <div className="text-2xl bg-purple-200 p-5 rounded font-semibold max-w-sm w-full h-fit">
            <p>{takeaway}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="mt-2">
          <blockquote className="border-l-4 border-tcatTeal pl-4"><p>{quote}</p></blockquote>
        </div>
        <div className="flex flex-col justify-center h-full">
          <img src={imageSource} alt={imageAltText} className="border-4 border-purple-700 rounded-md" />
        </div>
      </div>
    </div>
  );
}