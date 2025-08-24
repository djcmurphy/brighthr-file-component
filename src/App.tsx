import DocumentTable from "./file-browser/DocumentTable";

function App() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="to-sky-500/00 fixed inset-0 z-[-1] h-[50vh] bg-gradient-to-b from-sky-100" />
      <DocumentTable />
    </div>
  );
}

export default App;
