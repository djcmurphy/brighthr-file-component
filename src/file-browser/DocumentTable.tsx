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

export type SortField = "type" | "name" | "added";
export type SortDirection = "asc" | "desc" | "inactive";

export const getInitialSort = (files: FileOrFolder[]): FileOrFolder[] => {
  return [...files].sort((a, b) => {
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });
};

export default function DocumentTable() {
  const initialSortedFiles = useRef<FileOrFolder[]>(
    [...mockFiles].sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    }),
  );

  const [route, setRoute] = useState<string[]>([]);
  const [currentSort, setCurrentSort] = useState<{
    field: SortField | null;
    direction: SortDirection;
  }>({ field: null, direction: "asc" });

  const [nameFilter, setNameFilter] = useState("");

  const files = useMemo(() => {
    let currentLevel: FileOrFolder[] = initialSortedFiles.current;

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
    if (currentSort.field && currentSort.direction !== "inactive") {
      return [...filteredFiles].sort((a, b) => {
        const field = currentSort.field!;
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
    setCurrentSort({ field: null, direction: "inactive" });
    setNameFilter("");
  };

  const sortByField = (field: SortField) => {
    let newDirection: SortDirection = "asc";
    if (currentSort.field === field) {
      if (currentSort.direction === "asc") {
        newDirection = "desc";
      } else if (currentSort.direction === "desc") {
        newDirection = "inactive";
      } else {
        newDirection = "asc";
      }
    }
    setCurrentSort({
      field: newDirection === "inactive" ? null : field,
      direction: newDirection,
    });
  };

  return (
    <div className="min-h-[400px] min-w-[600px] rounded-md border-1 border-sky-600">
      <div className="flex h-12 items-center gap-2 overflow-x-auto bg-sky-500 px-4 text-white">
        <FileStack aria-hidden="true" />
        <Breadcrumbs route={route} navigateToFolder={navigateToFolder} />
      </div>
      <div className="h-2" />
      <div className="p-2">
        <table className="w-full" aria-label="Documents table">
          <thead>
            <tr className="h-12 border-b border-sky-600">
              <th scope="col" className="max-w-10 min-w-10">
                <div className="flex items-center gap-2 pl-4">Type</div>
              </th>
              <th scope="col">
                <div className="flex items-center gap-2 pl-4">
                  Name
                  <SortButton
                    field="name"
                    direction={
                      currentSort.field === "name"
                        ? currentSort.direction
                        : null
                    }
                    sortByField={sortByField}
                    ariaLabel={`Sort by name button. Currently ${
                      currentSort.field === "name"
                        ? currentSort.direction === "asc"
                          ? "sorted ascending"
                          : "sorted descending"
                        : "not sorted"
                    }`}
                  />
                </div>
              </th>
              <th scope="col">
                <div className="flex items-center gap-2 pl-4">
                  Added
                  <SortButton
                    field="added"
                    direction={
                      currentSort.field === "added"
                        ? currentSort.direction
                        : null
                    }
                    sortByField={sortByField}
                    ariaLabel={`Sort by date added button. Currently ${
                      currentSort.field === "added"
                        ? currentSort.direction === "asc"
                          ? "sorted ascending"
                          : "sorted descending"
                        : "not sorted"
                    }`}
                  />
                </div>
              </th>
            </tr>
            <tr>
              <th className="h-12 w-20 max-w-20 min-w-20 transition-all">
                <div
                  className={`transition-opacity duration-200 ${route.length > 0 ? "opacity-100" : "opacity-0"}`}
                >
                  {route.length > 0 && (
                    <button
                      onClick={() =>
                        navigateToFolder(route.slice(0, route.length - 1))
                      }
                      aria-label="Navigate up a level"
                      className="flex h-8 w-full cursor-pointer items-center gap-2 rounded-md border border-sky-100 bg-sky-50 px-2 py-1 text-sm text-sky-600 hover:text-gray-700"
                    >
                      <ChevronLeft size={16} />
                      Back
                    </button>
                  )}
                </div>
              </th>
              <th colSpan={1} className="px-1 py-1">
                <div className="flex h-8 items-center gap-2 rounded-md border border-gray-200 text-sm focus:border-sky-500 focus:outline-none">
                  <div className="flex h-full items-center justify-center rounded-l-md bg-sky-50 px-2">
                    <Search size={18} className="text-sky-600" />
                  </div>
                  <input
                    type="search"
                    aria-label="Filter documents by name"
                    placeholder="Filter by name..."
                    value={nameFilter}
                    onChange={(e) => {
                      const filterValue = e.target.value;
                      setNameFilter(filterValue);
                    }}
                    className=""
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {files.map((fileOrFolder) =>
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
            )}
          </tbody>
        </table>
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
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigateToFolder(route.slice(0, index + 1));
                }
              }}
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
      value={direction || "inactive"}
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
          e.preventDefault();
          navigateToFolder([...route, folder.name]);
        }
      }}
      role="button"
      aria-label={`Open folder ${folder.name}`}
    >
      <td className="px-4">
        <FolderIcon aria-hidden="true" />
      </td>
      <td className="px-4 underline">{folder.name}</td>
      <td className="px-4"></td>
    </tr>
  );
}
