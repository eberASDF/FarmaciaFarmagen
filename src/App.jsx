import { BrowserRouter } from "react-router-dom";
import Products from "./Products";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#EDBB99] py-8">
        <Products />
      </div>
    </BrowserRouter>
  );
}