import DocumentTable from "./file-browser/DocumentTable";

function App() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center">
      <div className="to-sky-500/00 absolute top-0 left-0 z-[-1] h-[50vh] w-full bg-gradient-to-b from-sky-100" />
      <DocumentTable />
    </div>
  );
}

export default App;
