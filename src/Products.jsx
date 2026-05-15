import { useState } from "react";
import Breadcrumb from "./Breadcrumbs";

export default function Products() {
  const [sizeFilter, setSizeFilter] = useState(null);
  const [colorFilter, setColorFilter] = useState(null);

  const dogsArray = [
    {
      size: "S",
      color: "white",
      image: "https://placedog.net/400/300?id=1",
      name: "Gigi",
      age: 1,
    },
    {
      size: "M",
      color: "white",
      image: "https://placedog.net/400/300?id=2",
      name: "Tom",
      age: 2,
    },
    {
      size: "L",
      color: "white",
      image: "https://placedog.net/400/300?id=3",
      name: "Jake",
      age: 3,
    },
    {
      size: "S",
      color: "black",
      image: "https://placedog.net/400/300?id=4",
      name: "Hill",
      age: 1,
    },
    {
      size: "M",
      color: "black",
      image: "https://placedog.net/400/300?id=5",
      name: "Jack",
      age: 2,
    },
    {
      size: "L",
      color: "black",
      image: "https://placedog.net/400/300?id=6",
      name: "Jones",
      age: 3,
    },
    {
      size: "S",
      color: "brown",
      image: "https://placedog.net/400/300?id=7",
      name: "Herbert",
      age: 1,
    },
    {
      size: "M",
      color: "brown",
      image: "https://placedog.net/400/300?id=8",
      name: "Coco",
      age: 2,
    },
    {
      size: "L",
      color: "brown",
      image: "https://placedog.net/400/300?id=9",
      name: "Benny",
      age: 3,
    },
  ];

  const filteredDogs = dogsArray.filter((dog) => {
    if (sizeFilter && dog.size !== sizeFilter) return false;

    if (colorFilter && dog.color !== colorFilter) return false;

    return true;
  });

  return (
    <div className="flex flex-col items-center p-2">
      <h1 className="text-4xl font-bold text-orange-950 p-4">Adopt a Friend 🐶</h1>
      <Breadcrumb sizeFilter={sizeFilter} colorFilter={colorFilter} />
      <main className="w-full max-w-6xl flex flex-col gap-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredDogs.map((dog) => (
            <div key={dog.name} className="bg-white/40 p-4 rounded-xl shadow-md flex flex-col">
              <div className="w-full h-[160px] bg-orange-100 rounded-md overflow-hidden mb-3">
                <img 
                  className="w-full h-full object-cover" 
                  src={dog.image} 
                  alt={dog.name} 
                  onError={(e) => { 
                    e.target.src = `https://picsum.photos/seed/${dog.name}/400/300`; 
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-orange-950 text-xl tracking-tight">{dog.name}</h3>
                  <span className="px-2 py-0.5 bg-orange-900 text-white text-[10px] font-bold rounded uppercase">
                    Talla {dog.size}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-orange-200/60">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-orange-800/70 font-bold tracking-wider">Color</span>
                    <span className="text-orange-950 capitalize text-sm font-semibold">{dog.color}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-orange-800/70 font-bold tracking-wider">Edad</span>
                    <span className="text-orange-950 text-sm font-semibold">
                      {dog.age} {dog.age > 1 ? "años" : "año"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white/60 rounded-2xl border border-white shadow-sm self-center w-full max-w-2xl">
            <h2 className="text-xl font-bold text-orange-950 mb-4">Filter by</h2>
            <div className="flex items-center mb-4">
              <h3 className="w-16 font-semibold">Size:</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setSizeFilter(null)}
                  className={`p-2 text-center rounded-md min-w-14 transition-colors ${sizeFilter === null ? 'bg-orange-900 text-white' : 'bg-white'}`}>
                  All
                </button>
                <button
                  onClick={() => setSizeFilter("S")}
                  className={`p-2 text-center rounded-md min-w-14 transition-colors ${sizeFilter === "S" ? 'bg-orange-900 text-white' : 'bg-white'}`}>
                  S
                </button>
                <button
                  onClick={() => setSizeFilter("M")}
                  className={`p-2 text-center rounded-md min-w-14 transition-colors ${sizeFilter === "M" ? 'bg-orange-900 text-white' : 'bg-white'}`}>
                  M
                </button>
                <button
                  onClick={() => setSizeFilter("L")}
                  className={`p-2 text-center rounded-md min-w-14 transition-colors ${sizeFilter === "L" ? 'bg-orange-900 text-white' : 'bg-white'}`}>
                  L
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <h3 className="w-16 font-semibold">Color:</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setColorFilter(null)}
                  className={`p-2 text-center rounded-md min-w-14 transition-colors ${colorFilter === null ? 'bg-orange-900 text-white' : 'bg-white'}`}>
                  All
                </button>
                <button
                  onClick={() => setColorFilter("white")}
                  className={`p-2 text-center rounded-md min-w-14 transition-colors ${colorFilter === 'white' ? 'bg-orange-900 text-white' : 'bg-white'}`}>
                  White
                </button>
                <button
                  onClick={() => setColorFilter("brown")}
                  className={`p-2 text-center rounded-md min-w-14 transition-colors ${colorFilter === 'brown' ? 'bg-orange-900 text-white' : 'bg-white'}`}>
                  Brown
                </button>
                <button
                  onClick={() => setColorFilter("black")}
                  className={`p-2 text-center rounded-md min-w-14 transition-colors ${colorFilter === 'black' ? 'bg-orange-900 text-white' : 'bg-white'}`}>
                  Black
                </button>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}