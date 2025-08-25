import { useMemo, useRef, useState } from "react";
import {
  mockFiles,
  type FileItem,
  type FileOrFolder,
  type Folder,
} from "./mockData";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  FileStack,
  Folder as FolderIcon,
  Search,
} from "lucide-react";
import dayjs from "dayjs";

type SortField = "type" | "name" | "added";
type SortDirection = "asc" | "desc";
type SortState = {
  field: SortField;
  direction: "asc" | "desc";
} | null;

export const getInitialSort = (files: FileOrFolder[]): FileOrFolder[] => {
  return [...files].sort((a, b) => {
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });
};

export default function DocumentTable() {
  const [route, setRoute] = useState<string[]>([]);
  const [currentSort, setCurrentSort] = useState<SortState>(null);

  const [nameFilter, setNameFilter] = useState("");

  const initialSortedFiles = useRef<FileOrFolder[]>(
    [...mockFiles].sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    }),
  ).current;

  const files = useMemo(() => {
    let currentLevel: FileOrFolder[] = initialSortedFiles;

    //route logic
    if (route.length > 0) {
      for (const folderName of route) {
        const folder = currentLevel.find(
          (item) => item.type === "folder" && item.name === folderName,
        ) as Folder | undefined;

        if (folder) {
          currentLevel = folder.files;
        }
      }
    }

    //filter logic
    let filteredFiles = currentLevel;
    if (nameFilter) {
      filteredFiles = currentLevel.filter((file) =>
        file.name.toLowerCase().includes(nameFilter.toLowerCase()),
      );
    }

    //sorting logic
    if (currentSort) {
      return [...filteredFiles].sort((a, b) => {
        const field = currentSort.field;
        const direction = currentSort.direction;

        const aValue =
          field === "type"
            ? a.type
            : field === "name"
              ? a.name
              : "added" in a
                ? a.added
                : "";
        const bValue =
          field === "type"
            ? b.type
            : field === "name"
              ? b.name
              : "added" in b
                ? b.added
                : "";

        if (aValue < bValue) {
          return direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return getInitialSort(filteredFiles);
  }, [route, nameFilter, currentSort]);

  const navigateToFolder = (folderPath: string[]) => {
    setRoute(folderPath);
    setCurrentSort(null);
    setNameFilter("");
  };
  const sortByField = (field: SortField) => {
    if (!currentSort || currentSort.field !== field) {
      setCurrentSort({ field, direction: "asc" });
    } else if (currentSort?.direction === "asc") {
      setCurrentSort({ field, direction: "desc" });
    } else {
      setCurrentSort(null);
    }
  };

  return (
    <div className="relative min-h-[400px] max-w-2xl rounded-md border-1 border-sky-600">
      <div className="flex h-12 items-center gap-2 overflow-x-auto bg-sky-500 px-4 text-white">
        <FileStack aria-hidden="true" />
        <Breadcrumbs route={route} navigateToFolder={navigateToFolder} />
      </div>
      <div className="h-2" />
      <div className="p-2">
        <div className="flex items-center gap-2 border-b border-gray-300 bg-gray-50 py-2">
          <div
            className={`transition-opacity duration-200 ${route.length > 0 ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <button
              onClick={() => navigateToFolder(route.slice(0, route.length - 1))}
              aria-label="Navigate up a level"
              className="flex h-8 cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          </div>
          <div className="flex h-8 max-w-sm flex-1 items-center rounded-md border border-gray-300 bg-white text-sm focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500">
            <div className="flex h-full items-center justify-center px-2">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="search"
              aria-label="Filter documents by name"
              placeholder="Filter by name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="h-full w-full px-2 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table
            className="w-full min-w-[300px] table-fixed"
            aria-label="Documents table"
          >
            <thead>
              <tr className="h-12 border-b border-sky-600">
                <th scope="col" className="w-[13%]">
                  <div className="flex items-center gap-2 pl-4">Type</div>
                </th>
                <th scope="col" className="w-[62%]">
                  <div className="flex items-center gap-2 pl-4">
                    Name
                    <SortButton
                      field="name"
                      direction={
                        currentSort?.field === "name"
                          ? currentSort.direction
                          : null
                      }
                      sortByField={sortByField}
                      ariaLabel={`Sort by name button. Currently ${
                        currentSort?.field === "name"
                          ? currentSort.direction === "asc"
                            ? "sorted ascending"
                            : "sorted descending"
                          : "not sorted"
                      }`}
                    />
                  </div>
                </th>
                <th scope="col" className="min-w-[25% w-[25%]">
                  <div className="flex items-center gap-2 pl-4">
                    Added
                    <SortButton
                      field="added"
                      direction={
                        currentSort?.field === "added"
                          ? currentSort.direction
                          : null
                      }
                      sortByField={sortByField}
                      ariaLabel={`Sort by date added button. Currently ${
                        currentSort?.field === "added"
                          ? currentSort.direction === "asc"
                            ? "sorted ascending"
                            : "sorted descending"
                          : "not sorted"
                      }`}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {files.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No files found
                  </td>
                </tr>
              ) : (
                files.map((fileOrFolder) =>
                  fileOrFolder.type === "folder" ? (
                    <FolderRow
                      key={fileOrFolder.name}
                      folder={fileOrFolder}
                      navigateToFolder={navigateToFolder}
                      route={route}
                    />
                  ) : (
                    <FileRow key={fileOrFolder.name} file={fileOrFolder} />
                  ),
                )
              )}
            </tbody>
          </table>{" "}
        </div>
      </div>
    </div>
  );
}
function Breadcrumbs({
  route,
  navigateToFolder,
}: {
  route: string[];
  navigateToFolder: (path: string[]) => void;
}) {
  return (
    <nav aria-label="Breadcrumb navigation">
      <ol className="flex list-none items-center gap-2">
        <li>
          <button
            onClick={() => navigateToFolder([])}
            className="cursor-pointer px-1 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Navigate to Documents root"
            aria-current={route.length === 0 ? "page" : undefined}
          >
            Documents
          </button>
        </li>
        {route.map((folder, index) => (
          <li key={folder} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            <button
              onClick={() => navigateToFolder(route.slice(0, index + 1))}
              className="cursor-pointer px-1 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-white"
              aria-label={`Navigate to ${folder} folder`}
              aria-current={index === route.length - 1 ? "page" : undefined}
            >
              {folder}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
function SortButton({
  field,
  direction,
  sortByField,
  ariaLabel: ariaLabel,
}: {
  field: SortField;
  direction: SortDirection | null;
  sortByField: (field: SortField) => void;
  ariaLabel: string;
}) {
  const inactiveClass =
    "bg-gray-50 text-gray-400 opacity-50  border-gray-500 hover:border-gray-800 hover:border-2";
  const activeClass = "bg-sky-600 text-white  opacity-100 border-white";

  return (
    <button
      aria-label={ariaLabel}
      tabIndex={0}
      data-test-value={direction || "null"}
      className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border hover:border ${!direction ? inactiveClass : activeClass}`}
      onClick={() => sortByField(field)}
    >
      {!direction ? (
        <ArrowUpDown size={14} />
      ) : direction === "asc" ? (
        <ArrowDown size={16} strokeWidth={4} />
      ) : (
        <ArrowUp size={16} strokeWidth={4} />
      )}
    </button>
  );
}

function FileRow({ file }: { file: FileItem }) {
  return (
    <tr className="h-10">
      <td className="px-4">{file.type}</td>
      <td className="px-4">{file.name}</td>
      <td className="px-4">{dayjs(file.added).format("DD/MM/YYYY")}</td>
    </tr>
  );
}

function FolderRow({
  folder,
  navigateToFolder,
  route,
}: {
  folder: Folder;
  navigateToFolder: (route: string[]) => void;
  route: string[];
}) {
  return (
    <tr
      className="h-10 cursor-pointer bg-amber-50 hover:bg-amber-100 focus:outline-2 focus:outline-gray-600"
      tabIndex={0}
      onClick={() => navigateToFolder([...route, folder.name])}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigateToFolder([...route, folder.name]);
        }
      }}
      role="button"
      aria-label={`Open folder ${folder.name}`}
    >
      <td className="px-4">
        <FolderIcon aria-hidden="true" className="text-amber-500" />
      </td>
      <td className="px-4 underline">{folder.name}</td>
      <td className="px-4"></td>
    </tr>
  );
}
