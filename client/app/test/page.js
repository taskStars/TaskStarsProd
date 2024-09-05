import SaveProductivity from "./components/saveProductivity"; // Import the client-side component

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <SaveProductivity /> {/* Use the client-side component */}
      </div>
    </div>
  );
}
