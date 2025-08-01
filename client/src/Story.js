export default function Story({name, location, summary, quote, takeaway, imageSource, imageAltText}) {
    return (
      <div className="mt-12 space-y-1 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-darkPurple">{name}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="text-2xl text-purple-700 font-normal mt-2">{location}</p>
            <p className="text-xl mt-4">{summary}</p>
            <br></br>
            <blockquote className="border-l-4 border-tcatTeal pl-4"><p>{quote}</p></blockquote>
          </div>

          <div>
            <div className="text-2xl bg-purple-200 p-5 rounded font-semibold max-w-sm"><p>{takeaway}</p></div>
            <br></br>
            <div>
              <img src={imageSource} alt={imageAltText} className="border-4 border-purple-700 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
}

// export default function Story({name, location, summary, quote, takeaway, imageSource, imageAltText}) {
//     return (
//       <div className="mt-12 space-y-1 max-w-4xl mx-auto">
//         <h2 className="text-4xl font-bold text-darkPurple">{name}</h2>
//         <p className="text-2xl text-purple-700 font-normal">{location}</p>
//         <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
//           <div>
//             <p className="text-xl mt-4">{summary}</p>
//             <br></br>
//             <blockquote className="border-l-4 border-tcatTeal pl-4"><p>{quote}</p></blockquote>
//             <div className="text-2xl bg-purple-200 p-5 rounded font-semibold max-w-sm m-5"><p>{takeaway}</p></div>
//           </div>

//           <div>
//             <div>
//               <img src={imageSource} alt={imageAltText} className="border-4 border-purple-700 rounded-md" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
// }